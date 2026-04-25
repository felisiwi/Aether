import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { semanticColors } from "../../tokens/design-tokens";
import { BpmController } from "./BpmController.1.0.0";

const meta: Meta<typeof BpmController> = {
  title: "Components/BpmController",
  component: BpmController,
  decorators: [
    (Story) => (
      <div
        data-theme="light"
        style={{
          minHeight: "100%",
          padding: 24,
          background: semanticColors.backdropNautralBackground,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BpmController>;

export const Default: Story = {
  render: function R() {
    const [v, setV] = useState(120);
    return (
      <BpmController
        value={v}
        onChange={setV}
        min={40}
        max={240}
        step={1}
        label="BPM"
      />
    );
  },
};

export const Active: Story = {
  render: function R() {
    const [v, setV] = useState(90);
    return (
      <BpmController
        value={v}
        onChange={setV}
        isActive
        label="bpm"
      />
    );
  },
};
