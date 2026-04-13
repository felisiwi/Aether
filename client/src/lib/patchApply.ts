import type { PatchStateMessage } from './webrtc'
import type { Synth } from './synth'

/** Matches `Synth` constructor defaults + JamRoom initial state. */
export const DEFAULT_PATCH_STATE: PatchStateMessage = {
  type: 'patchState',
  waveform: 'sine',
  attack: 0,
  release: 20,
  brightness: 20000,
  delay: 0,
  feedback: 0,
  reverb: 0,
  volume: 1,
}

export function applyPatchStateToSynth(
  synth: Synth | null,
  p: PatchStateMessage,
): void {
  if (!synth) return
  const w = p.waveform as OscillatorType
  if (['sine', 'triangle', 'sawtooth', 'square'].includes(w)) {
    synth.setWaveform(w)
  }
  synth.setAttack(p.attack)
  synth.setRelease(p.release)
  synth.setBrightness(p.brightness)
  synth.setDelayTime(p.delay)
  synth.setDelayFeedback(p.feedback)
  synth.setReverbMix(p.reverb)
  synth.setMasterVolume(p.volume)
}
