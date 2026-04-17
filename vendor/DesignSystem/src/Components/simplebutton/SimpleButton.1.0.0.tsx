import React, { useState } from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export interface SimpleButtonProps {
  children?: React.ReactNode;
  /** Visible label when `children` omitted. */
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** `solid` = filled surface; `outline` = transparent fill, stroked. */
  variant?: "solid" | "outline";
  className?: string;
  style?: React.CSSProperties;
}

/** REST snapshot: label 10 / 16, ExtraBold 660 — Text Variable/Label. */
const labelType = typography.label;

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  label,
  onClick,
  disabled = false,
  variant = "solid",
  className,
  style,
}) => {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const content = children ?? label ?? "";

  let background: string;
  let color: string;
  let borderColor: string;
  let borderWidthPx: number;
  let paddingBottom: number = layout.gap4;
  const paddingTop = layout.gap4;
  const paddingX = layout.gap8;

  if (variant === "solid") {
    if (disabled) {
      background = semanticColors.backdropStatesDisabledSurface;
      color = colors.textDisabled;
      borderColor = semanticColors.strokeDisabled;
      borderWidthPx = 0;
    } else if (pressed) {
      background = semanticColors.backdropSurfaceColouredSurface;
      color = colors.textPressed;
      borderColor = semanticColors.strokeColourPressed;
      borderWidthPx = layout.strokeM;
      paddingBottom = layout.gap2;
    } else if (hover) {
      background = semanticColors.backdropSurfaceColouredSurface;
      color = colors.textHeadingNeutral;
      borderColor = semanticColors.strokeColourPressed;
      borderWidthPx = layout.strokeM;
      paddingBottom = layout.gap2;
    } else {
      background = semanticColors.backdropInvertedBackground;
      color = semanticColors.buttonTextButtonText;
      borderColor = "transparent";
      borderWidthPx = 0;
    }
  } else if (disabled) {
    background = "transparent";
    color = semanticColors.buttonTextDisabled;
    borderColor = semanticColors.strokeDisabled;
    borderWidthPx = layout.strokeS;
  } else if (pressed) {
    background = semanticColors.backdropOpacityAdaptiveOpacityDarkenedWeak;
    color = semanticColors.buttonTextButtonText;
    borderColor = semanticColors.buttonStrokeSubtleColour;
    borderWidthPx = layout.strokeS;
  } else if (hover) {
    background = semanticColors.buttonSurfaceHoverTertiary;
    color = colors.textHeadingNeutral;
    borderColor = semanticColors.strokeMedium;
    borderWidthPx = layout.strokeS;
  } else {
    background = "transparent";
    color = colors.textHeadingNeutral;
    borderColor = semanticColors.strokeMedium;
    borderWidthPx = layout.strokeS;
  }

  const buttonStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: 660,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    paddingLeft: paddingX,
    paddingRight: paddingX,
    paddingTop,
    paddingBottom,
    borderRadius: layout.radiusS,
    border:
      borderWidthPx > 0
        ? `${borderWidthPx}px solid ${borderColor}`
        : "none",
    background,
    color,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.72 : 1,
    boxSizing: "border-box",
    ...style,
  };

  return (
    <button
      type="button"
      className={className}
      style={buttonStyle}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {content}
    </button>
  );
};

SimpleButton.displayName = "SimpleButton";
export default SimpleButton;
