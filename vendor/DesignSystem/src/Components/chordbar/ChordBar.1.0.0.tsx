import React from "react";
import { layout } from "../../tokens/design-tokens";
import { ChordCollection, type ChordCollectionHint } from "../chordcollection/ChordCollection.1.0.0";

export interface ChordBarProps {
  resolveHints: ChordCollectionHint[];
  tensionHints: ChordCollectionHint[];
  moveHints: ChordCollectionHint[];
  className?: string;
  style?: React.CSSProperties;
}

export const ChordBar: React.FC<ChordBarProps> = ({
  resolveHints,
  tensionHints,
  moveHints,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: layout.gap16,
        ...style,
      }}
    >
      <ChordCollection type="resolve" hints={resolveHints} />
      <ChordCollection type="tension" hints={tensionHints} />
      <ChordCollection type="move" hints={moveHints} />
    </div>
  );
};

ChordBar.displayName = "ChordBar";
export default ChordBar;
