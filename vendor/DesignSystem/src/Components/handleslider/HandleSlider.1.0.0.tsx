import React, { useCallback, useRef, useState } from "react";
import { semanticColors, layout, themeTokens } from "../../tokens/design-tokens";

export type HandleSliderVariant = "default" | "colour" | "theme";

/** Props for HandleSlider — a 0–1 normalized slider for Web Audio parameters. */
export interface HandleSliderProps {
  /** Current value (0–1 normalised float). */
  value: number;
  /** Called on every change with the new 0–1 value. */
  onChange: (value: number) => void;
  /** Visual variant: default (neutral), colour (orange/local), theme (purple/remote). */
  variant?: HandleSliderVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Called when the user begins dragging the thumb (pointer down on track). */
  onDragStart?: () => void;
  /** Called when the user releases the pointer or drag ends. */
  onDragEnd?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** REST snapshot: track (ActiveBar) height 2px — Layout/gap-2. */
const TRACK_HEIGHT = layout.gap2;
const THUMB_SIZE = layout.gap16;
const THUMB_WIDTH_PX = 16;
const THUMB_HEIGHT_PX = 16;

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
): string {
  if (isDragging) {
    if (variant === "theme") {
      return themeTokens.purple.primary20;
    }
    return semanticColors.wrapperColourPressed;
  }
  switch (variant) {
    case "colour":
      return semanticColors.strokeColour;
    case "theme":
      return semanticColors.backdropSurfaceThemedSurface;
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
  darkMode = false,
  disabled = false,
  onDragStart,
  onDragEnd,
  className,
  style,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const clamped = Math.max(0, Math.min(1, value));

  const trackBg = trackBackground(variant, darkMode, isDragging);
  const accent = fillAndThumbColor(variant, darkMode, isDragging);

  const resolve = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(Math.round(next * 1000) / 1000);
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      onDragStart?.();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      resolve(e.clientX);
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
      resolve(e.clientX);
    },
    [disabled, resolve],
  );

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    height: THUMB_SIZE,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
    touchAction: "none",
    userSelect: "none",
    ...style,
  };

  const trackStyle: React.CSSProperties = {
    position: "relative",
    flex: 1,
    height: TRACK_HEIGHT,
    borderRadius: layout.radiusRound,
    backgroundColor: trackBg,
    overflow: "visible",
  };

  const fillStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${clamped * 100}%`,
    borderRadius: layout.radiusRound,
    backgroundColor: accent,
    pointerEvents: "none",
  };

  const thumbStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: `${clamped * 100}%`,
    width: THUMB_WIDTH_PX,
    height: THUMB_HEIGHT_PX,
    borderRadius: layout.radiusNone,
    backgroundColor: accent,
    border: "none",
    transform: "translate(-50%, -50%)",
    boxSizing: "border-box",
    pointerEvents: "none",
  };

  return (
    <div
      className={className}
      style={containerStyle}
      role="slider"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (disabled) return;
        const step = e.shiftKey ? 0.1 : 0.01;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(1, clamped + step));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
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
