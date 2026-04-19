import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  themeTokens,
} from "../../tokens/design-tokens";
import { THEME_KEYS } from "../../tokens/theme-map";

export interface NoteProps {
  note: string;
  partOfChord: boolean;
  size?: "large" | "small";
  variant?: "default" | "themed";
  themeIndex?: 0 | 1 | 2 | 3;
  className?: string;
  style?: React.CSSProperties;
}

export const Note: React.FC<NoteProps> = ({
  note,
  partOfChord,
  size = "large",
  variant = "default",
  themeIndex = 0,
  className,
  style,
}) => {
  const themeKey = THEME_KEYS[themeIndex ?? 0];

  let color: string;
  if (partOfChord) {
    color = semanticColors.semanticStrokeStaticStrokeWhiteSolid;
  } else if (variant === "themed") {
    color =
      size === "small"
        ? themeTokens[themeKey].primary20
        : colors.textBodyNeutral;
  } else if (size === "large") {
    color = colors.textBodyNeutral;
  } else {
    color = colors.textBodyColour;
  }

  const isLarge = size === "large";
  const type = isLarge ? typography.titleS : typography.label;

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: isLarge ? 20 : type.fontSize,
    fontWeight: 660,
    lineHeight: isLarge ? `${32}px` : `${type.lineHeight}px`,
    letterSpacing: type.letterSpacing,
    fontStretch: `${type.fontWidth}%`,
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
