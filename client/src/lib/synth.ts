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
  /** Soft saturation post-filter, pre-delay/chorus (native WaveShaper — no Tone.js in bundle). */
  private driveNode: WaveShaperNode | null = null
  private delayNode: DelayNode | null = null
  private feedbackGain: GainNode | null = null
  private dryGain: GainNode | null = null
  private wetGain: GainNode | null = null
  private convolverNode: ConvolverNode | null = null
  private analyserNode: AnalyserNode | null = null
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
  private sustainLevel = 0.65
  /** Envelope decay (seconds), distinct from echo {@link setDelayTime}. */
  private envelopeDecay = 0
  private chorusDelay: DelayNode | null = null
  private chorusLfo: OscillatorNode | null = null
  private chorusLfoGain: GainNode | null = null
  private chorusSendGain: GainNode | null = null
  private _chorusMix = 0
  private _chorusDepth = 0
  private pitchLfo: OscillatorNode | null = null
  private pitchLfoGain: GainNode | null = null

  constructor(audioCtx: AudioContext | null, mode: 'keyboard' | 'wind' = 'keyboard') {
    this.ctx = audioCtx
    this.currentExpression = mode === 'keyboard' ? 1.0 : 0
    if (audioCtx) {
      this.masterGain = audioCtx.createGain()
      this.masterGain.gain.value = 1.0
      this.masterGain.connect(audioCtx.destination)

      this.analyserNode = audioCtx.createAnalyser()
      this.analyserNode.fftSize = 2048
      this.masterGain.connect(this.analyserNode)

      this.filterNode = audioCtx.createBiquadFilter()
      this.filterNode.type = 'lowpass'
      this.filterNode.frequency.value = this.brightness

      this.driveNode = audioCtx.createWaveShaper()
      this.driveNode.oversample = '4x'
      this.rebuildDriveCurve(0)

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

      // Chain: filter → drive (soft clip) → delay → dry/wet split → masterGain
      this.filterNode.connect(this.driveNode)
      this.driveNode.connect(this.delayNode)
      this.delayNode.connect(this.dryGain)
      this.delayNode.connect(this.convolverNode)
      this.convolverNode.connect(this.wetGain)
      this.dryGain.connect(this.masterGain)
      this.wetGain.connect(this.masterGain)

      // Chorus send — taps from delayNode (third fan-out), modulated delay, into masterGain
      this.chorusDelay = audioCtx.createDelay(0.05)
      this.chorusDelay.delayTime.value = 0.015

      this.chorusLfo = audioCtx.createOscillator()
      this.chorusLfo.type = 'sine'
      this.chorusLfo.frequency.value = 0.5
      this.chorusLfoGain = audioCtx.createGain()
      this.chorusLfoGain.gain.value = 0

      this.chorusSendGain = audioCtx.createGain()
      this.chorusSendGain.gain.value = 0

      this.chorusLfo.connect(this.chorusLfoGain)
      this.chorusLfoGain.connect(this.chorusDelay.delayTime)
      this.chorusLfo.start()

      this.delayNode.connect(this.chorusDelay)
      this.chorusDelay.connect(this.chorusSendGain)
      this.chorusSendGain.connect(this.masterGain)

      // Pitch LFO — vibrato
      this.pitchLfo = audioCtx.createOscillator()
      this.pitchLfo.type = 'sine'
      this.pitchLfo.frequency.value = 5 // default 5 Hz
      this.pitchLfoGain = audioCtx.createGain()
      this.pitchLfoGain.gain.value = 0 // silent until depth is set
      this.pitchLfo.connect(this.pitchLfoGain)
      this.pitchLfo.start()
    }
  }

  // Audio graph per voice: oscillator → voiceGain → filterNode → driveNode → delay → …

  noteOn(note: number): void {
    if (!this.ctx || !this.filterNode) return

    const existing = this.activeNotes.get(note)
    if (existing) {
      try {
        if (this.pitchLfoGain) {
          this.pitchLfoGain.disconnect(existing.oscillator.detune)
        }
      } catch {
        /* already disconnected */
      }
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

    const now = this.ctx.currentTime
    const voiceCount = this.activeNotes.size + 1
    const polyScale = 1 / Math.sqrt(voiceCount)
    const peak = this.currentExpression * polyScale
    const sustain = peak * this.sustainLevel

    if (this.attackTime > 0) {
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(peak, now + this.attackTime)
    } else {
      gain.gain.setValueAtTime(peak, now)
    }

    if (this.envelopeDecay > 0) {
      const decayStart = now + this.attackTime
      gain.gain.setTargetAtTime(sustain, decayStart, this.envelopeDecay / 3)
    }

    if (this.pitchLfoGain) {
      this.pitchLfoGain.connect(osc.detune)
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
      try {
        if (this.pitchLfoGain) {
          this.pitchLfoGain.disconnect(oscillator.detune)
        }
      } catch {
        /* already disconnected */
      }
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
      // Sets raw gain on held notes — overwrites scheduled ADSR; same as pre-ADSR behaviour.
      for (const active of this.activeNotes.values()) {
        active.gain.gain.value = this.currentExpression
      }
    }
  }

  panicAllNotesOff(): void {
    for (const active of this.activeNotes.values()) {
      try {
        if (this.pitchLfoGain) {
          this.pitchLfoGain.disconnect(active.oscillator.detune)
        }
      } catch {
        /* already disconnected */
      }
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
    this.driveNode?.disconnect()
    this.delayNode?.disconnect()
    this.feedbackGain?.disconnect()
    this.dryGain?.disconnect()
    this.wetGain?.disconnect()
    this.convolverNode?.disconnect()
    this.chorusLfo?.stop()
    this.chorusLfo?.disconnect()
    this.chorusLfoGain?.disconnect()
    this.pitchLfo?.stop()
    this.pitchLfo?.disconnect()
    this.pitchLfoGain?.disconnect()
    this.chorusDelay?.disconnect()
    this.chorusSendGain?.disconnect()
    this.analyserNode?.disconnect()
    this.masterGain?.disconnect()
    this.filterNode = null
    this.driveNode = null
    this.delayNode = null
    this.feedbackGain = null
    this.dryGain = null
    this.wetGain = null
    this.convolverNode = null
    this.chorusLfo = null
    this.chorusLfoGain = null
    this.pitchLfo = null
    this.pitchLfoGain = null
    this.chorusDelay = null
    this.chorusSendGain = null
    this.analyserNode = null
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

  getAnalyser(): AnalyserNode | null {
    return this.analyserNode
  }

  /** Bypass CC11 mapping — set expression gain directly (0–1). Overwrites scheduled ADSR on held notes. */
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

  /** Resonance / filter Q; `pct` is 0–100 from UI. */
  setResonance(pct: number): void {
    const clamped = Math.max(0, Math.min(100, pct))
    // log curve: 0.5–10 Q range
    const q = 0.5 * Math.pow(20, clamped / 100)
    if (this.filterNode) {
      this.filterNode.Q.value = q
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

  /** Envelope decay (not echo delay). */
  setEnvelopeDecay(ms: number): void {
    this.envelopeDecay = Math.max(0, Math.min(500, ms)) / 1000
  }

  /** Sustain level; `pct` is 0–100 from UI. */
  setSustain(pct: number): void {
    this.sustainLevel = Math.max(0, Math.min(100, pct)) / 100
  }

  /** Drive / saturation; `pct` is 0–100 from EffectsBoard. Local-only — not synced to peers. */
  setDrive(pct: number): void {
    const clamped = Math.max(0, Math.min(100, pct))
    // squared for perceptual linearity — do not change to linear
    const squared = (clamped / 100) ** 2
    this.rebuildDriveCurve(squared)
  }

  private rebuildDriveCurve(amount01: number): void {
    if (!this.driveNode) return
    const n = 2048
    const curve = new Float32Array(n)
    if (amount01 <= 1e-8) {
      for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * 2 - 1
        curve[i] = x
      }
    } else {
      const k = 1 + amount01 * 3
      const th = Math.tanh(k)
      for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * 2 - 1
        curve[i] = Math.tanh(k * x) / th
      }
    }
    this.driveNode.curve = curve
  }

  /** Chorus wet send; `pct` is 0–100 from UI. */
  setChorusMix(pct: number): void {
    this._chorusMix = Math.max(0, Math.min(100, pct)) / 100
    if (this.chorusSendGain) {
      this.chorusSendGain.gain.value = this._chorusMix * 0.5
    }
  }

  /** Modulation depth; `ms` is 0–100 from UI, capped at 10 ms in the DSP. */
  setChorusDepth(ms: number): void {
    this._chorusDepth = Math.max(0, Math.min(10, ms)) / 1000
    if (this.chorusLfoGain) {
      this.chorusLfoGain.gain.value = this._chorusDepth
    }
  }

  /** Pitch LFO rate; `pct` is 0–100 from UI. Maps 0.1–10 Hz logarithmically. */
  setPitchRate(pct: number): void {
    const clamped = Math.max(0, Math.min(100, pct))
    // map 0–100 to 0.1–10 Hz logarithmically
    const hz = 0.1 * Math.pow(100, clamped / 100)
    if (this.pitchLfo) {
      this.pitchLfo.frequency.value = hz
    }
  }

  /** Pitch LFO depth in cents; `pct` is 0–100 from UI (0–100 cents, one semitone max). */
  setPitchDepth(pct: number): void {
    const clamped = Math.max(0, Math.min(100, pct))
    if (this.pitchLfoGain) {
      this.pitchLfoGain.gain.value = clamped
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
