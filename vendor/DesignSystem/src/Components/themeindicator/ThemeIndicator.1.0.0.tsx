import React from "react";
import { layout } from "../../tokens/design-tokens";
import { ThemeWheel } from "../themewheel/ThemeWheel.1.0.0";
import type { ThemeWheelState, ThemeWheelTheme } from "../themewheel/ThemeWheel.1.0.0";
import { PaginationIndicator } from "../paginationindicator/PaginationIndicator.1.0.0";
import type { PaginationIndicatorState, PaginationPage } from "../paginationindicator/PaginationIndicator.1.0.0";

export type ThemeIndicatorTheme = ThemeWheelTheme;
export type ThemeIndicatorState = "active" | "disabled";

/**
 * Theme switch affordance: tri-colour wheel + pagination (Light / Dark / Colour).
 * Layout matches Figma: horizontal drag gutters, vertical stack gap-16, 32×44 min bounds.
 */
export interface ThemeIndicatorProps {
  /** Current appearance mode. */
  theme?: ThemeIndicatorTheme;
  state?: ThemeIndicatorState;
  darkMode?: boolean;
  /** Fired when the wheel is clicked with the next theme in cycle (light → dark → colour → light). */
  onThemeChange?: (next: ThemeIndicatorTheme) => void;
  className?: string;
  style?: React.CSSProperties;
  /** Optional label for assistive tech (default: "Theme appearance"). */
  "aria-label"?: string;
}

function themeToPage(t: ThemeIndicatorTheme): PaginationPage {
  if (t === "light") return "first";
  if (t === "dark") return "second";
  return "third";
}

function toWheelState(s: ThemeIndicatorState): ThemeWheelState {
  return s === "active" ? "default" : "disabled";
}

function toPaginationState(s: ThemeIndicatorState): PaginationIndicatorState {
  return s === "active" ? "default" : "disabled";
}

export const ThemeIndicator: React.FC<ThemeIndicatorProps> = ({
  theme = "light",
  state = "active",
  darkMode = false,
  onThemeChange,
  className,
  style,
  "aria-label": ariaLabel = "Theme appearance",
}) => {
  const wheelState = toWheelState(state);
  const paginationState = toPaginationState(state);

  return (
    <div
      className={className}
      role="group"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 32,
        minHeight: 44,
        background: "transparent",
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          flex: 1,
          alignSelf: "stretch",
          minWidth: layout.gap16,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: layout.gap16,
        }}
      >
        <ThemeWheel
          theme={theme}
          state={wheelState}
          darkMode={darkMode}
          onThemeChange={onThemeChange}
        />
        <PaginationIndicator
          page={themeToPage(theme)}
          state={paginationState}
          darkMode={darkMode}
        />
      </div>
      <div
        aria-hidden
        style={{
          flex: 1,
          alignSelf: "stretch",
          minWidth: layout.gap16,
        }}
      />
    </div>
  );
};

ThemeIndicator.displayName = "ThemeIndicator";
