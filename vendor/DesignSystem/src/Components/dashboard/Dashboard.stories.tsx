import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dashboard } from "./Dashboard.1.1.0";

const meta: Meta<typeof Dashboard> = {
  component: Dashboard,
  title: "Components/Dashboard",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Dashboard>;

export const BothPlayers: Story = {
  render: function R() {
    const [showRemote, setShowRemote] = useState(true);
    return (
      <div style={{ padding: 24 }}>
        <button type="button" onClick={() => setShowRemote((s) => !s)}>
          Toggle remote
        </button>
        <Dashboard
          localPlayer={{
            playerName: "You",
            variant: "local",
            instrument: "Piano",
            chordName: "Cmaj",
            notes: ["C", "E", "G"],
            latency: 22,
          }}
          remotePlayer={
            showRemote
              ? {
                  playerName: "Jam partner",
                  variant: "remote",
                  instrument: "Piano",
                  chordName: "Fmaj7",
                  notes: ["F", "A", "C", "E"],
                  latency: 88,
                }
              : null
          }
        />
      </div>
    );
  },
};
