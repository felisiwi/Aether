import React from "react";
import { typography, fontFamily, colors, semanticColors, layout, themeTokens } from "../../tokens/design-tokens";

export type ChordDisplayVariant = "default" | "colour" | "theme";
export interface ChordDisplayProps { notes: string[]; chordName: string; altName: string; variant?: ChordDisplayVariant; darkMode?: boolean; className?: string; style?: React.CSSProperties; }

const labelType = typography.label; const titleType = typography.titleS;
const CARD_MIN_HEIGHT = layout.gap24 * 2 + labelType.lineHeight * 2 + titleType.lineHeight + layout.gap4 * 2 + layout.strokeS * 2;

function getTokens(variant: ChordDisplayVariant, dark: boolean) {
  const emptyColor = dark ? semanticColors.strokeInvertedStrong : colors.textDisabled;
  switch (variant) {
    case "colour": return { borderColor: semanticColors.strokeColour, notesColor: semanticColors.strokeColour, chordColor: colors.textHeadingColour, altColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral, emptyColor };
    case "theme": return { borderColor: themeTokens.purple.primary50, notesColor: themeTokens.purple.primary50, chordColor: themeTokens.purple.primary50, altColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral, emptyColor };
    default: return { borderColor: dark ? semanticColors.strokeInvertedStrong : semanticColors.strokeMedium, notesColor: dark ? semanticColors.strokeInvertedStrong : colors.textBodyNeutral, chordColor: dark ? semanticColors.strokeInvertedSolid : colors.textHeadingNeutral, altColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral, emptyColor };
  }
}

export const ChordDisplay: React.FC<ChordDisplayProps> = ({ notes, chordName, altName, variant = "default", darkMode = false, className, style }) => {
  const tokens = getTokens(variant, darkMode);
  const hasContent = notes.length > 0 || chordName.length > 0;
  const notesLine = notes.length > 0 ? notes.join(" + ") : null;
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: layout.gap4, padding: layout.gap24, borderRadius: layout.radiusS, borderWidth: layout.strokeS, borderStyle: "solid", borderColor: tokens.borderColor, boxSizing: "border-box", minWidth: 0, minHeight: CARD_MIN_HEIGHT, ...style }} role="status" aria-label="Chord display">
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: labelType.lineHeight, fontFamily, fontSize: labelType.fontSize, fontWeight: labelType.fontWeight, lineHeight: `${labelType.lineHeight}px`, fontStretch: `${labelType.fontWidth}%`, color: notesLine ? tokens.notesColor : tokens.emptyColor, textAlign: "center", fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>{notesLine ?? "\u2014"}</span>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: titleType.lineHeight, fontFamily, fontSize: titleType.fontSize, fontWeight: titleType.fontWeight, lineHeight: `${titleType.lineHeight}px`, fontStretch: `${titleType.fontWidth}%`, letterSpacing: titleType.letterSpacing, color: hasContent ? tokens.chordColor : tokens.emptyColor, textAlign: "center", fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{chordName || "\u2014"}</span>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: labelType.lineHeight, fontFamily, fontSize: labelType.fontSize, fontWeight: labelType.fontWeight, lineHeight: `${labelType.lineHeight}px`, fontStretch: `${labelType.fontWidth}%`, color: altName ? tokens.altColor : tokens.emptyColor, textAlign: "center", fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>{altName || "\u2014"}</span>
    </div>
  );
};
ChordDisplay.displayName = "ChordDisplay";
export default ChordDisplay;
