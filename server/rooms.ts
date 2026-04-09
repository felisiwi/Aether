import { WebSocket } from 'ws'

// ─── Signal message types ────────────────────────────────────────

export interface JoinMessage {
  type: 'join'
  from: string
}

export interface PresenceMessage {
  type: 'presence'
  users: string[]
}

export interface OfferMessage {
  type: 'offer'
  from: string
  to: string
  sdp: unknown
}

export interface AnswerMessage {
  type: 'answer'
  from: string
  to: string
  sdp: unknown
}

export interface IceCandidateMessage {
  type: 'ice-candidate'
  from: string
  to: string
  candidate: unknown
}

export interface LeaveMessage {
  type: 'leave'
  from: string
}

export type SignalMessage =
  | JoinMessage
  | OfferMessage
  | AnswerMessage
  | IceCandidateMessage
  | LeaveMessage

export type RoutingMessage = OfferMessage | AnswerMessage | IceCandidateMessage

export function isRoutingMessage(
  msg: SignalMessage,
): msg is RoutingMessage {
  return (
    msg.type === 'offer' ||
    msg.type === 'answer' ||
    msg.type === 'ice-candidate'
  )
}

const VALID_TYPES = new Set([
  'join',
  'offer',
  'answer',
  'ice-candidate',
  'leave',
])

/**
 * Runtime validation — returns null for anything that isn't
 * a well-formed SignalMessage. Keeps `any` out of the server.
 */
export function parseSignalMessage(raw: string): SignalMessage | null {
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  if (typeof parsed !== 'object' || parsed === null) return null
  if (typeof parsed.type !== 'string' || !VALID_TYPES.has(parsed.type))
    return null
  if (typeof parsed.from !== 'string') return null

  if (
    parsed.type === 'offer' ||
    parsed.type === 'answer' ||
    parsed.type === 'ice-candidate'
  ) {
    if (typeof parsed.to !== 'string') return null
  }

  return parsed as unknown as SignalMessage
}

// ─── Presence management ─────────────────────────────────────────

export class Presence {
  private users = new Map<string, WebSocket>()

  add(username: string, ws: WebSocket): void {
    this.users.set(username, ws)
  }

  remove(username: string): boolean {
    return this.users.delete(username)
  }

  get(username: string): WebSocket | undefined {
    return this.users.get(username)
  }

  list(): string[] {
    return Array.from(this.users.keys())
  }

  get size(): number {
    return this.users.size
  }

  broadcast(data: string): void {
    for (const ws of this.users.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    }
  }

  broadcastPresence(): void {
    const msg: PresenceMessage = { type: 'presence', users: this.list() }
    this.broadcast(JSON.stringify(msg))
  }
}
