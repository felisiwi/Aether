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
  /** Semitone transpose offset passed to each octave (physical keys show sounded note). */
  noteOffset?: number;
  /** Mouse/touch down on a key tile (Keyboard variant). */
  onNoteOn?: (note: string) => void;
  /** Mouse/touch release or leave after a key press (Keyboard variant). */
  onNoteOff?: (note: string) => void;
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
  noteOffset,
  onNoteOn,
  onNoteOff,
  className,
  style,
}) => {
  const span = Math.max(1, octaveSpan);
  const lastStart = maxOctave - span + 1;
  const clampedStart = Math.min(maxOctave, Math.max(minOctave, Math.min(octave, lastStart)));

  const root: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: layout.gap4,
    width: "100%",
    minWidth: 1088,
    paddingTop: layout.gap16,
    paddingLeft: layout.gap16,
    paddingRight: layout.gap16,
    paddingBottom: 0,
    background: semanticColors.backdropNautralBackground,
    borderRadius: layout.radiusM,
    boxSizing: "border-box",
    ...style,
  };

  const keysRow: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: layout.gap4,
    width: "100%",
    minWidth: 0,
    justifyContent: "space-between",
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
            noteOffset={noteOffset}
            onNoteOn={onNoteOn}
            onNoteOff={onNoteOff}
          />
        ))}
      </div>
    </div>
  );
};

InstrumentInterface.displayName = "InstrumentInterface";
export default InstrumentInterface;
