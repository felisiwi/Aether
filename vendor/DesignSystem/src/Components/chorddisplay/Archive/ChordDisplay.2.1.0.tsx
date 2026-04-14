import React from "react";
import { HeldKeys } from "../../heldkeys/HeldKeys.1.1.0";
import {
  layout,
  semanticColors,
  typography,
  fontFamily,
  colors,
} from "../../../tokens/design-tokens";

export type ChordDisplayVariant = "local" | "remote";

export interface ChordDisplayProps {
  variant: ChordDisplayVariant;
  chordName: string;
  notes: string[];
  keyName: string;
  className?: string;
  style?: React.CSSProperties;
}

function surfaceBg(v: ChordDisplayVariant): string {
  return v === "local"
    ? semanticColors.backdropStaticElevatedSurface
    : semanticColors.backdropSurfaceThemedElevatedSurface;
}

function borderCol(v: ChordDisplayVariant): string {
  return v === "local" ? semanticColors.strokeColour : semanticColors.strokeTheme;
}

const chordType = typography.titleL;
const keyType = typography.label;

export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  variant,
  chordName,
  notes,
  keyName,
  className,
  style,
}) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: layout.gap8,
    padding: layout.gap24,
    borderRadius: layout.radiusS,
    borderWidth: layout.strokeS,
    borderStyle: "solid",
    borderColor: borderCol(variant),
    boxSizing: "border-box",
    minWidth: 0,
    background: surfaceBg(variant),
    ...style,
  };

  const chordStyle: React.CSSProperties = {
    fontFamily,
    fontSize: chordType.fontSize,
    fontWeight: chordType.fontWeight,
    lineHeight: `${chordType.lineHeight}px`,
    fontStretch: `${chordType.fontWidth}%`,
    letterSpacing: chordType.letterSpacing,
    color: colors.textHeadingNeutral,
    textAlign: "center",
  };

  const keyStyle: React.CSSProperties = {
    fontFamily,
    fontSize: keyType.fontSize,
    fontWeight: keyType.fontWeight,
    lineHeight: `${keyType.lineHeight}px`,
    fontStretch: `${keyType.fontWidth}%`,
    letterSpacing: keyType.letterSpacing,
    color: colors.textBodyNeutral,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <div className={className} style={containerStyle} role="region" aria-label="Chord display">
      <HeldKeys notes={notes} variant={variant} />
      <span style={chordStyle}>{chordName || "—"}</span>
      <span style={keyStyle}>{keyName || "—"}</span>
    </div>
  );
};

ChordDisplay.displayName = "ChordDisplay";
export default ChordDisplay;
