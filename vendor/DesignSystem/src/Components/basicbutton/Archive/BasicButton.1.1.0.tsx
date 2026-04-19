import React, { useCallback, useId, useState } from 'react';
import {
  typography as typographyTokens,
  fontFamily,
  colors as colorTokens,
  semanticColors,
  layout,
  focusRingLight,
} from '../../tokens/design-tokens';
import Icon from '../icon/Icon.1.1.0';
import type { IconWeight } from '../icon/Icon.1.1.0';
import type { IconName } from '../icon/icon-names';

/**
 * BasicButton v1.1.0 — Figma **Basic/Buttons** (`13669:55650`).
 * Surfaces, strokes, text, padding, radii, and stroke weights map to `design-tokens.ts`
 * from snapshot bound variables (one row per Type × Colour fill × State; Latching/Inside wrapper/Fixed ignored).
 *
 * v1.0.0 archived at `Archive/BasicButton.1.0.0.tsx`.
 */
export type BasicButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'subtle';
export type BasicButtonSize = 'small' | 'large';
/** Figma State; optional override for Storybook — otherwise derived from pointer/latch/disabled. */
export type BasicButtonVisualState =
  | 'active'
  | 'pressed'
  | 'disabled'
  | 'disabledPressed'
  | 'focus';

const C = semanticColors;
/** No fill variable in Figma — not a hex literal. */
const NO_FILL = 'transparent' as const;

type SurfaceTokens = {
  background: string;
  borderColor: string;
  borderWidth: number;
};

function surface(
  variant: BasicButtonVariant,
  colourFill: boolean,
  phase: BasicButtonVisualState,
): SurfaceTokens {
  const wNormal = layout.strokeL;
  const wHeavy = layout.strokeXl;

  if (phase === 'disabled' || phase === 'disabledPressed') {
    const bw = wNormal;
    const stroke = C.strokeDisabled;

    if (variant === 'primary') {
      if (!colourFill) {
        return { background: NO_FILL, borderColor: stroke, borderWidth: bw };
      }
      const bg = C.backdropStatesDisabledSurface;
      return { background: bg, borderColor: bg, borderWidth: bw };
    }

    if (variant === 'secondary') {
      if (!colourFill) {
        return { background: NO_FILL, borderColor: stroke, borderWidth: bw };
      }
      if (phase === 'disabledPressed') {
        const bg = C.backdropOpacityAdaptiveOpacityDarkenedSymbolic;
        return { background: bg, borderColor: bg, borderWidth: bw };
      }
      const bg = C.backdropStatesDisabledSurface;
      return { background: bg, borderColor: bg, borderWidth: bw };
    }

    if (variant === 'subtle') {
      if (!colourFill) {
        const bg = C.backdropNautralBackground;
        return { background: bg, borderColor: stroke, borderWidth: bw };
      }
      if (phase === 'disabledPressed') {
        const bg = C.backdropOpacityAdaptiveOpacityDarkenedSymbolic;
        return { background: bg, borderColor: bg, borderWidth: bw };
      }
      const bg = C.backdropStatesDisabledSurface;
      return { background: bg, borderColor: bg, borderWidth: bw };
    }

    /* tertiary */
    if (!colourFill) {
      return { background: NO_FILL, borderColor: stroke, borderWidth: bw };
    }
    if (phase === 'disabledPressed') {
      const bg = C.backdropOpacityAdaptiveOpacityDarkenedSymbolic;
      return { background: bg, borderColor: bg, borderWidth: bw };
    }
    const bg = C.backdropStatesDisabledSurface;
    return { background: bg, borderColor: bg, borderWidth: bw };
  }

  if (phase === 'focus') {
    const bw = wHeavy;
    const stroke = C.strokeFocus;
    if (variant === 'primary') {
      if (!colourFill) {
        return {
          background: C.backdropNautralBackground,
          borderColor: stroke,
          borderWidth: bw,
        };
      }
      return {
        background: C.backdropSurfaceColouredSurface,
        borderColor: stroke,
        borderWidth: bw,
      };
    }
    if (variant === 'secondary') {
      if (!colourFill) {
        return {
          background: C.backdropNautralBackground,
          borderColor: stroke,
          borderWidth: bw,
        };
      }
      return {
        background: C.backdropInvertedBackground,
        borderColor: stroke,
        borderWidth: bw,
      };
    }
    if (variant === 'subtle') {
      return {
        background: C.backdropNautralBackground,
        borderColor: stroke,
        borderWidth: bw,
      };
    }
    /* tertiary */
    if (!colourFill) {
      return {
        background: C.backdropNautralBackground,
        borderColor: stroke,
        borderWidth: bw,
      };
    }
    return {
      background: C.backdropSurfaceColouredSurfaceDark,
      borderColor: stroke,
      borderWidth: bw,
    };
  }

  if (phase === 'pressed') {
    const bw = wHeavy;
    if (variant === 'primary') {
      if (!colourFill) {
        return {
          background: C.wrapperElevatedPressed,
          borderColor: C.strokeColour,
          borderWidth: bw,
        };
      }
      return {
        background: C.backdropStaticColour,
        borderColor: C.strokeColourPressed,
        borderWidth: bw,
      };
    }
    if (variant === 'secondary') {
      if (!colourFill) {
        return {
          background: C.wrapperElevatedPressed,
          borderColor: C.strokeSolid,
          borderWidth: bw,
        };
      }
      return {
        background: C.backdropSurfaceColouredSurfaceDark,
        borderColor: C.strokeColourPressed,
        borderWidth: bw,
      };
    }
    if (variant === 'subtle') {
      if (!colourFill) {
        return {
          background: C.backdropNautralBackground,
          borderColor: C.strokeColourPressed,
          borderWidth: bw,
        };
      }
      return {
        background: C.wrapperElevatedPressed,
        borderColor: C.strokeColourPressed,
        borderWidth: bw,
      };
    }
    /* tertiary */
    if (!colourFill) {
      return {
        background: C.wrapperElevatedPressed,
        borderColor: C.strokeColourDark,
        borderWidth: bw,
      };
    }
    return {
      background: C.buttonSurfaceSmallbuttonPressed,
      borderColor: C.strokeColourPressed,
      borderWidth: bw,
    };
  }

  /* active */
  const bw = wNormal;
  if (variant === 'primary') {
    if (!colourFill) {
      return {
        background: C.backdropNautralBackground,
        borderColor: C.strokeColour,
        borderWidth: bw,
      };
    }
    return {
      background: C.backdropSurfaceColouredSurface,
      borderColor: C.strokeColour,
      borderWidth: bw,
    };
  }
  if (variant === 'secondary') {
    if (!colourFill) {
      return {
        background: C.backdropNautralBackground,
        borderColor: C.strokeSolid,
        borderWidth: bw,
      };
    }
    return {
      background: C.backdropInvertedBackground,
      borderColor: C.strokeSolid,
      borderWidth: bw,
    };
  }
  if (variant === 'subtle') {
    return {
      background: C.backdropNautralBackground,
      borderColor: C.strokeHighlight,
      borderWidth: bw,
    };
  }
  /* tertiary */
  if (!colourFill) {
    return {
      background: C.backdropNautralBackground,
      borderColor: C.strokeColourDark,
      borderWidth: bw,
    };
  }
  return {
    background: C.backdropSurfaceColouredSurfaceDark,
    borderColor: C.strokeColourDark,
    borderWidth: bw,
  };
}

function labelColor(
  variant: BasicButtonVariant,
  colourFill: boolean,
  phase: BasicButtonVisualState,
): string {
  if (phase === 'disabled' || phase === 'disabledPressed') {
    return colorTokens.textDisabled;
  }
  if (phase === 'pressed') {
    return colorTokens.textPressed;
  }
  if (variant === 'tertiary' && !colourFill && (phase === 'active' || phase === 'focus')) {
    return colorTokens.textBodyColour;
  }
  if (
    (variant === 'secondary' || variant === 'tertiary') &&
    colourFill &&
    (phase === 'active' || phase === 'focus')
  ) {
    return colorTokens.textWhiteAtDarkenedSurface;
  }
  return colorTokens.textHeadingNeutral;
}

function textMetrics(size: BasicButtonSize) {
  const t = size === 'small' ? typographyTokens.buttonS : typographyTokens.buttonM;
  return {
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
    fontVariationSettings: `'wdth' ${t.fontWidth}`,
    fontWeight: t.fontWeight as 600,
  };
}

/** Figma padding: gap-8 horizontal, gap-4 vertical (×2 each side). */
const padX = layout.gap8 * 2;
const padY = layout.gap4 * 2;
const rowGap = layout.buttonInnerItemSpacing;
const cornerRadius = layout.radiusM;
const TRANSITION =
  'background-color 200ms ease, color 200ms ease, border-color 200ms ease, border-width 120ms ease, box-shadow 200ms ease';

/** IconWrapper: radius-s; glyph Size=24 in snapshot for Small — Phosphor 24 / 32 for Large. */
const iconWrapperBox = (size: BasicButtonSize) => ({
  minWidth: size === 'small' ? 24 : 36,
  minHeight: size === 'small' ? 24 : 36,
  borderRadius: layout.radiusS,
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
});

function iconGlyphSize(size: BasicButtonSize): 24 | 32 {
  return size === 'small' ? 24 : 32;
}

/**
 * Figma **ONLY EDIT ICON** binds `Stroke/stroke-m` on the icon instance → outline weight reads as regular in Phosphor.
 */
const ICON_WEIGHT: IconWeight = 'regular';

export interface BasicButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: BasicButtonVariant;
  size?: BasicButtonSize;
  /** Figma "Colour fill": false = outline, true = solid. */
  colourFill?: boolean;
  /** Figma "Inside wrapper": min 44×44 touch target. */
  insideWrapper?: boolean;
  /** Figma "Latching function": true = toggle pressed on click; false = pressed only while pointer down. */
  latching?: boolean;
  showText?: boolean;
  showIcon?: boolean;
  /** Required when `showIcon` is true. */
  iconName?: IconName;
  /** Overrides visual state (Storybook); omit for normal pointer/disabled behaviour. */
  state?: BasicButtonVisualState;
  /** Phosphor / custom icon weight; default matches Figma stroke-m binding. */
  iconWeight?: IconWeight;
  type?: 'button' | 'submit' | 'reset';
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
  state: stateProp,
  iconWeight = ICON_WEIGHT,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}: BasicButtonProps) {
  const labelId = useId();
  const [pointerDown, setPointerDown] = useState(false);
  const [latched, setLatched] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const showPressed = !disabled && (latching ? latched : pointerDown);

  let derivedPhase: BasicButtonVisualState = 'active';
  if (disabled) {
    derivedPhase = 'disabled';
  } else if (showPressed) {
    derivedPhase = 'pressed';
  }

  const visualPhase = stateProp ?? derivedPhase;
  const surf = surface(variant, colourFill, visualPhase);
  const fg = labelColor(variant, colourFill, visualPhase);
  const tm = textMetrics(size);
  const iSize = iconGlyphSize(size);

  const showFocusChrome =
    !disabled && (focusVisible || visualPhase === 'focus') && visualPhase !== 'disabled' && visualPhase !== 'disabledPressed';
  const focusBoxShadow = showFocusChrome ? `0 0 0 3px ${focusRingLight}` : 'none';

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

  const wrapStyle = iconWrapperBox(size);

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
        gap: rowGap,
        paddingLeft: padX,
        paddingRight: padX,
        paddingTop: padY,
        paddingBottom: padY,
        minWidth: insideWrapper ? 44 : undefined,
        minHeight: insideWrapper ? 44 : undefined,
        boxSizing: 'border-box',
        borderRadius: cornerRadius,
        borderStyle: 'solid',
        borderWidth: surf.borderWidth,
        borderColor: surf.borderColor,
        backgroundColor: surf.background,
        color: fg,
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
      {showText ? <span id={labelId}>{children}</span> : null}
      {showIcon ? (
        <div style={wrapStyle} aria-hidden={!showText ? undefined : true}>
          <Icon name={iconName} size={iSize} color={fg} weight={iconWeight} />
        </div>
      ) : null}
    </button>
  );
}
  