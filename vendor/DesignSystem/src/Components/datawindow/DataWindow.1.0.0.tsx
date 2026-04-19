import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type DataWindowVariant = "default" | "colour" | "theme";

export interface DataWindowProps {
  children?: React.ReactNode;
  /** default = neutral, colour = orange/local player, theme = purple/remote player */
  variant?: DataWindowVariant;
  /** Optional overline label above the display */
  label?: string;
  /** Reduced padding for inline/dense layouts */
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Current numeric value */
  value?: number;
  /** Min/max range for scroll clamping */
  min?: number;
  max?: number;
  /** Called when value changes via scroll */
  onChange?: (value: number) => void;
  /** Suffix label e.g. "ms", "%", "K" — never editable */
  suffix?: string;
  /** Step size for scroll wheel changes (default 1) */
  step?: number;
  /** When true (e.g. linked slider dragging), use active styling together with scroll feedback. */
  isActive?: boolean;
  /** Merged onto the inner value panel (below optional label). Later keys override built-in panel styles. */
  panelStyle?: React.CSSProperties;
  /** Alias for `panelStyle` — same merge target (e.g. KeyOctave display-only overrides). Spread last. */
  innerPanelStyle?: React.CSSProperties;
}

interface VariantTokens {
  borderColor: string;
  labelColor: string;
  innerShadow: string;
}

function getVariantTokens(variant: DataWindowVariant): VariantTokens {
  switch (variant) {
    case "colour":
      return {
        borderColor: semanticColors.strokeColour,
        labelColor: colors.textBodyColour,
        innerShadow: `inset 0 1px 2px ${semanticColors.backdropOpacityAdaptiveShadowsInnershadow}`,
      };
    case "theme":
      return {
        borderColor: semanticColors.backdropSurfaceThemedSurface,
        labelColor: semanticColors.backdropSurfaceThemedSurface,
        innerShadow: `inset 0 1px 2px ${semanticColors.backdropOpacityAdaptiveShadowsInnershadow}`,
      };
    case "default":
    default:
      return {
        borderColor: semanticColors.strokeMedium,
        labelColor: colors.textBodyNeutral,
        innerShadow: `inset 0 1px 2px ${semanticColors.backdropOpacityAdaptiveShadowsInnershadow}`,
      };
  }
}

function clampValue(n: number, min?: number, max?: number): number {
  let v = n;
  if (min !== undefined) v = Math.max(min, v);
  if (max !== undefined) v = Math.min(max, v);
  return v;
}

export const DataWindow: React.FC<DataWindowProps> = ({
  children,
  variant = "default",
  label,
  compact = false,
  className,
  style,
  value,
  min,
  max,
  onChange,
  suffix,
  step = 1,
  isActive: isActiveProp = false,
  panelStyle: panelStyleProp,
  innerPanelStyle: innerPanelStyleProp,
}) => {
  const tokens = getVariantTokens(variant);
  const numericMode = value !== undefined;
  const interactive = numericMode && onChange !== undefined;

  const [scrollHot, setScrollHot] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);

  const isActive = isActiveProp || scrollHot;

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
    if (!interactive) return;
    const el = wheelContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY === 0) return;
      markScrollActive();
      const next = clampValue(
        value + (e.deltaY > 0 ? step : -step),
        min,
        max,
      );
      if (next !== value) onChange(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [interactive, value, step, min, max, onChange, markScrollActive]);

  const valueType = compact ? typography.titleS : typography.titleM;

  const valueTextStyle = (active: boolean): React.CSSProperties => ({
    fontFamily,
    fontSize: valueType.fontSize,
    lineHeight: `${valueType.lineHeight}px`,
    letterSpacing: valueType.letterSpacing,
    fontWeight: valueType.fontWeight,
    fontStretch: `${valueType.fontWidth}%`,
    color: active
      ? semanticColors.strokeColourPressed
      : colors.textHeadingNeutral,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
  });

  const suffixTextStyle = (active: boolean): React.CSSProperties => ({
    fontFamily,
    fontSize: typography.label.fontSize,
    lineHeight: `${typography.label.lineHeight}px`,
    letterSpacing: typography.label.letterSpacing,
    fontWeight: 660,
    fontStretch: `${typography.label.fontWidth}%`,
    color: active
      ? semanticColors.strokeColourPressed
      : colors.textBodyNeutral,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
    userSelect: "none",
  });

  /** Snapshot: Default `VariableID:9006:168` → stroke-medium; Active Variant2 `VariableID:13012:18766` → stroke-colour-pressed. */
  const panelBorderColor = numericMode
    ? isActive
      ? semanticColors.strokeColourPressed
      : semanticColors.strokeMedium
    : tokens.borderColor;

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: compact ? layout.gap2 : layout.gap4,
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.label.fontSize,
    lineHeight: `${typography.label.lineHeight}px`,
    letterSpacing: typography.label.letterSpacing,
    fontWeight: typography.label.fontWeight,
    fontStretch: `${typography.label.fontWidth}%`,
    color: tokens.labelColor,
    textTransform: "none",
    whiteSpace: "nowrap",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
  };

  const panelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: 48,
    paddingTop: layout.gap8,
    paddingBottom: layout.gap8,
    paddingLeft: compact ? layout.gap8 : layout.gap16,
    paddingRight: compact ? layout.gap8 : layout.gap16,
    borderRadius: layout.radiusS,
    borderWidth: layout.strokeM,
    borderStyle: "solid",
    borderColor: panelBorderColor,
    backgroundColor: semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak,
    boxShadow: tokens.innerShadow,
    boxSizing: "border-box",
    minWidth: 0,
    ...panelStyleProp,
    ...innerPanelStyleProp,
  };

  const valueRowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: layout.gap4,
    minWidth: 0,
    cursor: "default",
  };

  return (
    <div className={className} style={wrapperStyle}>
      {label && <span style={labelStyle}>{label}</span>}
      <div
        ref={numericMode ? wheelContainerRef : undefined}
        style={panelStyle}
      >
        {numericMode && (
          <div style={valueRowStyle}>
            <span style={valueTextStyle(isActive)}>{value}</span>
            {suffix ? (
              <span style={suffixTextStyle(isActive)}>{suffix}</span>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default DataWindow;
