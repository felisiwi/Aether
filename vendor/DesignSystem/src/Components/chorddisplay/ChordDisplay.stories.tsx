import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef } from "react";
import { ChordDisplay, type ChordDisplayNote } from "./ChordDisplay.2.3.0";

const meta: Meta<typeof ChordDisplay> = {
  title: "Components/ChordDisplay",
  component: ChordDisplay,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "themed", "oscilloscope"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChordDisplay>;

const majNotes: ChordDisplayNote[] = [
  { note: "C3", type: "white" },
  { note: "E3", type: "white" },
  { note: "G3", type: "white" },
];

export const Default: Story = {
  args: {
    variant: "default",
    notes: majNotes,
    chordName: "Cmaj",
  },
};

export const Themed: Story = {
  args: {
    variant: "themed",
    themeIndex: 0,
    notes: [
      { note: "D3", type: "white" },
      { note: "F#3", type: "white" },
      { note: "A3", type: "white" },
    ],
    chordName: "Dmaj",
  },
};

export const Empty: Story = {
  args: {
    variant: "default",
    notes: [],
    chordName: "",
  },
};

export const Oscilloscope: Story = {
  render: function OscStory() {
    const ref = useRef<HTMLCanvasElement>(null);
    return (
      <div style={{ width: 400 }}>
        <ChordDisplay variant="oscilloscope" oscilloscopeRef={ref} />
      </div>
    );
  },
};

export const SideBySide: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <ChordDisplay
        variant="default"
        chordName="Cmaj7"
        notes={[
          { note: "C3", type: "white" },
          { note: "E3", type: "white" },
          { note: "G3", type: "white" },
          { note: "B3", type: "white" },
        ]}
      />
      <ChordDisplay
        variant="themed"
        themeIndex={1}
        chordName="Fmaj7"
        notes={[
          { note: "F3", type: "white" },
          { note: "A3", type: "white" },
          { note: "C4", type: "white" },
          { note: "E4", type: "white" },
        ]}
      />
    </div>
  ),
};
