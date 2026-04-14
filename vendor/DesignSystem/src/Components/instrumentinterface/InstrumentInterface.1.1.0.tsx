import React from "react";
import { OctaveSection } from "../octavesection/OctaveSection.1.2.0";
import {
  typography,
  fontFamily,
  colors,
  layout,
  semanticColors,
} from "../../tokens/design-tokens";

export interface InstrumentInterfaceProps {
  /** Leftmost visible octave (each tile is one octave). */
  octave: number;
  onOctaveChange: (value: number) => void;
  /** How many {@link OctaveSection} tiles to show. */
  octaveSpan?: number;
  minOctave?: number;
  maxOctave?: number;
  pressedNotes?: string[];
  variant?: "Piano" | "Keyboard";
  className?: string;
  style?: React.CSSProperties;
}

const chevronType = typography.titleM;

/**
 * Full-width keyboard: optional note-hint rows are omitted here (see `OctaveSection` / screen frames).
 * Octave navigation (‹ ›) sits on the far left and right of the tiled octave strip.
 */
export const InstrumentInterface: React.FC<InstrumentInterfaceProps> = ({
  octave,
  onOctaveChange,
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
  const canDec = clampedStart > minOctave;
  const canInc = clampedStart < lastStart;

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
    flex: "1 1 auto",
    minWidth: 0,
    justifyContent: "center",
  };

  const arrowBtn = (dir: "left" | "right"): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: layout.gap48,
    minHeight: layout.gap96,
    padding: 0,
    border: `${layout.strokeS}px solid ${semanticColors.strokeMedium}`,
    borderRadius: layout.radiusS,
    background: semanticColors.backdropNautralBackground,
    cursor: dir === "left" ? (canDec ? "pointer" : "not-allowed") : canInc ? "pointer" : "not-allowed",
    opacity: dir === "left" ? (canDec ? 1 : 0.45) : canInc ? 1 : 0.45,
    flex: "0 0 auto",
  });

  const glyph: React.CSSProperties = {
    fontFamily,
    fontSize: chevronType.fontSize,
    fontWeight: chevronType.fontWeight,
    lineHeight: `${chevronType.lineHeight}px`,
    color: colors.textHeadingNeutral,
  };

  return (
    <div className={className} style={root} role="group" aria-label="Instrument keyboard">
      <button
        type="button"
        style={arrowBtn("left")}
        disabled={!canDec}
        aria-label="Show lower octaves"
        onClick={() => canDec && onOctaveChange(clampedStart - 1)}
      >
        <span style={glyph} aria-hidden>
          ‹
        </span>
      </button>

      <div style={keysRow}>
        {Array.from({ length: span }, (_, i) => (
          <OctaveSection
            key={clampedStart + i}
            octave={clampedStart + i}
            pressedNotes={pressedNotes}
            variant={variant}
          />
        ))}
      </div>

      <button
        type="button"
        style={arrowBtn("right")}
        disabled={!canInc}
        aria-label="Show higher octaves"
        onClick={() => canInc && onOctaveChange(clampedStart + 1)}
      >
        <span style={glyph} aria-hidden>
          ›
        </span>
      </button>
    </div>
  );
};

InstrumentInterface.displayName = "InstrumentInterface";
export default InstrumentInterface;
