import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../tokens/semantic-tokens.css";
import { TopNav } from "./TopNav.1.3.0";

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

export const WithJamControls: Story = {
  render: function R() {
    const [, setT] = useState<"light" | "dark">("light");
    const [bpm, setBpm] = useState(120);
    const [metro, setMetro] = useState(false);
    return (
      <TopNav
        onBackToLobby={() => undefined}
        onThemeChange={setT}
        bpm={bpm}
        onBpmChange={setBpm}
        showMetronome
        metronomeOn={metro}
        onMetronomeToggle={() => setMetro((m) => !m)}
      />
    );
  },
};
