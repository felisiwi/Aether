import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InstrumentInterface } from "./InstrumentInterface.1.1.0";

const meta: Meta<typeof InstrumentInterface> = {
  component: InstrumentInterface,
  title: "Components/InstrumentInterface",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof InstrumentInterface>;

export const PianoKeys: Story = {
  render: function R() {
    return (
      <InstrumentInterface
        octave={3}
        variant="Piano"
        octaveSpan={2}
        pressedNotes={[]}
      />
    );
  },
};

export const InstrumentKeyboardCaps: Story = {
  render: function R() {
    return (
      <InstrumentInterface
        octave={3}
        variant="Keyboard"
        octaveSpan={2}
        pressedNotes={["C#4", "F4"]}
      />
    );
  },
};
