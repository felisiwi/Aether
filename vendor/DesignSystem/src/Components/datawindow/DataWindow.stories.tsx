import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DataWindow } from "./DataWindow.1.0.0";

const meta: Meta<typeof DataWindow> = {
  title: "Components/DataWindow",
  component: DataWindow,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "colour", "theme"],
    },
    label: { control: "text" },
    compact: { control: "boolean" },
  },
  args: {
    variant: "default",
    label: "Chord",
    compact: false,
  },
};

export default meta;
type Story = StoryObj<typeof DataWindow>;

const sampleText: React.CSSProperties = {
  fontFamily: "Mona Sans, system-ui, sans-serif",
  fontSize: 24,
  fontWeight: 660,
  fontStretch: "120%",
  letterSpacing: -0.5,
  lineHeight: "32px",
  color: "#000",
  margin: 0,
};

const sampleSubtext: React.CSSProperties = {
  fontFamily: "Mona Sans, system-ui, sans-serif",
  fontSize: 13,
  lineHeight: "20px",
  color: "#00000099",
  margin: 0,
};

export const Default: Story = {
  args: {
    children: <p style={sampleText}>Cmaj7</p>,
  },
};

export const Colour: Story = {
  args: {
    variant: "colour",
    label: "Your Chord",
    children: <p style={sampleText}>Am9</p>,
  },
};

export const Theme: Story = {
  args: {
    variant: "theme",
    label: "Their Chord",
    children: <p style={sampleText}>Dm7</p>,
  },
};

export const Compact: Story = {
  args: {
    variant: "colour",
    label: "Latency",
    compact: true,
    children: (
      <span style={{ ...sampleText, fontSize: 16, lineHeight: "24px" }}>
        42 ms
      </span>
    ),
  },
};

export const WithMultipleLines: Story = {
  args: {
    variant: "colour",
    label: "Chord",
    children: (
      <div>
        <p style={sampleText}>Cmaj7</p>
        <p style={sampleSubtext}>C E G B</p>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ width: 160 }}>
        <DataWindow variant="default" label="Chord">
          <p style={sampleText}>Cmaj7</p>
          <p style={sampleSubtext}>C E G B</p>
        </DataWindow>
      </div>
      <div style={{ width: 160 }}>
        <DataWindow variant="colour" label="Your Chord">
          <p style={sampleText}>Am9</p>
          <p style={sampleSubtext}>A C E G B</p>
        </DataWindow>
      </div>
      <div style={{ width: 160 }}>
        <DataWindow variant="theme" label="Their Chord">
          <p style={sampleText}>Dm7</p>
          <p style={sampleSubtext}>D F A C</p>
        </DataWindow>
      </div>
    </div>
  ),
};

export const CompactRow: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <DataWindow variant="colour" label="Latency" compact>
        <span style={{ ...sampleText, fontSize: 16, lineHeight: "24px" }}>
          42 ms
        </span>
      </DataWindow>
      <DataWindow variant="colour" label="Waveform" compact>
        <span style={{ ...sampleText, fontSize: 16, lineHeight: "24px" }}>
          Sawtooth
        </span>
      </DataWindow>
      <DataWindow variant="colour" label="Gain" compact>
        <span style={{ ...sampleText, fontSize: 16, lineHeight: "24px" }}>
          0.75
        </span>
      </DataWindow>
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        backgroundColor: "#1A1A1A",
        padding: 24,
        borderRadius: 16,
      }}
    >
      <div style={{ width: 160 }}>
        <DataWindow variant="default" label="Chord">
          <p style={{ ...sampleText, color: "#fff" }}>Cmaj7</p>
          <p style={{ ...sampleSubtext, color: "#ffffff99" }}>C E G B</p>
        </DataWindow>
      </div>
      <div style={{ width: 160 }}>
        <DataWindow variant="colour" label="Your Chord">
          <p style={{ ...sampleText, color: "#fff" }}>Am9</p>
          <p style={{ ...sampleSubtext, color: "#ffffff99" }}>A C E G B</p>
        </DataWindow>
      </div>
      <div style={{ width: 160 }}>
        <DataWindow variant="theme" label="Their Chord">
          <p style={{ ...sampleText, color: "#fff" }}>Dm7</p>
          <p style={{ ...sampleSubtext, color: "#ffffff99" }}>D F A C</p>
        </DataWindow>
      </div>
    </div>
  ),
};
