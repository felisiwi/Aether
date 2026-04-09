export interface ExpressionConfig {
  curve: 'linear' | 'exponential' | 'logarithmic'
  /** CC11 values below this clamp to 0 (range 0–30). */
  noiseFloor: number
  /** CC11 value that maps to 1.0 gain (range 50–127). */
  gainCeiling: number
}

interface ActiveNote {
  oscillator: OscillatorNode
  gain: GainNode
}

function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12)
}

const RELEASE_MARGIN_S = 0.005

function createImpulseResponse(ctx: AudioContext, duration = 2, decay = 2): AudioBuffer {
  const length = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  return buffer
}

const DEFAULT_EXPRESSION: ExpressionConfig = {
  curve: 'linear',
  noiseFloor: 5,
  gainCeiling: 110,
}

export class Synth {
  private ctx: AudioContext | null
  private masterGain: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private delayNode: DelayNode | null = null
  private feedbackGain: GainNode | null = null
  private dryGain: GainNode | null = null
  private wetGain: GainNode | null = null
  private convolverNode: ConvolverNode | null = null
  private activeNotes = new Map<number, ActiveNote>()
  private waveform: OscillatorType = 'sine'
  private expression: ExpressionConfig = { ...DEFAULT_EXPRESSION }
  private currentExpression: number
  private attackTime = 0
  private releaseTime = 0.02
  private brightness = 20000
  private _delayTime = 0
  private _delayFeedback = 0
  private _reverbMix = 0

  constructor(audioCtx: AudioContext | null, mode: 'keyboard' | 'wind' = 'keyboard') {
    this.ctx = audioCtx
    this.currentExpression = mode === 'keyboard' ? 1.0 : 0
    if (audioCtx) {
      this.masterGain = audioCtx.createGain()
      this.masterGain.gain.value = 1.0
      this.masterGain.connect(audioCtx.destination)

      this.filterNode = audioCtx.createBiquadFilter()
      this.filterNode.type = 'lowpass'
      this.filterNode.frequency.value = this.brightness

      // Delay with feedback loop
      this.delayNode = audioCtx.createDelay(1.0)
      this.delayNode.delayTime.value = 0
      this.feedbackGain = audioCtx.createGain()
      this.feedbackGain.gain.value = 0
      this.delayNode.connect(this.feedbackGain)
      this.feedbackGain.connect(this.delayNode)

      // Reverb wet/dry parallel mix
      this.dryGain = audioCtx.createGain()
      this.dryGain.gain.value = 1.0
      this.wetGain = audioCtx.createGain()
      this.wetGain.gain.value = 0.0
      this.convolverNode = audioCtx.createConvolver()
      this.convolverNode.buffer = createImpulseResponse(audioCtx)

      // Chain: filter → delay → dry/wet split → masterGain
      this.filterNode.connect(this.delayNode)
      this.delayNode.connect(this.dryGain)
      this.delayNode.connect(this.convolverNode)
      this.convolverNode.connect(this.wetGain)
      this.dryGain.connect(this.masterGain)
      this.wetGain.connect(this.masterGain)
    }
  }

  // Audio graph per voice: oscillator → voiceGain → filterNode → masterGain → destination

  noteOn(note: number): void {
    if (!this.ctx || !this.filterNode) return

    const existing = this.activeNotes.get(note)
    if (existing) {
      try {
        existing.oscillator.stop()
        existing.oscillator.disconnect()
        existing.gain.disconnect()
      } catch {
        /* already stopped */
      }
      this.activeNotes.delete(note)
    }

    const osc = this.ctx.createOscillator()
    osc.type = this.waveform
    osc.frequency.value = midiToFreq(note)

    const gain = this.ctx.createGain()

    if (this.attackTime > 0) {
      gain.gain.setValueAtTime(0, this.ctx.currentTime)
      gain.gain.linearRampToValueAtTime(
        this.currentExpression,
        this.ctx.currentTime + this.attackTime,
      )
    } else {
      gain.gain.value = this.currentExpression
    }

    osc.connect(gain)
    gain.connect(this.filterNode)
    osc.start()

    this.activeNotes.set(note, { oscillator: osc, gain })
  }

  noteOff(note: number): void {
    const active = this.activeNotes.get(note)
    if (!active || !this.ctx) return

    const now = this.ctx.currentTime
    const { oscillator, gain } = active

    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + this.releaseTime)

    oscillator.stop(now + this.releaseTime + RELEASE_MARGIN_S)
    oscillator.onended = () => {
      oscillator.disconnect()
      gain.disconnect()
    }

    this.activeNotes.delete(note)
  }

  updateNotePitch(oldNote: number, newNote: number): void {
    const active = this.activeNotes.get(oldNote)
    if (!active || !this.ctx) return
    active.oscillator.frequency.setTargetAtTime(
      midiToFreq(newNote), this.ctx.currentTime, 0.01,
    )
    if (oldNote !== newNote) {
      this.activeNotes.delete(oldNote)
      this.activeNotes.set(newNote, active)
    }
  }

  setCC(cc: number, value: number): void {
    if (!this.ctx) return

    if (cc === 11) {
      this.currentExpression = this.mapExpression(value)
      for (const active of this.activeNotes.values()) {
        active.gain.gain.value = this.currentExpression
      }
    }
  }

  panicAllNotesOff(): void {
    for (const active of this.activeNotes.values()) {
      try {
        active.oscillator.stop()
        active.oscillator.disconnect()
        active.gain.disconnect()
      } catch {
        /* already stopped */
      }
    }
    this.activeNotes.clear()
  }

  dispose(): void {
    this.panicAllNotesOff()
    this.filterNode?.disconnect()
    this.delayNode?.disconnect()
    this.feedbackGain?.disconnect()
    this.dryGain?.disconnect()
    this.wetGain?.disconnect()
    this.convolverNode?.disconnect()
    this.masterGain?.disconnect()
    this.filterNode = null
    this.delayNode = null
    this.feedbackGain = null
    this.dryGain = null
    this.wetGain = null
    this.convolverNode = null
    this.masterGain = null
  }

  setWaveform(type: OscillatorType): void {
    this.waveform = type
    for (const active of this.activeNotes.values()) {
      active.oscillator.type = type
    }
  }

  setMasterVolume(value: number): void {
    if (!this.masterGain) return
    this.masterGain.gain.value = Math.max(0, Math.min(1, value))
  }

  get expressionValue(): number {
    return this.currentExpression
  }

  get outputNode(): AudioNode | null {
    return this.masterGain
  }

  get audioContext(): AudioContext | null {
    return this.ctx
  }

  /** Bypass CC11 mapping — set expression gain directly (0–1). */
  setExpressionDirect(value: number): void {
    this.currentExpression = Math.max(0, Math.min(1, value))
    for (const active of this.activeNotes.values()) {
      active.gain.gain.value = this.currentExpression
    }
  }

  setExpression(config: ExpressionConfig): void {
    this.expression = config
  }

  setAttack(ms: number): void {
    this.attackTime = Math.max(0, Math.min(500, ms)) / 1000
  }

  setRelease(ms: number): void {
    this.releaseTime = Math.max(10, Math.min(500, ms)) / 1000
  }

  setBrightness(hz: number): void {
    this.brightness = Math.max(500, Math.min(20000, hz))
    if (this.filterNode) {
      this.filterNode.frequency.value = this.brightness
    }
  }

  setDelayTime(ms: number): void {
    this._delayTime = Math.max(0, Math.min(1000, ms)) / 1000
    if (this.delayNode) {
      this.delayNode.delayTime.value = this._delayTime
    }
    if (this.feedbackGain) {
      this.feedbackGain.gain.value = this._delayTime > 0 ? this._delayFeedback : 0
    }
  }

  setDelayFeedback(ratio: number): void {
    this._delayFeedback = Math.max(0, Math.min(0.8, ratio))
    if (this.feedbackGain && this._delayTime > 0) {
      this.feedbackGain.gain.value = this._delayFeedback
    }
  }

  setReverbMix(ratio: number): void {
    this._reverbMix = Math.max(0, Math.min(1, ratio))
    if (this.dryGain) {
      this.dryGain.gain.value = 1 - this._reverbMix
    }
    if (this.wetGain) {
      this.wetGain.gain.value = this._reverbMix
    }
  }

  get attackMs(): number {
    return Math.round(this.attackTime * 1000)
  }

  get releaseMs(): number {
    return Math.round(this.releaseTime * 1000)
  }

  get brightnessHz(): number {
    return this.brightness
  }

  get delayTimeMs(): number {
    return Math.round(this._delayTime * 1000)
  }

  get delayFeedbackRatio(): number {
    return this._delayFeedback
  }

  get reverbMixRatio(): number {
    return this._reverbMix
  }

  private mapExpression(raw: number): number {
    const { noiseFloor, gainCeiling, curve } = this.expression

    if (raw < noiseFloor) return 0

    const range = gainCeiling - noiseFloor
    if (range <= 0) return 0

    const normalized = Math.min((raw - noiseFloor) / range, 1)

    switch (curve) {
      case 'exponential':
        return normalized * normalized
      case 'logarithmic':
        return Math.sqrt(normalized)
      case 'linear':
      default:
        return normalized
    }
  }
}
