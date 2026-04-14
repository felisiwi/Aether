import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CSSProperties } from 'react'
import {
  colors,
  semanticColors,
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import { HandleSlider } from '@ds/Components/handleslider/HandleSlider.1.0.0'
import { DataWindow } from '@ds/Components/datawindow/DataWindow.1.0.0'
import {
  SoundWaveController,
  type WaveformId,
} from '@ds/Components/soundwavecontroller/SoundWaveController.1.3.0'
import { TopNav } from '@ds/Components/topnav/TopNav.1.1.0'
import { Dashboard } from '@ds/Components/dashboard/Dashboard.1.1.0'
import { VolumeController } from '@ds/Components/volumecontroller/VolumeController.1.0.0'
import BasicButton from '../BasicButton'
import PianoKeyboard from './PianoKeyboard'
import DebugPanel from './DebugPanel'
import { useTheme } from '../../contexts/ThemeContext'
import type { PianoKeyboardHandle } from './PianoKeyboard'
import type { DebugPanelHandle } from './DebugPanel'
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

interface JamRoomParamStackRowProps {
  labelStyle: CSSProperties
  label: string
  value: number
  suffix: string
  sliderNorm: number
  onSlider: (n: number) => void
  variant?: 'default' | 'colour' | 'theme'
  min?: number
  max?: number
  step?: number
  onDataValueChange?: (v: number) => void
  isDark: boolean
}

function JamRoomParamStackRow({
  labelStyle,
  label,
  value,
  suffix,
  sliderNorm,
  onSlider,
  variant = 'default',
  min = 0,
  max = 100,
  step = 1,
  onDataValueChange,
  isDark,
}: JamRoomParamStackRowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const span = max - min || 1
  const handleDataWindow =
    onDataValueChange ??
    ((v: number) => {
      const clamped = Math.min(max, Math.max(min, v))
      onSlider((clamped - min) / span)
    })
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: layout.gap8 }}>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: layout.gap4 }}>
        <span style={labelStyle}>{label}</span>
        <DataWindow
          value={value}
          suffix={suffix}
          min={min}
          max={max}
          step={step}
          onChange={handleDataWindow}
          variant={variant}
          compact
          isActive={isDragging}
          innerPanelStyle={isDark ? {
            backgroundColor: semanticColors.backdropOpacityAdaptiveOpacityLightenedMedium,
            borderColor: semanticColors.strokeInvertedMedium,
          } : undefined}
        />
      </div>
      <HandleSlider
        value={Math.max(0, Math.min(1, sliderNorm))}
        onChange={onSlider}
        variant={variant}
        darkMode={isDark}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    </div>
  )
}

const JamRoomComponent = forwardRef<JamRoomHandle, JamRoomProps>(
  function JamRoomComponent(
    {
      localUser,
      remoteUser,
      localMode,
      synth,
      remoteSynth,
      sendPatchState,
      connectionState,
      transportType,
      sendMidi,
      rtt,
      oneWay,
      jitter,
      samplesRef,
      onLeave,
    },
    ref,
  ) {
    const { theme, mode, setThemeMode } = useTheme()
    const pianoRef = useRef<PianoKeyboardHandle>(null)
    const [pianoOctaveShift, setPianoOctaveShift] = useState(0)
    const debugRef = useRef<DebugPanelHandle>(null)
    const pulseRef = useRef<HTMLDivElement>(null)
    const oscilloscopeRef = useRef<HTMLCanvasElement>(null)
    const scopeWrapperRef = useRef<HTMLDivElement>(null)
    const envelopeContentRef = useRef<HTMLDivElement>(null)
    const [remoteNotes, setRemoteNotes] = useState<Set<number>>(new Set())
    const [localNotes, setLocalNotes] = useState<number[]>([])

    // Waveform — lifted so toolbar + DebugPanel stay in sync
    const [waveform, setWaveform] = useState<WaveformId>('sine')

    // Sound controls
    const [attack, setAttack] = useState(0)
    const [release, setRelease] = useState(20)
    const [brightness, setBrightness] = useState(20000)

    // Delay + Reverb controls
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

    // Transpose offset (semitones) — applied to audio/WebRTC in both modes
    const [transpose, setTranspose] = useState(DEFAULT_TRANSPOSE)
    const transposeRef = useRef(transpose)
    transposeRef.current = transpose

    // Remote sync toggle
    const [syncRemote, setSyncRemote] = useState(true)

    // Session recording
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

    // Expression lock — when true, keyboard keys are audible without breath (CC11)
    const [expressionLocked, setExpressionLocked] = useState(false)
    const toggleExpressionLock = useCallback(() => {
      setExpressionLocked((prev) => {
        const next = !prev
        if (next) synth?.setExpressionDirect(1.0)
        return next
      })
    }, [synth])

    // Wind octave shift (arrow keys, only active in wind mode)
    const [windOctaveShift, setWindOctaveShift] = useState(0)
    const windOctaveShiftRef = useRef(windOctaveShift)
    windOctaveShiftRef.current = windOctaveShift
    const windActiveNotesRef = useRef<Map<number, number>>(new Map())
    const keyboardActiveNotesRef = useRef<Map<number, number>>(new Map())

    // Glide held notes when transpose or octave changes mid-hold (wind)
    useEffect(() => {
      if (localMode !== 'wind' || !synth) return
      const activeMap = windActiveNotesRef.current
      if (activeMap.size === 0) return

      const newMap = new Map<number, number>()
      let lastNew: number | null = null
      for (const [rawNote, oldShifted] of activeMap) {
        const newShifted = rawNote + transpose + windOctaveShift * 12
        if (newShifted < 0 || newShifted > 127) continue
        synth.updateNotePitch(oldShifted, newShifted)
        if (oldShifted !== newShifted) {
          sendMidi({ type: 'noteOff', note: oldShifted, velocity: 0, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
          sendMidi({ type: 'noteOn', note: newShifted, velocity: 127, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
        }
        newMap.set(rawNote, newShifted)
        lastNew = newShifted
      }
      windActiveNotesRef.current = newMap
      if (lastNew !== null) setCurrentNote(lastNew)
    }, [transpose, windOctaveShift, localMode, synth, sendMidi])

    // Glide held notes when transpose or octave changes mid-hold (keyboard)
    const prevKbTransposeRef = useRef(transpose)
    const prevKbOctaveRef = useRef(pianoOctaveShift)
    useEffect(() => {
      if (localMode !== 'keyboard' || !synth) return
      const tDelta = transpose - prevKbTransposeRef.current
      const oDelta = (pianoOctaveShift - prevKbOctaveRef.current) * 12
      const totalDelta = tDelta + oDelta
      prevKbTransposeRef.current = transpose
      prevKbOctaveRef.current = pianoOctaveShift

      const activeMap = keyboardActiveNotesRef.current
      if (activeMap.size === 0 || totalDelta === 0) return

      const newMap = new Map<number, number>()
      let lastNew: number | null = null
      for (const [pianoNote, oldFinal] of activeMap) {
        const newFinal = oldFinal + totalDelta
        if (newFinal < 0 || newFinal > 127) continue
        synth.updateNotePitch(oldFinal, newFinal)
        if (oldFinal !== newFinal) {
          sendMidi({ type: 'noteOff', note: oldFinal, velocity: 0, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
          sendMidi({ type: 'noteOn', note: newFinal, velocity: 127, cc: 0, value: 0, channel: 1, timestamp: Date.now() })
        }
        newMap.set(pianoNote, newFinal)
        lastNew = newFinal
      }
      keyboardActiveNotesRef.current = newMap
      if (lastNew !== null) setCurrentNote(lastNew)
    }, [transpose, pianoOctaveShift, localMode, synth, sendMidi])

    // Current note display
    const [currentNote, setCurrentNote] = useState<number | null>(null)
    const [remoteCurrentNote, setRemoteCurrentNote] = useState<number | null>(null)

    const handleComputerKeyboardCapsLockOff = useCallback(() => {
      synth?.panicAllNotesOff()
      keyboardActiveNotesRef.current.clear()
      setLocalNotes([])
      setCurrentNote(null)
    }, [synth])

    const handleOctaveChange = useCallback(
      (v: number) => {
        if (localMode === 'keyboard') {
          pianoRef.current?.setOctaveShift(v)
        } else {
          setWindOctaveShift(v)
        }
      },
      [localMode],
    )

    useEffect(() => {
      if (localMode !== 'wind') return
      const down = (e: KeyboardEvent) => {
        if (e.repeat) return
        if (e.code === 'ArrowUp') {
          e.preventDefault()
          if (e.shiftKey) {
            setTranspose((v) => Math.min(v + 1, MAX_TRANSPOSE))
          } else {
            setWindOctaveShift((v) => Math.min(v + 1, 3))
          }
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          if (e.shiftKey) {
            setTranspose((v) => Math.max(v - 1, MIN_TRANSPOSE))
          } else {
            setWindOctaveShift((v) => Math.max(v - 1, -3))
          }
        }
      }
      window.addEventListener('keydown', down)
      return () => window.removeEventListener('keydown', down)
    }, [localMode])

    // Keyboard mode: Shift+Arrow for transpose (octave is handled inside PianoKeyboard via Arrow)
    useEffect(() => {
      if (localMode !== 'keyboard') return
      const down = (e: KeyboardEvent) => {
        if (e.repeat || !e.shiftKey) return
        if (e.code === 'ArrowUp') {
          e.preventDefault()
          setTranspose((v) => Math.min(v + 1, MAX_TRANSPOSE))
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          setTranspose((v) => Math.max(v - 1, MIN_TRANSPOSE))
        }
      }
      window.addEventListener('keydown', down)
      return () => window.removeEventListener('keydown', down)
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
            setCurrentNote(note)
            setLocalNotes((prev) => prev.includes(note) ? prev : [...prev, note])
          } else {
            synth.noteOff(note)
            setCurrentNote((prev) => (prev === note ? null : prev))
            setLocalNotes((prev) => prev.filter(n => n !== note))
          }
        } else if (event.type === 'cc') {
          sendMidi(event)
          if (!expressionLocked) {
            synth.setCC(event.cc, event.value)
          }
          if (event.cc === 11) {
            debugRef.current?.pushCC11(event.value, synth.expressionValue)
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
          setRemoteCurrentNote(event.note)
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
          setRemoteCurrentNote((prev) => (prev === event.note ? null : prev))
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

    const isDark = theme.mode === 'dark'

    const chordResult: ChordResult | null = useMemo(
      () => detectChord(localNotes),
      [localNotes],
    )

    const chordCardNotesLine = useMemo(
      () =>
        localNotes.length > 0 ? localNotes.map(midiNoteToName).join(' + ') : null,
      [localNotes],
    )

    const chordCardMainLine = useMemo(() => {
      if (chordResult?.primary) return chordResult.primary
      if (currentNote !== null) return midiNoteToName(currentNote)
      return null
    }, [chordResult, currentNote])

    const chordCardAltLine = useMemo(() => {
      if (chordResult === null) return null
      const root = chordResult.primary.match(/^[A-G][#b]?/)?.[0] ?? ''
      const text =
        root && chordResult.alternative
          ? `${root} ${chordResult.alternative}`
          : chordResult.alternative
      return text.length > 0 ? text : null
    }, [chordResult])

    const remoteNotesArray = useMemo(
      () => [...remoteNotes].sort((a, b) => a - b),
      [remoteNotes],
    )
    const remoteChordResult: ChordResult | null = useMemo(
      () => detectChord(remoteNotesArray),
      [remoteNotesArray],
    )
    const remoteChordNotesLine = useMemo(
      () =>
        remoteNotesArray.length > 0 ? remoteNotesArray.map(midiNoteToName).join(' + ') : null,
      [remoteNotesArray],
    )
    const remoteChordMainLine = useMemo(() => {
      if (remoteChordResult?.primary) return remoteChordResult.primary
      if (remoteCurrentNote !== null) return midiNoteToName(remoteCurrentNote)
      return null
    }, [remoteChordResult, remoteCurrentNote])
    const remoteChordAltLine = useMemo(() => {
      if (remoteChordResult === null) return null
      const root = remoteChordResult.primary.match(/^[A-G][#b]?/)?.[0] ?? ''
      const text =
        root && remoteChordResult.alternative
          ? `${root} ${remoteChordResult.alternative}`
          : remoteChordResult.alternative
      return text && text.length > 0 ? text : null
    }, [remoteChordResult])

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

    // Oscilloscope draw loop — always paint canvas (idle line without analyser / notes; waveform when available)
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

    // ── Shared layout tokens ──────────────────────────────────────
    const sectionGap = layout.gap32
    const panelBg = isDark
      ? semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak
      : semanticColors.backdropOpacityStaticOpacityDarkenedWeak
    const dividerBg = isDark
      ? semanticColors.strokeInvertedWeak
      : semanticColors.strokeWeak
    const headingColor = theme.textHeading
    const bodyColor = theme.textBody
    const disabledColor = theme.textDisabled
    const weakStroke = theme.strokeWeak

    const labelText: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.label.fontSize,
      fontWeight: typography.label.fontWeight,
      lineHeight: `${typography.label.lineHeight}px`,
      letterSpacing: typography.label.letterSpacing,
      fontStretch: `${typography.label.fontWidth}%`,
      fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
      fontVariationSettings: "'wdth' 120",
    }
    const titleSText: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.titleS.fontSize,
      fontWeight: typography.titleS.fontWeight,
      lineHeight: `${typography.titleS.lineHeight}px`,
      fontStretch: `${typography.titleS.fontWidth}%`,
      letterSpacing: typography.titleS.letterSpacing,
      fontVariationSettings: "'wdth' 120",
      fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
      fontVariantNumeric: 'tabular-nums',
    }
    const stepperBtn: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 44,
      minHeight: 44,
      border: `${layout.strokeL}px solid ${weakStroke}`,
      borderRadius: layout.radiusM,
      background: 'transparent',
      cursor: 'pointer',
      padding: `${layout.gap4}px ${layout.gap8}px`,
      color: headingColor,
    }
    const stepperPanel: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      padding: layout.gap8,
      borderRadius: layout.radiusS,
      border: 'none',
      backgroundColor: 'transparent',
      boxSizing: 'border-box' as const,
    }

    const sectionHeader = (title: string) => (
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: layout.gap8 }}>
        <span style={{ ...labelText, color: bodyColor, textTransform: 'uppercase' as const }}>{title}</span>
        <div style={{ height: layout.strokeS, background: dividerBg }} />
      </div>
    )

    const paramLabelStyle: CSSProperties = {
      ...labelText,
      color: colors.textHeadingNeutral,
      height: typography.label.lineHeight,
    }

    const paramStack = (
      label: string,
      value: number,
      suffix: string,
      sliderNorm: number,
      onSlider: (n: number) => void,
      variant: 'default' | 'colour' | 'theme' = 'default',
      min = 0,
      max = 100,
      step = 1,
      onDataValueChange?: (v: number) => void,
    ) => (
      <JamRoomParamStackRow
        labelStyle={paramLabelStyle}
        label={label}
        value={value}
        suffix={suffix}
        sliderNorm={sliderNorm}
        onSlider={onSlider}
        variant={variant}
        min={min}
        max={max}
        step={step}
        onDataValueChange={onDataValueChange}
        isDark={isDark}
      />
    )

    const octaveVal = localMode === 'keyboard' ? pianoOctaveShift : windOctaveShift

    const topNavDefaultTheme = mode === 'dark' ? 'dark' : 'light'

    const localPlayerProps = {
      playerName: 'YOU',
      variant: 'local' as const,
      instrument: localMode === 'wind' ? 'Aerophone Mini' : 'Piano',
      latency: rtt ?? 0,
      chordName: chordCardMainLine ?? '',
      notes: chordCardNotesLine ? chordCardNotesLine.split(' + ') : [],
      keyName: chordCardAltLine ?? '',
    }

    const remotePlayerProps = isSolo
      ? null
      : {
          playerName: (remoteUser ?? '').toUpperCase(),
          variant: 'remote' as const,
          instrument: 'Piano',
          latency: rtt ?? 0,
          chordName: remoteChordMainLine ?? '',
          notes: remoteChordNotesLine ? remoteChordNotesLine.split(' + ') : [],
          keyName: remoteChordAltLine ?? '',
        }

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
            key={mode}
            onBackToLobby={onLeave}
            defaultTheme={topNavDefaultTheme}
            onThemeChange={(t) => setThemeMode(t)}
          />
        </div>

        {/* DO NOT re-add nav or back button here — layout is intentionally nav-free */}
        {/* Layout: wordmark row → player area (SOUND + cards + remote) → four-section row (Instrument / Envelope / Effects / Octave & key) → keyboard */}
        {/* ── Middle content (no flex-grow — avoids empty gap above keyboard) ───────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: layout.gap16,
            minHeight: 0,
            overflow: 'hidden',
            paddingBottom: layout.paddingWrapperVertical,
            paddingLeft: layout.gap96,
            paddingRight: layout.gap96,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, minHeight: 0 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
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
              <Dashboard localPlayer={localPlayerProps} remotePlayer={remotePlayerProps} />
            </div>

            {/* ── Control surface row ────────────────────────────── */}
            <div style={{ display: 'flex', gap: sectionGap, alignItems: 'flex-start', flexWrap: 'wrap', minHeight: 0 }}>
              {/* INSTRUMENT — DO NOT add flex:1 or alignSelf:stretch here — oscilloscope must be fixed height */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: layout.gap16,
                  alignSelf: 'flex-start',
                  flex: '0 1 auto',
                }}
              >
                <SoundWaveController
                  selectedWaveform={waveform}
                  onWaveformChange={handleWaveformChange}
                />
                {/* DO NOT add flex:1 or alignSelf:stretch here — oscilloscope must be fixed height */}
                <canvas
                  ref={oscilloscopeRef}
                  style={{
                    display: 'block',
                    flex: '1 1 auto',
                    height: 180,
                    flexShrink: 0,
                    borderRadius: layout.radiusS,
                    background: theme.surfaceCard,
                    border: `${layout.strokeM}px solid ${weakStroke}`,
                  }}
                />
              </div>

              {/* CENTRE — parameter columns */}
              <div style={{ display: 'flex', flex: '1 1 280px', gap: sectionGap, alignItems: 'flex-start', minWidth: 0 }}>
                <div style={{ width: 136, display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
                    {paramStack('Attack', Math.round(attack), 'ms', attack / 500, (n) => handleAttack(Math.round(n * 100) * 5), 'default', 0, 500, 5)}
                    {paramStack('Release', Math.round(release), 'ms', (release - 10) / 490, (n) => handleRelease(Math.round((n * 490 + 10) / 5) * 5), 'default', 10, 500, 5)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, flex: '1 1 auto', minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: layout.gap32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, width: 136 }}>
                      {(() => {
                        const filterInK = brightness >= 1000
                        const dwValue = filterInK
                          ? Math.round((brightness / 1000) * 10) / 10
                          : brightness
                        const dwMin = filterInK ? 0.5 : 500
                        const dwMax = filterInK ? 20 : 20000
                        const dwStep = filterInK ? 0.1 : 100
                        return paramStack(
                          'Filter',
                          dwValue,
                          filterInK ? 'K' : 'Hz',
                          (brightness - 500) / 19500,
                          (n) => handleBrightness(Math.round((n * 19500 + 500) / 100) * 100),
                          'colour',
                          dwMin,
                          dwMax,
                          dwStep,
                          (v) =>
                            filterInK
                              ? handleBrightness(Math.round((v * 1000) / 100) * 100)
                              : handleBrightness(Math.round((v - 500) / 100) * 100 + 500),
                        )
                      })()}
                      {paramStack('Delay', Math.round(delayTime), 'ms', delayTime / 1000, (n) => handleDelayTime(Math.round(n * 100) * 10), 'default', 0, 1000, 10)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, width: 136 }}>
                      {paramStack('Feedback', Math.round(delayFeedback * 100), '%', delayFeedback / 0.8, (n) => handleDelayFeedback(Math.round(n * 0.8 * 20) / 20), 'default', 0, 80, 5)}
                      {paramStack('Reverb', Math.round(reverbMix * 100), '%', reverbMix, (n) => handleReverbMix(Math.round(n * 20) / 20), 'default', 0, 100, 5)}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — OCTAVE & KEY */}
              <div style={{ width: 196, display: 'flex', flexDirection: 'column', gap: layout.gap16, alignSelf: 'stretch', flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap40 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap4 }}>
                    <span style={{ ...labelText, color: headingColor }}>Octave</span>
                    <div style={{ display: 'flex', gap: layout.gap8, alignItems: 'center', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleOctaveChange(Math.min(octaveVal + 1, 3))}
                        style={stepperBtn}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                      </button>
                      <div style={stepperPanel}>
                        <div style={{ display: 'flex', gap: layout.gap4, alignItems: 'center', justifyContent: 'center', ...labelText }}>
                          <span style={{ color: colors.textHeadingNeutral, width: 16, textAlign: 'right' as const }}>+</span>
                          <span style={{ ...titleSText, color: headingColor, width: 20, textAlign: 'center' as const }}>{Math.abs(octaveVal)}</span>
                          <span style={{ color: colors.textHeadingNeutral, width: 16 }}>-</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOctaveChange(Math.max(octaveVal - 1, -3))}
                        style={stepperBtn}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap4 }}>
                      <span style={{ ...labelText, color: headingColor }}>Scale</span>
                      <div style={{ display: 'flex', gap: layout.gap8, alignItems: 'center', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setTranspose((v) => Math.min(v + 1, MAX_TRANSPOSE))}
                          style={stepperBtn}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                        </button>
                        <div style={stepperPanel}>
                          <div style={{ display: 'flex', gap: layout.gap4, alignItems: 'center', justifyContent: 'center', ...labelText }}>
                            <span style={{ color: colors.textHeadingNeutral, width: 16, textAlign: 'right' as const }}>+</span>
                            <span style={{ ...titleSText, color: headingColor, width: 20, textAlign: 'center' as const }}>{TRANSPOSE_KEY[transpose] ?? 'C'}</span>
                            <span style={{ color: colors.textHeadingNeutral, width: 16 }}>-</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTranspose((v) => Math.max(v - 1, MIN_TRANSPOSE))}
                          style={stepperBtn}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', ...labelText, color: disabledColor, whiteSpace: 'nowrap' as const }}>
                      <span>↑</span>
                      <span>⇧</span>
                      <span>↓</span>
                    </div>
                  </div>
                </div>

                {localMode === 'wind' && (
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
                )}
              </div>

              {/* FAR RIGHT — volumes + VU */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: layout.gap24,
                  alignItems: 'flex-start',
                  flexShrink: 0,
                }}
              >
                <VolumeController
                  variant="local"
                  value={volume * 100}
                  onChange={(v) => handleVolume(v / 100)}
                />
                {!isSolo && (
                  <VolumeController
                    variant="remote"
                    value={remoteVolume * 100}
                    onChange={(v) => setRemoteVolume(v / 100)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom piano keyboard ────────────────────────────────── */}
        {localMode === 'keyboard' && (
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              overflowX: 'auto',
              paddingBottom: layout.gap16,
            }}
          >
            <PianoKeyboard
              ref={pianoRef}
              onCapsLockOff={handleComputerKeyboardCapsLockOff}
              onMidiEvent={handleLocalMidi}
              remoteActiveNotes={remoteNotes}
              onOctaveShiftChange={setPianoOctaveShift}
              transpose={transpose}
            />
          </div>
        )}

        <DebugPanel
          ref={debugRef}
          rtt={rtt}
          oneWay={oneWay}
          jitter={jitter}
          samplesRef={samplesRef}
          transportType={transportType}
          synth={synth}
          waveform={waveform as OscillatorType}
          onWaveformChange={handleWaveformChange as (w: OscillatorType) => void}
        />
      </div>
    )
  },
)

export default JamRoomComponent
