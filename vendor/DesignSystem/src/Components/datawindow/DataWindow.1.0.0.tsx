import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type DataWindowVariant = "default" | "colour" | "theme";

export interface DataWindowProps {
  children: React.ReactNode;
  variant?: DataWindowVariant;
  label?: string;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

interface VariantTokens { borderColor: string; surfaceColor: string; labelColor: string; innerShadow: string; }

function getVariantTokens(variant: DataWindowVariant): VariantTokens {
  switch (variant) {
    case "colour":
      return { borderColor: semanticColors.strokeColour, surfaceColor: semanticColors.backdropOpacityStaticOpacityDarkenedWeak, labelColor: colors.textHeadingColour, innerShadow: `inset 0 1px 2px ${semanticColors.backdropOpacityAdaptiveShadowsInnershadow}` };
    case "theme":
      return { borderColor: semanticColors.backdropSurfaceThemedSurface, surfaceColor: semanticColors.backdropOpacityStaticOpacityDarkenedWeak, labelColor: semanticColors.backdropSurfaceThemedSurface, innerShadow: `inset 0 1px 2px ${semanticColors.backdropOpacityAdaptiveShadowsInnershadow}` };
    default:
      return { borderColor: semanticColors.strokeMedium, surfaceColor: semanticColors.backdropOpacityStaticOpacityDarkenedWeak, labelColor: colors.textBodyNeutral, innerShadow: `inset 0 1px 2px ${semanticColors.backdropOpacityAdaptiveShadowsInnershadow}` };
  }
}

export const DataWindow: React.FC<DataWindowProps> = ({ children, variant = "default", label, compact = false, className, style }) => {
  const tokens = getVariantTokens(variant);
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: compact ? layout.gap2 : layout.gap4, ...style }}>
      {label && <span style={{ fontFamily, fontSize: labelType.fontSize, lineHeight: `${labelType.lineHeight}px`, letterSpacing: labelType.letterSpacing, fontWeight: labelType.fontWeight, fontStretch: `${labelType.fontWidth}%`, color: tokens.labelColor, textTransform: "uppercase", whiteSpace: "nowrap", fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1", margin: 0, padding: 0 }}>{label}</span>}
      <div style={{ display: "flex", flexDirection: "column", padding: compact ? `${layout.gap4}px ${layout.gap8}px` : `${layout.gap8}px ${layout.gap16}px`, borderRadius: layout.radiusS, borderWidth: layout.strokeS, borderStyle: "solid", borderColor: tokens.borderColor, backgroundColor: tokens.surfaceColor, boxShadow: tokens.innerShadow, boxSizing: "border-box", minWidth: 0 }}>{children}</div>
    </div>
  );
};

export default DataWindow;
