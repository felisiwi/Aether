import React from "react";
import PianoKey from "../pianokey/PianoKey.1.5.1";
import { layout } from "../../tokens/design-tokens";

export interface OctaveSectionProps {
  octave: number;
  pressedNotes?: string[];
  variant?: "Piano" | "Keyboard";
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

function norm(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

export const OctaveSection: React.FC<OctaveSectionProps> = ({
  octave,
  pressedNotes = [],
  variant = "Piano",
  className,
  style,
}) => {
  const pressed = new Set(pressedNotes.map(norm));
  const pianoKeyVariant = variant === "Keyboard" ? "instrument" : "default";

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
            shortcutLabel="S"
            isPressed={pressed.has(norm(`C#${octave}`))}
            isBlack
            variant={pianoKeyVariant}
          />
          <PianoKey
            note={`D#${octave}`}
            shortcutLabel="D"
            isPressed={pressed.has(norm(`D#${octave}`))}
            isBlack
            variant={pianoKeyVariant}
          />
          <div style={{ width: layout.gap48 }} aria-hidden />
          <PianoKey
            note={`F#${octave}`}
            shortcutLabel="H"
            isPressed={pressed.has(norm(`F#${octave}`))}
            isBlack
            variant={pianoKeyVariant}
          />
          <PianoKey
            note={`G#${octave}`}
            shortcutLabel="J"
            isPressed={pressed.has(norm(`G#${octave}`))}
            isBlack
            variant={pianoKeyVariant}
          />
          <PianoKey
            note={`A#${octave}`}
            shortcutLabel="G"
            isPressed={pressed.has(norm(`A#${octave}`))}
            isBlack
            variant={pianoKeyVariant}
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
          {WHITES.map((w) => {
            const note = `${w.letter}${octave}`;
            return (
              <PianoKey
                key={note}
                note={note}
                shortcutLabel={w.shortcut}
                isPressed={pressed.has(norm(note))}
                isBlack={false}
                variant={pianoKeyVariant}
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
            variant={pianoKeyVariant}
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
              variant={pianoKeyVariant}
            />
          </div>
        );
      })}
    </div>
  );
};

OctaveSection.displayName = "OctaveSection";
export default OctaveSection;
