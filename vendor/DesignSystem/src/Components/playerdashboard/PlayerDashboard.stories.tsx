import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useRef } from "react";
import { PlayerDashboard } from "./PlayerDashboard.1.0.0";
import { PlayerHeader } from "../playerheader/PlayerHeader.1.0.0";
import { ChordDisplay } from "../chorddisplay/ChordDisplay.1.0.0";
import { VUBar } from "../vubar/VUBar.1.0.0";
import type { VUBarHandle } from "../vubar/VUBar.1.0.0";
import { LatencyIndicator } from "../latencyindicator/LatencyIndicator.1.0.0";

const meta: Meta<typeof PlayerDashboard> = {
  title: "Components/PlayerDashboard",
  component: PlayerDashboard,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "colour", "theme"] },
    direction: { control: { type: "select" }, options: ["row", "column"] },
    align: { control: { type: "select" }, options: ["left", "right"] },
    darkMode: { control: "boolean" },
  },
  args: { variant: "colour", direction: "row", align: "left", darkMode: false },
};

export default meta;
type Story = StoryObj<typeof PlayerDashboard>;

function AnimatedVU({ variant }: { variant: "default" | "colour" | "theme" }) {
  const barRef = useRef<VUBarHandle>(null);
  useEffect(() => {
    let frame: number;
    let t = Math.random() * 100;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      t += 0.05;
      barRef.current?.setLevel(0.3 + 0.3 * Math.sin(t) + 0.15 * Math.sin(t * 2.7));
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <VUBar ref={barRef} variant={variant} length={56} />;
}

export const LocalPlayer: Story = {
  render: () => (
    <PlayerDashboard variant="colour" direction="row">
      <AnimatedVU variant="colour" />
      <PlayerHeader name="Felix" instrument="Aerophone Mini" variant="colour" />
    </PlayerDashboard>
  ),
};

export const RemotePlayer: Story = {
  render: () => (
    <PlayerDashboard variant="theme" direction="row" align="right">
      <PlayerHeader name="Alex" instrument="Piano (keyboard)" variant="theme" align="right" />
      <AnimatedVU variant="theme" />
    </PlayerDashboard>
  ),
};

export const FullJamLayout: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <PlayerDashboard variant="colour">
        <AnimatedVU variant="colour" />
        <PlayerHeader name="Felix" instrument="Aerophone Mini" variant="colour" />
      </PlayerDashboard>

      <ChordDisplay
        notes={["C4", "E4", "G4", "B4"]}
        chordName="Cmaj7"
        altName="C major seventh"
        variant="colour"
      />

      <PlayerDashboard variant="theme" align="right">
        <PlayerHeader name="Alex" instrument="Piano (keyboard)" variant="theme" align="right" trailing={<LatencyIndicator rtt={42} />} />
        <AnimatedVU variant="theme" />
      </PlayerDashboard>
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <PlayerDashboard variant="colour" darkMode>
        <AnimatedVU variant="colour" />
        <PlayerHeader name="Felix" instrument="Aerophone Mini" variant="colour" darkMode />
      </PlayerDashboard>

      <ChordDisplay
        notes={["A3", "C4", "E4", "G4", "B4"]}
        chordName="Am9"
        altName="A minor ninth"
        variant="colour"
        darkMode
      />

      <PlayerDashboard variant="theme" align="right" darkMode>
        <PlayerHeader name="Alex" instrument="Piano (keyboard)" variant="theme" align="right" darkMode trailing={<LatencyIndicator rtt={42} darkMode />} />
        <AnimatedVU variant="theme" />
      </PlayerDashboard>
    </div>
  ),
};
