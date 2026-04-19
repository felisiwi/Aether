import React from "react";
import PianoKey from "../pianokey/PianoKey.1.4.0";
import { layout } from "../../tokens/design-tokens";

export interface OctaveSectionProps {
  octave: number;
  /** Semitone offset for Keyboard variant tile labels and pressed-state matching. */
  noteOffset?: number;
  pressedNotes?: string[];
  variant?: "Piano" | "Keyboard";
  /** Which keyboard shortcut group (0–2) for `Keyboard` variant; omit for `Piano`. */
  keyboardGroup?: number;
  className?: string;
  style?: React.CSSProperties;
}

const WHITES: { letter: string; shortcut: string }[] = [
  { letter: "C", shortcut: "Z" },
  { letter: "D", shortcut: "X" },
  { letter: "E", shortcut: "C" },
  { letter: "F", shortcut: "V" },
  { letter: "G", shortcut: "B" },
  { letter: "A", shortcut: "N" },
  { letter: "B", shortcut: "M" },
];

const BLACKS: { letter: string; shortcut: string; afterWhiteIndex: number }[] = [
  { letter: "C#", shortcut: "S", afterWhiteIndex: 0 },
  { letter: "D#", shortcut: "D", afterWhiteIndex: 1 },
  { letter: "F#", shortcut: "H", afterWhiteIndex: 3 },
  { letter: "G#", shortcut: "J", afterWhiteIndex: 4 },
  { letter: "A#", shortcut: "G", afterWhiteIndex: 5 },
];

/** Per-octave white-key shortcuts (C3, C4, C5 groups) — matches PianoKeyboard / CODE_LABELS. */
const WHITES_GROUP: Record<number, string[]> = {
  0: ["Z", "X", "C", "V", "B", "N", "M"],
  1: [",", ".", "-", "Q", "W", "E", "R"],
  2: ["T", "Y", "U", "I", "O", "P", "Å"],
};

/** C# D# F# G# A# order per octave group. */
const BLACKS_GROUP: Record<number, string[]> = {
  0: ["S", "D", "H", "J", "G"],
  1: ["L", "Ö", "2", "3", "4"],
  2: ["6", "7", "9", "0", "+"],
};

function norm(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

const PC_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const LETTER_PC: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

function parseNoteToMidi(note: string): number {
  const m = note.trim().match(/^([A-G])(#)?(\d+)$/);
  if (!m) return 60;
  const letter = m[1];
  const sharp = m[2] === "#";
  const o = Number(m[3]);
  const pc = sharp ? LETTER_PC[letter]! + 1 : LETTER_PC[letter]!;
  return (o + 1) * 12 + pc;
}

function midiToNoteName(midi: number): string {
  const idx = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${PC_NAMES[idx]}${octave}`;
}

/** Label and press target for a physical key after transpose offset. */
function withNoteOffset(baseNote: string, offset: number): string {
  if (offset === 0) return baseNote;
  const midi = parseNoteToMidi(baseNote) + offset;
  if (midi < 0 || midi > 127) return baseNote;
  return midiToNoteName(midi);
}

export const OctaveSection: React.FC<OctaveSectionProps> = ({
  octave,
  noteOffset = 0,
  pressedNotes = [],
  variant = "Piano",
  keyboardGroup,
  className,
  style,
}) => {
  const pressed = new Set(pressedNotes.map(norm));

  const whiteShortcuts =
    keyboardGroup !== undefined
      ? WHITES_GROUP[keyboardGroup] ?? ["", "", "", "", "", "", ""]
      : ["", "", "", "", "", "", ""];
  const blackShortcuts =
    keyboardGroup !== undefined
      ? BLACKS_GROUP[keyboardGroup] ?? ["", "", "", "", ""]
      : ["", "", "", "", ""];

  if (variant === "Keyboard") {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: layout.gap8,
          flex: 1,
          minWidth: 0,
          ...style,
        }}
        role="group"
        aria-label={`Keyboard octave ${octave}`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: layout.gap4,
            width: "100%",
          }}
        >
          <div
            style={{ width: layout.gap24, alignSelf: "stretch" }}
            aria-hidden
          />
          <PianoKey
            note={withNoteOffset(`C#${octave}`, noteOffset)}
            shortcutLabel={blackShortcuts[0] ?? ""}
            isPressed={pressed.has(norm(withNoteOffset(`C#${octave}`, noteOffset)))}
            isBlack
            variant="instrument"
          />
          <PianoKey
            note={withNoteOffset(`D#${octave}`, noteOffset)}
            shortcutLabel={blackShortcuts[1] ?? ""}
            isPressed={pressed.has(norm(withNoteOffset(`D#${octave}`, noteOffset)))}
            isBlack
            variant="instrument"
          />
          <div style={{ flex: 1, minWidth: 0 }} aria-hidden />
          <PianoKey
            note={withNoteOffset(`F#${octave}`, noteOffset)}
            shortcutLabel={blackShortcuts[2] ?? ""}
            isPressed={pressed.has(norm(withNoteOffset(`F#${octave}`, noteOffset)))}
            isBlack
            variant="instrument"
          />
          <PianoKey
            note={withNoteOffset(`G#${octave}`, noteOffset)}
            shortcutLabel={blackShortcuts[3] ?? ""}
            isPressed={pressed.has(norm(withNoteOffset(`G#${octave}`, noteOffset)))}
            isBlack
            variant="instrument"
          />
          <PianoKey
            note={withNoteOffset(`A#${octave}`, noteOffset)}
            shortcutLabel={blackShortcuts[4] ?? ""}
            isPressed={pressed.has(norm(withNoteOffset(`A#${octave}`, noteOffset)))}
            isBlack
            variant="instrument"
          />
          <div
            style={{ width: layout.gap24, alignSelf: "stretch" }}
            aria-hidden
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: layout.gap4,
            width: "100%",
          }}
        >
          {WHITES.map((w, i) => {
            const base = `${w.letter}${octave}`;
            const note = withNoteOffset(base, noteOffset);
            return (
              <PianoKey
                key={base}
                note={note}
                shortcutLabel={whiteShortcuts[i] ?? ""}
                isPressed={pressed.has(norm(note))}
                isBlack={false}
                variant="instrument"
              />
            );
          })}
        </div>
      </div>
    );
  }

  const whiteW = layout.gap48;
  const blackW = layout.gap32;
  const blackLeft = (afterWhiteIndex: number) => (afterWhiteIndex + 1) * whiteW - blackW / 2;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "row",
        ...style,
      }}
      role="group"
      aria-label={`Piano octave ${octave}`}
    >
      {WHITES.map((w) => {
        const note = `${w.letter}${octave}`;
        return (
          <PianoKey
            key={note}
            note={note}
            shortcutLabel={w.shortcut}
            isPressed={pressed.has(norm(note))}
            isBlack={false}
          />
        );
      })}
      {BLACKS.map((b) => {
        const note = `${b.letter}${octave}`;
        return (
          <div
            key={note}
            style={{
              position: "absolute",
              left: blackLeft(b.afterWhiteIndex),
              top: 0,
              zIndex: 1,
            }}
          >
            <PianoKey
              note={note}
              shortcutLabel={b.shortcut}
              isPressed={pressed.has(norm(note))}
              isBlack
            />
          </div>
        );
      })}
    </div>
  );
};

OctaveSection.displayName = "OctaveSection";
export default OctaveSection;
