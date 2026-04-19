import type { Meta, StoryObj } from "@storybook/react";
import React, { useMemo, useState } from "react";
import { SettingsPanel } from "./SettingsPanel.1.0.0";
import type { SettingsPanelController } from "./SettingsPanel.1.0.0";

const meta: Meta<typeof SettingsPanel> = {
  title: "Components/SettingsPanel",
  component: SettingsPanel,
  argTypes: {
    columns: { control: { type: "inline-radio" }, options: [1, 2] },
    rows: { control: { type: "inline-radio" }, options: [1, 2] },
  },
};

export default meta;
type Story = StoryObj<typeof SettingsPanel>;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type ControllerSpec = {
  label: string;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  initial: number;
  variant?: SettingsPanelController["variant"];
};

function useControllersFromSpecs(specs: readonly ControllerSpec[]) {
  const [values, setValues] = useState(() => specs.map((s) => s.initial));

  return useMemo(
    () =>
      specs.map((s, i) => {
        const value = values[i] ?? s.initial;
        const sliderNorm = (value - s.min) / (s.max - s.min);
        const step = s.step ?? 1;
        return {
          label: s.label,
          value,
          suffix: s.suffix,
          min: s.min,
          max: s.max,
          step: s.step,
          sliderNorm,
          variant: s.variant,
          onSliderChange: (norm: number) => {
            const raw = s.min + norm * (s.max - s.min);
            const stepped = Math.round(raw / step) * step;
            setValues((prev) => {
              const next = [...prev];
              next[i] = clamp(stepped, s.min, s.max);
              return next;
            });
          },
          onValueChange: (v: number) => {
            setValues((prev) => {
              const next = [...prev];
              next[i] = clamp(v, s.min, s.max);
              return next;
            });
          },
        };
      }),
    [specs, values],
  );
}

const SPEC_SINGLE: ControllerSpec[] = [
  {
    label: "Amount",
    suffix: "%",
    min: 0,
    max: 100,
    step: 1,
    initial: 50,
  },
];

export const Default: Story = {
  render: function DefaultStory() {
    const controllers = useControllersFromSpecs(SPEC_SINGLE);
    return (
      <div style={{ width: 200 }}>
        <SettingsPanel
          categoryTitle="Example"
          columns={1}
          rows={1}
          controllers={controllers}
        />
      </div>
    );
  },
};

const SPEC_ENVELOPE: ControllerSpec[] = [
  {
    label: "Attack",
    suffix: "ms",
    min: 0,
    max: 500,
    step: 5,
    initial: 50,
  },
  {
    label: "Sustain",
    suffix: "%",
    min: 0,
    max: 100,
    step: 1,
    initial: 80,
  },
  {
    label: "Release",
    suffix: "ms",
    min: 10,
    max: 500,
    step: 5,
    initial: 200,
  },
  {
    label: "Decay",
    suffix: "ms",
    min: 0,
    max: 500,
    step: 5,
    initial: 120,
  },
];

export const Envelope2x2: Story = {
  render: function EnvelopeStory() {
    const controllers = useControllersFromSpecs(SPEC_ENVELOPE);
    return (
      <div style={{ width: 400 }}>
        <SettingsPanel
          categoryTitle="Envelope"
          columns={2}
          rows={2}
          controllers={controllers}
        />
      </div>
    );
  },
};

const SPEC_CHORUS: ControllerSpec[] = [
  {
    label: "Mix",
    suffix: "%",
    min: 0,
    max: 100,
    step: 1,
    initial: 30,
    variant: "colour",
  },
  {
    label: "Depth",
    suffix: "%",
    min: 0,
    max: 100,
    step: 1,
    initial: 60,
    variant: "colour",
  },
];

export const Chorus1x2: Story = {
  render: function ChorusStory() {
    const controllers = useControllersFromSpecs(SPEC_CHORUS);
    return (
      <div style={{ width: 200 }}>
        <SettingsPanel
          categoryTitle="Chorus"
          columns={1}
          rows={2}
          controllers={controllers}
        />
      </div>
    );
  },
};

const SPEC_DELAY: ControllerSpec[] = [
  {
    label: "Time",
    suffix: "ms",
    min: 0,
    max: 2000,
    step: 10,
    initial: 320,
  },
  {
    label: "Feedback",
    suffix: "%",
    min: 0,
    max: 100,
    step: 1,
    initial: 15,
  },
];

export const NoTitle: Story = {
  render: function NoTitleStory() {
    const controllers = useControllersFromSpecs(SPEC_DELAY);
    return (
      <div style={{ width: 200 }}>
        <SettingsPanel columns={1} rows={2} controllers={controllers} />
      </div>
    );
  },
};

const SPEC_THEME_PAIR: ControllerSpec[] = [
  {
    label: "A",
    suffix: "",
    min: 0,
    max: 10,
    step: 1,
    initial: 3,
    variant: "theme",
  },
  {
    label: "B",
    suffix: "",
    min: 0,
    max: 10,
    step: 1,
    initial: 7,
    variant: "theme",
  },
];

export const ControlSurface: Story = {
  render: function ControlSurfaceStory() {
    const envelope = useControllersFromSpecs(SPEC_ENVELOPE);
    const chorus = useControllersFromSpecs(SPEC_CHORUS);
    const themePair = useControllersFromSpecs(SPEC_THEME_PAIR);
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, max-content)",
          gap: 24,
          maxWidth: 900,
        }}
      >
        <SettingsPanel
          categoryTitle="Envelope"
          columns={2}
          rows={2}
          controllers={envelope}
        />
        <SettingsPanel
          categoryTitle="Chorus"
          columns={1}
          rows={2}
          controllers={chorus}
        />
        <SettingsPanel
          categoryTitle="Pair"
          columns={2}
          rows={1}
          controllers={themePair}
        />
      </div>
    );
  },
};

export const DarkBackground: Story = {
  render: function DarkBackgroundStory() {
    const envelope = useControllersFromSpecs(SPEC_ENVELOPE);
    return (
      <div
        style={{
          backgroundColor: "#1A1A1A",
          padding: 24,
          borderRadius: 16,
          maxWidth: 420,
        }}
      >
        <SettingsPanel
          categoryTitle="Envelope"
          columns={2}
          rows={2}
          controllers={envelope}
        />
      </div>
    );
  },
};
