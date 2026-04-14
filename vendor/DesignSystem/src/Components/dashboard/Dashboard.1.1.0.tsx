import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayerDisplay from "../playerdisplay/PlayerDisplay.1.1.0";
import type { PlayerDisplayProps } from "../playerdisplay/PlayerDisplay.1.1.0";
import { layout } from "../../tokens/design-tokens";

export interface DashboardProps {
  localPlayer: PlayerDisplayProps;
  remotePlayer?: PlayerDisplayProps | null;
  className?: string;
  style?: React.CSSProperties;
}

const enterRemote = { x: "100%", opacity: 0 };
const center = { x: 0, opacity: 1 };
const exitRemote = { x: "100%", opacity: 0 };

/**
 * Two-player strip: local card always visible; remote slides in from the right when connected.
 */
export const Dashboard: React.FC<DashboardProps> = ({
  localPlayer,
  remotePlayer = null,
  className,
  style,
}) => {
  const shell: React.CSSProperties = {
    width: "100%",
    minHeight: layout.gap128,
    padding: layout.gap24,
    boxSizing: "border-box",
    ...style,
  };

  const row: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    gap: layout.gap24,
    width: "100%",
  };

  return (
    <div className={className} style={shell} role="region" aria-label="Players dashboard">
      <div style={row}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <PlayerDisplay {...localPlayer} />
        </div>
        <AnimatePresence initial={false}>
          {remotePlayer ? (
            <motion.div
              key="remote"
              initial={enterRemote}
              animate={center}
              exit={exitRemote}
              transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
              style={{ flex: "1 1 0", minWidth: 0 }}
            >
              <PlayerDisplay {...remotePlayer} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

Dashboard.displayName = "Dashboard";
export default Dashboard;
