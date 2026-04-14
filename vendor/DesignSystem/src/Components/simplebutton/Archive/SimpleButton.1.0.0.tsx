import React, { useState } from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../../tokens/design-tokens";

export interface SimpleButtonProps {
  children?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "outline";
  className?: string;
  style?: React.CSSProperties;
}

const btnType = typography.buttonM;

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

  if (disabled) {
    background =
      variant === "solid"
        ? semanticColors.backdropStatesDisabledSurface
        : "transparent";
    color = semanticColors.buttonTextDisabled;
    borderColor = semanticColors.strokeDisabled;
  } else if (pressed) {
    background =
      variant === "solid"
        ? semanticColors.buttonSurfaceSmallbuttonPressed
        : semanticColors.backdropOpacityAdaptiveOpacityDarkenedWeak;
    color = semanticColors.buttonTextButtonText;
    borderColor = semanticColors.buttonStrokeSubtleColour;
  } else if (hover) {
    background =
      variant === "solid"
        ? semanticColors.buttonSurfaceSmallbuttonHover
        : semanticColors.buttonSurfaceHoverTertiary;
    color = colors.textHeadingNeutral;
    borderColor = semanticColors.strokeMedium;
  } else {
    background =
      variant === "solid"
        ? semanticColors.buttonSurfaceSmallbuttonDefault
        : "transparent";
    color = colors.textHeadingNeutral;
    borderColor = semanticColors.strokeMedium;
  }

  const buttonStyle: React.CSSProperties = {
    fontFamily,
    fontSize: btnType.fontSize,
    fontWeight: btnType.fontWeight,
    lineHeight: `${btnType.lineHeight}px`,
    letterSpacing: btnType.letterSpacing,
    fontStretch: `${btnType.fontWidth}%`,
    paddingLeft: layout.paddingSubtle,
    paddingRight: layout.paddingSubtle,
    paddingTop: layout.gap8,
    paddingBottom: layout.gap8,
    borderRadius: layout.radiusS,
    border: `${layout.strokeS}px solid ${borderColor}`,
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
