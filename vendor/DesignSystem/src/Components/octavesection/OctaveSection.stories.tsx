import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OctaveSection } from "./OctaveSection.1.2.0";

const meta: Meta<typeof OctaveSection> = {
  component: OctaveSection,
  title: "Components/OctaveSection",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof OctaveSection>;

export const Piano: Story = {
  args: {
    octave: 4,
    variant: "Piano",
  },
};

export const Keyboard: Story = {
  args: {
    octave: 3,
    variant: "Keyboard",
  },
};

export const WithPressedNotes: Story = {
  render: function R() {
    const [notes, setNotes] = useState<string[]>(["C4", "E4", "G4"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <OctaveSection octave={4} pressedNotes={notes} variant="Piano" />
        <button type="button" onClick={() => setNotes((n) => (n.length ? [] : ["C4", "E4", "G4"]))}>
          Toggle held notes
        </button>
      </div>
    );
  },
};
