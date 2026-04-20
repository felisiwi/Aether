import React, { useMemo } from "react";
import { colors, fontFamily, layout, semanticColors, typography } from "../../tokens/design-tokens";

export interface ChordHintProps {
  chordName: string;
  missingNotes: string[];
  expanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

const STYLE = `
.chord-hint-notes {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  opacity: 0;
  max-width: 0;
  transition: opacity 200ms ease, max-width 200ms ease;
  white-space: nowrap;
}
.chord-hint:hover .chord-hint-notes {
  opacity: 1;
  max-width: 200px;
}
.chord-hint-expanded .chord-hint-notes {
  opacity: 1;
  max-width: 200px;
}
`;

if (typeof document !== "undefined" && !document.getElementById("chord-hint-style")) {
  const s = document.createElement("style");
  s.id = "chord-hint-style";
  s.textContent = STYLE;
  document.head.appendChild(s);
}

/**
 * Chord hint chip with collapsed (label only) and expanded (label + missing notes) states.
 * Snapshot: ChordHints 15557:372209.
 * v1.4.0: CSS :hover / .chord-hint-expanded — no React hover state (avoids parent re-render resets).
 * v1.5.0: optional onHoverStart / onHoverEnd on root (alongside CSS hover).
 */
export const ChordHint: React.FC<ChordHintProps> = ({
  chordName,
  missingNotes,
  expanded = false,
  className,
  style,
  onHoverStart,
  onHoverEnd,
}) => {
  const notes = useMemo(() => missingNotes.slice(0, 2), [missingNotes]);

  const chordStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.label.fontSize,
    lineHeight: `${typography.label.lineHeight}px`,
    letterSpacing: typography.label.letterSpacing,
    fontWeight: typography.label.fontWeight,
    fontStretch: `${typography.label.fontWidth}%`,
    color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
    whiteSpace: "nowrap",
  };

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: layout.gap8,
    minWidth: 0,
    cursor: "default",
    userSelect: "none" as const,
    ...style,
  };

  const noteStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.bodyS.fontSize,
    lineHeight: `${typography.bodyS.lineHeight}px`,
    letterSpacing: typography.bodyS.letterSpacing,
    fontWeight: 400,
    color: colors.textPressed,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
    whiteSpace: "nowrap",
  };

  return (
    <div
      className={`chord-hint${expanded ? " chord-hint-expanded" : ""}${className ? ` ${className}` : ""}`}
      style={wrapperStyle}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <span style={chordStyle}>{chordName}</span>
      <div className="chord-hint-notes">
        {notes.map((n, i) => (
          <span key={`${n}-${i}`} style={noteStyle}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
};

ChordHint.displayName = "ChordHint";
export default ChordHint;
