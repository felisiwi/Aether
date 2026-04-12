import React from "react";
import { typography, fontFamily, colors, semanticColors, layout } from "../../tokens/design-tokens";

export type LatencyIndicatorVariant = "default" | "colour" | "theme";
export interface LatencyIndicatorProps { rtt: number | null; variant?: LatencyIndicatorVariant; darkMode?: boolean; showUnit?: boolean; className?: string; style?: React.CSSProperties; }

const labelType = typography.label; const titleType = typography.titleM;

function getQualityColor(rtt: number | null) { if (rtt === null) return semanticColors.textFunctionalWarning; if (rtt <= 50) return semanticColors.textFunctionalSuccess; if (rtt <= 150) return semanticColors.textFunctionalWarning; return semanticColors.textFunctionalError; }

export const LatencyIndicator: React.FC<LatencyIndicatorProps> = ({ rtt, variant = "default", darkMode = false, showUnit = true, className, style }) => {
  const qualityColor = getQualityColor(rtt); const secondaryColor = darkMode ? colors.textBodyNeutralDark : colors.textBodyNeutral;
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: layout.gap2, ...style }} role="status" aria-label={rtt !== null ? `Latency ${rtt} milliseconds` : "Latency unavailable"}>
      <span style={{ fontFamily, fontSize: titleType.fontSize, fontWeight: titleType.fontWeight, lineHeight: `${titleType.lineHeight}px`, fontStretch: `${titleType.fontWidth}%`, letterSpacing: titleType.letterSpacing, fontVariantNumeric: "tabular-nums", color: qualityColor, fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>{rtt !== null ? rtt : "\u2014"}</span>
      {showUnit && <span style={{ fontFamily, fontSize: labelType.fontSize, lineHeight: `${labelType.lineHeight}px`, fontWeight: labelType.fontWeight, fontStretch: `${labelType.fontWidth}%`, color: secondaryColor, fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>ms</span>}
    </div>
  );
};
LatencyIndicator.displayName = "LatencyIndicator";
export default LatencyIndicator;
