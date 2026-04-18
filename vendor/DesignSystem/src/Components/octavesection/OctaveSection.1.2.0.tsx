import React from "react";
import PianoKey from "../pianokey/PianoKey.1.4.0";
import { layout } from "../../tokens/design-tokens";

export interface OctaveSectionProps {
  octave: number;
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

export const OctaveSection: React.FC<OctaveSectionProps> = ({
  octave,
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
          width: 356,
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
            paddingLeft: layout.gap24,
            paddingRight: layout.gap24,
          }}
        >
          <PianoKey
            note={`C#${octave}`}
            shortcutLabel={blackShortcuts[0] ?? ""}
            isPressed={pressed.has(norm(`C#${octave}`))}
            isBlack
          />
          <PianoKey
            note={`D#${octave}`}
            shortcutLabel={blackShortcuts[1] ?? ""}
            isPressed={pressed.has(norm(`D#${octave}`))}
            isBlack
          />
          <div style={{ width: layout.gap48 }} aria-hidden />
          <PianoKey
            note={`F#${octave}`}
            shortcutLabel={blackShortcuts[2] ?? ""}
            isPressed={pressed.has(norm(`F#${octave}`))}
            isBlack
          />
          <PianoKey
            note={`G#${octave}`}
            shortcutLabel={blackShortcuts[3] ?? ""}
            isPressed={pressed.has(norm(`G#${octave}`))}
            isBlack
          />
          <PianoKey
            note={`A#${octave}`}
            shortcutLabel={blackShortcuts[4] ?? ""}
            isPressed={pressed.has(norm(`A#${octave}`))}
            isBlack
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: layout.gap4,
          }}
        >
          {WHITES.map((w, i) => {
            const note = `${w.letter}${octave}`;
            return (
              <PianoKey
                key={note}
                note={note}
                shortcutLabel={whiteShortcuts[i] ?? ""}
                isPressed={pressed.has(norm(note))}
                isBlack={false}
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
