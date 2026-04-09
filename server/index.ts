import express from 'express'
import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { Presence, parseSignalMessage, isRoutingMessage } from './rooms.js'

/** Railway and other hosts set `PORT`; fall back for local dev. */
const PORT = (() => {
  const p = process.env.PORT
  if (p === undefined || p === '') return 3000
  const n = Number(p)
  return Number.isFinite(n) && n > 0 ? n : 3000
})()

const app = express()
app.use(express.json())

// Allow login (and other API) from the static frontend on another origin (e.g. Vercel).
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/login', (_req, res) => {
  res.json({ ok: true })
})

const server = createServer(app)
// `server` handles Upgrade; same port as Express. `perMessageDeflate: false` avoids
// rare issues with some reverse proxies (e.g. compression + buffering).
const wss = new WebSocketServer({
  server,
  perMessageDeflate: false,
  clientTracking: true,
})
const presence = new Presence()

/** Ping interval keeps connections warm through Railway / CDN idle timeouts (~60s). */
const HEARTBEAT_MS = 25_000
type WsClient = WebSocket & { isAlive?: boolean }

const heartbeat = setInterval(() => {
  wss.clients.forEach((socket) => {
    const ws = socket as WsClient
    if (ws.readyState !== WebSocket.OPEN) return
    if (ws.isAlive === false) {
      console.warn('[ws] no pong — terminating idle/zombie socket')
      ws.terminate()
      return
    }
    ws.isAlive = false
    ws.ping()
  })
}, HEARTBEAT_MS)

wss.on('connection', (ws, req) => {
  const client = ws as WsClient
  client.isAlive = true
  client.on('pong', () => {
    client.isAlive = true
  })

  const ip = req.socket.remoteAddress ?? 'unknown'
  console.log(`[ws] tcp open from ${ip}`)

  let username: string | null = null

  ws.on('message', (raw) => {
    const rawStr = raw.toString()
    const msg = parseSignalMessage(rawStr)
    if (!msg) {
      console.warn('[ws] Dropped malformed message')
      return
    }

    if (msg.type === 'join') {
      username = msg.from
      presence.add(username, ws)
      presence.broadcastPresence()
      console.log(`[join] ${username} (${presence.size} online)`)
      return
    }

    if (msg.type === 'leave') {
      if (username) {
        presence.remove(username)
        presence.broadcastPresence()
        console.log(`[leave] ${username} (${presence.size} online)`)
      }
      username = null
      return
    }

    if (isRoutingMessage(msg)) {
      const target = presence.get(msg.to)
      if (!target || target.readyState !== WebSocket.OPEN) {
        console.warn(
          `[${msg.type}] Target "${msg.to}" not found or disconnected`,
        )
        return
      }
      target.send(rawStr)
    }
  })

  ws.on('close', (code, reason) => {
    if (username) {
      presence.remove(username)
      presence.broadcastPresence()
      console.log(
        `[disconnect] ${username} (${presence.size} online) code=${code} reason=${reason.toString() || 'n/a'}`,
      )
    } else {
      console.log(`[ws] closed before join code=${code}`)
    }
  })

  ws.on('error', (err) => {
    console.error(`[ws error] ${username ?? 'unknown'}:`, err.message)
    if (username) {
      presence.remove(username)
      presence.broadcastPresence()
    }
  })
})

const HOST = process.env.HOST ?? '0.0.0.0'
server.listen(PORT, HOST, () => {
  console.log(`Aether signalling server on http://${HOST}:${PORT}`)
})

process.on('SIGTERM', () => {
  clearInterval(heartbeat)
  wss.close()
  server.close()
})
