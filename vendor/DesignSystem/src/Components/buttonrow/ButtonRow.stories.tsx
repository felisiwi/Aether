import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ButtonRow } from "./ButtonRow.1.0.0";

const waveformOptions = [
  { icon: "waveform-sine" as const, label: "Sine" },
  { icon: "waveform-triangle" as const, label: "Triangle" },
  { icon: "waveform-sawtooth" as const, label: "Sawtooth" },
  { icon: "waveform-square" as const, label: "Square" },
];

const meta: Meta<typeof ButtonRow> = {
  title: "Components/ButtonRow",
  component: ButtonRow,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ButtonRow>;

export const Default: Story = {
  render: function Render() {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <ButtonRow
        options={waveformOptions}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />
    );
  },
};
