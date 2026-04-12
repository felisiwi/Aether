import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { semanticColors, layout } from "../../tokens/design-tokens";

export type VUBarVariant = "default" | "colour" | "theme";
export interface VUBarHandle { setLevel: (level: number) => void; flash: () => void; }
export interface VUBarProps { variant?: VUBarVariant; darkMode?: boolean; orientation?: "vertical" | "horizontal"; thickness?: number; length?: number; className?: string; style?: React.CSSProperties; }

function getFillColor(v: VUBarVariant) { return v === "colour" ? semanticColors.strokeColour : v === "theme" ? semanticColors.backdropSurfaceThemedSurface : semanticColors.strokeStrong; }
function getTrackColor(dark: boolean) { return dark ? semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak : semanticColors.backdropStatesDisabledSurface; }

export const VUBar = forwardRef<VUBarHandle, VUBarProps>(function VUBar({ variant = "default", darkMode = false, orientation = "vertical", thickness = layout.gap4, length = 48, className, style }, ref) {
  const fillRef = useRef<HTMLDivElement>(null); const flashRef = useRef<HTMLDivElement>(null); const rafLevel = useRef(0);
  useImperativeHandle(ref, () => ({
    setLevel(level: number) { rafLevel.current = Math.max(0, Math.min(1, level)); const el = fillRef.current; if (!el) return; if (orientation === "vertical") el.style.height = `${rafLevel.current * 100}%`; else el.style.width = `${rafLevel.current * 100}%`; },
    flash() { const el = flashRef.current; if (!el) return; el.style.opacity = "1"; el.offsetHeight; el.style.transition = "opacity 200ms ease-out"; el.style.opacity = "0"; el.addEventListener("transitionend", () => { el.style.transition = ""; }, { once: true }); },
  }));
  useEffect(() => { let animId: number; const decay = () => { animId = requestAnimationFrame(decay); if (rafLevel.current > 0) { rafLevel.current = Math.max(0, rafLevel.current - 0.02); const el = fillRef.current; if (el) { if (orientation === "vertical") el.style.height = `${rafLevel.current * 100}%`; else el.style.width = `${rafLevel.current * 100}%`; } } }; animId = requestAnimationFrame(decay); return () => cancelAnimationFrame(animId); }, [orientation]);
  const isVert = orientation === "vertical"; const fillColor = getFillColor(variant); const trackColor = getTrackColor(darkMode);
  return (
    <div className={className} style={{ position: "relative", width: isVert ? thickness : length, height: isVert ? length : thickness, borderRadius: layout.radiusRound, backgroundColor: trackColor, overflow: "hidden", flexShrink: 0, ...style }} role="meter" aria-label="Level meter" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
      <div ref={fillRef} style={{ position: "absolute", borderRadius: layout.radiusRound, backgroundColor: fillColor, ...(isVert ? { bottom: 0, left: 0, width: "100%", height: "0%" } : { top: 0, left: 0, height: "100%", width: "0%" }) }} />
      <div ref={flashRef} style={{ position: "absolute", inset: 0, borderRadius: layout.radiusRound, backgroundColor: fillColor, opacity: 0, pointerEvents: "none" }} />
    </div>
  );
});
VUBar.displayName = "VUBar";
export default VUBar;
