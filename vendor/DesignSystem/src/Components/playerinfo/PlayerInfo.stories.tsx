import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PlayerInfo } from "./PlayerInfo.1.1.0";

const meta: Meta<typeof PlayerInfo> = {
  title: "Components/PlayerInfo",
  component: PlayerInfo,
  parameters: {
    layout: "centered",
    backgrounds: { default: "light" },
  },
  argTypes: {
    variant: { control: { type: "radio" }, options: ["local", "remote"] },
  },
  args: {
    playerName: "YOU",
    latency: 28,
    instrument: "Piano",
    variant: "local",
  },
};

export default meta;
type Story = StoryObj<typeof PlayerInfo>;

export const Local: Story = {};

export const Remote: Story = {
  args: {
    playerName: "FELIX",
    latency: 95,
    instrument: "Piano",
    variant: "remote",
  },
};
