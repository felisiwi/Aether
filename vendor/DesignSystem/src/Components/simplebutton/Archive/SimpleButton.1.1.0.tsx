import React from "react";
import Icon from "../icon/Icon.1.2.0";
import type { IconName } from "../icon/icon-names";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export interface SimpleButtonProps {
  children?: React.ReactNode;
  label?: string;
  iconName?: IconName;
  showIcon?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  state?: "active" | "default" | "pressed";
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

function getStateTokens(
  disabled: boolean,
  state: "active" | "default" | "pressed",
): { background: string; color: string; borderColor: string } {
  if (disabled) {
    return {
      background: semanticColors.backdropStatesDisabledSurface,
      color: colors.textDisabled,
      borderColor: semanticColors.strokeDisabled,
    };
  }
  if (state === "default") {
    return {
      background: semanticColors.backdropInvertedBackground,
      color: semanticColors.backdropStaticWhite,
      borderColor: semanticColors.backdropInvertedBackground,
    };
  }
  if (state === "pressed") {
    return {
      background: semanticColors.backdropSurfaceColouredSurface,
      color: colors.textPressed,
      borderColor: semanticColors.strokeColourPressed,
    };
  }
  return {
    background: semanticColors.backdropSurfaceColouredSurface,
    color: colors.textHeadingNeutral,
    borderColor: semanticColors.backdropSurfaceColouredSurface,
  };
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  label,
  iconName = "waveform-sine",
  showIcon = true,
  onClick,
  disabled = false,
  state = "active",
  className,
  style,
}) => {
  const content = children ?? label ?? "";
  const tokens = getStateTokens(disabled, state);

  return (
    <button
      type="button"
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: layout.gap4,
        minHeight: layout.gap40,
        paddingLeft: layout.gap8,
        paddingRight: layout.gap8,
        paddingTop: layout.gap4,
        paddingBottom: layout.gap4,
        borderRadius: layout.radiusS,
        border: `${layout.strokeS}px solid ${tokens.borderColor}`,
        background: tokens.background,
        color: tokens.color,
        cursor: disabled ? "not-allowed" : "pointer",
        boxSizing: "border-box",
        ...style,
      }}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {showIcon ? <Icon name={iconName} size={32} color={tokens.color} /> : null}
      <span
        style={{
          fontFamily,
          fontSize: labelType.fontSize,
          fontWeight: labelType.fontWeight,
          lineHeight: `${labelType.lineHeight}px`,
          letterSpacing: labelType.letterSpacing,
          fontStretch: `${labelType.fontWidth}%`,
          color: tokens.color,
          fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
          whiteSpace: "nowrap",
        }}
      >
        {content}
      </span>
    </button>
  );
};

SimpleButton.displayName = "SimpleButton";
export default SimpleButton;
