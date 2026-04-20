import React, { useMemo, useState } from "react";
import { fontFamily, layout, semanticColors, typography } from "../../tokens/design-tokens";

export interface ChordHintProps {
  chordName: string;
  missingNotes: string[];
  expanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Chord hint chip with collapsed (label only) and expanded (label + missing notes) states.
 * Snapshot: ChordHints 15557:372209.
 */
export const ChordHint: React.FC<ChordHintProps> = ({
  chordName,
  missingNotes,
  expanded = false,
  className,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const effectiveExpanded = expanded || isHovered;
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
    ...style,
  };

  const noteWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: layout.gap8,
    overflow: "hidden",
    opacity: effectiveExpanded ? 1 : 0,
    maxHeight: effectiveExpanded ? layout.gap32 : 0,
    maxWidth: effectiveExpanded ? undefined : 0,
    transition: "opacity 300ms ease, max-height 300ms ease, max-width 300ms ease",
  };

  const noteStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.bodyS.fontSize,
    lineHeight: `${typography.bodyS.lineHeight}px`,
    letterSpacing: typography.bodyS.letterSpacing,
    fontWeight: 400,
    color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
    whiteSpace: "nowrap",
  };

  return (
    <div
      className={className}
      style={wrapperStyle}
      onMouseEnter={expanded ? undefined : () => setIsHovered(true)}
      onMouseLeave={expanded ? undefined : () => setIsHovered(false)}
    >
      <span style={chordStyle}>{chordName}</span>
      <div aria-hidden={!effectiveExpanded} style={noteWrapperStyle}>
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
