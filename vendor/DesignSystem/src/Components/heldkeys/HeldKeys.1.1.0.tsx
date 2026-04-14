import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
  themeTokens,
} from "../../tokens/design-tokens";

export type HeldKeysVariant = "local" | "remote";

export type HeldKeysSeparator = "dot" | "plus";

export interface HeldKeysProps {
  /** Pitch class / note labels for the active row (e.g. C, E, G). */
  notes: string[];
  /** Matches parent ChordDisplay / PlayerDisplay colourway. */
  variant: HeldKeysVariant;
  /** Between-note glyph; Figma uses both `·` and `+`. */
  separator?: HeldKeysSeparator;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

function separatorChar(sep: HeldKeysSeparator): string {
  return sep === "plus" ? "+" : "·";
}

function noteColor(v: HeldKeysVariant): string {
  return v === "local" ? colors.textHeadingColour : themeTokens.components.primary50;
}

function sepColor(v: HeldKeysVariant): string {
  return v === "local" ? colors.textBodyColour : themeTokens.components.primary40;
}

/**
 * Note indicator row only — labels separated by dots or plus signs. No chord or key name.
 */
export const HeldKeys: React.FC<HeldKeysProps> = ({
  notes,
  variant,
  separator = "dot",
  className,
  style,
}) => {
  const sep = separatorChar(separator);
  const nCol = noteColor(variant);
  const sCol = sepColor(variant);

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: layout.gap4,
    minWidth: 0,
    ...style,
  };

  const noteStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    color: nCol,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const sepStyle: React.CSSProperties = {
    ...noteStyle,
    color: sCol,
    fontWeight: labelType.fontWeight,
    paddingLeft: layout.gap2,
    paddingRight: layout.gap2,
  };

  if (notes.length === 0) {
    return (
      <div className={className} style={rowStyle} role="presentation" aria-label="Held notes">
        <span style={{ ...noteStyle, color: semanticColors.strokeStrong }}>—</span>
      </div>
    );
  }

  return (
    <div className={className} style={rowStyle} role="presentation" aria-label="Held notes">
      {notes.map((n, i) => (
        <React.Fragment key={`${n}-${i}`}>
          {i > 0 ? <span style={sepStyle}>{sep}</span> : null}
          <span style={noteStyle}>{n}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

HeldKeys.displayName = "HeldKeys";
export default HeldKeys;
