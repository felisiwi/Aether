import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  colors,
  semanticColors,
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import { Tag } from '@ds/Components/tag/Tag.1.0.0'
import BasicButton from '../BasicButton'
import InputMeter from './InputMeter'
import PianoKeyboard from './PianoKeyboard'
import DebugPanel from './DebugPanel'
import { useTheme } from '../../contexts/ThemeContext'
import type { PianoKeyboardHandle } from './PianoKeyboard'
import type { InputMeterHandle } from './InputMeter'
import type { DebugPanelHandle } from './DebugPanel'
import type { MidiEvent, InstrumentMode } from '../../lib/midi'
import type { Synth } from '../../lib/synth'
import type { DataChannelState, TransportType } from '../../lib/webrtc'
import { SessionRecorder } from '../../lib/recorder'

const FONT = `${fontFamily}, sans-serif`
const WAVEFORMS: OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square']

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

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
  textColor?: string
}

function SliderControl({ label, value, min, max, step, format, onChange, textColor }: SliderControlProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: layout.gap4,
        fontFamily: FONT,
        fontSize: typography.label.fontSize,
        color: textColor ?? colors.textBodyNeutral,
        cursor: 'pointer',
      }}
    >
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 80, accentColor: semanticColors.buttonSurfacePrimary }}
      />
      <span
        style={{
          minWidth: '3.5em',
          fontVariantNumeric: 'tabular-nums',
          fontSize: typography.label.fontSize,
        }}
      >
        {format(value)}
      </span>
    </label>
  )
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
    const { theme } = useTheme()
    const localMeterRef = useRef<InputMeterHandle>(null)
    const remoteMeterRef = useRef<InputMeterHandle>(null)
    const pianoRef = useRef<PianoKeyboardHandle>(null)
    const [pianoOctaveShift, setPianoOctaveShift] = useState(0)
    const debugRef = useRef<DebugPanelHandle>(null)
    const pulseRef = useRef<HTMLDivElement>(null)
    const [remoteNotes, setRemoteNotes] = useState<Set<number>>(new Set())

    // Waveform — lifted so toolbar + DebugPanel stay in sync
    const [waveform, setWaveform] = useState<OscillatorType>('sine')
    const handleWaveformChange = useCallback(
      (w: OscillatorType) => {
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

    // Match Octave — shift piano keyboard to center on remote player's octave
    const [matchLabel, setMatchLabel] = useState<string | null>(null)
    const matchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const handleMatchOctave = useCallback(() => {
      if (remoteCurrentNote === null) return
      const displayOctave = Math.floor(remoteCurrentNote / 12) - 1
      pianoRef.current?.setOctaveShift(displayOctave - 4)

      const noteName = NOTE_NAMES[((remoteCurrentNote % 12) + 12) % 12]
      setMatchLabel(`Matched to ${noteName}${displayOctave}`)
      if (matchTimerRef.current) clearTimeout(matchTimerRef.current)
      matchTimerRef.current = setTimeout(() => setMatchLabel(null), 2000)
    }, [remoteCurrentNote])

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
          } else {
            synth.noteOff(note)
            setCurrentNote((prev) => (prev === note ? null : prev))
          }
        } else if (event.type === 'cc') {
          sendMidi(event)
          if (!expressionLocked) {
            synth.setCC(event.cc, event.value)
          }
          if (event.cc === 11) {
            localMeterRef.current?.setLevel(event.value)
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
            remoteMeterRef.current?.setLevel(event.value)
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

    const stateLabel = isSolo
      ? 'Solo'
      : connectionState === 'connected'
        ? 'Connected'
        : connectionState === 'connecting'
          ? 'Connecting…'
          : connectionState === 'disconnected'
            ? 'Disconnected'
            : 'Idle'

    const stateColor = isSolo
      ? theme.textBody
      : connectionState === 'connected'
        ? semanticColors.textFunctionalSuccess
        : connectionState === 'disconnected'
          ? semanticColors.textFunctionalError
          : theme.textBody

    const sectionBorder = `${layout.strokeS}px solid ${theme.strokeSymbolic}`

    const sectionLabelStyle: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.overline.fontSize,
      fontWeight: typography.overline.fontWeight,
      letterSpacing: typography.overline.letterSpacing,
      lineHeight: `${typography.overline.lineHeight}px`,
      textTransform: 'uppercase',
      color: theme.textDisabled,
      marginBottom: layout.gap8,
    }

    const sectionStyle: React.CSSProperties = {
      flex: '1 1 0',
      minWidth: 0,
      borderTop: sectionBorder,
      paddingTop: layout.gap16,
      display: 'flex',
      flexDirection: 'column',
      gap: layout.gap8,
    }

    const activeNote = currentNote ?? (syncRemote ? remoteCurrentNote : null)
    const activeNoteName = activeNote !== null ? midiNoteToName(activeNote) : null

    const readoutStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      minWidth: '3.5em',
    }

    const readoutValueStyle: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.titleM.fontSize,
      fontWeight: typography.titleM.fontWeight,
      fontVariantNumeric: 'tabular-nums',
      color: theme.textHeading,
    }

    const readoutLabelStyle: React.CSSProperties = {
      fontFamily: FONT,
      fontSize: typography.label.fontSize,
      color: theme.textDisabled,
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: layout.gap24,
          padding: layout.gap24,
        }}
      >
        {/* ── Player area ─────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: layout.gap32,
          }}
        >
          {/* Local player */}
          <div style={{ display: 'flex', alignItems: 'center', gap: layout.gap8 }}>
            <InputMeter ref={localMeterRef} />
            <div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: typography.titleS.fontSize,
                  fontWeight: typography.titleS.fontWeight,
                  color: theme.textHeading,
                }}
              >
                {localUser}
              </div>
              <Tag type="default" state="active">
                {localMode === 'wind' ? 'Aerophone Mini' : 'Piano (keyboard)'}
              </Tag>
            </div>
          </div>

          {/* Active note — centrepiece */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              minWidth: '4em',
            }}
          >
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
            <div
              style={{
                fontFamily: FONT,
                fontSize: typography.titleL.fontSize,
                fontWeight: typography.titleL.fontWeight,
                lineHeight: `${typography.titleL.lineHeight}px`,
                fontVariantNumeric: 'tabular-nums',
                color: activeNoteName !== null
                  ? theme.textColourHeading
                  : theme.textDisabled,
                textAlign: 'center',
              }}
            >
              {activeNoteName ?? '—'}
            </div>
            <span
              style={{
                fontFamily: FONT,
                fontSize: typography.bodyS.fontSize,
                fontWeight: 600,
                color: stateColor,
              }}
            >
              {stateLabel}
            </span>
          </div>

          {/* Remote player (hidden in solo mode) */}
          {!isSolo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: layout.gap8 }}>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: typography.titleS.fontSize,
                    fontWeight: typography.titleS.fontWeight,
                    color: theme.textHeading,
                  }}
                >
                  {remoteUser}
                </div>
                {rtt !== null && (
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: typography.label.fontSize,
                      color: theme.textBody,
                    }}
                  >
                    {rtt}ms
                  </span>
                )}
              </div>
              <InputMeter ref={remoteMeterRef} />
            </div>
          )}
        </div>

        {/* ── Control surface — 4 equal-width sections ────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: layout.gap16,
          }}
        >
          {/* INSTRUMENT */}
          <div style={sectionStyle}>
            <div style={sectionLabelStyle}>Instrument</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap4 }}>
              {WAVEFORMS.map((w) => {
                const selected = waveform === w
                return (
                  <label
                    key={w}
                    onClick={() => handleWaveformChange(w)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: layout.gap8,
                      fontFamily: FONT,
                      fontSize: typography.bodyS.fontSize,
                      color: selected ? theme.textHeading : theme.textBody,
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 16,
                        height: 16,
                        borderRadius: layout.radiusRound,
                        border: `${layout.strokeM}px solid ${selected ? semanticColors.buttonSurfacePrimary : theme.strokeSolid}`,
                        transition: 'border-color 80ms ease',
                      }}
                    >
                      {selected && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: layout.radiusRound,
                            background: semanticColors.buttonSurfacePrimary,
                          }}
                        />
                      )}
                    </span>
                    {w}
                  </label>
                )
              })}
            </div>
          </div>

          {/* ENVELOPE */}
          <div style={sectionStyle}>
            <div style={sectionLabelStyle}>Envelope</div>
            <SliderControl
              label="Attack"
              value={attack}
              min={0}
              max={500}
              step={5}
              format={(v) => `${v}ms`}
              onChange={handleAttack}
              textColor={theme.textBody}
            />
            <SliderControl
              label="Release"
              value={release}
              min={10}
              max={500}
              step={5}
              format={(v) => `${v}ms`}
              onChange={handleRelease}
              textColor={theme.textBody}
            />
          </div>

          {/* EFFECTS */}
          <div style={sectionStyle}>
            <div style={sectionLabelStyle}>Effects</div>
            <SliderControl
              label="Filter"
              value={brightness}
              min={500}
              max={20000}
              step={100}
              format={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}Hz`}
              onChange={handleBrightness}
              textColor={theme.textBody}
            />
            <SliderControl
              label="Delay"
              value={delayTime}
              min={0}
              max={1000}
              step={10}
              format={(v) => `${v}ms`}
              onChange={handleDelayTime}
              textColor={theme.textBody}
            />
            <SliderControl
              label="Feedback"
              value={delayFeedback}
              min={0}
              max={0.8}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={handleDelayFeedback}
              textColor={theme.textBody}
            />
            <SliderControl
              label="Reverb"
              value={reverbMix}
              min={0}
              max={1}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={handleReverbMix}
              textColor={theme.textBody}
            />
          </div>

          {/* OUTPUT */}
          <div style={sectionStyle}>
            <div style={sectionLabelStyle}>Output</div>
            {isRecording ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap8 }}>
                <span style={{
                  fontFamily: FONT,
                  fontSize: typography.label.fontSize,
                  fontVariantNumeric: 'tabular-nums',
                  color: semanticColors.textFunctionalError,
                  fontWeight: 600,
                }}>
                  ● {Math.floor(recTime / 60000)}:{String(Math.floor((recTime % 60000) / 1000)).padStart(2, '0')}
                </span>
                <BasicButton variant="secondary" size="small" onClick={handleStopRecord}>
                  Stop
                </BasicButton>
              </div>
            ) : (
              <BasicButton variant="secondary" size="small" onClick={handleRecord}>
                Record
              </BasicButton>
            )}
          </div>
        </div>

        {/* ── Instrument-specific strip ───────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: layout.gap24,
            borderTop: sectionBorder,
            paddingTop: layout.gap16,
            flexWrap: 'wrap',
          }}
        >
          {/* Octave readout */}
          <div
            onDoubleClick={() =>
              localMode === 'keyboard'
                ? pianoRef.current?.setOctaveShift(0)
                : setWindOctaveShift(0)
            }
            title="Double-click to reset · ↑↓ to shift"
            style={readoutStyle}
          >
            <span style={readoutValueStyle}>
              {(() => {
                const v = localMode === 'keyboard' ? pianoOctaveShift : windOctaveShift
                return v >= 0 ? `+${v}` : `${v}`
              })()}
            </span>
            <span style={readoutLabelStyle}>Oct</span>
          </div>

          {/* Transpose readout */}
          <div
            onDoubleClick={() => setTranspose(0)}
            title="Double-click to reset · Shift+↑↓ to change"
            style={readoutStyle}
          >
            <span style={readoutValueStyle}>
              {transpose >= 0 ? `+${transpose}` : `${transpose}`}
            </span>
            <span style={readoutLabelStyle}>{TRANSPOSE_KEY[transpose]}</span>
          </div>

          {/* Mode-specific controls */}
          {!isSolo && (
            <BasicButton
              variant={syncRemote ? 'primary' : 'secondary'}
              colourFill={syncRemote}
              size="small"
              onClick={() => setSyncRemote((v) => !v)}
            >
              {syncRemote ? 'Remote ON' : 'Remote OFF'}
            </BasicButton>
          )}

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

          {!isSolo && localMode === 'keyboard' && remoteCurrentNote !== null && (
            <BasicButton
              variant="secondary"
              size="small"
              onClick={handleMatchOctave}
            >
              Match Octave
            </BasicButton>
          )}
          {matchLabel && (
            <span
              style={{
                fontFamily: FONT,
                fontSize: typography.label.fontSize,
                color: semanticColors.buttonSurfacePrimary,
                animation: 'jamlink-flash 2s ease-out forwards',
              }}
            >
              {matchLabel}
            </span>
          )}
        </div>

        {/* ── Piano keyboard (keyboard mode only) ─────────────────── */}
        {localMode === 'keyboard' && (
          <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
            <PianoKeyboard
              ref={pianoRef}
              onMidiEvent={handleLocalMidi}
              remoteActiveNotes={remoteNotes}
              onOctaveShiftChange={setPianoOctaveShift}
              transpose={transpose}
            />
          </div>
        )}

        {/* Debug panel */}
        <DebugPanel
          ref={debugRef}
          rtt={rtt}
          oneWay={oneWay}
          jitter={jitter}
          samplesRef={samplesRef}
          transportType={transportType}
          synth={synth}
          waveform={waveform}
          onWaveformChange={handleWaveformChange}
        />
      </div>
    )
  },
)

export default JamRoomComponent
