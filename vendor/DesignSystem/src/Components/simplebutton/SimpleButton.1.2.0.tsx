import React, { useState } from "react";
import Icon from "../icon/Icon.1.2.0";
import type { IconName } from "../icon/icon-names";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type SimpleButtonState = "active" | "pressed" | "default";

export interface SimpleButtonProps {
  children?: React.ReactNode;
  label?: string;
  iconName?: IconName;
  showIcon?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  /** Ignored when `disabled` is true. */
  state?: SimpleButtonState;
  /** Use when icon-only (no visible `label`/children) so the button has an accessible name. */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

type StateStyle = {
  background: string;
  color: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
};

/** 40px tall row: 32px icon; equal vertical padding uses `layout.gap4`. */
function getStateStyle(disabled: boolean, state: SimpleButtonState): StateStyle {
  const hPad = layout.gap8;
  const vPadEqual = layout.gap4;

  if (disabled) {
    return {
      background: semanticColors.backdropStatesDisabledSurface,
      color: colors.textDisabled,
      paddingTop: vPadEqual,
      paddingBottom: vPadEqual,
      paddingLeft: hPad,
      paddingRight: hPad,
    };
  }
  if (state === "default") {
    return {
      background: semanticColors.backdropStaticBlack,
      color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
      paddingTop: vPadEqual,
      paddingBottom: vPadEqual,
      paddingLeft: hPad,
      paddingRight: hPad,
    };
  }
  if (state === "pressed") {
    return {
      background: semanticColors.buttonSurfaceSmallbuttonPressed,
      // White on dark orange meets WCAG; token `buttonTextDisabledTextColour` fails contrast on this fill.
      color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
      paddingTop: layout.gap8,
      paddingBottom: 0,
      paddingLeft: hPad,
      paddingRight: hPad,
    };
  }
  return {
    background: semanticColors.buttonSurfacePrimary,
    color: colors.textLabel,
    paddingTop: vPadEqual,
    paddingBottom: vPadEqual,
    paddingLeft: hPad,
    paddingRight: hPad,
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
  ariaLabel,
  className,
  style,
}) => {
  const content = children ?? label ?? "";
  const hasVisibleText =
    typeof content === "string"
      ? content.length > 0
      : Boolean(content);
  const tokens = getStateStyle(disabled, state);
  const [isPressed, setIsPressed] = useState(false);
  const showPressScale = isPressed && !disabled;

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: layout.gap8,
        minHeight: layout.gap40,
        minWidth: 0,
        paddingTop: tokens.paddingTop,
        paddingBottom: tokens.paddingBottom,
        paddingLeft: tokens.paddingLeft,
        paddingRight: tokens.paddingRight,
        borderRadius: layout.radiusM,
        border: "none",
        background: tokens.background,
        color: tokens.color,
        cursor: disabled ? "not-allowed" : "pointer",
        boxSizing: "border-box",
        transform: showPressScale ? "scale(0.92)" : "scale(1)",
        transition: showPressScale
          ? "transform 80ms ease-in"
          : "transform 120ms ease-out",
        ...style,
      }}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => {
        if (!disabled) setIsPressed(true);
      }}
      onPointerUp={() => setIsPressed(false)}
      onPointerCancel={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
    >
      {showIcon ? <Icon name={iconName} size={32} color={tokens.color} /> : null}
      {hasVisibleText ? (
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
      ) : null}
    </button>
  );
};

SimpleButton.displayName = "SimpleButton";
export default SimpleButton;
