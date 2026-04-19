import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  TestComponent,
  TestComponentVariant,
} from "./TestComponent.1.0.0";

const variantOptions: TestComponentVariant[] = ["frame938", "frame939"];

const meta: Meta<typeof TestComponent> = {
  title: "Components/TestComponent",
  component: TestComponent,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: variantOptions,
      description: "Figma Property 1: Frame 938 vs Frame 939",
    },
    decorative: { control: "boolean" },
    animatePress: { control: "boolean" },
  },
  args: {
    variant: "frame938",
    animatePress: true,
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof TestComponent>;

export const Default: Story = {};

export const Frame939: Story = {
  args: { variant: "frame939" },
};

/** Figma Frame 938: ON_PRESS → Frame 939 (300ms ease-out). */
export const PressToToggle: Story = {
  render: function PressToToggleRender() {
    const [variant, setVariant] =
      React.useState<TestComponentVariant>("frame938");
    return (
      <div>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 12,
            marginBottom: 12,
            color: "#666",
          }}
        >
          Click the surface to toggle variant.
        </p>
        <button
          type="button"
          onClick={() =>
            setVariant((v) => (v === "frame938" ? "frame939" : "frame938"))
          }
          style={{
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            borderRadius: 16,
          }}
          aria-label="Toggle test component colour between Frame 938 and Frame 939"
        >
          {/* Inner press animation would fight the button’s own feedback */}
          <TestComponent variant={variant} animatePress={false} />
        </button>
      </div>
    );
  },
};
