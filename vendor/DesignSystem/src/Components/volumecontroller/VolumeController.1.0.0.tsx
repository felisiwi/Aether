import React, { useCallback, useEffect, useRef } from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type VolumeControllerVariant = "local" | "remote";

export interface VolumeControllerProps {
  value: number;
  onChange: (value: number) => void;
  variant: VolumeControllerVariant;
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

function fillForVariant(v: VolumeControllerVariant): string {
  return v === "local"
    ? semanticColors.backdropSurfaceElevatedSurface
    : semanticColors.backdropSurfaceThemedElevatedSurface;
}

function borderForVariant(v: VolumeControllerVariant): string {
  return v === "local" ? semanticColors.strokeColour : semanticColors.strokeTheme;
}

function accentForVariant(v: VolumeControllerVariant): string {
  return v === "local" ? colors.textHeadingColour : semanticColors.strokeTheme;
}

/**
 * Tall rounded box control: fill rises from the bottom; shows **value %** and **Volume** label.
 */
export const VolumeController: React.FC<VolumeControllerProps> = ({
  value,
  onChange,
  variant,
  min = 0,
  max = 100,
  disabled = false,
  className,
  style,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const setFromClientY = useCallback(
    (clientY: number) => {
      const el = boxRef.current;
      if (!el || disabled) return;
      const r = el.getBoundingClientRect();
      const ratio = 1 - (clientY - r.top) / r.height;
      const next = clamp(min + ratio * (max - min), min, max);
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
    const el = boxRef.current;
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

  const pct = Math.round(((value - min) / (max - min)) * 100);
  const fillH = `${pct}%`;
  const fillBg = fillForVariant(variant);
  const borderCol = borderForVariant(variant);
  const accent = accentForVariant(variant);

  const titleType = typography.titleM;
  const labelType = typography.label;

  const outer: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: layout.gap80,
    height: layout.gap256,
    borderRadius: layout.radiusM,
    border: `${layout.strokeS}px solid ${borderCol}`,
    background: semanticColors.backdropStatesDisabledSurface,
    boxSizing: "border-box",
    overflow: "hidden",
    cursor: disabled ? "not-allowed" : "pointer",
    touchAction: "none",
    opacity: disabled ? 0.55 : 1,
    ...style,
  };

  const fillStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: fillH,
    background: fillBg,
    pointerEvents: "none",
  };

  const labelStack: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: layout.gap8,
    flex: "1 1 auto",
    padding: layout.gap16,
    pointerEvents: "none",
  };

  const pctStyle: React.CSSProperties = {
    fontFamily,
    fontSize: titleType.fontSize,
    fontWeight: titleType.fontWeight,
    lineHeight: `${titleType.lineHeight}px`,
    fontStretch: `${titleType.fontWidth}%`,
    letterSpacing: titleType.letterSpacing,
    color: accent,
    fontVariantNumeric: "tabular-nums",
  };

  const capStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    color: colors.textHeadingNeutral,
  };

  return (
    <div
      ref={boxRef}
      className={className}
      style={outer}
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
      <div style={labelStack}>
        <span style={pctStyle}>
          {pct}
          <span style={{ fontSize: labelType.fontSize, marginLeft: layout.gap4 }}>%</span>
        </span>
        <span style={capStyle}>Volume</span>
      </div>
    </div>
  );
};

VolumeController.displayName = "VolumeController";
export default VolumeController;
