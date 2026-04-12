import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useRef } from "react";
import { VUBar } from "./VUBar.1.0.0";
import type { VUBarHandle } from "./VUBar.1.0.0";

const meta: Meta<typeof VUBar> = {
  title: "Components/VUBar",
  component: VUBar,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "colour", "theme"],
    },
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal"],
    },
    darkMode: { control: "boolean" },
    thickness: { control: { type: "number", min: 2, max: 16 } },
    length: { control: { type: "number", min: 24, max: 200 } },
  },
  args: {
    variant: "default",
    orientation: "vertical",
    darkMode: false,
    thickness: 4,
    length: 48,
  },
};

export default meta;
type Story = StoryObj<typeof VUBar>;

export const Default: Story = {};

function Animated({
  variant,
  orientation,
  darkMode,
}: {
  variant: "default" | "colour" | "theme";
  orientation?: "vertical" | "horizontal";
  darkMode?: boolean;
}) {
  const barRef = useRef<VUBarHandle>(null);
  useEffect(() => {
    let frame: number;
    let t = Math.random() * 100;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      t += 0.05;
      const level = 0.3 + 0.3 * Math.sin(t) + 0.15 * Math.sin(t * 2.7);
      barRef.current?.setLevel(level);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <VUBar ref={barRef} variant={variant} orientation={orientation} darkMode={darkMode} length={64} />;
}

export const AnimatedColour: Story = {
  render: () => <Animated variant="colour" />,
};

export const AnimatedTheme: Story = {
  render: () => <Animated variant="theme" />,
};

export const Horizontal: Story = {
  render: () => <Animated variant="colour" orientation="horizontal" />,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 80 }}>
      <Animated variant="default" />
      <Animated variant="colour" />
      <Animated variant="theme" />
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-end",
        height: 80,
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <Animated variant="default" darkMode />
      <Animated variant="colour" darkMode />
      <Animated variant="theme" darkMode />
    </div>
  ),
};
