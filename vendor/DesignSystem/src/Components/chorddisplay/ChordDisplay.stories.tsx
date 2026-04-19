import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef } from "react";
import { ChordDisplay } from "./ChordDisplay.2.3.0";

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

const majNotes = [
  { note: "C3", partOfChord: true },
  { note: "E3", partOfChord: true },
  { note: "G3", partOfChord: true },
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
      { note: "D3", partOfChord: true },
      { note: "F#3", partOfChord: true },
      { note: "A3", partOfChord: true },
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
          { note: "C3", partOfChord: true },
          { note: "E3", partOfChord: true },
          { note: "G3", partOfChord: true },
          { note: "B3", partOfChord: true },
        ]}
      />
      <ChordDisplay
        variant="themed"
        themeIndex={1}
        chordName="Fmaj7"
        notes={[
          { note: "F3", partOfChord: true },
          { note: "A3", partOfChord: true },
          { note: "C4", partOfChord: true },
          { note: "E4", partOfChord: true },
        ]}
      />
    </div>
  ),
};
