import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ChordDisplay } from "./ChordDisplay.2.3.0";

const meta: Meta<typeof ChordDisplay> = {
  title: "Components/ChordDisplay",
  component: ChordDisplay,
  argTypes: {
    variant: { control: { type: "radio" }, options: ["local", "remote"] },
  },
  args: {
    notes: ["C", "E", "G"],
    chordName: "Cmaj",
    keyName: "C Major",
    variant: "local",
  },
};

export default meta;
type Story = StoryObj<typeof ChordDisplay>;

export const Local: Story = {};

export const Remote: Story = {
  args: {
    variant: "remote",
    chordName: "Dm7",
    notes: ["D", "F", "A", "C"],
    keyName: "D minor 7",
  },
};

export const Empty: Story = {
  args: {
    notes: [],
    chordName: "",
    keyName: "",
    variant: "local",
  },
};

export const SideBySide: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <ChordDisplay
        variant="local"
        chordName="Cmaj"
        notes={["C", "E", "G"]}
        keyName="C Major"
      />
      <ChordDisplay
        variant="remote"
        chordName="Fmaj7"
        notes={["F", "A", "C", "E"]}
        keyName="F Major 7"
      />
    </div>
  ),
};
