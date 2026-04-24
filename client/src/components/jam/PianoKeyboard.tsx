import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  colors,
  typography,
  fontFamily,
  layout,
  themeTokens,
} from '@ds/tokens/design-tokens'
import PianoKey from '@ds/Components/pianokey/PianoKey.1.5.2'
import { useTheme } from '../../contexts/ThemeContext'
import type { MidiEvent } from '../../lib/midi'

const FONT = `${fontFamily}, sans-serif`

const WHITE_W = 48
const WHITE_H = 142
const BLACK_W = 32
const BLACK_H = 89
const OCTAVES = 3
const BASE_START_NOTE = 48 // C3
const TOTAL_WHITE = OCTAVES * 7
const TOTAL_W = TOTAL_WHITE * WHITE_W
const MIN_SHIFT = -3
const MAX_SHIFT = 3

const NOTE_ROW_H = typography.label.lineHeight // 16px
const ROW_GAP = layout.gap8 // 8px

interface KeyDef {
  note: number
  black: boolean
  x: number
  label?: string
}

// Physical key codes (layout-independent) → MIDI note.
const KEY_MAP: Record<string, number> = {
  // ── Lower pair (C3–E4): Z-row white, A-row black ──
  KeyZ: 48, KeyX: 50, KeyC: 52, KeyV: 53, KeyB: 55, KeyN: 57, KeyM: 59,
  Comma: 60, Period: 62, Slash: 64,
  KeyS: 49, KeyD: 51, KeyG: 54, KeyH: 56, KeyJ: 58, KeyL: 61, Semicolon: 63,

  // ── Upper pair (F4–B5): Q-row white, number-row black ──
  KeyQ: 65, KeyW: 67, KeyE: 69, KeyR: 71, KeyT: 72, KeyY: 74, KeyU: 76,
  KeyI: 77, KeyO: 79, KeyP: 81, BracketLeft: 83,
  Digit2: 66, Digit3: 68, Digit4: 70, Digit6: 73, Digit7: 75,
  Digit9: 78, Digit0: 80, Minus: 82,
}

// e.code → display character (MacBook Pro US/English layout)
const CODE_LABELS: Record<string, string> = {
  KeyZ: 'Z', KeyX: 'X', KeyC: 'C', KeyV: 'V', KeyB: 'B', KeyN: 'N', KeyM: 'M',
  Comma: ',', Period: '.', Slash: '/',
  KeyS: 'S', KeyD: 'D', KeyG: 'G', KeyH: 'H', KeyJ: 'J', KeyL: 'L', Semicolon: ';',
  KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Y', KeyU: 'U',
  KeyI: 'I', KeyO: 'O', KeyP: 'P', BracketLeft: '[',
  Digit2: '2', Digit3: '3', Digit4: '4', Digit6: '6', Digit7: '7',
  Digit9: '9', Digit0: '0', Minus: '-',
}

const KEY_LABELS: Record<number, string> = {}
for (const [code, note] of Object.entries(KEY_MAP)) {
  const lbl = CODE_LABELS[code]
  if (!lbl) continue
  KEY_LABELS[note] = KEY_LABELS[note] ? `${KEY_LABELS[note]}/${lbl}` : lbl
}

function buildKeys(startNote: number, shift: number): KeyDef[] {
  const keys: KeyDef[] = []
  for (let oct = 0; oct < OCTAVES; oct++) {
    const base = startNote + oct * 12
    const bx = oct * 7 * WHITE_W
    const whites = [0, 2, 4, 5, 7, 9, 11]
    whites.forEach((semi, i) => {
      const note = base + semi
      keys.push({
        note,
        black: false,
        x: bx + i * WHITE_W,
        label: KEY_LABELS[note - shift * 12],
      })
    })
    const blacks = [
      { semi: 1, wi: 1 },
      { semi: 3, wi: 2 },
      { semi: 6, wi: 4 },
      { semi: 8, wi: 5 },
      { semi: 10, wi: 6 },
    ]
    blacks.forEach(({ semi, wi }) => {
      const note = base + semi
      keys.push({
        note,
        black: true,
        x: bx + wi * WHITE_W - BLACK_W / 2,
        label: KEY_LABELS[note - shift * 12],
      })
    })
  }
  return keys
}

function makeEvent(type: 'noteOn' | 'noteOff', note: number): MidiEvent {
  return {
    type,
    note,
    velocity: type === 'noteOn' ? 100 : 0,
    cc: 0,
    value: 0,
    channel: 1,
    timestamp: Date.now(),
  }
}

export interface PianoKeyboardProps {
  onMidiEvent: (event: MidiEvent) => void
  remoteActiveNotes?: ReadonlySet<number>
  onOctaveShiftChange?: (shift: number) => void
  /** When Caps Lock held mode is turned off: parent may panic synth; we clear computer-key press state. */
  onCapsLockOff?: () => void
  /** Pre-transpose MIDI numbers (computer keyboard) currently held while caps held mode is on. */
  onComputerHeldRawNotesChange?: (rawNotes: ReadonlySet<number>) => void
  transpose?: number
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteLabel(midiNote: number, transpose: number): string {
  const shifted = midiNote + transpose
  const name = NOTE_NAMES[((shifted % 12) + 12) % 12]
  const oct = Math.floor(shifted / 12) - 1
  return `${name}${oct}`
}

export interface PianoKeyboardHandle {
  setOctaveShift: (shift: number) => void
  clearComputerKeyboardPressState: () => void
}

const PianoKeyboard = forwardRef<PianoKeyboardHandle, PianoKeyboardProps>(
  function PianoKeyboard(
    {
      onMidiEvent,
      remoteActiveNotes,
      onOctaveShiftChange,
      onCapsLockOff,
      onComputerHeldRawNotesChange,
      transpose = 0,
    },
    ref,
  ) {
  const { theme } = useTheme()
  const [localActive, setLocalActive] = useState<Set<number>>(new Set())
  const [capsLockMode, setCapsLockMode] = useState(false)
  const [octaveShift, _setOctaveShift] = useState(0)
  const setOctaveShift = useCallback((v: number | ((prev: number) => number)) => {
    _setOctaveShift((prev) => {
      const next = typeof v === 'function' ? v(prev) : v
      const clamped = Math.max(MIN_SHIFT, Math.min(MAX_SHIFT, next))
      if (clamped !== prev) onOctaveShiftChange?.(clamped)
      return clamped
    })
  }, [onOctaveShiftChange])
  const octaveShiftRef = useRef(octaveShift)
  octaveShiftRef.current = octaveShift
  const callbackRef = useRef(onMidiEvent)
  callbackRef.current = onMidiEvent
  const heldNotesNotifyRef = useRef(onComputerHeldRawNotesChange)
  heldNotesNotifyRef.current = onComputerHeldRawNotesChange
  const activeKeyNotesRef = useRef<Map<string, number>>(new Map())
  /** Pre-transpose MIDI (KEY_MAP + octave) held while caps held mode is on. */
  const heldNotesRef = useRef<Set<number>>(new Set())
  const capsLockModeRef = useRef(false)
  capsLockModeRef.current = capsLockMode
  const pointerNoteRef = useRef<number | null>(null)

  const notifyHeldRawNotes = useCallback(() => {
    heldNotesNotifyRef.current?.(new Set(heldNotesRef.current))
  }, [])

  const clearComputerKeyboardPressState = useCallback(() => {
    setCapsLockMode(false)
    heldNotesRef.current.clear()
    notifyHeldRawNotes()
    activeKeyNotesRef.current.clear()
    pointerNoteRef.current = null
    setLocalActive(new Set())
  }, [notifyHeldRawNotes])

  useImperativeHandle(
    ref,
    () => ({
      setOctaveShift: (s: number) => setOctaveShift(s),
      clearComputerKeyboardPressState,
    }),
    [setOctaveShift, clearComputerKeyboardPressState],
  )

  const startNote = BASE_START_NOTE + octaveShift * 12
  const allKeys = useMemo(() => buildKeys(startNote, octaveShift), [startNote, octaveShift])
  const whiteKeys = useMemo(() => allKeys.filter((k) => !k.black), [allKeys])
  const blackKeys = useMemo(() => allKeys.filter((k) => k.black), [allKeys])

  const noteOn = useCallback((note: number) => {
    setLocalActive((prev) => {
      if (prev.has(note)) return prev
      const next = new Set(prev)
      next.add(note)
      return next
    })
    callbackRef.current(makeEvent('noteOn', note))
  }, [])

  const noteOff = useCallback((note: number) => {
    setLocalActive((prev) => {
      if (!prev.has(note)) return prev
      const next = new Set(prev)
      next.delete(note)
      return next
    })
    callbackRef.current(makeEvent('noteOff', note))
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'CapsLock') {
        e.preventDefault()
        if (e.repeat) return

        // Read OS caps lock state AFTER this keypress
        // true = light is now ON, false = light is now OFF
        const capsIsNowOn = e.getModifierState('CapsLock')

        if (capsIsNowOn) {
          // Caps lock light just turned ON — enter latch mode
          capsLockModeRef.current = true // sync immediately (state lags one render)
          setCapsLockMode(true)
        } else {
          // Caps lock light just turned OFF — release all held notes
          capsLockModeRef.current = false // sync immediately (state lags one render)
          for (const note of [...heldNotesRef.current]) {
            noteOff(note)
          }
          heldNotesRef.current.clear()
          notifyHeldRawNotes()
          onCapsLockOff?.()
          setCapsLockMode(false)
        }
        return
      }

      if (e.repeat) return

      if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        if (!e.altKey && !e.ctrlKey && !e.metaKey) {
          const capsHeld =
            capsLockModeRef.current && heldNotesRef.current.size > 0
          if (e.shiftKey && capsHeld) {
            e.preventDefault()
            const dir = e.code === 'ArrowRight' ? 12 : -12
            const heldSnapshot = [...heldNotesRef.current]
            for (const raw of heldSnapshot) {
              noteOff(raw)
              heldNotesRef.current.delete(raw)
              const nr = Math.max(0, Math.min(127, raw + dir))
              heldNotesRef.current.add(nr)
              noteOn(nr)
            }
            for (const [code, r] of [...activeKeyNotesRef.current]) {
              if (heldSnapshot.includes(r)) {
                activeKeyNotesRef.current.set(
                  code,
                  Math.max(0, Math.min(127, r + dir)),
                )
              }
            }
            notifyHeldRawNotes()
            if (e.code === 'ArrowRight') {
              setOctaveShift((v) => Math.min(v + 1, MAX_SHIFT))
            } else {
              setOctaveShift((v) => Math.max(v - 1, MIN_SHIFT))
            }
            return
          }
          e.preventDefault()
          if (e.code === 'ArrowRight') {
            setOctaveShift((v) => Math.min(v + 1, MAX_SHIFT))
          } else {
            setOctaveShift((v) => Math.max(v - 1, MIN_SHIFT))
          }
          return
        }
      }

      const baseNote = KEY_MAP[e.code]
      if (baseNote === undefined) return
      e.preventDefault()
      const shifted = baseNote + octaveShiftRef.current * 12
      if (shifted < 0 || shifted > 127) return

      if (capsLockModeRef.current) {
        if (heldNotesRef.current.has(shifted)) {
          heldNotesRef.current.delete(shifted)
          notifyHeldRawNotes()
          noteOff(shifted)
          activeKeyNotesRef.current.delete(e.code)
          return
        }
        activeKeyNotesRef.current.set(e.code, shifted)
        heldNotesRef.current.add(shifted)
        notifyHeldRawNotes()
        noteOn(shifted)
        return
      }

      activeKeyNotesRef.current.set(e.code, shifted)
      noteOn(shifted)
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'CapsLock') return

      const shifted = activeKeyNotesRef.current.get(e.code)
      if (shifted === undefined) return

      if (capsLockModeRef.current) {
        return
      }

      activeKeyNotesRef.current.delete(e.code)
      noteOff(shifted)
    }
    window.addEventListener('keydown', down, true)
    window.addEventListener('keyup', up, true)
    return () => {
      window.removeEventListener('keydown', down, true)
      window.removeEventListener('keyup', up, true)
    }
  }, [noteOn, noteOff, setOctaveShift, onCapsLockOff, notifyHeldRawNotes])

  const handlePointerDown = useCallback(
    (note: number) => (e: React.PointerEvent) => {
      e.preventDefault()
      if (capsLockModeRef.current && heldNotesRef.current.has(note)) {
        heldNotesRef.current.delete(note)
        notifyHeldRawNotes()
        noteOff(note)
        return
      }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      pointerNoteRef.current = note
      noteOn(note)
      if (capsLockModeRef.current) {
        heldNotesRef.current.add(note)
        notifyHeldRawNotes()
      }
    },
    [noteOn, noteOff, notifyHeldRawNotes],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pointerNoteRef.current === null) return
      let el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      while (el && !el.dataset?.note) el = el.parentElement
      const noteStr = el?.dataset?.note
      if (!noteStr) return
      const note = Number(noteStr)
      if (note !== pointerNoteRef.current) {
        const prev = pointerNoteRef.current
        if (capsLockModeRef.current) {
          heldNotesRef.current.delete(prev)
          notifyHeldRawNotes()
        }
        noteOff(prev)
        pointerNoteRef.current = note
        noteOn(note)
        if (capsLockModeRef.current) {
          heldNotesRef.current.add(note)
          notifyHeldRawNotes()
        }
      }
    },
    [noteOn, noteOff, notifyHeldRawNotes],
  )

  const handlePointerUp = useCallback(() => {
    if (pointerNoteRef.current !== null) {
      if (!capsLockModeRef.current) {
        noteOff(pointerNoteRef.current)
      }
      pointerNoteRef.current = null
    }
  }, [noteOff])

  const isLocalActive = (note: number) => localActive.has(note)
  const isRemoteOnly = (note: number) =>
    !localActive.has(note) && (remoteActiveNotes?.has(note) ?? false)
  const isActive = (note: number) =>
    localActive.has(note) || (remoteActiveNotes?.has(note) ?? false)

  const noteLabelBase: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: `${NOTE_ROW_H}px`,
    letterSpacing: typography.label.letterSpacing,
    fontVariationSettings: '"wdth" 120',
    textAlign: 'center',
    color: theme.textBody,
    pointerEvents: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Row 1: Black key note labels (Figma Frame 952) */}
      <div style={{ position: 'relative', height: NOTE_ROW_H, width: TOTAL_W, marginBottom: ROW_GAP }}>
        {blackKeys.map((k) => {
          const pressed = isActive(k.note)
          const ghost = isRemoteOnly(k.note)
          return (
            <span
              key={`bn-${k.note}`}
              style={{
                ...noteLabelBase,
                position: 'absolute',
                left: k.x,
                width: BLACK_W,
                color: ghost ? themeTokens.purple.primary50 : pressed ? colors.textPressed : noteLabelBase.color,
                transition: 'color 60ms ease',
              }}
            >
              {noteLabel(k.note, transpose)}
            </span>
          )
        })}
      </div>

      {/* Row 2: Key row (Figma Frame 953) — whites in flex, blacks absolute */}
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {whiteKeys.map((k) => (
          <div
            key={k.note}
            data-note={k.note}
            onPointerDown={handlePointerDown(k.note)}
            style={{ cursor: 'pointer', touchAction: 'none' }}
          >
            <PianoKey
              note={noteLabel(k.note, transpose)}
              shortcutLabel={k.label ?? ''}
              isPressed={isLocalActive(k.note)}
              isGhost={isRemoteOnly(k.note)}
              isBlack={false}
            />
          </div>
        ))}
        {blackKeys.map((k) => (
          <div
            key={k.note}
            data-note={k.note}
            onPointerDown={handlePointerDown(k.note)}
            style={{
              position: 'absolute',
              left: k.x,
              top: 0,
              zIndex: 1,
              cursor: 'pointer',
              touchAction: 'none',
            }}
          >
            <PianoKey
              note={noteLabel(k.note, transpose)}
              shortcutLabel={k.label ?? ''}
              isPressed={isLocalActive(k.note)}
              isGhost={isRemoteOnly(k.note)}
              isBlack={true}
            />
          </div>
        ))}
      </div>

      {/* Row 3: White key note labels (Figma Frame 951) */}
      <div style={{ display: 'inline-flex', marginTop: ROW_GAP }}>
        {whiteKeys.map((k) => {
          const pressed = isActive(k.note)
          const ghost = isRemoteOnly(k.note)
          return (
            <span
              key={`wn-${k.note}`}
              style={{
                ...noteLabelBase,
                width: WHITE_W,
                color: ghost ? themeTokens.purple.primary50 : pressed ? colors.textPressed : noteLabelBase.color,
                transition: 'color 60ms ease',
              }}
            >
              {noteLabel(k.note, transpose)}
            </span>
          )
        })}
      </div>
    </div>
  )
})

export default PianoKeyboard
