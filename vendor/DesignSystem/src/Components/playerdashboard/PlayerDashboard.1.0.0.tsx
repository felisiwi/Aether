import React from "react";
import { layout } from "../../tokens/design-tokens";

export type PlayerDashboardVariant = "default" | "colour" | "theme";
export interface PlayerDashboardProps { variant?: PlayerDashboardVariant; darkMode?: boolean; direction?: "row" | "column"; align?: "left" | "right"; children: React.ReactNode; className?: string; style?: React.CSSProperties; }

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ variant = "default", darkMode = false, direction = "row", align = "left", children, className, style }) => {
  const isRight = align === "right";
  return (
    <div className={className} style={{ display: "flex", flexDirection: direction, alignItems: direction === "row" ? "center" : (isRight ? "flex-end" : "flex-start"), gap: layout.gap8, ...style }} data-variant={variant} data-dark={darkMode}>
      {children}
    </div>
  );
};
PlayerDashboard.displayName = "PlayerDashboard";
export default PlayerDashboard;
