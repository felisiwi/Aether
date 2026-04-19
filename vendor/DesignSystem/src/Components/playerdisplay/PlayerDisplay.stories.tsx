import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PlayerDisplay } from "./PlayerDisplay.1.1.0";

const meta: Meta<typeof PlayerDisplay> = {
  component: PlayerDisplay,
  title: "Components/PlayerDisplay",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PlayerDisplay>;

export const Local: Story = {
  args: {
    playerName: "You",
    instrument: "Piano",
    variant: "local",
    chordName: "Cmaj",
    notes: ["C", "E", "G"],
    latency: 42,
  },
};

export const Remote: Story = {
  args: {
    playerName: "Partner",
    instrument: "Keys",
    variant: "remote",
    chordName: "Dm7",
    notes: ["D", "F", "A", "C"],
    latency: 120,
  },
};
