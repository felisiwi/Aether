import React from "react";
import { HeldKeys } from "../heldkeys/HeldKeys.1.1.0";
import {
  layout,
  semanticColors,
  typography,
  fontFamily,
  colors,
  themeTokens,
} from "../../tokens/design-tokens";

export type ChordDisplayVariant = "local" | "remote";

export interface ChordDisplayProps {
  variant: ChordDisplayVariant;
  chordName: string;
  notes: string[];
  keyName: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Semantic colour guide: local card = light peach; remote = purple primary10. */
function surfaceBg(v: ChordDisplayVariant): string {
  if (v === "local") {
    return semanticColors.backdropSurfaceElevatedSurface;
  }
  return themeTokens.purple.primary10;
}

function borderCol(v: ChordDisplayVariant): string {
  return v === "local" ? semanticColors.strokeColour : themeTokens.purple.primary50;
}

function headingCol(v: ChordDisplayVariant): string {
  return v === "local" ? colors.textHeadingColour : themeTokens.purple.primary50;
}

const chordType = typography.titleL;
const keyType = typography.bodyL;

export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  variant,
  chordName,
  notes,
  keyName,
  className,
  style,
}) => {
  const textColor = headingCol(variant);
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: layout.gap16,
    padding: layout.gap32,
    borderRadius: layout.radiusM,
    borderWidth: layout.strokeM,
    borderStyle: "solid",
    borderColor: borderCol(variant),
    boxSizing: "border-box",
    minWidth: 0,
    ...style,
    /* Variant surface must win over arbitrary `style` so local stays peach / remote light purple. */
    background: surfaceBg(variant),
  };

  const chordStyle: React.CSSProperties = {
    fontFamily,
    fontSize: chordType.fontSize,
    fontWeight: chordType.fontWeight,
    lineHeight: `${chordType.lineHeight}px`,
    fontStretch: `${chordType.fontWidth}%`,
    letterSpacing: chordType.letterSpacing,
    color: textColor,
    textAlign: "center",
  };

  const keyStyle: React.CSSProperties = {
    fontFamily,
    fontSize: keyType.fontSize,
    lineHeight: `${keyType.lineHeight}px`,
    letterSpacing: keyType.letterSpacing,
    color: textColor,
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
