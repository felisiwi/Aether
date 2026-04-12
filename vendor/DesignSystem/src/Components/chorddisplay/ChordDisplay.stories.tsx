import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ChordDisplay } from "./ChordDisplay.1.0.0";

const meta: Meta<typeof ChordDisplay> = {
  title: "Components/ChordDisplay",
  component: ChordDisplay,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "colour", "theme"] },
    darkMode: { control: "boolean" },
  },
  args: {
    notes: ["C4", "E4", "G4", "B4"],
    chordName: "Cmaj7",
    altName: "C major seventh",
    variant: "default",
    darkMode: false,
  },
};

export default meta;
type Story = StoryObj<typeof ChordDisplay>;

export const Default: Story = {};

export const Colour: Story = {
  args: { variant: "colour" },
};

export const Theme: Story = {
  args: { variant: "theme" },
};

export const SingleNote: Story = {
  args: {
    notes: ["A3"],
    chordName: "A3",
    altName: "",
    variant: "colour",
  },
};

export const Empty: Story = {
  args: {
    notes: [],
    chordName: "",
    altName: "",
    variant: "colour",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <ChordDisplay
        notes={["C4", "E4", "G4", "B4"]}
        chordName="Cmaj7"
        altName="C major seventh"
        variant="default"
      />
      <ChordDisplay
        notes={["A3", "C4", "E4", "G4", "B4"]}
        chordName="Am9"
        altName="A minor ninth"
        variant="colour"
      />
      <ChordDisplay
        notes={["D3", "F3", "A3", "C4"]}
        chordName="Dm7"
        altName="D minor seventh"
        variant="theme"
      />
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 24,
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <ChordDisplay
        notes={["C4", "E4", "G4", "B4"]}
        chordName="Cmaj7"
        altName="C major seventh"
        variant="default"
        darkMode
      />
      <ChordDisplay
        notes={["A3", "C4", "E4", "G4", "B4"]}
        chordName="Am9"
        altName="A minor ninth"
        variant="colour"
        darkMode
      />
      <ChordDisplay
        notes={["D3", "F3", "A3", "C4"]}
        chordName="Dm7"
        altName="D minor seventh"
        variant="theme"
        darkMode
      />
    </div>
  ),
};
