import React from "react";
import PianoKey from "../pianokey/PianoKey.1.5.0";
import { OctaveSection } from "../octavesection/OctaveSection.1.0.0";
import {
  typography,
  fontFamily,
  colors,
  layout,
  semanticColors,
} from "../../tokens/design-tokens";

export interface InstrumentInterfaceProps {
  /** Starting MIDI-style octave number for the section control. */
  octave: number;
  onOctaveChange: (octave: number) => void;
  /** Use laptop / instrument key caps (see `PianoKey` `variant`). */
  keyVariant?: "default" | "instrument";
  /** When true, show note names above black keys (Figma KeyNoteRow). */
  showNoteHints?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const whites: { note: string; shortcutLabel: string }[] = [
  { note: "C3", shortcutLabel: "Z" },
  { note: "D3", shortcutLabel: "X" },
  { note: "E3", shortcutLabel: "C" },
  { note: "F3", shortcutLabel: "V" },
  { note: "G3", shortcutLabel: "B" },
  { note: "A3", shortcutLabel: "N" },
  { note: "B3", shortcutLabel: "M" },
];

const blacks: { note: string; shortcutLabel: string; after: number }[] = [
  { note: "C#3", shortcutLabel: "S", after: 0 },
  { note: "D#3", shortcutLabel: "D", after: 1 },
  { note: "F#3", shortcutLabel: "H", after: 3 },
  { note: "G#3", shortcutLabel: "J", after: 4 },
  { note: "A#3", shortcutLabel: "G", after: 5 },
];


export const InstrumentInterface: React.FC<InstrumentInterfaceProps> = ({
  octave,
  onOctaveChange,
  keyVariant = "default",
  showNoteHints = true,
  className,
  style,
}) => {
  const vk = keyVariant;
  const octaveUi: "piano" | "keyboard" =
    vk === "instrument" ? "keyboard" : "piano";

  const whiteW = layout.gap48;
  const blackW = vk === "instrument" ? layout.gap48 : layout.gap32;

  const blackLeft = (after: number) =>
    (after + 1) * whiteW - blackW / 2;

  const labelH = typography.label.lineHeight;
  const noteLabel: React.CSSProperties = {
    fontFamily,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: `${labelH}px`,
    letterSpacing: typography.label.letterSpacing,
    fontStretch: `${typography.label.fontWidth}%`,
    textAlign: "center",
    color: colors.textBodyNeutral,
  };

  const root: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.gap16,
    padding: layout.gap16,
    background: semanticColors.backdropNautralBackground,
    borderRadius: layout.radiusM,
    boxSizing: "border-box",
    ...style,
  };

  const row: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    flexDirection: "row",
  };

  return (
    <div className={className} style={root}>
      <OctaveSection
        octave={octave}
        onOctaveChange={onOctaveChange}
        variant={octaveUi}
      />

      {showNoteHints ? (
        <div
          style={{
            position: "relative",
            height: labelH,
            width: 7 * whiteW,
          }}
        >
          {blacks.map((b) => (
            <span
              key={b.note}
              style={{
                ...noteLabel,
                position: "absolute",
                left: blackLeft(b.after),
                width: blackW,
              }}
            >
              {b.note}
            </span>
          ))}
        </div>
      ) : null}

      <div style={row}>
        {whites.map((w) => (
          <PianoKey
            key={w.note}
            note={w.note}
            shortcutLabel={w.shortcutLabel}
            isPressed={false}
            isBlack={false}
            variant={vk}
          />
        ))}
        {blacks.map((b) => (
          <div
            key={b.note}
            style={{
              position: "absolute",
              left: blackLeft(b.after),
              top: 0,
              zIndex: 1,
            }}
          >
            <PianoKey
              note={b.note}
              shortcutLabel={b.shortcutLabel}
              isPressed={false}
              isBlack
              variant={vk}
            />
          </div>
        ))}
      </div>

      {showNoteHints ? (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {whites.map((w) => (
            <span
              key={w.note}
              style={{
                ...noteLabel,
                width: whiteW,
              }}
            >
              {w.note}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

InstrumentInterface.displayName = "InstrumentInterface";
export default InstrumentInterface;
