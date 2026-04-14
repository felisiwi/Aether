import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SimpleButton } from "./SimpleButton.1.2.0";

const meta: Meta<typeof SimpleButton> = {
  component: SimpleButton,
  title: "Components/SimpleButton",
  parameters: { layout: "centered" },
  argTypes: {
    state: { control: "radio", options: ["active", "pressed", "default"] },
    disabled: { control: "boolean" },
    label: { control: "text" },
    iconName: {
      control: "select",
      options: ["waveform-sine", "waveform-triangle", "waveform-sawtooth", "waveform-square"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof SimpleButton>;

export const Default: Story = {
  args: {
    label: "Label",
    state: "active",
    disabled: false,
    iconName: "waveform-sine",
  },
};

export const Outline: Story = {
  args: {
    label: "Triangle",
    state: "default",
    iconName: "waveform-triangle",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
    iconName: "waveform-square",
  },
};

export const Pressed: Story = {
  args: {
    label: "Pressed",
    state: "pressed",
    iconName: "waveform-sawtooth",
  },
};

export const FourStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SimpleButton label="Active" state="active" iconName="waveform-sine" />
      <SimpleButton label="Pressed" state="pressed" iconName="waveform-triangle" />
      <SimpleButton label="Default" state="default" iconName="waveform-sawtooth" />
      <SimpleButton label="Disabled" disabled iconName="waveform-square" />
    </div>
  ),
};
