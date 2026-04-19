import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type PlayerHeaderVariant = "default" | "colour" | "theme";

/** Props for PlayerHeader — player identification with name, instrument tag, and optional trailing content. */
export interface PlayerHeaderProps {
  /** Player display name. */
  name: string;
  /** Instrument or mode label shown as a subtitle tag. */
  instrument?: string;
  /** Visual variant: default (neutral), colour (orange/local), theme (purple/remote). */
  variant?: PlayerHeaderVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Optional content rendered to the right (e.g. VUBar, latency). */
  trailing?: React.ReactNode;
  /** Alignment — local player is left-aligned, remote player is right-aligned. */
  align?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

const titleType = typography.titleS;
const labelType = typography.label;

interface VariantTokens {
  nameColor: string;
  instrumentColor: string;
  instrumentBg: string;
}

function getTokens(variant: PlayerHeaderVariant, dark: boolean): VariantTokens {
  switch (variant) {
    case "colour":
      return {
        nameColor: dark
          ? semanticColors.strokeInvertedSolid
          : colors.textHeadingNeutral,
        instrumentColor: colors.textHeadingColour,
        instrumentBg: dark
          ? semanticColors.backdropOpacityAdaptiveOpacityDarkenedWeak
          : semanticColors.buttonSurfaceSmallbuttonDefault,
      };
    case "theme":
      return {
        nameColor: dark
          ? semanticColors.strokeInvertedSolid
          : colors.textHeadingNeutral,
        instrumentColor: semanticColors.backdropSurfaceThemedSurface,
        instrumentBg: dark
          ? semanticColors.backdropOpacityAdaptiveOpacityDarkenedWeak
          : semanticColors.backdropStatesDisabledSurface,
      };
    default:
      return {
        nameColor: dark
          ? semanticColors.strokeInvertedSolid
          : colors.textHeadingNeutral,
        instrumentColor: dark ? colors.textBodyNeutralDark : colors.textBodyNeutral,
        instrumentBg: dark
          ? semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak
          : semanticColors.backdropStatesDisabledSurface,
      };
  }
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  name,
  instrument,
  variant = "default",
  darkMode = false,
  trailing,
  align = "left",
  className,
  style,
}) => {
  const tokens = getTokens(variant, darkMode);
  const isRight = align === "right";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: layout.gap8,
    flexDirection: isRight ? "row-reverse" : "row",
    ...style,
  };

  const infoStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: isRight ? "flex-end" : "flex-start",
    gap: layout.gap2,
    minWidth: 0,
  };

  const nameStyle: React.CSSProperties = {
    fontFamily,
    fontSize: titleType.fontSize,
    fontWeight: titleType.fontWeight,
    lineHeight: `${titleType.lineHeight}px`,
    fontStretch: `${titleType.fontWidth}%`,
    letterSpacing: titleType.letterSpacing,
    color: tokens.nameColor,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const instrumentStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    paddingLeft: layout.gap4,
    paddingRight: layout.gap4,
    paddingTop: layout.gap2,
    paddingBottom: layout.gap2,
    borderRadius: layout.radiusXs,
    backgroundColor: tokens.instrumentBg,
    fontFamily,
    fontSize: labelType.fontSize,
    lineHeight: `${labelType.lineHeight}px`,
    fontWeight: labelType.fontWeight,
    fontStretch: `${labelType.fontWidth}%`,
    letterSpacing: labelType.letterSpacing,
    color: tokens.instrumentColor,
    whiteSpace: "nowrap",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={infoStyle}>
        <span style={nameStyle}>{name}</span>
        {instrument && <span style={instrumentStyle}>{instrument}</span>}
      </div>
      {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
    </div>
  );
};

PlayerHeader.displayName = "PlayerHeader";
export default PlayerHeader;
