# JamLink

Real-time music jamming over the web. Two players connect, pick their instrument, and play together with sub-second latency using MIDI over WebRTC data channels.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Client | React 19, TypeScript 6, Vite 8 |
| Server | Express 5, ws (WebSocket), tsx |
| Audio | Web Audio API (OscillatorNode, BiquadFilter, ConvolverNode, DelayNode) |
| MIDI | Web MIDI API, custom parser (`lib/midi.ts`) |
| Transport | WebRTC data channels (MIDI events), WebSocket (signalling + presence) |
| Design system | Vendored DS slice in `vendor/DesignSystem/src` (`@ds` alias) |
| Icons | @phosphor-icons/react |

## Prerequisites

- Node.js 20+
- Design tokens/components live under `vendor/DesignSystem/src` (Vite/TS alias `@ds`)
- (Optional) [ngrok](https://ngrok.com) for cross-network testing
- (Optional) [Metered TURN server](https://metered.ca) credentials for NAT traversal

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your TURN credentials and signal URL

# 3. Start both client and server
npm run dev
```

The signalling server runs on `http://localhost:3000`. The Vite dev server proxies `/api` requests there automatically.

### Cross-network testing with ngrok

```bash
npm run dev:tunnel
```

This starts ngrok alongside the dev servers. Set `VITE_SIGNAL_URL` to the ngrok WSS URL in `.env`.

## NPM scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start client + server concurrently |
| `npm run dev:tunnel` | Client + server + ngrok tunnel |
| `npm run dev:server` | Server only (tsx watch) |
| `npm run dev:client` | Client only (Vite) |
| `npm run tunnel` | ngrok on port 3000 |

## Project structure

```
JamLink/
├── .env.example              # Environment variable template
├── package.json              # Root manifest (single-package monorepo)
├── tsconfig.json             # Root TS config with project references
│
├── client/
│   ├── index.html            # SPA shell
│   ├── vite.config.ts        # Vite config, @ds alias, React dedupe
│   ├── tsconfig.json         # Client TS config
│   └── src/
│       ├── main.tsx           # React bootstrap + AudioContextProvider
│       ├── App.tsx            # Top-level state machine (login → session)
│       ├── styles/
│       │   └── tokens.css     # Global CSS resets, font imports, animations
│       ├── contexts/
│       │   └── AudioContext.tsx  # Shared AudioContext lifecycle
│       ├── pages/
│       │   ├── Login.tsx      # Username + instrument mode selection
│       │   ├── Lobby.tsx      # Online users, connect to peer
│       │   └── JamRoom.tsx    # Jam session orchestration (page-level)
│       ├── components/
│       │   ├── BasicButton.tsx  # DS BasicButton wrapper (null-ref guard)
│       │   └── jam/
│       │       ├── JamRoom.tsx       # Core jam UI, synth controls, recording
│       │       ├── PianoKeyboard.tsx  # On-screen piano (3 octaves, keyboard input)
│       │       ├── PlayerCard.tsx     # Lobby user card
│       │       ├── LobbyGrid.tsx     # CSS grid of player cards
│       │       ├── DeviceSelector.tsx # MIDI device dropdown
│       │       ├── InputMeter.tsx     # Real-time input level meter
│       │       └── DebugPanel.tsx     # Collapsible debug overlay
│       ├── hooks/
│       │   ├── useAudioContext.ts  # AudioContext resume/suspend
│       │   ├── useWebRTC.ts       # Peer connection + data channel + presence
│       │   ├── useLatency.ts      # RTT/jitter measurement via ping-pong
│       │   └── useMIDI.ts         # Web MIDI API access + device selection
│       └── lib/
│           ├── midi.ts        # MIDI types, raw message parser
│           ├── synth.ts       # Web Audio synth (oscillators, filter, delay, reverb)
│           ├── recorder.ts    # MediaRecorder session capture + download
│           ├── signalling.ts  # WebSocket signalling client
│           └── webrtc.ts      # RTCPeerConnection setup, ICE, TURN config
│
└── server/
    ├── index.ts              # Express + WebSocket signalling server
    ├── rooms.ts              # Message types, Presence map, broadcast
    └── tsconfig.json         # Server TS config
```

## Architecture

### Data flow

```
┌──────────┐   WebSocket   ┌──────────┐   WebSocket   ┌──────────┐
│ Player A │◄─────────────►│  Server  │◄─────────────►│ Player B │
│ (client) │  signalling   │ (Node.js)│  signalling   │ (client) │
│          │               │          │               │          │
│          │   WebRTC DC   │          │   WebRTC DC   │          │
│          │◄──────────────┼──────────┼──────────────►│          │
│          │  MIDI events  │          │  MIDI events  │          │
└──────────┘   (peer-to-   └──────────┘   peer-to-    └──────────┘
               peer)                      peer)
```

1. **Signalling** — WebSocket via the Node server handles `join`, `leave`, `offer`, `answer`, and `ice-candidate` messages.
2. **Peer connection** — Once signalling completes, a direct WebRTC `RTCDataChannel` carries MIDI events between peers.
3. **Audio** — Each client runs its own Web Audio synth. Incoming remote MIDI triggers the local synth, so each player hears both instruments with minimal latency.

### Audio graph (per voice)

```
Oscillator → GainNode (per-note envelope) → BiquadFilter (lowpass)
    → DelayNode (with feedback loop) → dry/wet split
        → DryGain ──────────────┐
        → ConvolverNode → WetGain ──┤
                                    ▼
                              MasterGain → AudioContext.destination
```

### Synth features

- **Waveform**: sine, triangle, sawtooth, square
- **Attack/Release**: gain envelope with `linearRampToValueAtTime`
- **Filter**: lowpass `BiquadFilterNode`, real-time frequency cutoff
- **Delay**: `DelayNode` with feedback loop (time + feedback ratio)
- **Reverb**: synthetic impulse response via `ConvolverNode` (dry/wet mix)
- **Expression**: CC11 breath control (wind mode) or fixed 1.0 (keyboard mode)

### Instrument modes

| Mode | Input | Expression | MIDI devices |
|------|-------|-----------|-------------|
| Piano (keyboard) | On-screen piano + computer keyboard | Fixed at 1.0 (velocity-driven) | Disabled |
| Aerophone Mini | Hardware MIDI controller | CC11 breath (0–127 → 0.0–1.0) | Auto-detected |

## Design system integration

JamLink vendors a minimal copy of the design system under `vendor/DesignSystem/src`, exposed as the `@ds` alias. The DS provides:

### Components used

- `BasicButton` — wrapped in `components/BasicButton.tsx` to guard against a null-ref issue in the DS source
- `Tag` — status/mode labels
- `Icon` — Phosphor icon wrapper

### Token categories

All tokens are imported from `@ds/tokens/design-tokens`:

| Token | Usage |
|-------|-------|
| `fontFamily` | `"Mona Sans"` — used everywhere as `${fontFamily}, sans-serif` |
| `typography.*` | `display`, `headlineL`, `headlineM`, `titleL`, `titleM`, `titleS`, `bodyL`, `bodyM`, `bodyS`, `label`, `overline`, `buttonM`, `buttonS` |
| `colors.*` | `textHeadingNeutral`, `textBodyNeutral`, `textDisabled`, `textHeadingColour`, `textBodyColour`, `textWhiteAtDarkenedSurface` |
| `semanticColors.*` | `buttonSurfacePrimary`, `backdropNautralBackground`, `backdropStatesDisabledSurface`, `strokeSymbolic`, `strokeSolid`, `textFunctionalError`, `textFunctionalSuccess`, `backdropSurfaceElevatedSurface` |
| `layout.*` | `radiusRound`, `radiusXs`, `radiusM`, `radiusS`, `radiusL`, `gap2`–`gap64`, `strokeS`, `strokeM`, `strokeL` |

### Intentional raw values

These hardcoded values are intentional and not DS token misses:

| Value | Location | Reason |
|-------|----------|--------|
| `#fff` / `#000` | `PianoKeyboard.tsx` | Classic piano key colors |
| `fontSize: 7–8` | `PianoKeyboard.tsx` | Tiny key labels, smaller than DS minimum (`label` = 10) |
| `fontWeight: 600` | Various | DS semibold convention; DS doesn't export a standalone weight constant |
| `gap: 12` | `PianoKeyboard.tsx` | DS has no `gap12` (jumps 8 → 16); one-off spacing |
| Piano dimensions | `PianoKeyboard.tsx` | Musical instrument geometry, not UI layout |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SIGNAL_URL` | Yes | WebSocket URL for signalling (default: `ws://localhost:3000`) |
| `VITE_TURN_HOST` | No | TURN server host for NAT traversal (e.g. `standard.relay.metered.ca`) |
| `VITE_TURN_USERNAME` | No | TURN server username |
| `VITE_TURN_CREDENTIAL` | No | TURN server credential |
| `NGROK_AUTHTOKEN` | No | ngrok auth token for tunnel mode |

## Key decisions

- **No React Router** — navigation is local state (`login` → `session`, `lobby` → `jam`). The app has only 3 views.
- **Single root package.json** — not npm workspaces. One `npm install` serves both client and server.
- **TypeScript project references** — root `tsconfig.json` references `client/` and `server/` for IDE support.
- **React dedupe** — `resolve.dedupe: ['react', 'react-dom']` in Vite config prevents duplicate React instances from the external DS package.
- **Synth lifecycle** — `Synth` is created in a `useEffect` (not `useRef`) to ensure proper cleanup and recreation when AudioContext or mode changes. Prevents stale HMR instances.
- **BasicButton wrapper** — guards against a null-ref crash in the DS's `BasicButton` component by capturing `e.currentTarget` before `requestAnimationFrame`.
