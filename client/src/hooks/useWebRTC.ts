import { useCallback, useEffect, useRef, useState } from 'react'
import { SignallingClient } from '../lib/signalling'
import {
  PeerManager,
  turnConfigured as _turnConfigured,
} from '../lib/webrtc'
import type { DataChannelState, TransportType } from '../lib/webrtc'
import type { MidiEvent } from '../lib/midi'

export type { DataChannelState, TransportType }

export interface UseWebRTCOptions {
  signalUrl: string
  username: string | null
  onRemoteMidi: (event: MidiEvent) => void
  onPong: (originTs: number) => void
}

export function useWebRTC({
  signalUrl,
  username,
  onRemoteMidi,
  onPong,
}: UseWebRTCOptions) {
  const [presence, setPresence] = useState<string[]>([])
  const [connectionState, setConnectionState] =
    useState<DataChannelState>('idle')
  const [transportType, setTransportType] =
    useState<TransportType>('unknown')
  const [remoteUser, setRemoteUser] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const midiRef = useRef(onRemoteMidi)
  midiRef.current = onRemoteMidi
  const pongRef = useRef(onPong)
  pongRef.current = onPong

  const signalRef = useRef<SignallingClient | null>(null)
  const peerRef = useRef<PeerManager | null>(null)

  useEffect(() => {
    if (!username) return

    const signal = new SignallingClient()
    signalRef.current = signal

    const peer = new PeerManager(signal, username, {
      onStateChange: (state) => {
        setConnectionState(state)
        if (state === 'disconnected') setError('Connection lost')
        if (state === 'connected') setError(null)
      },
      onTransportType: setTransportType,
      onRemoteMidi: (event) => midiRef.current(event),
      onPong: (ts) => pongRef.current(ts),
    })
    peerRef.current = peer

    signal.connect(signalUrl, username, {
      onPresence: setPresence,
      onOffer: (from, sdp) => {
        setRemoteUser(from)
        peer.handleOffer(from, sdp).catch((e: unknown) => {
          setError(
            `Failed to handle offer: ${e instanceof Error ? e.message : String(e)}`,
          )
        })
      },
      onAnswer: (_from, sdp) => {
        peer.handleAnswer(sdp).catch((e: unknown) => {
          setError(
            `Failed to handle answer: ${e instanceof Error ? e.message : String(e)}`,
          )
        })
      },
      onIceCandidate: (_from, candidate) => {
        peer.handleIceCandidate(candidate).catch((e: unknown) => {
          setError(
            `ICE candidate error: ${e instanceof Error ? e.message : String(e)}`,
          )
        })
      },
      onError: setError,
    })

    return () => {
      peer.disconnect()
      signal.disconnect()
      signalRef.current = null
      peerRef.current = null
    }
  }, [signalUrl, username])

  const connectToPeer = useCallback((targetUser: string) => {
    const peer = peerRef.current
    if (!peer) return
    setRemoteUser(targetUser)
    peer.initiateOffer(targetUser).catch((e: unknown) => {
      setError(
        `Failed to connect: ${e instanceof Error ? e.message : String(e)}`,
      )
    })
  }, [])

  const disconnect = useCallback(() => {
    peerRef.current?.disconnect()
    setRemoteUser(null)
    setConnectionState('idle')
    setTransportType('unknown')
  }, [])

  const sendMidi = useCallback((event: MidiEvent) => {
    peerRef.current?.sendMidi(event)
  }, [])

  const sendPing = useCallback(() => {
    peerRef.current?.sendPing()
  }, [])

  return {
    presence,
    connectionState,
    transportType,
    turnConfigured: _turnConfigured,
    remoteUser,
    error,
    connectToPeer,
    disconnect,
    sendMidi,
    sendPing,
  }
}
