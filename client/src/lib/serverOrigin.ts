/**
 * WebSocket signalling URL (VITE_SIGNAL_URL or local default).
 * Must match the host/port where the Aether signalling server runs.
 */
export function getSignalWebSocketUrl(): string {
  const raw = import.meta.env.VITE_SIGNAL_URL?.trim()
  return raw || 'ws://localhost:3000'
}

/**
 * HTTP origin for REST calls on the same server (Express + WebSocket share the port).
 * `wss://` → `https://`, `ws://` → `http://`.
 */
export function getServerHttpOrigin(): string {
  return websocketUrlToHttpOrigin(getSignalWebSocketUrl())
}

export function websocketUrlToHttpOrigin(wsUrl: string): string {
  const u = new URL(wsUrl)
  const protocol =
    u.protocol === 'wss:'
      ? 'https:'
      : u.protocol === 'ws:'
        ? 'http:'
        : u.protocol
  return `${protocol}//${u.host}`
}

/** Absolute URL for API routes on the signalling server. */
export function serverApiUrl(path: string): string {
  const base = getServerHttpOrigin().replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
