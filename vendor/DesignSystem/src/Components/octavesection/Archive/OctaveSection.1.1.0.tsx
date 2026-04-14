import React from "react";
import PianoKey from "../../pianokey/PianoKey.1.5.1";
import { layout } from "../../../tokens/design-tokens";

export interface OctaveSectionProps {
  octave: number;
  pressedNotes?: string[];
  variant?: "default" | "instrument";
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
  variant = "default",
  className,
  style,
}) => {
  const vk = variant === "instrument" ? "instrument" : "default";
  const whiteW = layout.gap48;
  const blackW = vk === "instrument" ? layout.gap48 : layout.gap32;

  const blackLeft = (afterWhiteIndex: number) =>
    (afterWhiteIndex + 1) * whiteW - blackW / 2;

  const pressed = new Set(pressedNotes.map(norm));

  const row: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    flexDirection: "row",
    ...style,
  };

  return (
    <div className={className} style={row} role="group" aria-label={`Piano octave ${octave}`}>
      {WHITES.map((w) => {
        const note = `${w.letter}${octave}`;
        return (
          <PianoKey
            key={note}
            note={note}
            shortcutLabel={w.shortcut}
            isPressed={pressed.has(norm(note))}
            isBlack={false}
            variant={vk}
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
              variant={vk}
            />
          </div>
        );
      })}
    </div>
  );
};

OctaveSection.displayName = "OctaveSection";
export default OctaveSection;
