import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type VUBarVariant = "default" | "colour" | "theme";

/** Imperative handle for 60 fps VU updates — no React state involved. */
export interface VUBarHandle {
  /** Set normalised level (0–1). Call at ~60 fps from rAF. */
  setLevel: (level: number) => void;
  /** Trigger a brief peak flash. */
  flash: () => void;
}

/** Props for VUBar — a lightweight level meter designed for 60 fps updates. */
export interface VUBarProps {
  /** Visual variant: default (neutral), colour (orange/local), theme (purple/remote). */
  variant?: VUBarVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Orientation of the bar. */
  orientation?: "vertical" | "horizontal";
  /** Width in px (vertical) or height in px (horizontal). */
  thickness?: number;
  /** Length in px along the meter axis. */
  length?: number;
  className?: string;
  style?: React.CSSProperties;
}

function getFillColor(variant: VUBarVariant): string {
  switch (variant) {
    case "colour":
      return semanticColors.strokeColour;
    case "theme":
      return semanticColors.backdropSurfaceThemedSurface;
    default:
      return semanticColors.strokeStrong;
  }
}

function getTrackColor(dark: boolean): string {
  return dark
    ? semanticColors.backdropOpacityAdaptiveOpacityLightenedWeak
    : semanticColors.backdropStatesDisabledSurface;
}

/**
 * VUBar — a lightweight level meter that updates via imperative handle
 * to avoid React re-renders at audio frame rates.
 */
export const VUBar = forwardRef<VUBarHandle, VUBarProps>(
  function VUBar(
    {
      variant = "default",
      darkMode = false,
      orientation = "vertical",
      thickness = layout.gap4,
      length = 48,
      className,
      style,
    },
    ref,
  ) {
    const fillRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);
    const rafLevel = useRef(0);

    useImperativeHandle(ref, () => ({
      setLevel(level: number) {
        rafLevel.current = Math.max(0, Math.min(1, level));
        const el = fillRef.current;
        if (!el) return;
        if (orientation === "vertical") {
          el.style.height = `${rafLevel.current * 100}%`;
        } else {
          el.style.width = `${rafLevel.current * 100}%`;
        }
      },
      flash() {
        const el = flashRef.current;
        if (!el) return;
        el.style.opacity = "1";
        el.offsetHeight; // force reflow
        el.style.transition = "opacity 200ms ease-out";
        el.style.opacity = "0";
        const reset = () => {
          el.style.transition = "";
        };
        el.addEventListener("transitionend", reset, { once: true });
      },
    }));

    // Decay: smoothly reduce level when no new setLevel calls arrive
    useEffect(() => {
      let animId: number;
      const decay = () => {
        animId = requestAnimationFrame(decay);
        if (rafLevel.current > 0) {
          rafLevel.current = Math.max(0, rafLevel.current - 0.02);
          const el = fillRef.current;
          if (el) {
            if (orientation === "vertical") {
              el.style.height = `${rafLevel.current * 100}%`;
            } else {
              el.style.width = `${rafLevel.current * 100}%`;
            }
          }
        }
      };
      animId = requestAnimationFrame(decay);
      return () => cancelAnimationFrame(animId);
    }, [orientation]);

    const isVert = orientation === "vertical";
    const fillColor = getFillColor(variant);
    const trackColor = getTrackColor(darkMode);

    const containerStyle: React.CSSProperties = {
      position: "relative",
      width: isVert ? thickness : length,
      height: isVert ? length : thickness,
      borderRadius: layout.radiusRound,
      backgroundColor: trackColor,
      overflow: "hidden",
      flexShrink: 0,
      ...style,
    };

    const fillStyle: React.CSSProperties = {
      position: "absolute",
      borderRadius: layout.radiusRound,
      backgroundColor: fillColor,
      ...(isVert
        ? { bottom: 0, left: 0, width: "100%", height: "0%" }
        : { top: 0, left: 0, height: "100%", width: "0%" }),
    };

    const flashStyle: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      borderRadius: layout.radiusRound,
      backgroundColor: fillColor,
      opacity: 0,
      pointerEvents: "none",
    };

    return (
      <div
        className={className}
        style={containerStyle}
        role="meter"
        aria-label="Level meter"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div ref={fillRef} style={fillStyle} />
        <div ref={flashRef} style={flashStyle} />
      </div>
    );
  },
);

VUBar.displayName = "VUBar";
export default VUBar;
