import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { SettingsPanel } from "./SettingsPanel.1.0.0";
import { ParameterControl } from "../parametercontrol/ParameterControl.1.0.0";
import { WaveformSelector } from "../waveformselector/WaveformSelector.1.0.0";
import type { WaveformType } from "../waveformselector/WaveformSelector.1.0.0";

const meta: Meta<typeof SettingsPanel> = {
  title: "Components/SettingsPanel",
  component: SettingsPanel,
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "colour", "theme"] },
    darkMode: { control: "boolean" },
  },
  args: {
    label: "Effects",
    variant: "default",
    darkMode: false,
  },
};

export default meta;
type Story = StoryObj<typeof SettingsPanel>;

export const Default: Story = {
  args: {
    children: <div style={{ fontSize: 13, color: "#0009" }}>Controls go here</div>,
  },
};

function EnvelopePanel({ variant, darkMode }: { variant: "default" | "colour" | "theme"; darkMode?: boolean }) {
  const [attack, setAttack] = useState(50);
  const [release, setRelease] = useState(200);
  return (
    <SettingsPanel label="Envelope" variant={variant} darkMode={darkMode}>
      <ParameterControl label="Attack" value={attack} min={0} max={500} step={5} format={(v) => `${v}ms`} onChange={setAttack} variant={variant} darkMode={darkMode} />
      <ParameterControl label="Release" value={release} min={10} max={500} step={5} format={(v) => `${v}ms`} onChange={setRelease} variant={variant} darkMode={darkMode} />
    </SettingsPanel>
  );
}

function InstrumentPanel({ variant, darkMode }: { variant: "default" | "colour" | "theme"; darkMode?: boolean }) {
  const [wf, setWf] = useState<WaveformType>("sine");
  return (
    <SettingsPanel label="Instrument" variant={variant} darkMode={darkMode}>
      <WaveformSelector value={wf} onChange={setWf} variant={variant} darkMode={darkMode} />
    </SettingsPanel>
  );
}

export const WithEnvelope: Story = {
  render: () => <div style={{ width: 280 }}><EnvelopePanel variant="colour" /></div>,
};

export const ControlSurface: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 800 }}>
      <InstrumentPanel variant="colour" />
      <EnvelopePanel variant="colour" />
      <EnvelopePanel variant="theme" />
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        maxWidth: 800,
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <InstrumentPanel variant="colour" darkMode />
      <EnvelopePanel variant="colour" darkMode />
      <EnvelopePanel variant="theme" darkMode />
    </div>
  ),
};
