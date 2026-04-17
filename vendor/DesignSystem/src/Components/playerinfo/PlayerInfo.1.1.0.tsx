import React from "react";
import {
  layout,
  typography,
  fontFamily,
  colors,
  themeTokens,
} from "../../tokens/design-tokens";

export type PlayerInfoVariant = "local" | "remote";

export interface PlayerInfoProps {
  playerName: string;
  latency: number | null;
  instrument: string;
  variant: PlayerInfoVariant;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

function textColor(v: PlayerInfoVariant): string {
  return v === "local" ? colors.textHeadingNeutral : themeTokens.purple.primary50;
}

function formatLatency(latency: number | null): string {
  if (latency === null || Number.isNaN(latency)) return "(--)";
  return `(${Math.round(latency)}ms)`;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  playerName,
  latency,
  instrument,
  variant,
  className,
  style,
}) => {
  const tone = textColor(variant);
  const baseLabel: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    color: tone,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: layout.gap8,
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        ...style,
      }}
      role="group"
      aria-label={`Player ${playerName}`}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: layout.gap8,
          minWidth: 0,
          flex: "1 1 auto",
        }}
      >
        <span style={{ ...baseLabel, textTransform: "uppercase" }}>{playerName}</span>
        <span style={baseLabel}>{formatLatency(latency)}</span>
      </div>
      <span style={{ ...baseLabel, textAlign: "right", flex: "0 0 auto" }}>{instrument}</span>
    </div>
  );
};

PlayerInfo.displayName = "PlayerInfo";
export default PlayerInfo;
