import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tag } from "./Tag.1.0.0";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  argTypes: {
    label: { control: "text" },
    variant: { control: "radio", options: ["default", "themed"] },
    themeIndex: { control: { type: "number", min: 0, max: 3, step: 1 } },
  },
  args: {
    label: "Tag",
    variant: "default",
    themeIndex: 0,
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};

export const ThemedPurple: Story = {
  args: { variant: "themed", themeIndex: 0, label: "Purple" },
};

export const ThemedPink: Story = {
  args: { variant: "themed", themeIndex: 1, label: "Pink" },
};

export const ThemedGrid: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Tag label="Default" variant="default" />
      <Tag label="T0" variant="themed" themeIndex={0} />
      <Tag label="T1" variant="themed" themeIndex={1} />
      <Tag label="T2" variant="themed" themeIndex={2} />
      <Tag label="T3" variant="themed" themeIndex={3} />
    </div>
  ),
};
