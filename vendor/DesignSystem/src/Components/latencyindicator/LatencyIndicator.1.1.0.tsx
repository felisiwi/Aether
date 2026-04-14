import React from "react";
import {
  typography,
  fontFamily,
  semanticColors,
} from "../../tokens/design-tokens";

export type LatencyIndicatorVariant = "default" | "colour" | "theme";

const GOOD_MS = 50;
const FAIR_MS = 150;

export interface LatencyIndicatorProps {
  /** Round-trip time in milliseconds, or null when unavailable. */
  rtt: number | null;
  /** Reserved for future palette tweaks; compact readout uses quality colours only. */
  variant?: LatencyIndicatorVariant;
  darkMode?: boolean;
  /** When false, omits the `ms` suffix (value only). */
  showUnit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

function getQualityColor(rtt: number | null): string {
  if (rtt === null) return semanticColors.textFunctionalWarning;
  if (rtt <= GOOD_MS) return semanticColors.textFunctionalSuccess;
  if (rtt <= FAIR_MS) return semanticColors.strokeColourDark;
  return semanticColors.textFunctionalError;
}

/**
 * Compact inline latency readout (e.g. `28ms`) — single line, colour-coded by quality.
 */
export const LatencyIndicator: React.FC<LatencyIndicatorProps> = ({
  rtt,
  showUnit = true,
  className,
  style,
}) => {
  const qualityColor = getQualityColor(rtt);
  const text =
    rtt === null
      ? "—"
      : showUnit
        ? `${rtt}ms`
        : String(rtt);

  const inlineStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 0,
    whiteSpace: "nowrap",
    ...style,
  };

  const valueStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    letterSpacing: labelType.letterSpacing,
    fontVariantNumeric: "tabular-nums",
    color: qualityColor,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <span
      className={className}
      style={inlineStyle}
      role="status"
      aria-label={rtt !== null ? `Latency ${rtt} milliseconds` : "Latency unavailable"}
    >
      <span style={valueStyle}>{text}</span>
    </span>
  );
};

LatencyIndicator.displayName = "LatencyIndicator";
export default LatencyIndicator;
