import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayerDisplay from "../playerdisplay/PlayerDisplay.1.1.0";
import type { PlayerDisplayProps } from "../playerdisplay/PlayerDisplay.1.1.0";
import { layout } from "../../tokens/design-tokens";

export interface DashboardProps {
  localPlayer: PlayerDisplayProps | null;
  remotePlayer: PlayerDisplayProps | null;
  className?: string;
  style?: React.CSSProperties;
}

const enterRemote = { x: "100%", opacity: 0 };
const center = { x: 0, opacity: 1 };
const exitRemote = { x: "100%", opacity: 0 };

const enterLocal = { x: "-100%", opacity: 0 };
const exitLocal = { x: "-100%", opacity: 0 };

export const Dashboard: React.FC<DashboardProps> = ({
  localPlayer,
  remotePlayer,
  className,
  style,
}) => {
  const row: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: layout.gap24,
    width: "100%",
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div className={className} style={row} role="region" aria-label="Players dashboard">
      <AnimatePresence initial={false}>
        {localPlayer ? (
          <motion.div
            key="local"
            initial={enterLocal}
            animate={center}
            exit={exitLocal}
            transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
            style={{ flex: "1 1 0", minWidth: 0 }}
          >
            <PlayerDisplay {...localPlayer} />
          </motion.div>
        ) : null}
      </AnimatePresence>

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
  );
};

Dashboard.displayName = "Dashboard";
export default Dashboard;
