import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PaginationIndicator } from "./PaginationIndicator.1.0.0";

const meta: Meta<typeof PaginationIndicator> = {
  title: "Components/Atoms/PaginationIndicator",
  component: PaginationIndicator,
  argTypes: {
    page: { control: "select", options: ["first", "second", "third"] },
    state: { control: "select", options: ["default", "disabled"] },
    darkMode: { control: "boolean" },
  },
  args: {
    page: "first",
    state: "default",
    darkMode: false,
  },
};

export default meta;
type Story = StoryObj<typeof PaginationIndicator>;

export const First: Story = {};

export const Second: Story = {
  args: { page: "second" },
};

export const Third: Story = {
  args: { page: "third" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const DarkMode: Story = {
  args: { darkMode: true, page: "second" },
};
