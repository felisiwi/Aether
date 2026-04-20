import React from "react";
import {
  typography,
  fontFamily,
  semanticColors,
  layout,
  themeTokens,
} from "../../tokens/design-tokens";
import { THEME_KEYS } from "../../tokens/theme-map";

export interface TagProps {
  label: string;
  variant?: "default" | "themed";
  themeIndex?: 0 | 1 | 2 | 3;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

export const Tag: React.FC<TagProps> = ({
  label,
  variant = "default",
  themeIndex = 0,
  className,
  style,
}) => {
  const themeKey = THEME_KEYS[themeIndex ?? 0];
  const textColor =
    variant === "themed"
      ? themeTokens[themeKey].primary60
      : semanticColors.semanticStrokeStaticStrokeBlackSolid;

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: 660,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    color: textColor,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: layout.gap4,
        paddingBottom: layout.gap4,
        paddingLeft: layout.gap8,
        paddingRight: layout.gap8,
        borderRadius: layout.radiusS,
        background: semanticColors.backdropStaticWhite,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <span style={textStyle}>{label}</span>
    </div>
  );
};

Tag.displayName = "Tag";
export default Tag;
