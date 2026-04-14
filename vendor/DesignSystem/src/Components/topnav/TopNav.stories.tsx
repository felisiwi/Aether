import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TopNav } from "./TopNav.1.1.0";

const meta: Meta<typeof TopNav> = {
  component: TopNav,
  title: "Components/TopNav",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TopNav>;

export const Default: Story = {
  render: function R() {
    const [, setT] = useState<"light" | "dark">("light");
    return <TopNav onThemeChange={setT} />;
  },
};

export const WithBackToLobby: Story = {
  render: function R() {
    const [, setT] = useState<"light" | "dark">("light");
    return (
      <TopNav onBackToLobby={() => undefined} onThemeChange={setT} />
    );
  },
};
