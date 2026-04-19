import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  DataController,
  type DataControllerProps,
} from "./DataController.1.0.0";

const meta: Meta<typeof DataController> = {
  title: "Components/DataController",
  component: DataController,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "colour", "theme"],
    },
    themeIndex: { control: { type: "number", min: 0, max: 3, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof DataController>;

function StatefulDataController(
  props: Omit<
    DataControllerProps,
    "value" | "sliderNorm" | "onSliderChange" | "onValueChange"
  > & { initialValue?: number; initialNorm?: number },
) {
  const {
    initialValue = 42,
    initialNorm = 0.42,
    ...rest
  } = props;
  const [value, setValue] = useState(initialValue);
  const [norm, setNorm] = useState(initialNorm);
  return (
    <DataController
      {...rest}
      value={value}
      sliderNorm={norm}
      onSliderChange={setNorm}
      onValueChange={setValue}
    />
  );
}

export const Default: Story = {
  render: () => (
    <StatefulDataController
      label="Attack"
      suffix="ms"
      min={0}
      max={500}
      step={5}
      variant="default"
    />
  ),
};

export const Colour: Story = {
  render: () => (
    <StatefulDataController
      label="Filter"
      suffix="Hz"
      min={500}
      max={20000}
      step={100}
      variant="colour"
    />
  ),
};

export const Theme: Story = {
  render: () => (
    <StatefulDataController
      label="Remote"
      suffix="%"
      min={0}
      max={100}
      step={1}
      variant="theme"
      themeIndex={1}
    />
  ),
};
