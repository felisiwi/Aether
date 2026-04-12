import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SectionHeader } from "./SectionHeader.1.0.0";

const meta: Meta<typeof SectionHeader> = {
  title: "Components/SectionHeader",
  component: SectionHeader,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "colour", "theme"],
    },
    label: { control: "text" },
  },
  args: {
    label: "Oscillator",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {};

export const Colour: Story = {
  args: { variant: "colour", label: "Oscillator" },
};

export const Theme: Story = {
  args: { variant: "theme", label: "Oscillator" },
};

export const WithRightContent: Story = {
  args: {
    label: "Effects",
    variant: "colour",
    rightContent: (
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#F04700",
          letterSpacing: 0.5,
          textTransform: "uppercase" as const,
        }}
      >
        3 active
      </span>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: 360 }}>
      <SectionHeader label="Oscillator" variant="default" />
      <SectionHeader label="Filter" variant="colour" />
      <SectionHeader label="Reverb" variant="theme" />
      <SectionHeader
        label="Effects"
        variant="colour"
        rightContent={
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#F04700",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            3 active
          </span>
        }
      />
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        width: 360,
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <SectionHeader label="Oscillator" variant="default" />
      <SectionHeader label="Filter" variant="colour" />
      <SectionHeader label="Reverb" variant="theme" />
    </div>
  ),
};
