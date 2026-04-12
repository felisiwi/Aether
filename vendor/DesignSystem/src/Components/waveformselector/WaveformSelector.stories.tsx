import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { WaveformSelector } from "./WaveformSelector.1.0.0";
import type { WaveformType } from "./WaveformSelector.1.0.0";

const meta: Meta<typeof WaveformSelector> = {
  title: "Components/WaveformSelector",
  component: WaveformSelector,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "colour", "theme"] },
    darkMode: { control: "boolean" },
    disabled: { control: "boolean" },
    value: { control: { type: "select" }, options: ["sine", "triangle", "sawtooth", "square"] },
  },
  args: {
    value: "sine",
    variant: "default",
    darkMode: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof WaveformSelector>;

export const Default: Story = {};

function Interactive({
  variant,
  darkMode,
}: {
  variant: "default" | "colour" | "theme";
  darkMode?: boolean;
}) {
  const [wf, setWf] = useState<WaveformType>("sine");
  return <WaveformSelector value={wf} onChange={setWf} variant={variant} darkMode={darkMode} />;
}

export const InteractiveColour: Story = {
  render: () => <Interactive variant="colour" />,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32 }}>
      <Interactive variant="default" />
      <Interactive variant="colour" />
      <Interactive variant="theme" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, variant: "colour", value: "sawtooth" },
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 32,
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <Interactive variant="default" darkMode />
      <Interactive variant="colour" darkMode />
      <Interactive variant="theme" darkMode />
    </div>
  ),
};
