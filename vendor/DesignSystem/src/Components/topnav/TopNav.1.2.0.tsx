import React, { useState } from "react";
import { ThemeWheel } from "../themewheel/ThemeWheel.1.0.0";
import type { ThemeWheelTheme } from "../themewheel/ThemeWheel.1.0.0";
import BasicButton from "../basicbutton/BasicButton.1.2.0";
import {
  layout,
  semanticColors,
  typography,
  fontFamily,
} from "../../tokens/design-tokens";
import logoUrl from "../../assets/aetherlogo.svg";

export interface TopNavProps {
  /** Primary navigation — returns to lobby / session list. */
  onBackToLobby?: () => void;
  onThemeChange?: (theme: "light" | "dark") => void;
  defaultTheme?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

function toWheelTheme(t: "light" | "dark"): ThemeWheelTheme {
  return t;
}

/**
 * TopNav v1.2.0 — Back to Lobby, centred logo (Figma logo height 24px → `layout.gap24`), two-segment {@link ThemeWheel} (light / dark only). No bottom border.
 */
export const TopNav: React.FC<TopNavProps> = ({
  onBackToLobby,
  onThemeChange,
  defaultTheme = "light",
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
    height: layout.gap24,
    width: "auto",
    display: "block",
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
        {onBackToLobby ? (
          <BasicButton
            variant="secondary"
            size="small"
            colourFill={false}
            showText
            showIcon={false}
            onClick={onBackToLobby}
          >
            Back to Lobby
          </BasicButton>
        ) : (
          <span
            style={{
              minWidth: layout.gap32,
              fontFamily,
              fontSize: typography.label.fontSize,
              lineHeight: `${typography.label.lineHeight}px`,
            }}
            aria-hidden
          />
        )}
      </div>

      <div style={centre}>
        <img src={logoUrl} alt="Aether" style={logoStyle} />
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
