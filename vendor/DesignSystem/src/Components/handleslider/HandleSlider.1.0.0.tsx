import React, { useCallback, useRef } from "react";
import {
  colors,
  semanticColors,
  layout,
  fontFamily,
  typography,
  themeTokens,
} from "../../tokens/design-tokens";

export type HandleSliderVariant = "default" | "colour" | "theme";

export interface HandleSliderProps {
  value: number;
  onChange: (value: number) => void;
  variant?: HandleSliderVariant;
  darkMode?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TRACK_HEIGHT = layout.gap4;
const THUMB_SIZE = layout.gap16;

function getTokens(variant: HandleSliderVariant, dark: boolean) {
  const trackBg = dark ? semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak : semanticColors.backdropStatesDisabledSurface;
  switch (variant) {
    case "colour": return { trackFill: semanticColors.strokeColour, trackBg, thumbBorder: semanticColors.strokeColour, thumbBg: dark ? semanticColors.backdropStatesHoverSurface : semanticColors.backdropNautralBackground };
    case "theme": return { trackFill: themeTokens.components.primary50, trackBg, thumbBorder: themeTokens.components.primary50, thumbBg: dark ? semanticColors.backdropStatesHoverSurface : semanticColors.backdropNautralBackground };
    default: return { trackFill: dark ? semanticColors.strokeInvertedStrong : semanticColors.strokeStrong, trackBg, thumbBorder: dark ? semanticColors.strokeInvertedSolid : semanticColors.strokeSolid, thumbBg: dark ? semanticColors.backdropStatesHoverSurface : semanticColors.backdropNautralBackground };
  }
}

export const HandleSlider: React.FC<HandleSliderProps> = ({ value, onChange, variant = "default", darkMode = false, disabled = false, className, style }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const tokens = getTokens(variant, darkMode);
  const clamped = Math.max(0, Math.min(1, value));
  const resolve = useCallback((clientX: number) => { const el = trackRef.current; if (!el) return; const rect = el.getBoundingClientRect(); const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)); onChange(Math.round(next * 1000) / 1000); }, [onChange]);
  const handlePointerDown = useCallback((e: React.PointerEvent) => { if (disabled) return; e.preventDefault(); (e.target as HTMLElement).setPointerCapture(e.pointerId); resolve(e.clientX); }, [disabled, resolve]);
  const handlePointerMove = useCallback((e: React.PointerEvent) => { if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return; resolve(e.clientX); }, [disabled, resolve]);
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", height: THUMB_SIZE, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1, touchAction: "none", userSelect: "none", ...style }} role="slider" aria-valuenow={Math.round(clamped * 100)} aria-valuemin={0} aria-valuemax={100} aria-disabled={disabled} tabIndex={disabled ? -1 : 0} onKeyDown={(e) => { if (disabled) return; const step = e.shiftKey ? 0.1 : 0.01; if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); onChange(Math.min(1, clamped + step)); } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); onChange(Math.max(0, clamped - step)); } }}>
      <div ref={trackRef} style={{ position: "relative", flex: 1, height: TRACK_HEIGHT, borderRadius: layout.radiusRound, backgroundColor: tokens.trackBg, overflow: "visible" }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${clamped * 100}%`, borderRadius: layout.radiusRound, backgroundColor: tokens.trackFill, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: `${clamped * 100}%`, width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: layout.radiusRound, backgroundColor: tokens.thumbBg, border: `${layout.strokeL}px solid ${tokens.thumbBorder}`, transform: "translate(-50%, -50%)", boxSizing: "border-box", boxShadow: `0 1px 3px ${semanticColors.backdropOpacityAdaptiveShadowsDropshadowMid}`, pointerEvents: "none" }} />
      </div>
    </div>
  );
};

HandleSlider.displayName = "HandleSlider";
export default HandleSlider;
