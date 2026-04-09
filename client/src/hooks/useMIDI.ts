import { useEffect, useRef, useState } from 'react'
import { parseMidiMessage } from '../lib/midi'
import type { MidiEvent } from '../lib/midi'

export type { MidiEvent }

export interface MidiDevice {
  id: string
  name: string
  manufacturer: string
}

export interface UseMIDIOptions {
  onMidiEvent: (event: MidiEvent) => void
  /** When false, skip auto-select and ignore all incoming MIDI messages. */
  enabled?: boolean
}

/**
 * React hook wrapping the Web MIDI API.
 *
 * - Requests MIDI access on mount
 * - Hot-plugging: device list updates when hardware connects/disconnects
 * - Performance: `onMidiEvent` is stored in a ref and invoked directly
 *   from the MIDI message handler — CC11 breath data never touches React state
 */
export function useMIDI({ onMidiEvent, enabled = true }: UseMIDIOptions) {
  const [devices, setDevices] = useState<MidiDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const callbackRef = useRef(onMidiEvent)
  callbackRef.current = onMidiEvent

  const accessRef = useRef<MIDIAccess | null>(null)

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError('Web MIDI is not supported in this browser. Please use Chrome.')
      return
    }

    let aborted = false

    navigator.requestMIDIAccess().then(
      (access) => {
        if (aborted) return
        accessRef.current = access

        const updateDevices = () => {
          const list: MidiDevice[] = []
          access.inputs.forEach((input) => {
            list.push({
              id: input.id,
              name: input.name ?? 'Unknown device',
              manufacturer: input.manufacturer ?? 'Unknown',
            })
          })
          setDevices(list)
        }

        updateDevices()
        access.onstatechange = updateDevices
      },
      (err) => {
        if (aborted) return
        setError(
          `MIDI access denied: ${err instanceof Error ? err.message : String(err)}`,
        )
      },
    )

    return () => {
      aborted = true
      if (accessRef.current) {
        accessRef.current.onstatechange = null
      }
    }
  }, [])

  // Auto-select first available device when none is selected (wind mode only)
  useEffect(() => {
    if (enabled && devices.length > 0 && selectedDeviceId === null) {
      setSelectedDeviceId(devices[0].id)
    }
  }, [devices, selectedDeviceId, enabled])

  useEffect(() => {
    const access = accessRef.current
    if (!enabled || !access || !selectedDeviceId) return

    const input = access.inputs.get(selectedDeviceId)
    if (!input) return

    const handleMessage = (e: MIDIMessageEvent) => {
      if (!e.data) return
      const event = parseMidiMessage(e.data, Date.now())
      if (event) callbackRef.current(event)
    }

    input.onmidimessage = handleMessage

    return () => {
      input.onmidimessage = null
    }
  }, [selectedDeviceId])

  return { devices, selectedDeviceId, setSelectedDeviceId, error }
}
