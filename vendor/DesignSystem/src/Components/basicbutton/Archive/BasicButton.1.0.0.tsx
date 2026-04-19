import React, { useCallback, useId, useState } from 'react';
import {
  typography as typographyTokens,
  fontFamily,
  colors as colorTokens,
} from '../../tokens/design-tokens';
import Icon from '../icon/Icon.1.1.0';
import type { IconName } from '../icon/icon-names';

/**
 * BasicButton v1.0.0 — Figma **Basic/Buttons** (`13669:55650`).
 * Only **Fixed state=False** variants are modeled (fixed=True is for separate Figma pages).
 * Ignores **Add component** / **.PlaceholderSmall** (hidden in file).
 *
 * Interaction (prototype):
 * - **Latching function=False:** pressed appearance while pointer is down (`pointerup` / `leave` / `cancel` clears).
 * - **Latching function=True:** each **click** toggles latched pressed appearance.
 * Figma transition ~1250ms SLOW; CSS uses ~200ms for snappier UI (see README).
 *
 * Icon: nested **Icon** via `iconName` + `color` synced to label text (no hardcoded SVG).
 */
export type BasicButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'subtle';
export type BasicButtonSize = 'small' | 'large';

const ORANGE = colorTokens.textHeadingColour;
const PEACH_PRESSED = 'rgb(253, 225, 216)';
const FOCUS_RING = 'rgb(0, 123, 128)';
const BLACK = colorTokens.textHeadingNeutral;
const WHITE = '#ffffff';
const TERTIARY_BORDER = 'rgb(163, 50, 0)';
const SUBTLE_BORDER = 'rgba(0, 0, 0, 0.08)';
const DISABLED_STROKE = 'rgba(0, 0, 0, 0.12)';

type Phase = 'active' | 'pressed' | 'disabled' | 'disabledPressed';

type SurfaceStyle = {
  background: string;
  borderColor: string;
  borderWidth: number;
  color: string;
};

function surface(
  variant: BasicButtonVariant,
  colourFill: boolean,
  phase: Phase,
): SurfaceStyle {
  const disabledText = colorTokens.textDisabled;
  const body = colorTokens.textBodyNeutral;

  if (phase === 'disabled' || phase === 'disabledPressed') {
    const bw = phase === 'disabledPressed' ? 3 : 2;
    if (variant === 'primary') {
      if (!colourFill) {
        return {
          background: WHITE,
          borderColor: DISABLED_STROKE,
          borderWidth: bw,
          color: disabledText,
        };
      }
      return {
        background: `color-mix(in srgb, ${ORANGE} 22%, ${WHITE})`,
        borderColor: DISABLED_STROKE,
        borderWidth: bw,
        color: disabledText,
      };
    }
    if (variant === 'secondary' || variant === 'tertiary') {
      return {
        background: WHITE,
        borderColor: DISABLED_STROKE,
        borderWidth: bw,
        color: disabledText,
      };
    }
    return {
      background: WHITE,
      borderColor: DISABLED_STROKE,
      borderWidth: bw,
      color: disabledText,
    };
  }

  if (variant === 'primary') {
    if (!colourFill) {
      if (phase === 'pressed') {
        return {
          background: PEACH_PRESSED,
          borderColor: ORANGE,
          borderWidth: 3,
          color: BLACK,
        };
      }
      return {
        background: WHITE,
        borderColor: ORANGE,
        borderWidth: 2,
        color: BLACK,
      };
    }
    if (phase === 'pressed') {
      return {
        background: `color-mix(in srgb, ${BLACK} 14%, ${ORANGE})`,
        borderColor: ORANGE,
        borderWidth: 3,
        color: BLACK,
      };
    }
    return {
      background: ORANGE,
      borderColor: ORANGE,
      borderWidth: 2,
      color: BLACK,
    };
  }

  if (variant === 'secondary') {
    if (!colourFill) {
      if (phase === 'pressed') {
        return {
          background: 'rgb(245, 245, 245)',
          borderColor: BLACK,
          borderWidth: 3,
          color: BLACK,
        };
      }
      return {
        background: WHITE,
        borderColor: BLACK,
        borderWidth: 2,
        color: BLACK,
      };
    }
    if (phase === 'pressed') {
      return {
        background: 'rgb(51, 51, 51)',
        borderColor: BLACK,
        borderWidth: 3,
        color: WHITE,
      };
    }
    return {
      background: BLACK,
      borderColor: BLACK,
      borderWidth: 2,
      color: WHITE,
    };
  }

  if (variant === 'tertiary') {
    if (!colourFill) {
      if (phase === 'pressed') {
        return {
          background: PEACH_PRESSED,
          borderColor: TERTIARY_BORDER,
          borderWidth: 3,
          color: TERTIARY_BORDER,
        };
      }
      return {
        background: WHITE,
        borderColor: TERTIARY_BORDER,
        borderWidth: 2,
        color: TERTIARY_BORDER,
      };
    }
    if (phase === 'pressed') {
      return {
        background: `color-mix(in srgb, ${BLACK} 18%, ${TERTIARY_BORDER})`,
        borderColor: TERTIARY_BORDER,
        borderWidth: 3,
        color: WHITE,
      };
    }
    return {
      background: TERTIARY_BORDER,
      borderColor: TERTIARY_BORDER,
      borderWidth: 2,
      color: WHITE,
    };
  }

  if (!colourFill) {
    if (phase === 'pressed') {
      return {
        background: 'rgba(0,0,0,0.04)',
        borderColor: 'rgba(0,0,0,0.14)',
        borderWidth: 3,
        color: body,
      };
    }
    return {
      background: WHITE,
      borderColor: SUBTLE_BORDER,
      borderWidth: 2,
      color: body,
    };
  }
  if (phase === 'pressed') {
    return {
      background: 'rgba(0,0,0,0.12)',
      borderColor: 'rgba(0,0,0,0.2)',
      borderWidth: 3,
      color: body,
    };
  }
  return {
    background: 'rgba(0,0,0,0.06)',
    borderColor: SUBTLE_BORDER,
    borderWidth: 2,
    color: body,
  };
}

const typo = typographyTokens as Record<string, { fontSize: number; lineHeight: number }>;

function textMetrics(size: BasicButtonSize) {
  const key = size === 'small' ? 'Button-S' : 'Button-M';
  const t = typo[key] ?? { fontSize: 14, lineHeight: 28 };
  return {
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    fontVariationSettings: "'wdth' 108",
    fontWeight: 600 as const,
  };
}

function iconSizeForButton(size: BasicButtonSize): 16 | 24 {
  return size === 'small' ? 16 : 24;
}

/** Outer frame + inner TextWrapper from snapshot → 8+8 horizontal, 4+4 vertical */
const PAD_X = 16;
const PAD_Y = 8;
const ROW_GAP = 10;
const RADIUS = 16;
const TRANSITION =
  'background-color 200ms ease, color 200ms ease, border-color 200ms ease, border-width 120ms ease, box-shadow 200ms ease';

export interface BasicButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: BasicButtonVariant;
  size?: BasicButtonSize;
  /** Figma "Colour fill": false = outline style, true = solid fill (per type). */
  colourFill?: boolean;
  /** Figma "Inside wrapper": min 44×44 touch target. */
  insideWrapper?: boolean;
  /** Figma "Latching function": true = toggle pressed on click; false = pressed only while pointer down. */
  latching?: boolean;
  showText?: boolean;
  showIcon?: boolean;
  /** Required when `showIcon` is true. Renders nested **Icon**. */
  iconName?: IconName;
  type?: 'button' | 'submit' | 'reset';
  /** Visual **Disabled pressed** variant (Figma state); only applies when `disabled` is true. */
  disabledPressed?: boolean;
}

export default function BasicButton({
  variant = 'primary',
  size = 'small',
  colourFill = false,
  insideWrapper = false,
  latching = false,
  showText = true,
  showIcon = false,
  iconName = 'close',
  disabled = false,
  children = 'Button',
  className,
  style,
  type = 'button',
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onFocus,
  onBlur,
  disabledPressed = false,
  ...rest
}: BasicButtonProps) {
  const labelId = useId();
  const [pointerDown, setPointerDown] = useState(false);
  const [latched, setLatched] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const showPressed = !disabled && (latching ? latched : pointerDown);

  let phase: Phase = 'active';
  if (disabled) {
    phase = disabledPressed ? 'disabledPressed' : 'disabled';
  } else if (showPressed) {
    phase = 'pressed';
  }

  const surf = surface(variant, colourFill, phase);
  const tm = textMetrics(size);
  const iSize = iconSizeForButton(size);

  const focusBoxShadow =
    !disabled && focusVisible ? `0 0 0 3px ${FOCUS_RING}` : 'none';

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if (!latching) setPointerDown(true);
    },
    [disabled, latching, onPointerDown],
  );

  const clearPointer = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      if (!latching) setPointerDown(false);
    },
    [latching, onPointerUp],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      if (!latching) setPointerDown(false);
    },
    [latching, onPointerLeave],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      if (latching) setLatched((v) => !v);
    },
    [disabled, latching, onClick],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      onFocus?.(e);
      requestAnimationFrame(() => {
        if (e.currentTarget.matches(':focus-visible')) setFocusVisible(true);
      });
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      onBlur?.(e);
      setFocusVisible(false);
    },
    [onBlur],
  );

  const onlyIcon = showIcon && !showText;
  if (onlyIcon && !rest['aria-label'] && !rest['aria-labelledby']) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('BasicButton: icon-only buttons should set aria-label or aria-labelledby.');
    }
  }

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerUp={clearPointer}
      onPointerCancel={clearPointer}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-labelledby={showText ? labelId : rest['aria-labelledby']}
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ROW_GAP,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
        paddingTop: PAD_Y,
        paddingBottom: PAD_Y,
        minWidth: insideWrapper ? 44 : undefined,
        minHeight: insideWrapper ? 44 : undefined,
        boxSizing: 'border-box',
        borderRadius: RADIUS,
        borderStyle: 'solid',
        borderWidth: surf.borderWidth,
        borderColor: surf.borderColor,
        backgroundColor: surf.background,
        color: surf.color,
        fontFamily,
        fontSize: tm.fontSize,
        lineHeight: `${tm.lineHeight}px`,
        fontWeight: tm.fontWeight,
        fontVariationSettings: tm.fontVariationSettings,
        fontFeatureSettings: "'ss01', 'lnum', 'tnum'",
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: TRANSITION,
        WebkitTapHighlightColor: 'transparent',
        boxShadow: focusBoxShadow,
        outline: 'none',
        ...style,
      }}
    >
      {showIcon ? <Icon name={iconName} size={iSize} color={surf.color} weight="regular" /> : null}
      {showText ? <span id={labelId}>{children}</span> : null}
    </button>
  );
}
