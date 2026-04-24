import React, { useState } from "react";
import { ThemeWheel } from "../themewheel/ThemeWheel.1.0.0";
import type { ThemeWheelTheme } from "../themewheel/ThemeWheel.1.0.0";
import BasicButton from "../basicbutton/BasicButton.1.2.0";
import { BpmController } from "../bpmcontroller/BpmController.1.0.0";
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
  /** Jam tempo; shown with {@link onBpmChange} as a {@link BpmController}. */
  bpm?: number;
  onBpmChange?: (value: number) => void;
  /** Metronome latched on (visual); pair with {@link onMetronomeToggle}. */
  metronomeOn?: boolean;
  onMetronomeToggle?: () => void;
  /** When true, show the metronome control (jam shell). Default false hides it. */
  showMetronome?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function toWheelTheme(t: "light" | "dark"): ThemeWheelTheme {
  return t;
}

/**
 * TopNav v1.3.0 — Figma `TopNav` node `15335:112034`. Back to Lobby, centred logo, right rail:
 * optional {@link BpmController} + optional metronome {@link BasicButton}, then {@link ThemeWheel} (`layout.gap48` between blocks).
 *
 * v1.2.0 archived at `Archive/TopNav.1.2.0.tsx`.
 */
export const TopNav: React.FC<TopNavProps> = ({
  onBackToLobby,
  onThemeChange,
  defaultTheme = "light",
  bpm,
  onBpmChange,
  metronomeOn = false,
  onMetronomeToggle,
  showMetronome = false,
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
    paddingLeft: layout.gap48,
    paddingRight: layout.gap48,
    paddingTop: layout.gap24,
    paddingBottom: layout.gap24,
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

  const showBpm = bpm !== undefined && onBpmChange !== undefined;
  const jamToolsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: layout.gap8,
    flexShrink: 0,
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

      <div
        style={{
          ...side,
          justifyContent: "flex-end",
          gap: layout.gap48,
        }}
      >
        {showBpm || showMetronome ? (
          <div style={jamToolsStyle}>
            {showBpm ? (
              <BpmController value={bpm} onChange={onBpmChange} label="BPM" />
            ) : null}
            {showMetronome ? (
              // BasicButton uses visual state "active" for idle (there is no "default" token).
              <BasicButton
                variant="primary"
                size="small"
                colourFill={false}
                insideWrapper
                showText={false}
                showIcon
                iconName="metronome"
                latching
                state={metronomeOn ? "pressed" : "active"}
                aria-label="Metronome"
                type="button"
                disabled={!onMetronomeToggle}
                onClick={onMetronomeToggle}
              />
            ) : null}
          </div>
        ) : null}
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
