import React, { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { ThemeWheel } from "../themewheel/ThemeWheel.1.0.0";
import type { ThemeWheelTheme } from "../themewheel/ThemeWheel.1.0.0";
import {
  layout,
  semanticColors,
  colors,
  typography,
  fontFamily,
} from "../../tokens/design-tokens";
import logoUrl from "../../assets/aetherlogo.svg";

export interface TopNavProps {
  /** When set, shows a back control on the left. */
  onBack?: () => void;
  /** Called when the theme wheel selects the next theme (light/dark only). */
  onThemeChange?: (theme: "light" | "dark") => void;
  /** Initial colour mode for the two-segment wheel. */
  defaultTheme?: "light" | "dark";
  /** Optional right-of-logo debug label (Storybook / dev). */
  debugLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

function toWheelTheme(t: "light" | "dark"): ThemeWheelTheme {
  return t;
}

export const TopNav: React.FC<TopNavProps> = ({
  onBack,
  onThemeChange,
  defaultTheme = "light",
  debugLabel,
  className,
  style,
}) => {
  const [mode, setMode] = useState<"light" | "dark">(defaultTheme);

  const bar: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: layout.gap16,
    paddingLeft: layout.paddingSubtle,
    paddingRight: layout.paddingSubtle,
    paddingTop: layout.gap8,
    paddingBottom: layout.gap8,
    width: "100%",
    boxSizing: "border-box",
    borderBottom: `${layout.strokeS}px solid ${semanticColors.strokeWeak}`,
    background: semanticColors.backdropNautralBackground,
    ...style,
  };

  const side: React.CSSProperties = {
    flex: "1 1 0",
    display: "flex",
    alignItems: "center",
    minWidth: 0,
  };

  const centre: React.CSSProperties = {
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.gap4,
  };

  const logoStyle: React.CSSProperties = {
    height: layout.gap32,
    width: "auto",
    display: "block",
  };

  const debugStyle: React.CSSProperties = {
    fontFamily,
    fontSize: typography.label.fontSize,
    lineHeight: `${typography.label.lineHeight}px`,
    color: colors.textBodyNeutral,
  };

  const handleTheme = (next: ThemeWheelTheme) => {
    if (next === "colour") return;
    const m = next === "dark" ? "dark" : "light";
    setMode(m);
    onThemeChange?.(m);
  };

  return (
    <header className={className} style={bar}>
      <div style={{ ...side, justifyContent: "flex-start" }}>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: layout.gap4,
              padding: layout.gap4,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: colors.textHeadingNeutral,
            }}
            aria-label="Back"
          >
            <ArrowLeft size={layout.gap24} weight="bold" />
          </button>
        ) : (
          <span style={{ width: layout.gap32 }} aria-hidden />
        )}
      </div>

      <div style={centre}>
        <img src={logoUrl} alt="Aether" style={logoStyle} />
        {debugLabel ? <span style={debugStyle}>{debugLabel}</span> : null}
      </div>

      <div style={{ ...side, justifyContent: "flex-end" }}>
        <ThemeWheel
          theme={toWheelTheme(mode)}
          variant="two"
          onThemeChange={handleTheme}
        />
      </div>
    </header>
  );
};

TopNav.displayName = "TopNav";
export default TopNav;
