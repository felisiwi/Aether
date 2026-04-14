import React from "react";
import { LatencyIndicator } from "../../latencyindicator/LatencyIndicator.1.1.0";
import {
  layout,
  typography,
  fontFamily,
  colors,
  semanticColors,
} from "../../../tokens/design-tokens";

export type PlayerInfoVariant = "local" | "remote";

export interface PlayerInfoProps {
  playerName: string;
  latency: number | null;
  instrument: string;
  variant: PlayerInfoVariant;
  className?: string;
  style?: React.CSSProperties;
}

const nameType = typography.titleS;

function nameColor(v: PlayerInfoVariant): string {
  return v === "local" ? colors.textHeadingColour : semanticColors.strokeTheme;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  playerName,
  latency,
  instrument,
  variant,
  className,
  style,
}) => {
  const row: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: layout.gap8,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    ...style,
  };

  const left: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: layout.gap8,
    minWidth: 0,
    flex: "1 1 auto",
  };

  const nameStyle: React.CSSProperties = {
    fontFamily,
    fontSize: nameType.fontSize,
    fontWeight: nameType.fontWeight,
    lineHeight: `${nameType.lineHeight}px`,
    fontStretch: `${nameType.fontWidth}%`,
    letterSpacing: nameType.letterSpacing,
    color: nameColor(variant),
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    whiteSpace: "nowrap",
  };

  const instStyle: React.CSSProperties = {
    fontFamily,
    fontSize: nameType.fontSize,
    fontWeight: nameType.fontWeight,
    lineHeight: `${nameType.lineHeight}px`,
    fontStretch: `${nameType.fontWidth}%`,
    letterSpacing: nameType.letterSpacing,
    color: colors.textBodyNeutral,
    textAlign: "right",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
  };

  return (
    <div className={className} style={row} role="group" aria-label={`Player ${playerName}`}>
      <div style={left}>
        <span style={nameStyle}>{playerName}</span>
        <LatencyIndicator rtt={latency} />
      </div>
      <span style={instStyle}>{instrument}</span>
    </div>
  );
};

PlayerInfo.displayName = "PlayerInfo";
export default PlayerInfo;
