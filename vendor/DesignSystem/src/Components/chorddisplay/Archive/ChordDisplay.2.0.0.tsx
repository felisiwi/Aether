import React from "react";
import { HeldKeys } from "../heldkeys/HeldKeys.1.0.0";
import type { HeldKeysProps } from "../heldkeys/HeldKeys.1.0.0";
import { layout, semanticColors } from "../../tokens/design-tokens";

export type ChordDisplayVariant = "local" | "remote";

export interface ChordDisplayProps extends HeldKeysProps {
  /** Local player (orange / colour) vs remote (purple / theme). */
  variant: ChordDisplayVariant;
}

function borderForVariant(v: ChordDisplayVariant): string {
  if (v === "local") return semanticColors.strokeColour;
  return semanticColors.strokeTheme;
}

/**
 * Framed chord card: {@link HeldKeys} content with a border coloured for local (orange stroke) vs remote (theme stroke).
 */
export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  variant,
  chordName,
  notes,
  keyName,
  className,
  style,
}) => {
  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: layout.gap24,
    borderRadius: layout.radiusS,
    borderWidth: layout.strokeS,
    borderStyle: "solid",
    borderColor: borderForVariant(variant),
    boxSizing: "border-box",
    minWidth: 0,
    ...style,
  };

  return (
    <div className={className} style={containerStyle} role="region" aria-label="Chord display">
      <HeldKeys chordName={chordName} notes={notes} keyName={keyName} />
    </div>
  );
};

ChordDisplay.displayName = "ChordDisplay";
export default ChordDisplay;
