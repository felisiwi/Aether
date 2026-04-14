import React from "react";
import PlayerHeader from "../playerheader/PlayerHeader.1.0.0";
import ChordDisplay from "../chorddisplay/ChordDisplay.2.1.0";
import type { ChordDisplayProps } from "../chorddisplay/ChordDisplay.2.1.0";
import { LatencyIndicator } from "../latencyindicator/LatencyIndicator.1.1.0";
import { layout } from "../../tokens/design-tokens";

export interface PlayerDisplayProps extends ChordDisplayProps {
  playerName: string;
  /** Optional instrument tag under the name (e.g. “Piano”). */
  instrument?: string;
  latency?: number | null;
}

function headerVariant(
  v: ChordDisplayProps["variant"],
): "colour" | "theme" {
  return v === "local" ? "colour" : "theme";
}

function latencyVariant(
  v: ChordDisplayProps["variant"],
): "colour" | "theme" {
  return v === "local" ? "colour" : "theme";
}

export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({
  playerName,
  instrument,
  latency,
  variant,
  chordName,
  notes,
  keyName,
  className,
  style,
}) => {
  const align = variant === "remote" ? "right" : "left";

  const col: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: variant === "remote" ? "flex-end" : "flex-start",
    gap: layout.gap16,
    minWidth: 0,
    ...style,
  };

  return (
    <section className={className} style={col} aria-label={`Player ${playerName}`}>
      <PlayerHeader
        name={playerName}
        instrument={instrument}
        variant={headerVariant(variant)}
        align={align}
        trailing={
          latency !== undefined ? (
            <LatencyIndicator
              rtt={latency ?? null}
              variant={latencyVariant(variant)}
            />
          ) : undefined
        }
      />
      <ChordDisplay
        variant={variant}
        chordName={chordName}
        notes={notes}
        keyName={keyName}
      />
    </section>
  );
};

PlayerDisplay.displayName = "PlayerDisplay";
export default PlayerDisplay;
