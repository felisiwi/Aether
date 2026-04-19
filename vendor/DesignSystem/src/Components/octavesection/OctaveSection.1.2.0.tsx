import React from "react";
import PianoKey from "../pianokey/PianoKey.1.4.0";
import { layout } from "../../tokens/design-tokens";

export interface OctaveSectionProps {
  octave: number;
  pressedNotes?: string[];
  /** Remote peer held notes (Keyboard variant ghost highlight). */
  remoteNotes?: string[];
  variant?: "Piano" | "Keyboard";
  /** Which keyboard shortcut group (0–2) for `Keyboard` variant; omit for `Piano`. */
  keyboardGroup?: number;
  /** Semitone transpose offset; physical key labels show the note that actually sounds. */
  noteOffset?: number;
  /** Mouse/touch down on a key tile (Keyboard variant only). */
  onNoteOn?: (note: string) => void;
  /** Mouse/touch release or leave (Keyboard variant only). */
  onNoteOff?: (note: string) => void;
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
  1: [",", ".", "/", "Q", "W", "E", "R"],
  2: ["T", "Y", "U", "I", "O", "P", "["],
};

/** C# D# F# G# A# order per octave group. */
const BLACKS_GROUP: Record<number, string[]> = {
  0: ["S", "D", "G", "H", "J"],
  1: ["L", ";", "2", "3", "4"],
  2: ["6", "7", "9", "0", "-"],
};

function norm(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

const NOTE_NAMES = [
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

/** Semitones from C within the octave for the 7 white keys (C…B). */
const WHITE_SEMITONES_FROM_C = [0, 2, 4, 5, 7, 9, 11] as const;
/** Semitones from C for C#, D#, F#, G#, A# (same order as {@link BLACKS}). */
const BLACK_SEMITONES_FROM_C = [1, 3, 6, 8, 10] as const;

function transposedNoteName(
  octave: number,
  baseSemitoneFromC: number,
  noteOffset: number,
): string {
  const actualSemitone = baseSemitoneFromC + noteOffset;
  const actualOctave = octave + Math.floor(actualSemitone / 12);
  const actualNoteIndex = ((actualSemitone % 12) + 12) % 12;
  return `${NOTE_NAMES[actualNoteIndex]}${actualOctave}`;
}

export const OctaveSection: React.FC<OctaveSectionProps> = ({
  octave,
  pressedNotes = [],
  remoteNotes,
  variant = "Piano",
  keyboardGroup,
  noteOffset = 0,
  onNoteOn,
  onNoteOff,
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
    const keyboardNote = (blackIndex: 0 | 1 | 2 | 3 | 4) =>
      transposedNoteName(octave, BLACK_SEMITONES_FROM_C[blackIndex], noteOffset);

    const remote = new Set((remoteNotes ?? []).map(norm));
    const isGhostNote = (note: string) =>
      remote.has(norm(note)) && !pressed.has(norm(note));

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
          <div
            key={`black-0-${octave}`}
            onPointerDown={(e) => {
              e.preventDefault();
              onNoteOn?.(keyboardNote(0));
            }}
            onPointerUp={() => onNoteOff?.(keyboardNote(0))}
            onPointerLeave={() => onNoteOff?.(keyboardNote(0))}
            style={{
              flex: 1,
              minWidth: 0,
              touchAction: "none",
              cursor: "pointer",
            }}
          >
            <PianoKey
              note={keyboardNote(0)}
              shortcutLabel={blackShortcuts[0] ?? ""}
              isPressed={pressed.has(norm(keyboardNote(0)))}
              isGhost={isGhostNote(keyboardNote(0))}
              isBlack
              variant="instrument"
            />
          </div>
          <div
            key={`black-1-${octave}`}
            onPointerDown={(e) => {
              e.preventDefault();
              onNoteOn?.(keyboardNote(1));
            }}
            onPointerUp={() => onNoteOff?.(keyboardNote(1))}
            onPointerLeave={() => onNoteOff?.(keyboardNote(1))}
            style={{
              flex: 1,
              minWidth: 0,
              touchAction: "none",
              cursor: "pointer",
            }}
          >
            <PianoKey
              note={keyboardNote(1)}
              shortcutLabel={blackShortcuts[1] ?? ""}
              isPressed={pressed.has(norm(keyboardNote(1)))}
              isGhost={isGhostNote(keyboardNote(1))}
              isBlack
              variant="instrument"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }} aria-hidden />
          <div
            key={`black-2-${octave}`}
            onPointerDown={(e) => {
              e.preventDefault();
              onNoteOn?.(keyboardNote(2));
            }}
            onPointerUp={() => onNoteOff?.(keyboardNote(2))}
            onPointerLeave={() => onNoteOff?.(keyboardNote(2))}
            style={{
              flex: 1,
              minWidth: 0,
              touchAction: "none",
              cursor: "pointer",
            }}
          >
            <PianoKey
              note={keyboardNote(2)}
              shortcutLabel={blackShortcuts[2] ?? ""}
              isPressed={pressed.has(norm(keyboardNote(2)))}
              isGhost={isGhostNote(keyboardNote(2))}
              isBlack
              variant="instrument"
            />
          </div>
          <div
            key={`black-3-${octave}`}
            onPointerDown={(e) => {
              e.preventDefault();
              onNoteOn?.(keyboardNote(3));
            }}
            onPointerUp={() => onNoteOff?.(keyboardNote(3))}
            onPointerLeave={() => onNoteOff?.(keyboardNote(3))}
            style={{
              flex: 1,
              minWidth: 0,
              touchAction: "none",
              cursor: "pointer",
            }}
          >
            <PianoKey
              note={keyboardNote(3)}
              shortcutLabel={blackShortcuts[3] ?? ""}
              isPressed={pressed.has(norm(keyboardNote(3)))}
              isGhost={isGhostNote(keyboardNote(3))}
              isBlack
              variant="instrument"
            />
          </div>
          <div
            key={`black-4-${octave}`}
            onPointerDown={(e) => {
              e.preventDefault();
              onNoteOn?.(keyboardNote(4));
            }}
            onPointerUp={() => onNoteOff?.(keyboardNote(4))}
            onPointerLeave={() => onNoteOff?.(keyboardNote(4))}
            style={{
              flex: 1,
              minWidth: 0,
              touchAction: "none",
              cursor: "pointer",
            }}
          >
            <PianoKey
              note={keyboardNote(4)}
              shortcutLabel={blackShortcuts[4] ?? ""}
              isPressed={pressed.has(norm(keyboardNote(4)))}
              isGhost={isGhostNote(keyboardNote(4))}
              isBlack
              variant="instrument"
            />
          </div>
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
            const baseSemitone = WHITE_SEMITONES_FROM_C[i];
            const note = transposedNoteName(octave, baseSemitone, noteOffset);
            return (
              <div
                key={`${w.letter}${octave}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onNoteOn?.(note);
                }}
                onPointerUp={() => onNoteOff?.(note)}
                onPointerLeave={() => onNoteOff?.(note)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  touchAction: "none",
                  cursor: "pointer",
                }}
              >
                <PianoKey
                  note={note}
                  shortcutLabel={whiteShortcuts[i] ?? ""}
                  isPressed={pressed.has(norm(note))}
                  isGhost={isGhostNote(note)}
                  isBlack={false}
                  variant="instrument"
                />
              </div>
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
      {WHITES.map((w, i) => {
        const baseSemitone = WHITE_SEMITONES_FROM_C[i];
        const note = transposedNoteName(octave, baseSemitone, noteOffset);
        return (
          <PianoKey
            key={`${w.letter}${octave}`}
            note={note}
            shortcutLabel={w.shortcut}
            isPressed={pressed.has(norm(note))}
            isBlack={false}
          />
        );
      })}
      {BLACKS.map((b, i) => {
        const baseSemitone = BLACK_SEMITONES_FROM_C[i];
        const note = transposedNoteName(octave, baseSemitone, noteOffset);
        return (
          <div
            key={`${b.letter}${octave}`}
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
