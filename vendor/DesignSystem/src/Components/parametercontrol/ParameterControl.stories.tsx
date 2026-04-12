import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ParameterControl } from "./ParameterControl.1.0.0";

const meta: Meta<typeof ParameterControl> = {
  title: "Components/ParameterControl",
  component: ParameterControl,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "colour", "theme"] },
    darkMode: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Attack",
    value: 50,
    min: 0,
    max: 500,
    step: 5,
    variant: "default",
    darkMode: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ParameterControl>;

export const Default: Story = {
  args: { format: (v: number) => `${v}ms` },
};

function Interactive({
  variant,
  darkMode,
}: {
  variant: "default" | "colour" | "theme";
  darkMode?: boolean;
}) {
  const [attack, setAttack] = useState(50);
  const [release, setRelease] = useState(200);
  const [reverb, setReverb] = useState(0.3);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
      <ParameterControl
        label="Attack"
        value={attack}
        min={0}
        max={500}
        step={5}
        format={(v) => `${v}ms`}
        onChange={setAttack}
        variant={variant}
        darkMode={darkMode}
      />
      <ParameterControl
        label="Release"
        value={release}
        min={10}
        max={500}
        step={5}
        format={(v) => `${v}ms`}
        onChange={setRelease}
        variant={variant}
        darkMode={darkMode}
      />
      <ParameterControl
        label="Reverb"
        value={reverb}
        min={0}
        max={1}
        step={0.05}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={setReverb}
        variant={variant}
        darkMode={darkMode}
      />
    </div>
  );
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

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
        display: "flex",
        gap: 32,
      }}
    >
      <Interactive variant="default" darkMode />
      <Interactive variant="colour" darkMode />
      <Interactive variant="theme" darkMode />
    </div>
  ),
};
