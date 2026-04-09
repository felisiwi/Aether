import { useCallback, useEffect, useRef, useState } from 'react'
import {
  colors,
  semanticColors,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import { useAudioContext } from './hooks/useAudioContext'
import { useWebRTC } from './hooks/useWebRTC'
import { useLatency } from './hooks/useLatency'
import { useTheme } from './contexts/ThemeContext'
import { Synth } from './lib/synth'
import Login from './pages/Login'
import Lobby from './pages/Lobby'
import JamRoomPage from './pages/JamRoom'
import type { MidiEvent, InstrumentMode } from './lib/midi'

const FONT = `${fontFamily}, sans-serif`
const SIGNAL_URL = import.meta.env.VITE_SIGNAL_URL || 'ws://localhost:3000'

// ─── Audio suspended banner ──────────────────────────────────────

function AudioBanner({ onResume }: { onResume: () => void }) {
  useEffect(() => {
    const handler = () => onResume()
    document.addEventListener('click', handler, { once: true })
    return () => document.removeEventListener('click', handler)
  }, [onResume])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 32,
        background: semanticColors.backdropFunctionalWarningSurface,
        color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontSize: typography.bodyS.fontSize,
        fontWeight: 600,
        zIndex: 10000,
      }}
    >
      Audio paused — tap anywhere to resume
    </div>
  )
}

// ─── Session (post-login container) ──────────────────────────────

function Session({
  username,
  mode,
  onLogout,
}: {
  username: string
  mode: InstrumentMode
  onLogout: () => void
}) {
  const { audioCtx, resume, state: audioState } = useAudioContext()
  const [joined, setJoined] = useState(false)
  const [view, setView] = useState<'lobby' | 'jam' | 'solo'>('lobby')

  // ── Synth (recreated when audioCtx or mode changes) ──
  const [synth, setSynth] = useState<Synth | null>(null)
  useEffect(() => {
    if (!audioCtx) return
    const s = new Synth(audioCtx, mode)
    setSynth(s)
    return () => s.dispose()
  }, [audioCtx, mode])

  // ── Remote MIDI dispatch (set by JamRoom page) ──
  const remoteMidiRef = useRef<(event: MidiEvent) => void>(() => {})
  const onRemoteMidi = useCallback((event: MidiEvent) => {
    remoteMidiRef.current(event)
  }, [])

  // ── Latency: sendPing ref breaks circular dep ──
  const sendPingRef = useRef<() => void>(() => {})
  const stableSendPing = useCallback(() => sendPingRef.current(), [])
  const [isConnected, setIsConnected] = useState(false)

  const latency = useLatency({
    sendPing: stableSendPing,
    connected: isConnected,
  })

  // ── WebRTC ──
  const {
    presence,
    connectionState,
    transportType,
    turnConfigured,
    remoteUser,
    error,
    connectToPeer,
    disconnect,
    sendMidi,
    sendPing,
  } = useWebRTC({
    signalUrl: SIGNAL_URL,
    username: joined ? username : null,
    onRemoteMidi,
    onPong: latency.handlePong,
  })

  sendPingRef.current = sendPing

  useEffect(() => {
    setIsConnected(connectionState === 'connected')
  }, [connectionState])

  useEffect(() => {
    if (connectionState === 'connected') setView('jam')
  }, [connectionState])

  const handleStartJamming = useCallback(async () => {
    await resume()
    setJoined(true)
  }, [resume])

  const handlePlaySolo = useCallback(async () => {
    await resume()
    setJoined(true)
    setView('solo')
  }, [resume])

  const noopSendMidi = useCallback(() => {}, [])
  const soloRemoteMidiRef = useRef<(event: MidiEvent) => void>(() => {})
  const emptySamplesRef = useRef<number[]>([])

  const handleLeave = useCallback(() => {
    disconnect()
    setView('lobby')
  }, [disconnect])

  const handleLeaveSolo = useCallback(() => {
    setView('lobby')
  }, [])

  const showBanner = audioState === 'suspended'

  return (
    <>
      {showBanner && <AudioBanner onResume={resume} />}

      {view === 'lobby' ? (
        <Lobby
          username={username}
          joined={joined}
          onStartJamming={handleStartJamming}
          onPlaySolo={handlePlaySolo}
          presence={presence}
          connectToPeer={connectToPeer}
          connectingTo={
            connectionState === 'connecting' ? remoteUser : null
          }
          connectionState={connectionState}
          turnConfigured={turnConfigured}
          error={error}
          mode={mode}
          onLogout={onLogout}
        />
      ) : view === 'solo' ? (
        <JamRoomPage
          username={username}
          mode={mode}
          synth={synth}
          remoteUser={null}
          connectionState="idle"
          transportType="unknown"
          sendMidi={noopSendMidi}
          rtt={null}
          oneWay={null}
          jitter={null}
          samplesRef={emptySamplesRef}
          remoteMidiRef={soloRemoteMidiRef}
          onLeave={handleLeaveSolo}
        />
      ) : (
        <JamRoomPage
          username={username}
          mode={mode}
          synth={synth}
          remoteUser={remoteUser}
          connectionState={connectionState}
          transportType={transportType}
          sendMidi={sendMidi}
          rtt={latency.rtt}
          oneWay={latency.oneWay}
          jitter={latency.jitter}
          samplesRef={latency.samplesRef}
          remoteMidiRef={remoteMidiRef}
          onLeave={handleLeave}
        />
      )}
    </>
  )
}

// ─── App root ────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<'login' | 'session'>(() =>
    localStorage.getItem('jamlink_user') ? 'session' : 'login',
  )
  const [username, setUsername] = useState(
    () => localStorage.getItem('jamlink_user') ?? '',
  )
  const [mode, setMode] = useState<InstrumentMode>('keyboard')

  const handleLogin = useCallback((u: string, m: InstrumentMode) => {
    setUsername(u)
    setMode(m)
    setPage('session')
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('jamlink_user')
    setUsername('')
    setPage('login')
  }, [])

  if (page === 'login' || !username) {
    return <Login onLogin={handleLogin} />
  }

  return <Session username={username} mode={mode} onLogout={handleLogout} />
}
