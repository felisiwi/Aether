import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HeldKeys } from "./HeldKeys.1.1.0";

const meta: Meta<typeof HeldKeys> = {
  component: HeldKeys,
  title: "Components/HeldKeys",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof HeldKeys>;

export const LocalDot: Story = {
  args: {
    variant: "local",
    notes: ["C", "E", "G"],
    separator: "dot",
  },
};

export const RemotePlus: Story = {
  args: {
    variant: "remote",
    notes: ["C", "D", "E"],
    separator: "plus",
  },
};

export const Empty: Story = {
  args: {
    variant: "local",
    notes: [],
  },
};
