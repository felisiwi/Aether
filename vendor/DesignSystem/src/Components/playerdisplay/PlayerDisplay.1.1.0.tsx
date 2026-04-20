import React from "react";
import PlayerInfo from "../playerinfo/PlayerInfo.1.1.0";
import ChordDisplay from "../chorddisplay/ChordDisplay.2.3.0";
import type { ChordDisplayNote, ChordDisplayProps } from "../chorddisplay/ChordDisplay.2.3.0";
import type { ThemeIndex } from "../../tokens/theme-map";
import { layout } from "../../tokens/design-tokens";

export interface PlayerDisplayProps {
  playerName: string;
  variant: "local" | "remote";
  instrument: string;
  latency: number | null;
  chordName?: string;
  notes?: string[];
  /** Remote player theme slot (0–3). Ignored when `variant` is `local`. */
  themeIndex?: ThemeIndex;
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
  themeIndex = 0,
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

  const chordVariant: ChordDisplayProps["variant"] =
    variant === "local" ? "default" : "themed";

  const chordNotes: ChordDisplayNote[] = notes.map((note) => ({
    note,
    type: "white",
  }));

  return (
    <section className={className} style={col} aria-label={`Player ${playerName}`}>
      <PlayerInfo
        playerName={playerName}
        instrument={instrument}
        latency={latency}
        variant={variant}
      />
      <ChordDisplay
        variant={chordVariant}
        chordName={chordName}
        notes={chordNotes}
        themeIndex={themeIndex}
      />
    </section>
  );
};

PlayerDisplay.displayName = "PlayerDisplay";
export default PlayerDisplay;
