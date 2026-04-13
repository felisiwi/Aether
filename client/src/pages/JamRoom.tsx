import { useCallback, useEffect, useRef } from 'react'
import { fontFamily } from '@ds/tokens/design-tokens'
import JamRoomComponent from '../components/jam/JamRoom'
import { useTheme } from '../contexts/ThemeContext'
import type { JamRoomHandle } from '../components/jam/JamRoom'
import type { MidiEvent, InstrumentMode } from '../lib/midi'
import type { Synth } from '../lib/synth'
import type {
  DataChannelState,
  PatchStateMessage,
  TransportType,
} from '../lib/webrtc'
import { useMIDI } from '../hooks/useMIDI'

const FONT = `${fontFamily}, sans-serif`

interface JamRoomPageProps {
  username: string
  mode: InstrumentMode
  synth: Synth | null
  remoteSynth: Synth | null
  sendPatchState: (patch: PatchStateMessage) => void
  remoteUser: string | null
  connectionState: DataChannelState
  transportType: TransportType
  sendMidi: (event: MidiEvent) => void
  rtt: number | null
  oneWay: number | null
  jitter: number | null
  samplesRef: React.RefObject<number[]>
  remoteMidiRef: React.MutableRefObject<(event: MidiEvent) => void>
  onLeave: () => void
}

export default function JamRoomPage({
  username,
  mode,
  synth,
  remoteSynth,
  sendPatchState,
  remoteUser,
  connectionState,
  transportType,
  sendMidi,
  rtt,
  oneWay,
  jitter,
  samplesRef,
  remoteMidiRef,
  onLeave,
}: JamRoomPageProps) {
  const jamRoomRef = useRef<JamRoomHandle>(null)

  const onMidiEvent = useCallback((event: MidiEvent) => {
    jamRoomRef.current?.handleLocalMidi(event)
  }, [])

  useMIDI({ onMidiEvent, enabled: mode === 'wind' })

  // Wire remote MIDI from Session → JamRoom component
  useEffect(() => {
    remoteMidiRef.current = (event: MidiEvent) => {
      jamRoomRef.current?.handleRemoteMidi(event)
    }
    return () => {
      remoteMidiRef.current = () => {}
    }
  }, [remoteMidiRef])

  const { theme } = useTheme()

  return (
    <div style={{ fontFamily: FONT, minHeight: '100vh', background: theme.pageBg, transition: 'background-color 200ms ease' }}>
      <JamRoomComponent
        ref={jamRoomRef}
        localUser={username}
        remoteUser={remoteUser}
        localMode={mode}
        synth={synth}
        remoteSynth={remoteSynth}
        sendPatchState={sendPatchState}
        connectionState={connectionState}
        transportType={transportType}
        sendMidi={sendMidi}
        rtt={rtt}
        oneWay={oneWay}
        jitter={jitter}
        samplesRef={samplesRef}
        onLeave={onLeave}
      />
    </div>
  )
}
