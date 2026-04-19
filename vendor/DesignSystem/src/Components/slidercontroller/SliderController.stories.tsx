import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import SliderController from "./SliderController.1.0.0";

const meta: Meta<typeof SliderController> = {
  title: "Components/SliderController",
  component: SliderController,
  decorators: [
    (Story) => (
      <div
        style={{
          height: 240,
          width: 80,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Level",
    suffix: "%",
    min: 0,
    max: 100,
    step: 1,
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof SliderController>;

export const Master: Story = {
  render: function R(args) {
    const [value, setValue] = useState(50);
    return (
      <SliderController
        {...args}
        value={value}
        onChange={setValue}
        variant="default"
      />
    );
  },
};

export const Player3Green: Story = {
  render: function R(args) {
    const [value, setValue] = useState(72);
    return (
      <SliderController
        {...args}
        value={value}
        onChange={setValue}
        variant={3}
      />
    );
  },
};
