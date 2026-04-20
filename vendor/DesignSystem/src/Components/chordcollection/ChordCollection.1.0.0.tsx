import React from "react";
import Icon from "../icon/Icon.1.2.0";
import type { IconName } from "../icon/icon-names";
import { ChordHint } from "../chordhint/ChordHint.1.5.0";
import { layout, semanticColors } from "../../tokens/design-tokens";

export type ChordCollectionType = "general" | "resolve" | "tension" | "move";

export interface ChordCollectionHint {
  chordName: string;
  missingNotes: string[];
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export interface ChordCollectionProps {
  type: ChordCollectionType;
  hints: ChordCollectionHint[];
  className?: string;
  style?: React.CSSProperties;
}

const TYPE_TO_ICON: Record<ChordCollectionType, IconName> = {
  general: "music-notes-plus",
  resolve: "arrow-u-up-left",
  tension: "arrows-out-line-horizontal",
  move: "shuffle",
};

const MAX_HINTS = 3;

export const ChordCollection: React.FC<ChordCollectionProps> = ({
  type,
  hints,
  className,
  style,
}) => {
  const visibleHints = hints.slice(0, MAX_HINTS);
  const isGeneral = type === "general";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: layout.gap8,
        ...style,
      }}
    >
      <Icon
        name={TYPE_TO_ICON[type]}
        size={16}
        color={semanticColors.semanticStrokeStaticStrokeWhiteSolid}
      />
      {visibleHints.map((hint, index) => (
        <ChordHint
          key={`${hint.chordName}-${index}`}
          chordName={hint.chordName}
          missingNotes={hint.missingNotes}
          expanded={isGeneral}
          onHoverStart={hint.onHoverStart}
          onHoverEnd={hint.onHoverEnd}
        />
      ))}
    </div>
  );
};

ChordCollection.displayName = "ChordCollection";
export default ChordCollection;
