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

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/login', (_req, res) => {
  res.json({ ok: true })
})

const server = createServer(app)
const wss = new WebSocketServer({ server })
const presence = new Presence()

wss.on('connection', (ws) => {
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

  ws.on('close', () => {
    if (username) {
      presence.remove(username)
      presence.broadcastPresence()
      console.log(`[disconnect] ${username} (${presence.size} online)`)
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
