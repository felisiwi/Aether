import type { MidiEvent } from './midi'
import type { SignallingClient } from './signalling'

// ─── TURN configuration ──────────────────────────────────────────

const turnUrl = import.meta.env.VITE_TURN_URL
const turnUser = import.meta.env.VITE_TURN_USERNAME
const turnCred = import.meta.env.VITE_TURN_CREDENTIAL

export const turnConfigured = Boolean(turnUrl && turnUser && turnCred)

if (!turnConfigured) {
  console.warn(
    '⚠️ TURN credentials missing — real-network connections will likely fail',
  )
}

const iceServers: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
]

if (turnConfigured) {
  iceServers.push({ urls: turnUrl, username: turnUser, credential: turnCred })
}

// ─── Types ───────────────────────────────────────────────────────

export type DataChannelState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'

export type TransportType = 'unknown' | 'host' | 'srflx' | 'relay'

export interface PeerCallbacks {
  onStateChange: (state: DataChannelState) => void
  onTransportType: (type: TransportType) => void
  onRemoteMidi: (event: MidiEvent) => void
  onPong: (originTs: number) => void
}

// ─── Compact data-channel wire format ────────────────────────────

interface DCNoteOn {
  t: 'on'
  n: number
  ts: number
}
interface DCNoteOff {
  t: 'off'
  n: number
  ts: number
}
interface DCCC {
  t: 'cc'
  c: number
  v: number
  ts: number
}
interface DCPing {
  t: 'ping'
  ts: number
}
interface DCPong {
  t: 'pong'
  ts: number
}
type DCMessage = DCNoteOn | DCNoteOff | DCCC | DCPing | DCPong

function serializeMidi(event: MidiEvent): string {
  switch (event.type) {
    case 'noteOn':
      return `{"t":"on","n":${event.note},"ts":${event.timestamp}}`
    case 'noteOff':
      return `{"t":"off","n":${event.note},"ts":${event.timestamp}}`
    case 'cc':
      return `{"t":"cc","c":${event.cc},"v":${event.value},"ts":${event.timestamp}}`
  }
}

function parseDCMessage(raw: string): DCMessage | null {
  try {
    const msg = JSON.parse(raw) as Record<string, unknown>
    if (typeof msg.t !== 'string') return null
    return msg as unknown as DCMessage
  } catch {
    return null
  }
}

function dcToMidiEvent(msg: DCNoteOn | DCNoteOff | DCCC): MidiEvent {
  switch (msg.t) {
    case 'on':
      return {
        type: 'noteOn',
        note: msg.n,
        velocity: 127,
        cc: 0,
        value: 0,
        channel: 1,
        timestamp: msg.ts,
      }
    case 'off':
      return {
        type: 'noteOff',
        note: msg.n,
        velocity: 0,
        cc: 0,
        value: 0,
        channel: 1,
        timestamp: msg.ts,
      }
    case 'cc':
      return {
        type: 'cc',
        note: 0,
        velocity: 0,
        cc: msg.c,
        value: msg.v,
        channel: 1,
        timestamp: msg.ts,
      }
  }
}

// ─── PeerManager ─────────────────────────────────────────────────

export class PeerManager {
  private pc: RTCPeerConnection | null = null
  private dc: RTCDataChannel | null = null
  private signal: SignallingClient
  private localUser: string
  private _remoteUser = ''
  private callbacks: PeerCallbacks
  private hasReconnected = false
  private _state: DataChannelState = 'idle'

  constructor(
    signal: SignallingClient,
    localUser: string,
    callbacks: PeerCallbacks,
  ) {
    this.signal = signal
    this.localUser = localUser
    this.callbacks = callbacks
  }

  get remoteUser(): string {
    return this._remoteUser
  }
  get state(): DataChannelState {
    return this._state
  }

  async initiateOffer(targetUser: string): Promise<void> {
    this.cleanup()
    this._remoteUser = targetUser
    this.setState('connecting')

    const pc = this.createPC()
    this.dc = pc.createDataChannel('midi', {
      ordered: false,
      maxRetransmits: 0,
    })
    this.wireDataChannel(this.dc)

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    this.signal.sendOffer(targetUser, offer)
  }

  async handleOffer(
    from: string,
    sdp: RTCSessionDescriptionInit,
  ): Promise<void> {
    this.cleanup()
    this._remoteUser = from
    this.setState('connecting')

    const pc = this.createPC()
    pc.ondatachannel = (e) => {
      this.dc = e.channel
      this.wireDataChannel(this.dc)
    }

    await pc.setRemoteDescription(sdp)
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    this.signal.sendAnswer(from, answer)
  }

  async handleAnswer(sdp: RTCSessionDescriptionInit): Promise<void> {
    if (this.pc) {
      await this.pc.setRemoteDescription(sdp)
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (this.pc) {
      await this.pc.addIceCandidate(candidate)
    }
  }

  sendMidi(event: MidiEvent): void {
    if (this.dc && this.dc.readyState === 'open') {
      this.dc.send(serializeMidi(event))
    }
  }

  sendPing(): void {
    if (this.dc && this.dc.readyState === 'open') {
      this.dc.send(`{"t":"ping","ts":${Date.now()}}`)
    }
  }

  disconnect(): void {
    this.cleanup()
    this._remoteUser = ''
    this.setState('idle')
  }

  // ── internals ──────────────────────────────────────────────────

  private createPC(): RTCPeerConnection {
    const pc = new RTCPeerConnection({ iceServers })
    this.pc = pc

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.signal.sendIceCandidate(
          this._remoteUser,
          e.candidate.toJSON(),
        )
      }
    }

    pc.onconnectionstatechange = () => {
      const s = pc.connectionState
      if (s === 'failed' || s === 'disconnected') {
        this.handlePeerDisconnect()
      }
    }

    return pc
  }

  private wireDataChannel(dc: RTCDataChannel): void {
    dc.onopen = () => {
      this.hasReconnected = false
      this.setState('connected')
      this.detectTransportType()
    }

    dc.onmessage = (e: MessageEvent<string>) => {
      this.handleDCMessage(e.data)
    }

    dc.onclose = () => {
      if (this._state === 'connected') {
        this.handlePeerDisconnect()
      }
    }
  }

  private handleDCMessage(raw: string): void {
    const msg = parseDCMessage(raw)
    if (!msg) return

    switch (msg.t) {
      case 'on':
      case 'off':
      case 'cc':
        this.callbacks.onRemoteMidi(dcToMidiEvent(msg))
        break
      case 'ping':
        if (this.dc && this.dc.readyState === 'open') {
          this.dc.send(`{"t":"pong","ts":${msg.ts}}`)
        }
        break
      case 'pong':
        this.callbacks.onPong(msg.ts)
        break
    }
  }

  private handlePeerDisconnect(): void {
    if (!this.hasReconnected && this._remoteUser) {
      this.hasReconnected = true
      this.setState('connecting')
      this.initiateOffer(this._remoteUser).catch(() => {
        this.setState('disconnected')
      })
    } else {
      this.setState('disconnected')
    }
  }

  private async detectTransportType(): Promise<void> {
    if (!this.pc) return
    try {
      const stats = await this.pc.getStats()
      let localCandidateId: string | undefined

      stats.forEach((report: Record<string, unknown>) => {
        if (
          report.type === 'candidate-pair' &&
          report.state === 'succeeded' &&
          typeof report.localCandidateId === 'string'
        ) {
          localCandidateId = report.localCandidateId
        }
      })

      if (localCandidateId) {
        const local = stats.get(localCandidateId) as
          | Record<string, unknown>
          | undefined
        if (local && typeof local.candidateType === 'string') {
          this.callbacks.onTransportType(
            local.candidateType as TransportType,
          )
        }
      }
    } catch {
      // stats not available yet
    }
  }

  private setState(state: DataChannelState): void {
    this._state = state
    this.callbacks.onStateChange(state)
  }

  private cleanup(): void {
    if (this.dc) {
      this.dc.onopen = null
      this.dc.onmessage = null
      this.dc.onclose = null
      try {
        this.dc.close()
      } catch {
        /* already closed */
      }
      this.dc = null
    }
    if (this.pc) {
      this.pc.onicecandidate = null
      this.pc.onconnectionstatechange = null
      this.pc.ondatachannel = null
      try {
        this.pc.close()
      } catch {
        /* already closed */
      }
      this.pc = null
    }
  }
}
