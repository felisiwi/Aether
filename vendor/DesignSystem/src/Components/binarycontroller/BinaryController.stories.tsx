import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BinaryController } from "./BinaryController.1.0.0";

const meta: Meta<typeof BinaryController> = {
  title: "Components/BinaryController",
  component: BinaryController,
};

export default meta;
type Story = StoryObj<typeof BinaryController>;

export const Default: Story = {
  render: () => (
    <BinaryController
      title="Key"
      value="C"
      onUp={() => undefined}
      onDown={() => undefined}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <BinaryController
      title="Octave"
      value="0"
      disabled
      onUp={() => undefined}
      onDown={() => undefined}
    />
  ),
};
