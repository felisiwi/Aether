import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  themeTokens,
} from "../../tokens/design-tokens";
import { THEME_KEYS } from "../../tokens/theme-map";

export type NoteType = "white" | "orange" | "themed";

export interface NoteProps {
  note: string;
  type: NoteType;
  size?: "large" | "small";
  themeIndex?: 0 | 1 | 2 | 3;
  className?: string;
  style?: React.CSSProperties;
}

export const Note: React.FC<NoteProps> = ({
  note,
  type: noteType,
  size = "large",
  themeIndex = 0,
  className,
  style,
}) => {
  const themeKey = THEME_KEYS[themeIndex ?? 0];

  let color: string;
  if (noteType === "white") {
    color = semanticColors.semanticStrokeStaticStrokeWhiteSolid;
  } else if (noteType === "orange") {
    color = colors.textPressed;
  } else {
    color =
      size === "small"
        ? themeTokens[themeKey].primary20
        : themeTokens[themeKey].primary50;
  }

  const isLarge = size === "large";
  const textTypo = isLarge ? typography.titleS : typography.label;

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: isLarge ? 20 : textTypo.fontSize,
    fontWeight: 660,
    lineHeight: isLarge ? `${32}px` : `${textTypo.lineHeight}px`,
    letterSpacing: textTypo.letterSpacing,
    fontStretch: `${textTypo.fontWidth}%`,
    color,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
    background: "none",
    border: "none",
    ...style,
  };

  return (
    <span className={className} style={textStyle}>
      {note}
    </span>
  );
};

Note.displayName = "Note";
export default Note;
