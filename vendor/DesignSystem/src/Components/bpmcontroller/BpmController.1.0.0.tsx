import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export interface BpmControllerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Unit label shown after the value (Figma DataWindow suffix; default "BPM"). */
  label?: string;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Figma `BpmController` node `15851:87159` — DataWindow-style panel (fixed width, value + suffix, scroll to change). */
export const BpmController: React.FC<BpmControllerProps> = ({
  value,
  onChange,
  min = 40,
  max = 240,
  step = 1,
  label = "BPM",
  isActive: isActiveProp = false,
  className,
  style,
}) => {
  const [scrollHot, setScrollHot] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollAccRef = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const isActive = isActiveProp || scrollHot;
  const clamped = clamp(value, min, max);

  const clearScrollTimer = useCallback(() => {
    if (scrollTimerRef.current !== null) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  }, []);

  const markScrollActive = useCallback(() => {
    setScrollHot(true);
    clearScrollTimer();
    scrollTimerRef.current = setTimeout(() => {
      scrollTimerRef.current = null;
      setScrollHot(false);
    }, 800);
  }, [clearScrollTimer]);

  useEffect(() => {
    return () => {
      clearScrollTimer();
    };
  }, [clearScrollTimer]);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY === 0) return;
      markScrollActive();

      scrollAccRef.current += e.deltaY;

      const threshold = 8;
      const steps = Math.trunc(scrollAccRef.current / threshold);
      if (steps === 0) return;
      scrollAccRef.current -= steps * threshold;

      const next = clamp(clamped - steps * step, min, max);
      if (next !== clamped) onChange(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [clamped, min, max, step, onChange, markScrollActive]);

  const digitSlots = Math.max(
    String(Math.floor(Math.abs(min))).length,
    String(Math.floor(Math.abs(max))).length,
  );

  const numberMinWidth =
    digitSlots >= 3
      ? layout.gap48 + layout.gap8
      : digitSlots === 2
        ? layout.gap40 + layout.gap8
        : layout.gap24 + layout.gap8;

  /** Figma snapshot width ≈103px; use token sum (no raw px). */
  const panelWidth = layout.gap64 + layout.gap32 + layout.gap8;

  const panelBorderColor = isActive
    ? semanticColors.strokeColourPressed
    : semanticColors.strokeMedium;

  const valueType = typography.titleS;

  const valueTextStyle: React.CSSProperties = {
    fontFamily,
    fontSize: valueType.fontSize,
    lineHeight: `${valueType.lineHeight}px`,
    letterSpacing: valueType.letterSpacing,
    fontWeight: valueType.fontWeight,
    fontStretch: `${valueType.fontWidth}%`,
    color: isActive ? semanticColors.strokeColourPressed : colors.textHeadingNeutral,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
    margin: 0,
    padding: 0,
    minWidth: numberMinWidth,
    boxSizing: "border-box",
  };

  const suffixTextStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.label.fontSize,
    lineHeight: `${typography.label.lineHeight}px`,
    letterSpacing: typography.label.letterSpacing,
    fontWeight: typography.label.fontWeight,
    fontStretch: `${typography.label.fontWidth}%`,
    color: isActive ? semanticColors.strokeColourPressed : colors.textBodyNeutral,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
    userSelect: "none",
    textTransform: "none",
  };

  const suffixFrameStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: layout.gap4,
    paddingBottom: layout.gap4,
    boxSizing: "border-box",
  };

  const panelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: layout.gap4,
    width: panelWidth,
    minHeight: layout.gap48,
    paddingTop: layout.gap8,
    paddingBottom: layout.gap8,
    paddingLeft: layout.gap16,
    paddingRight: layout.gap16,
    borderRadius: layout.radiusS,
    borderWidth: layout.strokeM,
    borderStyle: "solid",
    borderColor: panelBorderColor,
    backgroundColor: semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak,
    boxShadow: `inset 0 1px 2px ${semanticColors.backdropOpacityAdaptiveShadowsInnershadow}`,
    boxSizing: "border-box",
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = clamp(clamped + step, min, max);
      if (next !== clamped) onChange(next);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = clamp(clamped - step, min, max);
      if (next !== clamped) onChange(next);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (min !== clamped) onChange(min);
    } else if (e.key === "End") {
      e.preventDefault();
      if (max !== clamped) onChange(max);
    }
  };

  return (
    <div
      ref={wheelRef}
      className={className}
      role="spinbutton"
      tabIndex={0}
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={`Tempo, ${label}`}
      onKeyDown={onKeyDown}
      style={{ ...panelStyle, ...style }}
    >
      <span style={valueTextStyle}>{clamped}</span>
      <div style={suffixFrameStyle}>
        <span style={suffixTextStyle}>{label}</span>
      </div>
    </div>
  );
};

BpmController.displayName = "BpmController";
export default BpmController;
