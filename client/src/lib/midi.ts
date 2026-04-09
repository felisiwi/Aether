// ─── Instrument mode ─────────────────────────────────────────────

export type InstrumentMode = 'keyboard' | 'wind'

// ─── MIDI event types ────────────────────────────────────────────

export interface MidiEvent {
  type: 'noteOn' | 'noteOff' | 'cc'
  note: number
  velocity: number
  cc: number
  value: number
  channel: number
  timestamp: number
}

// ─── Raw MIDI parsing ────────────────────────────────────────────

const NOTE_ON = 0x90
const NOTE_OFF = 0x80
const CONTROL_CHANGE = 0xb0

/**
 * Parse a raw MIDI message (2–3 bytes) into a structured MidiEvent.
 * Returns null for unsupported message types (sysex, timing, etc).
 *
 * Handles the MIDI convention where Note On with velocity 0
 * is treated as Note Off.
 */
export function parseMidiMessage(
  data: Uint8Array,
  timestamp: number,
): MidiEvent | null {
  if (data.length < 2) return null

  const status = data[0]
  const msgType = status & 0xf0
  const channel = (status & 0x0f) + 1

  switch (msgType) {
    case NOTE_ON: {
      const note = data[1]
      const velocity = data.length > 2 ? data[2] : 0
      if (velocity === 0) {
        return { type: 'noteOff', note, velocity: 0, cc: 0, value: 0, channel, timestamp }
      }
      return { type: 'noteOn', note, velocity, cc: 0, value: 0, channel, timestamp }
    }

    case NOTE_OFF: {
      const note = data[1]
      const velocity = data.length > 2 ? data[2] : 0
      return { type: 'noteOff', note, velocity, cc: 0, value: 0, channel, timestamp }
    }

    case CONTROL_CHANGE: {
      const cc = data[1]
      const value = data.length > 2 ? data[2] : 0
      return { type: 'cc', note: 0, velocity: 0, cc, value, channel, timestamp }
    }

    default:
      return null
  }
}
