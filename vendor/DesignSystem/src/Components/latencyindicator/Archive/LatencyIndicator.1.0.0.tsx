import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type LatencyIndicatorVariant = "default" | "colour" | "theme";

/** Quality tier thresholds in milliseconds. */
const GOOD_MS = 50;
const FAIR_MS = 150;

/**
 * Props for LatencyIndicator — shows WebRTC RTT in ms with
 * colour-coded quality (green/amber/red), updated ~1 Hz.
 */
export interface LatencyIndicatorProps {
  /** Round-trip time in milliseconds, or null when unavailable. */
  rtt: number | null;
  /** Visual variant. */
  variant?: LatencyIndicatorVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Show the "ms" unit label. */
  showUnit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;
const titleType = typography.titleM;

function getQualityColor(rtt: number | null): string {
  if (rtt === null) return semanticColors.textFunctionalWarning;
  if (rtt <= GOOD_MS) return semanticColors.textFunctionalSuccess;
  if (rtt <= FAIR_MS) return semanticColors.textFunctionalWarning;
  return semanticColors.textFunctionalError;
}

export const LatencyIndicator: React.FC<LatencyIndicatorProps> = ({
  rtt,
  variant = "default",
  darkMode = false,
  showUnit = true,
  className,
  style,
}) => {
  const qualityColor = getQualityColor(rtt);
  const secondaryColor = darkMode ? colors.textBodyNeutralDark : colors.textBodyNeutral;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.gap2,
    ...style,
  };

  const valueStyle: React.CSSProperties = {
    fontFamily,
    fontSize: titleType.fontSize,
    fontWeight: titleType.fontWeight,
    lineHeight: `${titleType.lineHeight}px`,
    fontStretch: `${titleType.fontWidth}%`,
    letterSpacing: titleType.letterSpacing,
    fontVariantNumeric: "tabular-nums",
    color: qualityColor,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const unitStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    lineHeight: `${labelType.lineHeight}px`,
    fontWeight: labelType.fontWeight,
    fontStretch: `${labelType.fontWidth}%`,
    color: secondaryColor,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <div
      className={className}
      style={containerStyle}
      role="status"
      aria-label={rtt !== null ? `Latency ${rtt} milliseconds` : "Latency unavailable"}
    >
      <span style={valueStyle}>{rtt !== null ? rtt : "\u2014"}</span>
      {showUnit && <span style={unitStyle}>ms</span>}
    </div>
  );
};

LatencyIndicator.displayName = "LatencyIndicator";
export default LatencyIndicator;
