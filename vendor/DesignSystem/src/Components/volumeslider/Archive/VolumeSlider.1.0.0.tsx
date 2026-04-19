import React, { useCallback, useEffect, useRef } from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

const WHEEL_STEP = 1;

/**
 * Vertical volume control (0–100). Active fill grows **upward** from the bottom using
 * `semanticColors.backdropSurfaceElevatedSurface`. Wheel behaviour matches {@link DataWindow}:
 * Scroll **up** increases the value; scroll **down** decreases (per product spec).
 */
export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
  className,
  style,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromClientY = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el || disabled) return;
      const r = el.getBoundingClientRect();
      const ratio = 1 - (clientY - r.top) / r.height;
      const next = clamp(
        min + ratio * (max - min),
        min,
        max,
      );
      onChange(Math.round(next));
    },
    [disabled, min, max, onChange],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientY(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setFromClientY(e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el || disabled) return;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      if (ev.deltaY === 0) return;
      const next = clamp(
        value + (ev.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP),
        min,
        max,
      );
      if (next !== value) onChange(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [disabled, value, min, max, onChange]);

  const pct = ((value - min) / (max - min)) * 100;

  const trackW = layout.gap32;
  const trackH = layout.gap256;

  const labelType = typography.label;

  const rootStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.gap8,
    opacity: disabled ? 0.55 : 1,
    ...style,
  };

  const trackStyle: React.CSSProperties = {
    position: "relative",
    width: trackW,
    height: trackH,
    borderRadius: layout.radiusS,
    background: semanticColors.backdropStatesDisabledSurface,
    border: `${layout.strokeS}px solid ${semanticColors.strokeMedium}`,
    boxSizing: "border-box",
    cursor: disabled ? "not-allowed" : "pointer",
    touchAction: "none",
  };

  const fillStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: `${pct}%`,
    background: semanticColors.backdropSurfaceElevatedSurface,
    borderRadius: layout.radiusS,
    pointerEvents: "none",
  };

  const pctStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    lineHeight: `${labelType.lineHeight}px`,
    fontWeight: labelType.fontWeight,
    color: colors.textHeadingNeutral,
  };

  return (
    <div className={className} style={rootStyle}>
      <span style={pctStyle}>{Math.round(pct)}%</span>
      <div
        ref={trackRef}
        style={trackStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="slider"
        aria-label="Volume"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
      >
        <div style={fillStyle} />
      </div>
    </div>
  );
};

VolumeSlider.displayName = "VolumeSlider";
export default VolumeSlider;
