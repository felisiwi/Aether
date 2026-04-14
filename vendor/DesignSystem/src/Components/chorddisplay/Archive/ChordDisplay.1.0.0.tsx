import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../../tokens/design-tokens";

export type ChordDisplayVariant = "default" | "colour" | "theme";

/**
 * Props for ChordDisplay — shows chord name, constituent notes, and an
 * alternative name in a bordered card. Matches JamRoom's chord card.
 */
export interface ChordDisplayProps {
  /** Individual note names, e.g. ["C4", "E4", "G4", "B4"]. */
  notes: string[];
  /** Primary chord symbol, e.g. "Cmaj7". Empty string for no chord. */
  chordName: string;
  /** Alternative / quality name, e.g. "C major seventh". */
  altName: string;
  /** Visual variant: default (neutral), colour (orange/local), theme (purple/remote). */
  variant?: ChordDisplayVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;
const titleType = typography.titleS;
const FONT = fontFamily;

interface VariantTokens {
  borderColor: string;
  notesColor: string;
  chordColor: string;
  altColor: string;
  emptyColor: string;
}

function getTokens(variant: ChordDisplayVariant, dark: boolean): VariantTokens {
  const emptyColor = dark
    ? semanticColors.strokeInvertedStrong
    : colors.textDisabled;

  switch (variant) {
    case "colour":
      return {
        borderColor: semanticColors.strokeColour,
        notesColor: semanticColors.strokeColour,
        chordColor: colors.textHeadingColour,
        altColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral,
        emptyColor,
      };
    case "theme":
      return {
        borderColor: semanticColors.backdropSurfaceThemedSurface,
        notesColor: semanticColors.backdropSurfaceThemedSurface,
        chordColor: semanticColors.backdropSurfaceThemedSurface,
        altColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral,
        emptyColor,
      };
    default:
      return {
        borderColor: dark
          ? semanticColors.strokeInvertedStrong
          : semanticColors.strokeMedium,
        notesColor: dark
          ? semanticColors.strokeInvertedStrong
          : colors.textBodyNeutral,
        chordColor: dark
          ? semanticColors.strokeInvertedSolid
          : colors.textHeadingNeutral,
        altColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral,
        emptyColor,
      };
  }
}

export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  notes,
  chordName,
  altName,
  variant = "default",
  darkMode = false,
  className,
  style,
}) => {
  const tokens = getTokens(variant, darkMode);
  const hasContent = notes.length > 0 || chordName.length > 0;
  const notesLine = notes.length > 0 ? notes.join(" + ") : null;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: layout.gap4,
    padding: layout.gap24,
    borderRadius: layout.radiusS,
    borderWidth: layout.strokeS,
    borderStyle: "solid",
    borderColor: tokens.borderColor,
    boxSizing: "border-box",
    minWidth: 0,
    ...style,
  };

  const notesStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: labelType.lineHeight,
    fontFamily: FONT,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    color: notesLine ? tokens.notesColor : tokens.emptyColor,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const chordStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: titleType.lineHeight,
    fontFamily: FONT,
    fontSize: titleType.fontSize,
    fontWeight: titleType.fontWeight,
    lineHeight: `${titleType.lineHeight}px`,
    fontStretch: `${titleType.fontWidth}%`,
    letterSpacing: titleType.letterSpacing,
    color: hasContent ? tokens.chordColor : tokens.emptyColor,
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  };

  const altStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: labelType.lineHeight,
    fontFamily: FONT,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    color: altName ? tokens.altColor : tokens.emptyColor,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <div className={className} style={containerStyle} role="status" aria-label="Chord display">
      <span style={notesStyle}>{notesLine ?? "\u2014"}</span>
      <span style={chordStyle}>{chordName || "\u2014"}</span>
      <span style={altStyle}>{altName || "\u2014"}</span>
    </div>
  );
};

ChordDisplay.displayName = "ChordDisplay";
export default ChordDisplay;
