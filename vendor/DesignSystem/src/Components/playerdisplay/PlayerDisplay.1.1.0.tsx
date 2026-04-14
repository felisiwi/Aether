import React from "react";
import PlayerInfo from "../playerinfo/PlayerInfo.1.1.0";
import ChordDisplay from "../chorddisplay/ChordDisplay.2.3.0";
import type { ChordDisplayProps } from "../chorddisplay/ChordDisplay.2.3.0";
import { layout } from "../../tokens/design-tokens";

export interface PlayerDisplayProps {
  playerName: string;
  variant: ChordDisplayProps["variant"];
  instrument: string;
  latency: number | null;
  chordName?: string;
  notes?: string[];
  keyName?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * One player column: {@link PlayerInfo} above {@link ChordDisplay}.
 */
export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({
  playerName,
  variant,
  instrument,
  latency,
  chordName = "",
  notes = [],
  keyName = "",
  className,
  style,
}) => {
  const col: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: layout.gap16,
    minWidth: 0,
    ...style,
  };

  return (
    <section className={className} style={col} aria-label={`Player ${playerName}`}>
      <PlayerInfo
        playerName={playerName}
        instrument={instrument}
        latency={latency}
        variant={variant}
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
