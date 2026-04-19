import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  semanticColors,
  layout,
  fontFamily,
} from '@ds/tokens/design-tokens'
import type { WaveformId } from '@ds/Components/soundwavecontroller/SoundWaveController.1.3.0'
import type { ButtonRowOption } from '@ds/Components/buttonrow/ButtonRow.1.0.0'
import { TopNav } from '@ds/Components/topnav/TopNav.1.2.0'
import { JamBoard } from '@ds/Components/jamboard/JamBoard.1.0.0'
import type { ChordDisplayNote } from '@ds/Components/chorddisplay/ChordDisplay.2.3.0'
import { EffectsBoard } from '@ds/Components/effectsboard/EffectsBoard.1.0.0'
import { KeyOctaveController } from '@ds/Components/keyoctavecontroller/KeyOctaveController.1.0.0'
import { InstrumentInterface } from '@ds/Components/instrumentinterface/InstrumentInterface.1.1.0'
import BasicButton from '../BasicButton'
import PianoKeyboard from './PianoKeyboard'
import { useTheme } from '../../contexts/ThemeContext'
import type { PianoKeyboardHandle } from './PianoKeyboard'
import type { MidiEvent, InstrumentMode } from '../../lib/midi'
import type { Synth } from '../../lib/synth'
import { detectChord } from '../../lib/chords'
import type { ChordResult } from '../../lib/chords'
import type {
  DataChannelState,
  PatchStateMessage,
  TransportType,
} from '../../lib/webrtc'
import { SessionRecorder } from '../../lib/recorder'

const FONT = `${fontFamily}, sans-serif`

const DEFAULT_TRANSPOSE = 0
const MIN_TRANSPOSE = -5
const MAX_TRANSPOSE = 6
const TRANSPOSE_KEY: Record<number, string> = {
  '-5': 'G', '-4': 'Ab', '-3': 'A', '-2': 'Bb', '-1': 'B',
  '0': 'C', '1': 'C#', '2': 'D', '3': 'Eb', '4': 'E', '5': 'F', '6': 'F#',
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
function midiNoteToName(note: number): string {
  const idx = ((note % 12) + 12) % 12
  const octave = Math.floor(note / 12) - 1
  return `${NOTE_NAMES[idx]}${octave}`
}

function pitchClassName(note: number): string {
  return NOTE_NAMES[((note % 12) + 12) % 12]
}

const WAVEFORM_IDS = ['sine', 'triangle', 'sawtooth', 'square'] as const

const waveformOptions: ButtonRowOption[] = [
  { icon: 'waveform-sine', label: 'Sine' },
  { icon: 'waveform-triangle', label: 'Triangle' },
  { icon: 'waveform-sawtooth', label: 'Sawtooth' },
  { icon: 'waveform-square', label: 'Square' },
]

export interface JamRoomHandle {
  handleLocalMidi: (event: MidiEvent) => void
  handleRemoteMidi: (event: MidiEvent) => void
}

export interface JamRoomProps {
  localUser: string
  remoteUser: string | null
  localMode: InstrumentMode
  synth: Synth | null
  remoteSynth: Synth | null
  sendPatchState: (patch: PatchStateMessage) => void
  connectionState: DataChannelState
  transportType: TransportType
  sendMidi: (event: MidiEvent) => void
  rtt: number | null
  oneWay: number | null
  jitter: number | null
  samplesRef: React.RefObject<number[]>
  onLeave: () => void
}

const JamRoomComponent = forwardRef<JamRoomHandle, JamRoomProps>(
  function JamRoomComponent(
    {
      localUser: _localUser,
      remoteUser,
      localMode,
      synth,
      remoteSynth,
      sendPatchState,
      connectionState,
      transportType: _transportType,
      sendMidi,
      rtt: _rtt,
      oneWay: _oneWay,
      jitter: _jitter,
      samplesRef: _samplesRef,
      onLeave,
    },
    ref,
  ) {
    const { theme, mode, setThemeMode } = useTheme()
    const pianoRef = useRef<PianoKeyboardHandle>(null)
    const [pianoOctaveShift, setPianoOctaveShift] = useState(0)
    const pianoOctaveShiftRef = useRef(pianoOctaveShift)
    pianoOctaveShiftRef.current = pianoOctaveShift

    const pulseRef = useRef<HTMLDivElement>(null)
    const oscilloscopeRef = useRef<HTMLCanvasElement>(null)
    const [remoteNotes, setRemoteNotes] = useState<Set<number>>(new Set())
    const [localNotes, setLocalNotes] = useState<number[]>([])

    const [waveform, setWaveform] = useState<WaveformId>('sine')

    const [attack, setAttack] = useState(0)
    const [release, setRelease] = useState(20)
    const [sustain, setSustain] = useState(65)
    const [envelopeDecay, setEnvelopeDecay] = useState(0)
    const [chorusMix, setChorusMix] = useState(0)
    const [chorusDepth, setChorusDepth] = useState(0)
    const [pitchRate, setPitchRate] = useState(0)
    const [pitchDepth, setPitchDepth] = useState(0)
    const [brightness, setBrightness] = useState(20000)

    const [delayTime, setDelayTime] = useState(0)
    const [delayFeedback, setDelayFeedback] = useState(0)
    const [reverbMix, setReverbMix] = useState(0)

    const [volume, setVolume] = useState(1)

    const patchSnapshotRef = useRef({
      waveform: 'sine' as WaveformId,
      attack: 0,
      release: 20,
      brightness: 20000,
      delayTime: 0,
      delayFeedback: 0,
      reverbMix: 0,
      volume: 1,
    })

    useEffect(() => {
      patchSnapshotRef.current = {
        waveform,
        attack,
        release,
        brightness,
        delayTime,
        delayFeedback,
        reverbMix,
        volume,
      }
    })

    const patchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const sendPatchStateRef = useRef(sendPatchState)
    sendPatchStateRef.current = sendPatchState

    const buildPatchMessage = useCallback((): PatchStateMessage => {
      const p = patchSnapshotRef.current
      return {
        type: 'patchState',
        waveform: String(p.waveform),
        attack: p.attack,
        release: p.release,
        brightness: p.brightness,
        delay: p.delayTime,
        feedback: p.delayFeedback,
        reverb: p.reverbMix,
        volume: p.volume,
      }
    }, [])

    const schedulePatchSend = useCallback(() => {
      if (connectionState !== 'connected' || !remoteUser) return
      if (patchDebounceRef.current) clearTimeout(patchDebounceRef.current)
      patchDebounceRef.current = setTimeout(() => {
        patchDebounceRef.current = null
        sendPatchStateRef.current(buildPatchMessage())
      }, 200)
    }, [connectionState, remoteUser, buildPatchMessage])

    useEffect(() => {
      return () => {
        if (patchDebounceRef.current) clearTimeout(patchDebounceRef.current)
      }
    }, [])

    useEffect(() => {
      if (connectionState !== 'connected' || !remoteUser) return
      sendPatchStateRef.current(buildPatchMessage())
    }, [connectionState, remoteUser, buildPatchMessage])

    useEffect(() => {
      if (!synth) return
      synth.setSustain(sustain)
      synth.setEnvelopeDecay(envelopeDecay)
      synth.setChorusMix(chorusMix)
      synth.setChorusDepth(chorusDepth)
    }, [synth, sustain, envelopeDecay, chorusMix, chorusDepth])

    const handleWaveformChange = useCallback(
      (w: WaveformId) => {
        setWaveform(w)
        synth?.setWaveform(w)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )
    const handleAttack = useCallback(
      (ms: number) => {
        setAttack(ms)
        synth?.setAttack(ms)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )
    const handleSustain = useCallback(
      (pct: number) => {
        setSustain(pct)
        schedulePatchSend()
      },
      [schedulePatchSend],
    )
    const handleEnvelopeDecay = useCallback(
      (ms: number) => {
        setEnvelopeDecay(ms)
        schedulePatchSend()
      },
      [schedulePatchSend],
    )
    const handleChorusMix = useCallback(
      (v: number) => {
        setChorusMix(v)
        schedulePatchSend()
      },
      [schedulePatchSend],
    )
    const handleChorusDepth = useCallback(
      (ms: number) => {
        setChorusDepth(ms)
        schedulePatchSend()
      },
      [schedulePatchSend],
    )
    const handleRelease = useCallback(
      (ms: number) => {
        setRelease(ms)
        synth?.setRelease(ms)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )
    const handleBrightness = useCallback(
      (hz: number) => {
        setBrightness(hz)
        synth?.setBrightness(hz)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )
    const handleDelayTime = useCallback(
      (ms: number) => {
        setDelayTime(ms)
        synth?.setDelayTime(ms)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )
    const handleDelayFeedback = useCallback(
      (v: number) => {
        setDelayFeedback(v)
        synth?.setDelayFeedback(v)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )
    const handleReverbMix = useCallback(
      (v: number) => {
        setReverbMix(v)
        synth?.setReverbMix(v)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )
    const handleVolume = useCallback(
      (v: number) => {
        setVolume(v)
        synth?.setMasterVolume(v)
        schedulePatchSend()
      },
      [synth, schedulePatchSend],
    )

    const filterK = useMemo(() => {
      const k = brightness / 1000
      return Math.min(16, Math.max(0, Math.round(k * 10) / 10))
    }, [brightness])

    const handleFilterK = useCallback(
      (k: number) => {
        handleBrightness(Math.round(k * 1000))
      },
      [handleBrightness],
    )

    const [transpose, setTranspose] = useState(DEFAULT_TRANSPOSE)
    const transposeRef = useRef(transpose)
    transposeRef.current = transpose

    const [syncRemote, setSyncRemote] = useState(true)

    const recorderRef = useRef<SessionRecorder | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recTime, setRecTime] = useState(0)
    const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const handleRecord = useCallback(() => {
      if (!synth?.audioContext || !synth.outputNode) return
      const rec = new SessionRecorder(synth.audioContext, synth.outputNode)
      rec.start()
      recorderRef.current = rec
      setIsRecording(true)
      setRecTime(0)
      recTimerRef.current = setInterval(() => {
        setRecTime(rec.elapsed)
      }, 200)
    }, [synth])

    const handleStopRecord = useCallback(async () => {
      if (!recorderRef.current) return
      if (recTimerRef.current) clearInterval(recTimerRef.current)
      const blob = await recorderRef.current.stop()
      recorderRef.current = null
      setIsRecording(false)
      setRecTime(0)
      SessionRecorder.download(blob)
    }, [])

    const [expressionLocked, setExpressionLocked] = useState(false)
    const toggleExpressionLock = useCallback(() => {
      setExpressionLocked((prev) => {
        const next = !prev
        if (next) synth?.setExpressionDirect(1.0)
        return next
      })
    }, [synth])

    const [windOctaveShift, setWindOctaveShift] = useState(0)
    const windOctaveShiftRef = useRef(windOctaveShift)
    windOctaveShiftRef.current = windOctaveShift
    const windActiveNotesRef = useRef<Map<number, number>>(new Map())
    const keyboardActiveNotesRef = useRef<Map<number, number>>(new Map())

    useEffect(() => {
      if (localMode !== 'wind' || !synth) return
      const activeMap = windActiveNotesRef.current
      if (activeMap.size === 0) return

      const newMap = new Map<number, number>()
      for (const [rawNote, oldShifted] of activeMap) {
        const newShifted = rawNote + transpose + windOctaveShift * 12
        if (newShifted < 0 || newShifted > 127) continue
        synth.updateNotePitch(oldShifted, newShifted)
        if (oldShifted !== newShifted) {
          sendMidi({ type: 'noteOff', note: oldShifted, velocity: 0, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
          sendMidi({ type: 'noteOn', note: newShifted, velocity: 127, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
        }
        newMap.set(rawNote, newShifted)
      }
      windActiveNotesRef.current = newMap
    }, [transpose, windOctaveShift, localMode, synth, sendMidi])

    const prevKbTransposeRef = useRef(transpose)
    const prevKbOctaveRef = useRef(pianoOctaveShift)
    useEffect(() => {
      if ((localMode !== 'keyboard' && localMode !== 'nanokey') || !synth) return
      const tDelta = transpose - prevKbTransposeRef.current
      const oDelta = (pianoOctaveShift - prevKbOctaveRef.current) * 12
      const totalDelta = tDelta + oDelta
      prevKbTransposeRef.current = transpose
      prevKbOctaveRef.current = pianoOctaveShift

      const activeMap = keyboardActiveNotesRef.current
      if (activeMap.size === 0 || totalDelta === 0) return

      const snapshot = new Map(activeMap)
      for (const [, oldFinal] of snapshot) {
        const newFinal = oldFinal + totalDelta
        if (newFinal < 0 || newFinal > 127) continue
        synth.updateNotePitch(oldFinal, newFinal)
        if (oldFinal !== newFinal) {
          sendMidi({ type: 'noteOff', note: oldFinal, velocity: 0, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
          sendMidi({ type: 'noteOn', note: newFinal, velocity: 127, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
        }
      }

      const semitoneShift = totalDelta
      for (const [key, oldNote] of [...keyboardActiveNotesRef.current]) {
        const newNote = oldNote + semitoneShift
        if (newNote < 0 || newNote > 127) {
          keyboardActiveNotesRef.current.delete(key)
        } else {
          keyboardActiveNotesRef.current.set(key, newNote)
        }
      }

      setLocalNotes([...keyboardActiveNotesRef.current.values()].filter(n => n >= 0 && n <= 127))
    }, [transpose, pianoOctaveShift, localMode, synth, sendMidi])

    const handleComputerKeyboardCapsLockOff = useCallback(() => {
      synth?.panicAllNotesOff()
      keyboardActiveNotesRef.current.clear()
      setLocalNotes([])
    }, [synth])

    useEffect(() => {
      if (localMode !== 'wind') return
      const down = (e: KeyboardEvent) => {
        if (e.repeat) return
        if (e.code === 'ArrowLeft') {
          e.preventDefault()
          setTranspose((v) => Math.max(v - 1, MIN_TRANSPOSE))
        } else if (e.code === 'ArrowRight') {
          e.preventDefault()
          setTranspose((v) => Math.min(v + 1, MAX_TRANSPOSE))
        } else if (e.code === 'ArrowUp') {
          e.preventDefault()
          setWindOctaveShift((v) => Math.min(v + 1, 3))
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          setWindOctaveShift((v) => Math.max(v - 1, -3))
        }
      }
      window.addEventListener('keydown', down)
      return () => window.removeEventListener('keydown', down)
    }, [localMode])

    useEffect(() => {
      if (localMode !== 'keyboard' && localMode !== 'nanokey') return
      const down = (e: KeyboardEvent) => {
        if (e.repeat) return
        if (
          e.code !== 'ArrowUp'
          && e.code !== 'ArrowDown'
          && e.code !== 'ArrowLeft'
          && e.code !== 'ArrowRight'
        ) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        if (e.code === 'ArrowLeft') {
          pianoRef.current?.setOctaveShift(pianoOctaveShiftRef.current - 1)
        } else if (e.code === 'ArrowRight') {
          pianoRef.current?.setOctaveShift(pianoOctaveShiftRef.current + 1)
        } else if (e.code === 'ArrowUp') {
          setTranspose((v) => Math.min(v + 1, MAX_TRANSPOSE))
        } else if (e.code === 'ArrowDown') {
          setTranspose((v) => Math.max(v - 1, MIN_TRANSPOSE))
        }
      }
      window.addEventListener('keydown', down, true)
      return () => window.removeEventListener('keydown', down, true)
    }, [localMode])

    const handleLocalMidi = useCallback(
      (event: MidiEvent) => {
        if (!synth) return

        if (event.type === 'noteOn' || event.type === 'noteOff') {
          let note: number
          if (localMode === 'wind') {
            if (event.type === 'noteOn') {
              note = event.note + transposeRef.current + windOctaveShiftRef.current * 12
              if (note < 0 || note > 127) return
              windActiveNotesRef.current.set(event.note, note)
            } else {
              note = windActiveNotesRef.current.get(event.note)
                ?? (event.note + transposeRef.current + windOctaveShiftRef.current * 12)
              windActiveNotesRef.current.delete(event.note)
              if (note < 0 || note > 127) return
            }
          } else {
            if (event.type === 'noteOn') {
              note = event.note + transposeRef.current
              if (note < 0 || note > 127) return
              keyboardActiveNotesRef.current.set(event.note, note)
            } else {
              note = keyboardActiveNotesRef.current.get(event.note)
                ?? (event.note + transposeRef.current)
              keyboardActiveNotesRef.current.delete(event.note)
              if (note < 0 || note > 127) return
            }
          }
          const shifted = { ...event, note }
          sendMidi(shifted)
          if (event.type === 'noteOn') {
            synth.noteOn(note)
            setLocalNotes((prev) => prev.includes(note) ? prev : [...prev, note])
          } else {
            synth.noteOff(note)
            setLocalNotes((prev) => prev.filter(n => n !== note))
          }
        } else if (event.type === 'cc') {
          if (localMode === 'nanokey') return
          sendMidi(event)
          if (!expressionLocked) {
            synth.setCC(event.cc, event.value)
          }
        }
      },
      [sendMidi, synth, expressionLocked, localMode],
    )

    const handleRemoteMidi = useCallback(
      (event: MidiEvent) => {
        if (!remoteSynth || !syncRemote) return
        if (event.type === 'noteOn') {
          remoteSynth.noteOn(event.note)
          setRemoteNotes((prev) => {
            const next = new Set(prev)
            next.add(event.note)
            return next
          })
          if (pulseRef.current) {
            pulseRef.current.animate(
              [
                { transform: 'scale(1)', opacity: 0.5 },
                { transform: 'scale(1.5)', opacity: 0 },
              ],
              { duration: 300, easing: 'ease-out' },
            )
          }
        } else if (event.type === 'noteOff') {
          remoteSynth.noteOff(event.note)
          setRemoteNotes((prev) => {
            const next = new Set(prev)
            next.delete(event.note)
            return next
          })
        } else if (event.type === 'cc') {
          remoteSynth.setCC(event.cc, event.value)
        }
      },
      [remoteSynth, syncRemote],
    )

    const localMidiRef = useRef(handleLocalMidi)
    localMidiRef.current = handleLocalMidi
    const remoteMidiRef = useRef(handleRemoteMidi)
    remoteMidiRef.current = handleRemoteMidi

    useImperativeHandle(
      ref,
      () => ({
        handleLocalMidi: (e: MidiEvent) => localMidiRef.current(e),
        handleRemoteMidi: (e: MidiEvent) => remoteMidiRef.current(e),
      }),
      [],
    )

    const isSolo = remoteUser === null

    const chordResult: ChordResult | null = useMemo(
      () => detectChord(localNotes),
      [localNotes],
    )

    const chordCardMainLine = useMemo(() => {
      if (chordResult?.primary) return chordResult.primary
      return null
    }, [chordResult])

    const remoteNotesArray = useMemo(
      () => [...remoteNotes].sort((a, b) => a - b),
      [remoteNotes],
    )
    const remoteChordResult: ChordResult | null = useMemo(
      () => detectChord(remoteNotesArray),
      [remoteNotesArray],
    )
    const remoteChordMainLine = useMemo(() => {
      if (remoteChordResult?.primary) return remoteChordResult.primary
      return null
    }, [remoteChordResult])
    const localChordNotes: ChordDisplayNote[] = useMemo(() => {
      const hasChord = Boolean(chordResult?.primary)
      return localNotes.map((midiNote) => {
        const noteName = midiNoteToName(midiNote)
        const pc = pitchClassName(midiNote)
        const isInChord = hasChord && (chordResult?.noteNames?.includes(pc) ?? false)
        return { note: noteName, partOfChord: isInChord }
      })
    }, [localNotes, chordResult])

    const remoteChordNotes: ChordDisplayNote[] = useMemo(
      () =>
        Array.from(remoteNotes).map((midiNote) => {
          const noteName = midiNoteToName(midiNote)
          return { note: noteName, partOfChord: false }
        }),
      [remoteNotes],
    )

    const [remoteVolume, setRemoteVolume] = useState(1)

    useEffect(() => {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
        document.documentElement.style.overflow = ''
      }
    }, [])

    useEffect(() => {
      const canvas = oscilloscopeRef.current
      if (!canvas) return

      let data = new Uint8Array(2048)
      let rafId: number

      const draw = () => {
        rafId = requestAnimationFrame(draw)

        const w = canvas.offsetWidth
        const h = canvas.offsetHeight
        if (w === 0 || h === 0) return
        if (canvas.width !== w) canvas.width = w
        if (canvas.height !== h) canvas.height = h

        const ctx2d = canvas.getContext('2d')
        if (!ctx2d) return

        ctx2d.fillStyle = semanticColors.backdropStaticBlack
        ctx2d.fillRect(0, 0, w, h)

        const analyser = synth?.getAnalyser() ?? null
        const hasNotes = localNotes.length > 0

        if (!hasNotes || !analyser) {
          ctx2d.beginPath()
          ctx2d.moveTo(0, h / 2)
          ctx2d.lineTo(w, h / 2)
          ctx2d.lineWidth = 1
          ctx2d.strokeStyle = semanticColors.strokeInvertedMedium
          ctx2d.stroke()
          return
        }

        if (data.length !== analyser.fftSize) {
          data = new Uint8Array(analyser.fftSize)
        }
        analyser.getByteTimeDomainData(data)

        const clipThreshold = h * 0.02
        let clipping = false
        const sliceWidth = w / data.length
        let x = 0

        ctx2d.beginPath()
        for (let i = 0; i < data.length; i++) {
          const v = data[i] / 128.0
          const y = (v * h) / 2
          if (y < clipThreshold || y > h - clipThreshold) clipping = true
          if (i === 0) {
            ctx2d.moveTo(x, y)
          } else {
            ctx2d.lineTo(x, y)
          }
          x += sliceWidth
        }

        ctx2d.lineWidth = 2
        ctx2d.strokeStyle = clipping
          ? semanticColors.textFunctionalError
          : semanticColors.strokeColour
        ctx2d.stroke()
      }

      draw()
      return () => cancelAnimationFrame(rafId)
    }, [synth, localNotes.length])

    const topNavDefaultTheme = mode === 'dark' ? 'dark' : 'light'

    const horizontalPad = { paddingLeft: layout.gap48, paddingRight: layout.gap48 }

    return (
      <div
        style={{
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: theme.pageBg,
          transition: 'background-color 600ms ease',
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 20,
            width: '100%',
          }}
        >
          <TopNav
            onBackToLobby={onLeave}
            defaultTheme={topNavDefaultTheme}
            onThemeChange={(t: 'light' | 'dark') => setThemeMode(t)}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'visible',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 0,
              paddingBottom: layout.gap48,
            }}
          >
          <div style={{ position: 'relative', flexShrink: 0, ...horizontalPad }}>
            {!isSolo && (
              <div
                ref={pulseRef}
                style={{
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderRadius: layout.radiusRound,
                  background: semanticColors.buttonSurfacePrimary,
                  opacity: 0,
                  pointerEvents: 'none',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                }}
              />
            )}
            <JamBoard
              variant={isSolo ? 'solo' : 'duo'}
              localNotes={localChordNotes}
              localChordName={chordCardMainLine ?? ''}
              oscilloscopeRef={oscilloscopeRef}
              remoteNotes={remoteChordNotes}
              remoteChordName={remoteChordMainLine ?? ''}
              remoteThemeIndex={0}
              masterVolume={Math.round(volume * 100)}
              onMasterVolumeChange={(v) => handleVolume(v / 100)}
              remoteVolume={Math.round(remoteVolume * 100)}
              onRemoteVolumeChange={(v) => setRemoteVolume(v / 100)}
            />
          </div>

          <div style={horizontalPad}>
            <EffectsBoard
              waveformIndex={Math.max(0, WAVEFORM_IDS.indexOf(waveform))}
              onWaveformChange={(i) => handleWaveformChange(WAVEFORM_IDS[i] as WaveformId)}
              waveformOptions={waveformOptions}
              filter={filterK}
              onFilterChange={handleFilterK}
              drive={0}
              onDriveChange={() => {}}
              reverb={Math.round(reverbMix * 100)}
              onReverbChange={(v) => handleReverbMix(v / 100)}
              glide={0}
              onGlideChange={() => {}}
              attack={Math.round(attack)}
              onAttackChange={handleAttack}
              sustain={sustain}
              onSustainChange={handleSustain}
              release={Math.round(release)}
              onReleaseChange={handleRelease}
              decay={envelopeDecay}
              onDecayChange={handleEnvelopeDecay}
              chorusMix={chorusMix}
              onChorusMixChange={handleChorusMix}
              chorusDepth={chorusDepth}
              onChorusDepthChange={handleChorusDepth}
              pitchRate={pitchRate}
              onPitchRateChange={setPitchRate}
              pitchDepth={pitchDepth}
              onPitchDepthChange={setPitchDepth}
              delayTime={Math.round(delayTime)}
              onDelayTimeChange={(v) => handleDelayTime(v)}
              feedback={Math.round(delayFeedback * 100)}
              onFeedbackChange={(v) => handleDelayFeedback(v / 100)}
            />
          </div>

          {localMode === 'wind' && (
            <div style={horizontalPad}>
              <BasicButton
                variant="primary"
                colourFill
                size="small"
                latching
                state={!expressionLocked ? 'pressed' : 'active'}
                onClick={toggleExpressionLock}
              >
                Breath Control
              </BasicButton>
            </div>
          )}

          {(localMode === 'keyboard' || localMode === 'nanokey') && (
            <div
              style={{
                paddingBottom: layout.gap48,
                ...horizontalPad,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: layout.gap16,
                  minWidth: 0,
                }}
              >
                <KeyOctaveController
                  keyValue={TRANSPOSE_KEY[transpose] ?? 'C'}
                  octaveValue={String(pianoOctaveShift)}
                  onKeyUp={() => setTranspose((v) => Math.min(v + 1, MAX_TRANSPOSE))}
                  onKeyDown={() => setTranspose((v) => Math.max(v - 1, MIN_TRANSPOSE))}
                  onOctaveUp={() => pianoRef.current?.setOctaveShift(pianoOctaveShift + 1)}
                  onOctaveDown={() => pianoRef.current?.setOctaveShift(pianoOctaveShift - 1)}
                />
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    minWidth: 0,
                    alignSelf: 'stretch',
                    display: 'flex',
                    alignItems: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      pointerEvents: 'auto',
                      zIndex: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <PianoKeyboard
                      ref={pianoRef}
                      onCapsLockOff={handleComputerKeyboardCapsLockOff}
                      onMidiEvent={handleLocalMidi}
                      remoteActiveNotes={remoteNotes}
                      onOctaveShiftChange={(s) => setPianoOctaveShift(s)}
                      transpose={transpose}
                    />
                  </div>
                  <InstrumentInterface
                    octave={3 + pianoOctaveShift}
                    octaveSpan={3}
                    pressedNotes={localNotes.map(midiNoteToName)}
                    noteOffset={transpose}
                    variant="Keyboard"
                    style={{ background: 'transparent', pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    )
  },
)

export default JamRoomComponent
