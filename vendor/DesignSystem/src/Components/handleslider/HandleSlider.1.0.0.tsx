import React, { useCallback, useRef, useState } from "react";
import { semanticColors, layout, themeTokens } from "../../tokens/design-tokens";
import { THEME_KEYS, type ThemeIndex } from "../../tokens/theme-map";

export type HandleSliderVariant = "default" | "colour" | "theme";

export type HandleSliderOrientation = "horizontal" | "vertical";

/** Props for HandleSlider — a 0–1 normalised slider for Web Audio parameters. */
export interface HandleSliderProps {
  /** Current value (0–1 normalised float). */
  value: number;
  /** Called on every change with the new 0–1 value. */
  onChange: (value: number) => void;
  /** Visual variant: default (neutral), colour (orange/local), theme (player colour ramp). */
  variant?: HandleSliderVariant;
  /** Player slot when `variant` is `theme` (purple=0 … blue=3). */
  themeIndex?: ThemeIndex;
  /**
   * When `variant` is `theme`, full-intensity thumb/fill when true (e.g. wheel or focus
   * interaction without drag). Idle themed uses 50% opacity when false and not dragging.
   */
  visualActive?: boolean;
  /** Horizontal (default) or vertical track. */
  orientation?: HandleSliderOrientation;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Called when the user begins dragging the thumb (pointer down on track). */
  onDragStart?: () => void;
  /** Called when the user releases the pointer or drag ends. */
  onDragEnd?: () => void;
  /** Visible label element id for `aria-labelledby` (preferred over `ariaLabel` when set). */
  ariaLabelledBy?: string;
  /** Accessible name when `ariaLabelledBy` is not used. Defaults to "Slider". */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** REST snapshot: track (ActiveBar) thickness 2px — Layout/gap-2. */
const TRACK_HEIGHT = layout.gap2;
const THUMB_SIZE = layout.gap16;
const THUMB_WIDTH_PX = 16;
const THUMB_HEIGHT_PX = 16;

function themeKey(index: ThemeIndex | undefined) {
  return THEME_KEYS[index ?? 0];
}

function trackBackground(
  variant: HandleSliderVariant,
  darkMode: boolean,
  isDragging: boolean,
): string {
  if (isDragging) {
    if (variant === "theme") {
      return semanticColors.backdropStaticThemedElevatedSurface;
    }
    return semanticColors.backdropSurfaceElevatedSurface;
  }
  return darkMode
    ? semanticColors.backdropOpacityAdaptiveOpacityLightenedMedium
    : semanticColors.backdropOpacityAdaptiveOpacityDarkenedMedium;
}

function fillAndThumbColor(
  variant: HandleSliderVariant,
  darkMode: boolean,
  isDragging: boolean,
  themeIndex: ThemeIndex | undefined,
): string {
  if (isDragging) {
    if (variant === "theme") {
      return themeTokens[themeKey(themeIndex)].primary20;
    }
    return semanticColors.wrapperColourPressed;
  }
  switch (variant) {
    case "colour":
      return semanticColors.strokeColour;
    case "theme":
      return themeTokens[themeKey(themeIndex)].primary60;
    default:
      return darkMode
        ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
        : semanticColors.backdropInvertedBackground;
  }
}

export const HandleSlider: React.FC<HandleSliderProps> = ({
  value,
  onChange,
  variant = "default",
  themeIndex,
  visualActive = false,
  orientation = "horizontal",
  darkMode = false,
  disabled = false,
  onDragStart,
  onDragEnd,
  ariaLabelledBy,
  ariaLabel,
  className,
  style,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const clamped = Math.max(0, Math.min(1, value));
  const isVertical = orientation === "vertical";

  const trackBg = trackBackground(variant, darkMode, isDragging);
  const accent = fillAndThumbColor(variant, darkMode, isDragging, themeIndex);
  const themedIdleDim =
    variant === "theme" && !isDragging && !visualActive;

  const resolve = useCallback(
    (clientX: number, clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let next: number;
      if (isVertical) {
        next = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
      } else {
        next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      }
      onChange(Math.round(next * 1000) / 1000);
    },
    [isVertical, onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      onDragStart?.();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      resolve(e.clientX, e.clientY);
    },
    [disabled, onDragStart, resolve],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
      resolve(e.clientX, e.clientY);
    },
    [disabled, resolve],
  );

  const containerStyle: React.CSSProperties = isVertical
    ? {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: THUMB_SIZE,
        height: "100%",
        flex: 1,
        minHeight: 0,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        touchAction: "none",
        userSelect: "none",
        ...style,
      }
    : {
        display: "flex",
        alignItems: "center",
        height: THUMB_SIZE,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        touchAction: "none",
        userSelect: "none",
        ...style,
      };

  const trackStyle: React.CSSProperties = isVertical
    ? {
        position: "relative",
        width: TRACK_HEIGHT,
        flex: 1,
        minHeight: layout.gap40,
        alignSelf: "center",
        borderRadius: layout.radiusRound,
        backgroundColor: trackBg,
        overflow: "visible",
      }
    : {
        position: "relative",
        flex: 1,
        height: TRACK_HEIGHT,
        borderRadius: layout.radiusRound,
        backgroundColor: trackBg,
        overflow: "visible",
      };

  const fillStyle: React.CSSProperties = isVertical
    ? {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: `${clamped * 100}%`,
        borderRadius: layout.radiusRound,
        backgroundColor: accent,
        opacity: themedIdleDim ? 0.5 : 1,
        pointerEvents: "none",
      }
    : {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: `${clamped * 100}%`,
        borderRadius: layout.radiusRound,
        backgroundColor: accent,
        opacity: themedIdleDim ? 0.5 : 1,
        pointerEvents: "none",
      };

  const thumbStyle: React.CSSProperties = isVertical
    ? {
        position: "absolute",
        left: "50%",
        bottom: `calc(${clamped * 100}% - ${THUMB_HEIGHT_PX / 2}px)`,
        width: THUMB_WIDTH_PX,
        height: THUMB_HEIGHT_PX,
        borderRadius: layout.radiusNone,
        backgroundColor: accent,
        border: "none",
        transform: "translateX(-50%)",
        opacity: themedIdleDim ? 0.5 : 1,
        boxSizing: "border-box",
        pointerEvents: "none",
      }
    : {
        position: "absolute",
        top: "50%",
        left: `${clamped * 100}%`,
        width: THUMB_WIDTH_PX,
        height: THUMB_HEIGHT_PX,
        borderRadius: layout.radiusNone,
        backgroundColor: accent,
        border: "none",
        transform: "translate(-50%, -50%)",
        opacity: themedIdleDim ? 0.5 : 1,
        boxSizing: "border-box",
        pointerEvents: "none",
      };

  const a11yName =
    ariaLabelledBy !== undefined
      ? { "aria-labelledby": ariaLabelledBy }
      : { "aria-label": ariaLabel ?? "Slider" };

  return (
    <div
      className={className}
      style={containerStyle}
      role="slider"
      {...a11yName}
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-disabled={disabled}
      aria-orientation={isVertical ? "vertical" : "horizontal"}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (disabled) return;
        const step = e.shiftKey ? 0.1 : 0.01;
        const inc = isVertical
          ? e.key === "ArrowUp" || e.key === "ArrowRight"
          : e.key === "ArrowRight" || e.key === "ArrowUp";
        const dec = isVertical
          ? e.key === "ArrowDown" || e.key === "ArrowLeft"
          : e.key === "ArrowLeft" || e.key === "ArrowDown";
        if (inc) {
          e.preventDefault();
          onChange(Math.min(1, clamped + step));
        } else if (dec) {
          e.preventDefault();
          onChange(Math.max(0, clamped - step));
        }
      }}
    >
      <div
        ref={trackRef}
        style={trackStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div style={fillStyle} />
        <div style={thumbStyle} />
      </div>
    </div>
  );
};

HandleSlider.displayName = "HandleSlider";
export default HandleSlider;
