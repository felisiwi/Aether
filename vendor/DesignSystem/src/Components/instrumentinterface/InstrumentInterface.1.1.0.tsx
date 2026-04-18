import React from "react";
import { OctaveSection } from "../octavesection/OctaveSection.1.2.0";
import { layout, semanticColors } from "../../tokens/design-tokens";

export interface InstrumentInterfaceProps {
  /** Leftmost visible octave (each tile is one octave). */
  octave: number;
  /** How many {@link OctaveSection} tiles to show. */
  octaveSpan?: number;
  minOctave?: number;
  maxOctave?: number;
  pressedNotes?: string[];
  variant?: "Piano" | "Keyboard";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Full-width keyboard: optional note-hint rows are omitted here (see `OctaveSection` / screen frames).
 * Octave navigation is handled by {@link KeyOctaveController} in the app shell.
 */
export const InstrumentInterface: React.FC<InstrumentInterfaceProps> = ({
  octave,
  octaveSpan = 2,
  minOctave = 1,
  maxOctave = 7,
  pressedNotes,
  variant = "Piano",
  className,
  style,
}) => {
  const span = Math.max(1, octaveSpan);
  const lastStart = maxOctave - span + 1;
  const clampedStart = Math.min(maxOctave, Math.max(minOctave, Math.min(octave, lastStart)));

  const root: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: layout.gap16,
    width: "100%",
    padding: layout.gap16,
    background: semanticColors.backdropNautralBackground,
    borderRadius: layout.radiusM,
    boxSizing: "border-box",
    ...style,
  };

  const keysRow: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: layout.gap8,
    width: "100%",
    minWidth: 0,
    justifyContent: "center",
  };

  return (
    <div className={className} style={root} role="group" aria-label="Instrument keyboard">
      <div style={keysRow}>
        {Array.from({ length: span }, (_, i) => (
          <OctaveSection
            key={clampedStart + i}
            octave={clampedStart + i}
            pressedNotes={pressedNotes}
            variant={variant}
            keyboardGroup={variant === "Keyboard" ? i : undefined}
          />
        ))}
      </div>
    </div>
  );
};

InstrumentInterface.displayName = "InstrumentInterface";
export default InstrumentInterface;
