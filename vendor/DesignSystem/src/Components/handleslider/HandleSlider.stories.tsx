import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { HandleSlider } from "./HandleSlider.1.0.0";

const meta: Meta<typeof HandleSlider> = {
  title: "Components/HandleSlider",
  component: HandleSlider,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "colour", "theme"],
    },
    darkMode: { control: "boolean" },
    disabled: { control: "boolean" },
    value: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
  args: {
    variant: "default",
    value: 0.5,
    darkMode: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof HandleSlider>;

export const Default: Story = {};

export const Colour: Story = { args: { variant: "colour" } };

export const Theme: Story = { args: { variant: "theme" } };

export const Disabled: Story = { args: { disabled: true, variant: "colour" } };

function Interactive({ variant, darkMode }: { variant: "default" | "colour" | "theme"; darkMode?: boolean }) {
  const [v, setV] = useState(0.5);
  return (
    <div style={{ width: 240 }}>
      <HandleSlider value={v} onChange={setV} variant={variant} darkMode={darkMode} />
      <span style={{ fontFamily: "Mona Sans, system-ui", fontSize: 13, color: darkMode ? "#fff9" : "#0009" }}>
        {v.toFixed(3)}
      </span>
    </div>
  );
}

export const InteractiveDefault: Story = {
  render: () => <Interactive variant="default" />,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 240 }}>
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
        display: "flex",
        flexDirection: "column",
        gap: 24,
        width: 240,
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
