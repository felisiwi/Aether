import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ThemeIndicator } from "./ThemeIndicator.1.0.0";

const meta: Meta<typeof ThemeIndicator> = {
  title: "Components/ThemeIndicator",
  component: ThemeIndicator,
  argTypes: {
    theme: { control: "select", options: ["light", "dark", "colour"] },
    state: { control: "select", options: ["active", "disabled"] },
    darkMode: { control: "boolean" },
  },
  args: {
    theme: "light",
    state: "active",
    darkMode: false,
  },
};

export default meta;
type Story = StoryObj<typeof ThemeIndicator>;

export const Light: Story = {};

export const Dark: Story = {
  args: { theme: "dark" },
};

export const Colour: Story = {
  args: { theme: "colour" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const DarkMode: Story = {
  args: { darkMode: true, theme: "colour" },
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <ThemeIndicator theme="light" />
      <ThemeIndicator theme="dark" />
      <ThemeIndicator theme="colour" />
    </div>
  ),
};
