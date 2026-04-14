import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { VolumeController } from "./VolumeController.1.0.0";

const meta: Meta<typeof VolumeController> = {
  component: VolumeController,
  title: "Components/VolumeController",
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: { type: "radio" }, options: ["local", "remote"] },
  },
  args: {
    variant: "local",
  },
};

export default meta;
type Story = StoryObj<typeof VolumeController>;

export const Local: Story = {
  render: function R() {
    const [value, setValue] = useState(72);
    return <VolumeController value={value} onChange={setValue} variant="local" />;
  },
};

export const Remote: Story = {
  render: function R() {
    const [value, setValue] = useState(40);
    return <VolumeController value={value} onChange={setValue} variant="remote" />;
  },
};

export const Disabled: Story = {
  render: function R() {
    const [value, setValue] = useState(30);
    return (
      <VolumeController value={value} onChange={setValue} variant="local" disabled />
    );
  },
};
