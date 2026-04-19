import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DataWindow } from "./DataWindow.1.0.0";
import {
  typography,
  fontFamily,
  colors,
  layout,
  semanticColors,
} from "../../tokens/design-tokens";

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
    label: "Attack",
    compact: false,
  },
};

export default meta;
type Story = StoryObj<typeof DataWindow>;

const valueText: React.CSSProperties = {
  fontFamily,
  fontSize: typography.titleM.fontSize,
  fontWeight: typography.titleM.fontWeight,
  lineHeight: `${typography.titleM.lineHeight}px`,
  fontStretch: `${typography.titleM.fontWidth}%`,
  letterSpacing: typography.titleM.letterSpacing,
  color: colors.textHeadingNeutral,
  margin: 0,
};

const subText: React.CSSProperties = {
  fontFamily,
  fontSize: typography.bodyS.fontSize,
  lineHeight: `${typography.bodyS.lineHeight}px`,
  color: colors.textBodyNeutral,
  margin: 0,
};

export const Default: Story = {
  args: {
    children: <p style={valueText}>12 ms</p>,
  },
};

export const Colour: Story = {
  args: {
    variant: "colour",
    label: "Filter cutoff",
    children: <p style={valueText}>2.4 kHz</p>,
  },
};

export const Theme: Story = {
  args: {
    variant: "theme",
    label: "Resonance",
    children: <p style={valueText}>0.62</p>,
  },
};

export const Compact: Story = {
  args: {
    variant: "colour",
    label: "Gain",
    compact: true,
    children: (
      <span
        style={{
          ...valueText,
          fontSize: typography.titleS.fontSize,
          lineHeight: `${typography.titleS.lineHeight}px`,
        }}
      >
        0.75
      </span>
    ),
  },
};

export const WithMultipleLines: Story = {
  args: {
    variant: "colour",
    label: "Envelope",
    children: (
      <div>
        <p style={valueText}>240 ms</p>
        <p style={subText}>Release stage</p>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: layout.gap24, alignItems: "flex-start" }}>
      <div style={{ width: layout.gap160 }}>
        <DataWindow variant="default" label="Attack">
          <p style={valueText}>8 ms</p>
          <p style={subText}>Note on</p>
        </DataWindow>
      </div>
      <div style={{ width: layout.gap160 }}>
        <DataWindow variant="colour" label="Decay">
          <p style={valueText}>120 ms</p>
          <p style={subText}>Shape A</p>
        </DataWindow>
      </div>
      <div style={{ width: layout.gap160 }}>
        <DataWindow variant="theme" label="Sustain">
          <p style={valueText}>−8 dB</p>
          <p style={subText}>Level</p>
        </DataWindow>
      </div>
    </div>
  ),
};

export const CompactRow: Story = {
  render: () => (
    <div style={{ display: "flex", gap: layout.gap16, alignItems: "flex-start" }}>
      <DataWindow variant="colour" label="Latency" compact>
        <span
          style={{
            ...valueText,
            fontSize: typography.titleS.fontSize,
            lineHeight: `${typography.titleS.lineHeight}px`,
          }}
        >
          42 ms
        </span>
      </DataWindow>
      <DataWindow variant="colour" label="Waveform" compact>
        <span
          style={{
            ...valueText,
            fontSize: typography.titleS.fontSize,
            lineHeight: `${typography.titleS.lineHeight}px`,
          }}
        >
          Sawtooth
        </span>
      </DataWindow>
      <DataWindow variant="colour" label="Gain" compact>
        <span
          style={{
            ...valueText,
            fontSize: typography.titleS.fontSize,
            lineHeight: `${typography.titleS.lineHeight}px`,
          }}
        >
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
        gap: layout.gap24,
        alignItems: "flex-start",
        background: semanticColors.backdropInvertedBackground,
        padding: layout.gap24,
        borderRadius: layout.radiusM,
      }}
    >
      <div style={{ width: layout.gap160 }}>
        <DataWindow variant="default" label="LFO rate">
          <p style={{ ...valueText, color: semanticColors.backdropStaticWhite }}>3.2 Hz</p>
          <p style={{ ...subText, color: semanticColors.backdropOpacityAdaptiveOpacityLightenedStrong }}>
            Slow sweep
          </p>
        </DataWindow>
      </div>
      <div style={{ width: layout.gap160 }}>
        <DataWindow variant="colour" label="Drive">
          <p style={{ ...valueText, color: semanticColors.backdropStaticWhite }}>18%</p>
          <p style={{ ...subText, color: semanticColors.backdropOpacityAdaptiveOpacityLightenedStrong }}>
            Saturation
          </p>
        </DataWindow>
      </div>
      <div style={{ width: layout.gap160 }}>
        <DataWindow variant="theme" label="Pan">
          <p style={{ ...valueText, color: semanticColors.backdropStaticWhite }}>−0.12</p>
          <p style={{ ...subText, color: semanticColors.backdropOpacityAdaptiveOpacityLightenedStrong }}>
            Stereo
          </p>
        </DataWindow>
      </div>
    </div>
  ),
};
