import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { KeyOctaveController } from "./KeyOctaveController.1.0.0";

const meta: Meta<typeof KeyOctaveController> = {
  title: "Components/KeyOctaveController",
  component: KeyOctaveController,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof KeyOctaveController>;

export const Default: Story = {
  args: {
    keyValue: "C#",
    octaveValue: "+1",
    onKeyUp: () => {},
    onKeyDown: () => {},
    onOctaveUp: () => {},
    onOctaveDown: () => {},
  },
};
