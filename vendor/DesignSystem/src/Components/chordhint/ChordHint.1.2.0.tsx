import React, { useMemo, useState } from "react";
import { colors, fontFamily, layout, semanticColors, typography } from "../../tokens/design-tokens";

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
 * v1.2.0: width/opacity transition for hover; missing notes use colors.textPressed.
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
    cursor: "default",
    userSelect: "none" as const,
    ...style,
  };

  const noteWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: effectiveExpanded ? layout.gap8 : 0,
    overflow: "hidden",
    opacity: effectiveExpanded ? 1 : 0,
    width: effectiveExpanded ? "auto" : 0,
    minWidth: 0,
    transition: "opacity 200ms ease, width 200ms ease",
    whiteSpace: "nowrap",
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
