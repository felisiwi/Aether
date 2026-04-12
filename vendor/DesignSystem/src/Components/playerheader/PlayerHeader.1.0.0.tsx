import React from "react";
import { typography, fontFamily, colors, semanticColors, layout } from "../../tokens/design-tokens";

export type PlayerHeaderVariant = "default" | "colour" | "theme";
export interface PlayerHeaderProps { name: string; instrument?: string; variant?: PlayerHeaderVariant; darkMode?: boolean; trailing?: React.ReactNode; align?: "left" | "right"; className?: string; style?: React.CSSProperties; }

const titleType = typography.titleS; const labelType = typography.label;

function getTokens(variant: PlayerHeaderVariant, dark: boolean) {
  switch (variant) {
    case "colour": return { nameColor: dark ? semanticColors.strokeInvertedSolid : colors.textHeadingNeutral, instrumentColor: colors.textHeadingColour, instrumentBg: dark ? semanticColors.backdropOpacityAdaptiveOpacityDarkenedWeak : semanticColors.buttonSurfaceSmallbuttonDefault };
    case "theme": return { nameColor: dark ? semanticColors.strokeInvertedSolid : colors.textHeadingNeutral, instrumentColor: semanticColors.backdropSurfaceThemedSurface, instrumentBg: dark ? semanticColors.backdropOpacityAdaptiveOpacityDarkenedWeak : semanticColors.backdropStatesDisabledSurface };
    default: return { nameColor: dark ? semanticColors.strokeInvertedSolid : colors.textHeadingNeutral, instrumentColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral, instrumentBg: dark ? semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak : semanticColors.backdropStatesDisabledSurface };
  }
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({ name, instrument, variant = "default", darkMode = false, trailing, align = "left", className, style }) => {
  const tokens = getTokens(variant, darkMode); const isRight = align === "right";
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: layout.gap8, flexDirection: isRight ? "row-reverse" : "row", ...style }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: isRight ? "flex-end" : "flex-start", gap: layout.gap2, minWidth: 0 }}>
        <span style={{ fontFamily, fontSize: titleType.fontSize, fontWeight: titleType.fontWeight, lineHeight: `${titleType.lineHeight}px`, fontStretch: `${titleType.fontWidth}%`, letterSpacing: titleType.letterSpacing, color: tokens.nameColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
        {instrument && <span style={{ display: "inline-flex", alignItems: "center", paddingLeft: layout.gap4, paddingRight: layout.gap4, paddingTop: layout.gap2, paddingBottom: layout.gap2, borderRadius: layout.radiusXs, backgroundColor: tokens.instrumentBg, fontFamily, fontSize: labelType.fontSize, lineHeight: `${labelType.lineHeight}px`, fontWeight: labelType.fontWeight, fontStretch: `${labelType.fontWidth}%`, letterSpacing: labelType.letterSpacing, color: tokens.instrumentColor, whiteSpace: "nowrap", fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>{instrument}</span>}
      </div>
      {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
    </div>
  );
};
PlayerHeader.displayName = "PlayerHeader";
export default PlayerHeader;
