import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import SoundWaveController, {
  type WaveformId,
} from "./SoundWaveController.1.3.0";

const meta: Meta<typeof SoundWaveController> = {
  component: SoundWaveController,
  title: "Components/SoundWaveController",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SoundWaveController>;

export const Default: Story = {
  render: function R() {
    const [wf, setWf] = useState<WaveformId>("sine");
    return (
      <SoundWaveController
        selectedWaveform={wf}
        onWaveformChange={setWf}
      />
    );
  },
};
