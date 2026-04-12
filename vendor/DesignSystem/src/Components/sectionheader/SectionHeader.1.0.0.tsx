import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type SectionHeaderVariant = "default" | "colour" | "theme";

export interface SectionHeaderProps {
  /** Section title text */
  label: string;
  /** default = neutral, colour = orange/local player, theme = purple/remote player */
  variant?: SectionHeaderVariant;
  /** Optional content rendered on the right side of the header */
  rightContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const overline = typography.overline;

interface VariantTokens {
  textColor: string;
  accentColor: string;
}

function getVariantTokens(variant: SectionHeaderVariant): VariantTokens {
  switch (variant) {
    case "colour":
      return {
        textColor: colors.textHeadingColour,
        accentColor: semanticColors.strokeColour,
      };
    case "theme":
      return {
        textColor: semanticColors.backdropSurfaceThemedSurface,
        accentColor: semanticColors.backdropSurfaceThemedSurface,
      };
    case "default":
    default:
      return {
        textColor: colors.textBodyNeutral,
        accentColor: semanticColors.strokeMedium,
      };
  }
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  variant = "default",
  rightContent,
  className,
  style,
}) => {
  const tokens = getVariantTokens(variant);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: layout.gap8,
    boxSizing: "border-box",
    ...style,
  };

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: overline.fontSize,
    lineHeight: `${overline.lineHeight}px`,
    letterSpacing: overline.letterSpacing,
    fontWeight: overline.fontWeight,
    fontStretch: `${overline.fontWidth}%`,
    color: tokens.textColor,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
  };

  const ruleStyle: React.CSSProperties = {
    flex: 1,
    height: layout.strokeS,
    backgroundColor: tokens.accentColor,
    borderRadius: layout.radiusRound,
    minWidth: layout.gap16,
  };

  const rightContentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    flexShrink: 0,
  };

  return (
    <div className={className} style={containerStyle} role="heading" aria-level={3}>
      <span style={textStyle}>{label}</span>
      <span style={ruleStyle} aria-hidden="true" />
      {rightContent && <span style={rightContentStyle}>{rightContent}</span>}
    </div>
  );
};

export default SectionHeader;
