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
  colors,
  semanticColors,
  layout,
  typography,
  fontFamily,
  themeTokens,
} from '@ds/tokens/design-tokens'
import { ChordDisplay } from '@ds/Components/chorddisplay/ChordDisplay.1.0.0'
import { HandleSlider } from '@ds/Components/handleslider/HandleSlider.1.0.0'
import type { WaveformType } from '@ds/Components/waveformselector/WaveformSelector.1.0.0'
import { VUBar } from '@ds/Components/vubar/VUBar.1.0.0'
import type { VUBarHandle } from '@ds/Components/vubar/VUBar.1.0.0'
import { LatencyIndicator } from '@ds/Components/latencyindicator/LatencyIndicator.1.0.0'
import BasicButton from '../BasicButton'
import PianoKeyboard from './PianoKeyboard'
import DebugPanel from './DebugPanel'
import { ThemeIndicator } from '@ds/Components/themeindicator/ThemeIndicator.1.0.0'
import { useTheme } from '../../contexts/ThemeContext'
import type { PianoKeyboardHandle } from './PianoKeyboard'
import type { DebugPanelHandle } from './DebugPanel'
import type { MidiEvent, InstrumentMode } from '../../lib/midi'
import type { Synth } from '../../lib/synth'
import { detectChord } from '../../lib/chords'
import type { ChordResult } from '../../lib/chords'
import type { DataChannelState, TransportType } from '../../lib/webrtc'
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

const WAVEFORMS: WaveformType[] = ['sine', 'triangle', 'sawtooth', 'square']

export interface JamRoomHandle {
  handleLocalMidi: (event: MidiEvent) => void
  handleRemoteMidi: (event: MidiEvent) => void
}

export interface JamRoomProps {
  localUser: string
  remoteUser: string | null
  localMode: InstrumentMode
  synth: Synth | null
  connectionState: DataChannelState
  transportType: TransportType
  sendMidi: (event: MidiEvent) => void
  rtt: number | null
  oneWay: number | null
  jitter: number | null
  samplesRef: React.RefObject<number[]>
}

const JamRoomComponent = forwardRef<JamRoomHandle, JamRoomProps>(
  function JamRoomComponent(
    {
      localUser,
      remoteUser,
      localMode,
      synth,
      connectionState,
      transportType,
      sendMidi,
      rtt,
      oneWay,
      jitter,
      samplesRef,
    },
    ref,
  ) {
    const { theme, mode, setThemeMode } = useTheme()
    const localMeterRef = useRef<VUBarHandle>(null)
    const remoteMeterRef = useRef<VUBarHandle>(null)
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
    const [waveform, setWaveform] = useState<WaveformType>('sine')
    const handleWaveformChange = useCallback(
      (w: WaveformType) => {
        setWaveform(w)
        synth?.setWaveform(w)
      },
      [synth],
    )

    // Sound controls
    const [attack, setAttack] = useState(0)
    const [release, setRelease] = useState(20)
    const [brightness, setBrightness] = useState(20000)
    const handleAttack = useCallback(
      (ms: number) => { setAttack(ms); synth?.setAttack(ms) },
      [synth],
    )
    const handleRelease = useCallback(
      (ms: number) => { setRelease(ms); synth?.setRelease(ms) },
      [synth],
    )
    const handleBrightness = useCallback(
      (hz: number) => { setBrightness(hz); synth?.setBrightness(hz) },
      [synth],
    )

    // Delay + Reverb controls
    const [delayTime, setDelayTime] = useState(0)
    const [delayFeedback, setDelayFeedback] = useState(0)
    const [reverbMix, setReverbMix] = useState(0)
    const handleDelayTime = useCallback(
      (ms: number) => { setDelayTime(ms); synth?.setDelayTime(ms) },
      [synth],
    )
    const handleDelayFeedback = useCallback(
      (v: number) => { setDelayFeedback(v); synth?.setDelayFeedback(v) },
      [synth],
    )
    const handleReverbMix = useCallback(
      (v: number) => { setReverbMix(v); synth?.setReverbMix(v) },
      [synth],
    )

    const [volume, setVolume] = useState(1)
    const handleVolume = useCallback(
      (v: number) => { setVolume(v); synth?.setMasterVolume(v) },
      [synth],
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
            localMeterRef.current?.flash()
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
            localMeterRef.current?.setLevel(event.value / 127)
            debugRef.current?.pushCC11(event.value, synth.expressionValue)
          }
        }
      },
      [sendMidi, synth, expressionLocked, localMode],
    )

    const handleRemoteMidi = useCallback(
      (event: MidiEvent) => {
        if (!synth || !syncRemote) return
        if (event.type === 'noteOn') {
          synth.noteOn(event.note)
          remoteMeterRef.current?.flash()
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
          synth.noteOff(event.note)
          setRemoteCurrentNote((prev) => (prev === event.note ? null : prev))
          setRemoteNotes((prev) => {
            const next = new Set(prev)
            next.delete(event.note)
            return next
          })
        } else if (event.type === 'cc') {
          if (event.cc === 11) {
            remoteMeterRef.current?.setLevel(event.value / 127)
          }
        }
      },
      [synth, syncRemote],
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

        ctx2d.fillStyle = theme.surfaceCard
        ctx2d.fillRect(0, 0, w, h)

        const analyser = synth?.getAnalyser() ?? null
        const hasNotes = localNotes.length > 0

        if (!hasNotes || !analyser) {
          ctx2d.beginPath()
          ctx2d.moveTo(0, h / 2)
          ctx2d.lineTo(w, h / 2)
          ctx2d.lineWidth = 1
          ctx2d.strokeStyle = theme.textDisabled
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
          : theme.accentColour
        ctx2d.stroke()
      }

      draw()
      return () => cancelAnimationFrame(rafId)
    }, [synth, theme, localNotes.length])

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
      border: `${layout.strokeM}px solid ${weakStroke}`,
      backgroundColor: panelBg,
      boxSizing: 'border-box' as const,
    }

    const sectionHeader = (title: string) => (
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: layout.gap8 }}>
        <span style={{ ...labelText, color: bodyColor, textTransform: 'uppercase' as const }}>{title}</span>
        <div style={{ height: layout.strokeS, background: dividerBg }} />
      </div>
    )

    const valueUnit = (
      val: string | number,
      unit: string,
      valColor: string,
      unitColor: string,
    ) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: layout.gap2 }}>
        <span style={{ ...titleSText, color: valColor }}>{val}</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', padding: `${layout.gap4}px 0`, alignSelf: 'stretch' }}>
          <span style={{ ...labelText, color: unitColor }}>{unit}</span>
        </div>
      </div>
    )

    const paramStack = (
      label: string,
      displayVal: string | number,
      unit: string,
      sliderNorm: number,
      onSlider: (n: number) => void,
      variant: 'default' | 'colour' | 'theme' = 'default',
    ) => {
      const isColour = variant === 'colour'
      const borderCol = isColour ? semanticColors.strokeColour : weakStroke
      const valCol = isColour ? colors.textHeadingColour : headingColor
      const unitCol = isColour ? colors.textPressed : bodyColor
      return (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: layout.gap8 }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: layout.gap4 }}>
            <span style={{ ...labelText, color: headingColor, height: typography.label.lineHeight }}>{label}</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              height: 48,
              padding: layout.gap8,
              borderRadius: layout.radiusS,
              border: `${layout.strokeM}px solid ${borderCol}`,
              backgroundColor: panelBg,
              boxSizing: 'border-box' as const,
            }}>
              {valueUnit(displayVal, unit, valCol, unitCol)}
            </div>
          </div>
          <HandleSlider
            value={Math.max(0, Math.min(1, sliderNorm))}
            onChange={onSlider}
            variant={variant}
            darkMode={isDark}
          />
        </div>
      )
    }

    const octaveVal = localMode === 'keyboard' ? pianoOctaveShift : windOctaveShift

    return (
      <div
        style={{
          height: '100vh',
          maxHeight: '100vh',
          paddingTop: layout.paddingWrapperVertical,
          paddingBottom: layout.paddingWrapperVertical,
          paddingLeft: layout.gap96,
          paddingRight: layout.gap96,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: theme.pageBg,
          fontFamily: FONT,
        }}
      >
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
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <img
                src="/aether-wordmark.svg"
                alt="Aether"
                style={{ height: 32, filter: isDark ? 'invert(1)' : 'none' }}
              />
              {!isSolo && (
                <BasicButton variant="primary" size="small">
                  Detether
                </BasicButton>
              )}
              <ThemeIndicator theme={mode} darkMode={isDark} onThemeChange={setThemeMode} />
            </div>
            {/* ── Player dashboards row ──────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: sectionGap }}>
              {/* Player 1: SOUND panel + name/chord/VU */}
              <div style={{ display: 'flex', gap: layout.gap32, alignItems: 'flex-start' }}>
                {/* SOUND volume */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, width: 136, height: 142 }}>
                  {sectionHeader('SOUND')}
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: layout.gap8, justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap4 }}>
                      <span style={{ ...labelText, color: headingColor }}>Volume</span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 48,
                        padding: layout.gap8,
                        borderRadius: layout.radiusS,
                        border: `${layout.strokeM}px solid ${weakStroke}`,
                        backgroundColor: panelBg,
                        boxSizing: 'border-box' as const,
                      }}>
                        {valueUnit(Math.round(volume * 100), '%', headingColor, bodyColor)}
                      </div>
                    </div>
                    <HandleSlider value={volume} onChange={handleVolume} darkMode={isDark} />
                  </div>
                </div>

                {/* Name row + ChordDisplay + VUBar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', ...labelText, whiteSpace: 'nowrap' as const }}>
                    <span style={{ color: colors.textHeadingColour }}>YOU</span>
                    <span style={{ color: bodyColor }}>
                      {localMode === 'wind' ? 'Aerophone Mini' : 'Piano (Keyboard)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: layout.gap8, alignItems: 'flex-start' }}>
                    <VUBar
                      ref={localMeterRef}
                      variant="colour"
                      darkMode={isDark}
                      orientation="vertical"
                      thickness={8}
                      length={120}
                      style={{
                        borderRadius: 0,
                        border: `${layout.strokeM}px solid ${semanticColors.strokeColour}`,
                      }}
                    />
                    <ChordDisplay
                      notes={chordCardNotesLine ? chordCardNotesLine.split(' + ') : []}
                      chordName={chordCardMainLine ?? ''}
                      altName={chordCardAltLine ?? ''}
                      variant="colour"
                      darkMode={isDark}
                      style={{ width: 158, minHeight: 120 }}
                    />
                  </div>
                </div>
              </div>

              {/* Latency indicator (centred, flex-grow) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: layout.gap8, alignSelf: 'center' }}>
                {!isSolo && (
                  <div style={{ position: 'relative' }}>
                    <LatencyIndicator rtt={rtt} darkMode={isDark} showUnit={false} />
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
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Player 2: name/chord/VU + RECEIVED SOUND panel */}
              {!isSolo && (
                <div style={{ display: 'flex', gap: layout.gap32, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', ...labelText, whiteSpace: 'nowrap' as const }}>
                      <span style={{ color: themeTokens.components.primary50 }}>
                        {(remoteUser ?? '').toUpperCase()}
                      </span>
                      <span style={{ color: bodyColor }}>Piano (Keyboard)</span>
                    </div>
                    <div style={{ display: 'flex', gap: layout.gap8, alignItems: 'flex-start' }}>
                      <ChordDisplay
                        notes={remoteChordNotesLine ? remoteChordNotesLine.split(' + ') : []}
                        chordName={remoteChordMainLine ?? ''}
                        altName={remoteChordAltLine ?? ''}
                        variant="theme"
                        darkMode={isDark}
                        style={{ width: 158, minHeight: 120 }}
                      />
                      <VUBar
                        ref={remoteMeterRef}
                        variant="theme"
                        darkMode={isDark}
                        orientation="vertical"
                        thickness={8}
                        length={120}
                        style={{
                          borderRadius: 0,
                          border: `${layout.strokeM}px solid ${themeTokens.components.primary50}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* RECEIVED SOUND volume */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, width: 136, height: 142 }}>
                    {sectionHeader('RECEIVED SOUND')}
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: layout.gap8, justifyContent: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap4 }}>
                        <span style={{ ...labelText, color: headingColor }}>Volume</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: 48,
                          padding: layout.gap8,
                          borderRadius: layout.radiusS,
                          border: `${layout.strokeM}px solid ${themeTokens.components.primary50}`,
                          backgroundColor: panelBg,
                          boxSizing: 'border-box' as const,
                        }}>
                          {valueUnit(
                            Math.round(remoteVolume * 100),
                            '%',
                            themeTokens.components.primary50,
                            themeTokens.components.primary50,
                          )}
                        </div>
                      </div>
                      <HandleSlider value={remoteVolume} onChange={setRemoteVolume} variant="theme" darkMode={isDark} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Control surface row ────────────────────────────── */}
            <div style={{ display: 'flex', gap: sectionGap, alignItems: 'flex-start' }}>
              {/* INSTRUMENT — DO NOT add flex:1 or alignSelf:stretch here — oscilloscope must be fixed height */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: layout.gap16, alignSelf: 'flex-start' }}>
                {sectionHeader('INSTRUMENT')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap4 }}>
                  <div style={{ display: 'flex', gap: layout.gap8, alignItems: 'center', padding: `0 ${layout.gap4}px` }}>
                    {WAVEFORMS.map((w) => (
                      <span
                        key={w}
                        onClick={() => handleWaveformChange(w)}
                        style={{
                          ...labelText,
                          color: waveform === w ? headingColor : bodyColor,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap' as const,
                        }}
                      >
                        {w.charAt(0).toUpperCase() + w.slice(1)}
                      </span>
                    ))}
                  </div>
                  {/* DO NOT add flex:1 or alignSelf:stretch here — oscilloscope must be fixed height */}
                  <canvas
                    ref={oscilloscopeRef}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 180,
                      flexShrink: 0,
                      borderRadius: layout.radiusS,
                      background: theme.surfaceCard,
                      border: `${layout.strokeM}px solid ${weakStroke}`,
                    }}
                  />
                </div>
              </div>

              {/* ENVELOPE (136px) */}
              <div style={{ width: 136, display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
                {sectionHeader('ENVELOPE')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
                  {paramStack('Attack', Math.round(attack), 'ms', attack / 500, (n) => handleAttack(Math.round(n * 100) * 5), 'colour')}
                  {paramStack('Release', Math.round(release), 'ms', (release - 10) / 490, (n) => handleRelease(Math.round((n * 490 + 10) / 5) * 5))}
                </div>
              </div>

              {/* EFFECTS (2-column) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16 }}>
                {sectionHeader('EFFECTS')}
                <div style={{ display: 'flex', gap: layout.gap32, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, width: 136 }}>
                    {paramStack(
                      'Filter',
                      brightness >= 1000 ? (brightness / 1000).toFixed(1) : String(brightness),
                      brightness >= 1000 ? 'K' : 'Hz',
                      (brightness - 500) / 19500,
                      (n) => handleBrightness(Math.round((n * 19500 + 500) / 100) * 100),
                    )}
                    {paramStack('Delay', Math.round(delayTime), 'ms', delayTime / 1000, (n) => handleDelayTime(Math.round(n * 100) * 10))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap16, width: 136 }}>
                    {paramStack('Feedback', Math.round(delayFeedback * 100), '%', delayFeedback / 0.8, (n) => handleDelayFeedback(Math.round(n * 0.8 * 20) / 20))}
                    {paramStack('Reverb', Math.round(reverbMix * 100), '%', reverbMix, (n) => handleReverbMix(Math.round(n * 20) / 20))}
                  </div>
                </div>
              </div>

              {/* OCTAVE & KEY (196px) */}
              <div style={{ width: 196, display: 'flex', flexDirection: 'column', gap: layout.gap16, alignSelf: 'stretch' }}>
                {sectionHeader('OCTAVE & KEY')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap40 }}>
                  {/* Octave stepper */}
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
                          <span style={{ color: bodyColor, width: 16, textAlign: 'right' as const }}>+</span>
                          <span style={{ ...titleSText, color: headingColor, width: 20, textAlign: 'center' as const }}>{Math.abs(octaveVal)}</span>
                          <span style={{ color: bodyColor, width: 16 }}>-</span>
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

                  {/* Scale stepper */}
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
                            <span style={{ color: bodyColor, width: 16, textAlign: 'right' as const }}>+</span>
                            <span style={{ ...titleSText, color: headingColor, width: 20, textAlign: 'center' as const }}>{TRANSPOSE_KEY[transpose] ?? 'C'}</span>
                            <span style={{ color: bodyColor, width: 16 }}>-</span>
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
                      <span>Arrow up</span>
                      <span>Shift</span>
                      <span>Arrow dwn</span>
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
