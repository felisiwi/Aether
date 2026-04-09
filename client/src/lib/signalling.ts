// ─── Client-side signal message types (received from server) ─────

interface PresenceMsg {
  type: 'presence'
  users: string[]
}
interface OfferMsg {
  type: 'offer'
  from: string
  sdp: RTCSessionDescriptionInit
}
interface AnswerMsg {
  type: 'answer'
  from: string
  sdp: RTCSessionDescriptionInit
}
interface IceCandidateMsg {
  type: 'ice-candidate'
  from: string
  candidate: RTCIceCandidateInit
}
type ServerMessage = PresenceMsg | OfferMsg | AnswerMsg | IceCandidateMsg

// ─── Handler interface ───────────────────────────────────────────

export interface SignalHandlers {
  onPresence?: (users: string[]) => void
  onOffer?: (from: string, sdp: RTCSessionDescriptionInit) => void
  onAnswer?: (from: string, sdp: RTCSessionDescriptionInit) => void
  onIceCandidate?: (from: string, candidate: RTCIceCandidateInit) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (message: string) => void
}

// ─── SignallingClient ────────────────────────────────────────────

export class SignallingClient {
  private ws: WebSocket | null = null
  private _username = ''

  get username(): string {
    return this._username
  }

  get connected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  connect(url: string, username: string, handlers: SignalHandlers): void {
    this.disconnect()
    this._username = username

    const ws = new WebSocket(url)
    this.ws = ws

    ws.onopen = () => {
      this.send({ type: 'join', from: username })
      handlers.onOpen?.()
    }

    ws.onmessage = (e: MessageEvent<string>) => {
      let msg: ServerMessage
      try {
        msg = JSON.parse(e.data) as ServerMessage
      } catch {
        return
      }

      switch (msg.type) {
        case 'presence':
          handlers.onPresence?.(msg.users)
          break
        case 'offer':
          handlers.onOffer?.(msg.from, msg.sdp)
          break
        case 'answer':
          handlers.onAnswer?.(msg.from, msg.sdp)
          break
        case 'ice-candidate':
          handlers.onIceCandidate?.(msg.from, msg.candidate)
          break
      }
    }

    ws.onclose = () => handlers.onClose?.()
    ws.onerror = () => handlers.onError?.('WebSocket connection failed')
  }

  sendOffer(to: string, sdp: RTCSessionDescriptionInit): void {
    this.send({ type: 'offer', from: this._username, to, sdp })
  }

  sendAnswer(to: string, sdp: RTCSessionDescriptionInit): void {
    this.send({ type: 'answer', from: this._username, to, sdp })
  }

  sendIceCandidate(to: string, candidate: RTCIceCandidateInit): void {
    this.send({ type: 'ice-candidate', from: this._username, to, candidate })
  }

  disconnect(): void {
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'leave', from: this._username })
      }
      this.ws.close()
      this.ws = null
    }
  }

  private send(msg: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    }
  }
}
