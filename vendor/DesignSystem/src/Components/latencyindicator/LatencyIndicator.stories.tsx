import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LatencyIndicator } from "./LatencyIndicator.1.0.0";

const meta: Meta<typeof LatencyIndicator> = {
  title: "Components/LatencyIndicator",
  component: LatencyIndicator,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "colour", "theme"] },
    darkMode: { control: "boolean" },
    showUnit: { control: "boolean" },
    rtt: { control: { type: "number" } },
  },
  args: {
    rtt: 42,
    variant: "default",
    darkMode: false,
    showUnit: true,
  },
};

export default meta;
type Story = StoryObj<typeof LatencyIndicator>;

export const Good: Story = { args: { rtt: 28 } };

export const Fair: Story = { args: { rtt: 95 } };

export const Poor: Story = { args: { rtt: 210 } };

export const Unavailable: Story = { args: { rtt: null } };

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <LatencyIndicator rtt={28} />
      <LatencyIndicator rtt={95} />
      <LatencyIndicator rtt={210} />
      <LatencyIndicator rtt={null} />
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 32,
        alignItems: "flex-start",
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <LatencyIndicator rtt={28} darkMode />
      <LatencyIndicator rtt={95} darkMode />
      <LatencyIndicator rtt={210} darkMode />
      <LatencyIndicator rtt={null} darkMode />
    </div>
  ),
};
