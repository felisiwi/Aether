import React from "react";
import { motion } from "framer-motion";
import { semanticColors, layout } from "../../tokens/design-tokens";

export type PaginationPage = "first" | "second" | "third";
export type PaginationIndicatorState = "default" | "disabled";

/**
 * Three-dot pagination (wide active pill + two narrow dots). Spacing: gap-4 (layout.gap4).
 * Active: Backdrop/Background/inverted-background. Passive: adaptive darkened-strong @ 60% opacity.
 */
export interface PaginationIndicatorProps {
  /** Which position is active (maps to Light / Dark / Colour order). */
  page?: PaginationPage;
  state?: PaginationIndicatorState;
  darkMode?: boolean;
  /** Called when user selects a dot (first = Light, second = Dark, third = Colour). */
  onPageChange?: (page: PaginationPage) => void;
  className?: string;
  style?: React.CSSProperties;
}

const DOT_H = 4;
const PILL_W = 12;
const NARROW_W = 4;

const order: PaginationPage[] = ["first", "second", "third"];

export const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  page = "first",
  state = "default",
  darkMode = false,
  onPageChange,
  className,
  style,
}) => {
  const activeFill = darkMode ? semanticColors.backdropStaticWhite : semanticColors.backdropInvertedBackground;
  const passiveBase = darkMode
    ? semanticColors.backdropOpacityAdaptiveOpacityLightenedStrong
    : semanticColors.backdropOpacityAdaptiveOpacityDarkenedStrong;

  const transition = {
    type: "spring" as const,
    stiffness: 520,
    damping: 34,
    mass: 0.35,
  };

  const disabled = state === "disabled";
  const interactive = Boolean(onPageChange) && !disabled;

  return (
    <div
      className={className}
      role="tablist"
      aria-label="Theme page"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: layout.gap4,
        height: DOT_H,
        ...style,
      }}
    >
      {order.map((p) => {
        const active = p === page;
        return (
          <motion.button
            key={p}
            type="button"
            role="tab"
            aria-selected={active}
            layout
            initial={false}
            animate={{
              width: active ? PILL_W : NARROW_W,
            }}
            transition={transition}
            disabled={disabled || !onPageChange}
            onClick={() => interactive && onPageChange?.(p)}
            style={{
              height: DOT_H,
              borderRadius: layout.radiusRound,
              backgroundColor: active ? activeFill : passiveBase,
              opacity: disabled ? 0.45 : active ? 1 : 0.6,
              flexShrink: 0,
              border: "none",
              padding: 0,
              cursor: interactive ? "pointer" : "default",
            }}
          />
        );
      })}
    </div>
  );
};

PaginationIndicator.displayName = "PaginationIndicator";
