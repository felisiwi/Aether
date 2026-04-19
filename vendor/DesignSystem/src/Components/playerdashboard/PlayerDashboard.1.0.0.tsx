import React from "react";
import {
  layout,
} from "../../tokens/design-tokens";

export type PlayerDashboardVariant = "default" | "colour" | "theme";

/**
 * Props for PlayerDashboard — a composition wrapper that lays out a
 * PlayerHeader, VUBar, ChordDisplay, and LatencyIndicator for one player.
 * Accepts children rather than concrete sub-component props so Aether can
 * compose freely.
 */
export interface PlayerDashboardProps {
  /** Visual variant: default (neutral), colour (orange/local), theme (purple/remote). */
  variant?: PlayerDashboardVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Layout direction. */
  direction?: "row" | "column";
  /** Content alignment for remote (right-aligned) vs local (left). */
  align?: "left" | "right";
  /** Child components to compose (PlayerHeader, VUBar, ChordDisplay, etc.). */
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({
  variant = "default",
  darkMode = false,
  direction = "row",
  align = "left",
  children,
  className,
  style,
}) => {
  const isRight = align === "right";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction,
    alignItems: direction === "row" ? "center" : (isRight ? "flex-end" : "flex-start"),
    gap: layout.gap8,
    ...style,
  };

  return (
    <div className={className} style={containerStyle} data-variant={variant} data-dark={darkMode}>
      {children}
    </div>
  );
};

PlayerDashboard.displayName = "PlayerDashboard";
export default PlayerDashboard;
