import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PlayerHeader } from "./PlayerHeader.1.0.0";

const meta: Meta<typeof PlayerHeader> = {
  title: "Components/PlayerHeader",
  component: PlayerHeader,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "colour", "theme"] },
    align: { control: { type: "select" }, options: ["left", "right"] },
    darkMode: { control: "boolean" },
  },
  args: {
    name: "Felix",
    instrument: "Aerophone Mini",
    variant: "colour",
    align: "left",
    darkMode: false,
  },
};

export default meta;
type Story = StoryObj<typeof PlayerHeader>;

export const Default: Story = {};

export const RemotePlayer: Story = {
  args: {
    name: "Alex",
    instrument: "Piano (keyboard)",
    variant: "theme",
    align: "right",
  },
};

export const NoInstrument: Story = {
  args: { instrument: undefined },
};

export const WithTrailing: Story = {
  args: {
    trailing: (
      <div
        style={{
          width: 4,
          height: 48,
          borderRadius: 999,
          backgroundColor: "#F04700",
        }}
      />
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PlayerHeader name="Felix" instrument="Aerophone Mini" variant="colour" />
      <PlayerHeader name="Alex" instrument="Piano (keyboard)" variant="theme" align="right" />
      <PlayerHeader name="Observer" variant="default" />
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <PlayerHeader name="Felix" instrument="Aerophone Mini" variant="colour" darkMode />
      <PlayerHeader name="Alex" instrument="Piano (keyboard)" variant="theme" align="right" darkMode />
      <PlayerHeader name="Observer" variant="default" darkMode />
    </div>
  ),
};
