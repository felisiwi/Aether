import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ThemeWheel } from "./ThemeWheel.1.0.0";
import type { ThemeWheelTheme } from "./ThemeWheel.1.0.0";

export default {
  title: "Components/Atoms/ThemeWheel",
  component: ThemeWheel,
  argTypes: {
    theme: { control: "select", options: ["light", "dark", "colour"] },
    state: { control: "select", options: ["default", "disabled"] },
    darkMode: { control: "boolean" },
    variant: { control: "select", options: ["three", "two"] },
  },
  args: {
    theme: "light",
    state: "default",
    darkMode: false,
    variant: "three",
  },
} satisfies Meta<typeof ThemeWheel>;

type Story = StoryObj<typeof ThemeWheel>;

export const Default: Story = {};

/** Controlled state + onThemeChange so clicks cycle light → dark → colour → light in Storybook. */
export const InteractiveThreeCycle: Story = {
  render: (args) => {
    const [theme, setTheme] = React.useState<ThemeWheelTheme>("light");
    return (
      <ThemeWheel
        {...args}
        variant="three"
        theme={theme}
        onThemeChange={setTheme}
      />
    );
  },
};

export const DarkEmphasis: Story = {
  args: { theme: "dark" },
};

export const ColourEmphasis: Story = {
  args: { theme: "colour" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const DarkMode: Story = {
  args: { darkMode: true, theme: "dark" },
};

export const TwoTheme: Story = {
  args: { variant: "two", theme: "light" },
};
