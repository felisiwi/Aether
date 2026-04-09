import { useCallback, useEffect, useRef, useState } from 'react'
import {
  layout,
  fontFamily,
} from '@ds/tokens/design-tokens'
import BasicButton from '../components/BasicButton'
import ThemeToggle from '../components/ThemeToggle'
import JamRoomComponent from '../components/jam/JamRoom'
import DeviceSelector from '../components/jam/DeviceSelector'
import { useTheme } from '../contexts/ThemeContext'
import type { JamRoomHandle } from '../components/jam/JamRoom'
import type { MidiEvent, InstrumentMode } from '../lib/midi'
import type { Synth } from '../lib/synth'
import type { DataChannelState, TransportType } from '../lib/webrtc'
import { useMIDI } from '../hooks/useMIDI'

const FONT = `${fontFamily}, sans-serif`

interface JamRoomPageProps {
  username: string
  mode: InstrumentMode
  synth: Synth | null
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

  const midi = useMIDI({ onMidiEvent, enabled: mode === 'wind' })

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
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${layout.gap8}px ${layout.gap16}px`,
          borderBottom: `${layout.strokeS}px solid ${theme.strokeSymbolic}`,
        }}
      >
        <BasicButton
          variant="secondary"
          size="small"
          onClick={onLeave}
          showIcon
          iconName="arrow-left"
        >
          {remoteUser === null ? 'Back to Lobby' : 'Leave'}
        </BasicButton>

        {mode === 'wind' && (
          <div style={{ flex: 1, maxWidth: 320, marginLeft: layout.gap16 }}>
            <DeviceSelector
              mode={mode}
              onModeChange={() => {}}
              devices={midi.devices}
              selectedDeviceId={midi.selectedDeviceId}
              onSelectDevice={midi.setSelectedDeviceId}
              error={midi.error}
            />
          </div>
        )}

        <ThemeToggle />
      </div>

      {/* Jam room */}
      <JamRoomComponent
        ref={jamRoomRef}
        localUser={username}
        remoteUser={remoteUser}
        localMode={mode}
        synth={synth}
        connectionState={connectionState}
        transportType={transportType}
        sendMidi={sendMidi}
        rtt={rtt}
        oneWay={oneWay}
        jitter={jitter}
        samplesRef={samplesRef}
      />
    </div>
  )
}
