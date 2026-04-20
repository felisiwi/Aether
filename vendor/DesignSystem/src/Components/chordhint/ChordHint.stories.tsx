import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ChordHint } from "./ChordHint.1.5.0";

const meta: Meta<typeof ChordHint> = {
  title: "Components/ChordHint",
  component: ChordHint,
};

export default meta;
type Story = StoryObj<typeof ChordHint>;

export const Minimized: Story = {
  args: {
    chordName: "Cmaj",
    missingNotes: ["G", "Bb"],
  },
};

export const Expanded: Story = {
  args: {
    chordName: "Cmaj",
    missingNotes: ["G", "Bb"],
    expanded: true,
  },
};

export const OneNote: Story = {
  args: {
    chordName: "G7",
    missingNotes: ["F"],
    expanded: true,
  },
};
