import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export interface HeldKeysProps {
  chordName: string;
  notes: string[];
  keyName: string;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;
const titleType = typography.titleS;

/**
 * Inner chord readout (chord symbol, notes row, key name). Display-only — no interactive semantics.
 */
export const HeldKeys: React.FC<HeldKeysProps> = ({
  chordName,
  notes,
  keyName,
  className,
  style,
}) => {
  const notesLine = notes.length > 0 ? notes.join(" · ") : null;

  const colStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: layout.gap4,
    ...style,
  };

  const notesStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    color: notesLine ? colors.textBodyNeutral : semanticColors.strokeStrong,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const chordStyle: React.CSSProperties = {
    fontFamily,
    fontSize: titleType.fontSize,
    fontWeight: titleType.fontWeight,
    lineHeight: `${titleType.lineHeight}px`,
    fontStretch: `${titleType.fontWidth}%`,
    letterSpacing: titleType.letterSpacing,
    color: chordName ? colors.textHeadingNeutral : semanticColors.strokeStrong,
    textAlign: "center",
  };

  const keyStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    color: keyName ? colors.textBodyNeutral : semanticColors.strokeStrong,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <div className={className} style={colStyle} role="img" aria-label="Held keys">
      <span style={chordStyle}>{chordName || "\u2014"}</span>
      <span style={notesStyle}>{notesLine ?? "\u2014"}</span>
      <span style={keyStyle}>{keyName || "\u2014"}</span>
    </div>
  );
};

HeldKeys.displayName = "HeldKeys";
export default HeldKeys;
