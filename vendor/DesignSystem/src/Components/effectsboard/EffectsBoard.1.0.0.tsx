import React, { useMemo } from "react";
import type { ButtonRowOption } from "../buttonrow/ButtonRow.1.0.0";
import { SettingsPanel } from "../settingspanel/SettingsPanel.1.0.0";
import type { SettingsPanelController } from "../settingspanel/SettingsPanel.1.0.0";
import { ToneController } from "../tonecontroller/ToneController.1.0.0";
import type { ToneControllerSlider } from "../tonecontroller/ToneController.1.0.0";
import { layout, semanticColors } from "../../tokens/design-tokens";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function toNorm(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return (value - min) / (max - min);
}

/** Figma EffectsBoard horizontal scroll row — `minWidth` 1188 → gap128×9 + gap32 + gap4. */
const SCROLL_CONTENT_MIN_WIDTH =
  layout.gap128 * 9 + layout.gap32 + layout.gap4;

/** Figma EffectsBoard content height 240 → gap160 + gap80. */
const ROW_HEIGHT = layout.gap160 + layout.gap80;

/** Figma scroll row `itemSpacing` 26 → gap24 + gap2. */
const SECTION_GAP = layout.gap24 + layout.gap2;

const TONE_FILTER = { min: 0, max: 16, step: 0.1, suffix: "K" as const };
const TONE_DRIVE = { min: 0, max: 100, step: 1, suffix: "%" as const };
const TONE_REVERB = { min: 0, max: 100, step: 1, suffix: "%" as const };
const TONE_GLIDE = { min: 0, max: 5000, step: 1, suffix: "ms" as const };

const ENV_ATTACK = { min: 0, max: 500, step: 5, suffix: "ms" as const };
const ENV_SUSTAIN = { min: 0, max: 100, step: 1, suffix: "%" as const };
const ENV_RELEASE = { min: 10, max: 500, step: 5, suffix: "ms" as const };
const ENV_DECAY = { min: 0, max: 500, step: 5, suffix: "ms" as const };

const CHORUS_MIX = { min: 0, max: 100, step: 1, suffix: "%" as const };
const CHORUS_DEPTH = { min: 0, max: 100, step: 1, suffix: "ms" as const };

const LFO_RATE = { min: 0, max: 20, step: 0.1, suffix: "Hz" as const };
const LFO_DEPTH = { min: 0, max: 100, step: 1, suffix: "¢" as const };

const DELAY_TIME = { min: 0, max: 2000, step: 10, suffix: "ms" as const };
const DELAY_FEEDBACK = { min: 0, max: 100, step: 1, suffix: "%" as const };

const dividerStyle: React.CSSProperties = {
  width: layout.strokeS,
  alignSelf: "stretch",
  flexShrink: 0,
  backgroundColor: semanticColors.strokeWeak,
};

export interface EffectsBoardProps {
  waveformIndex: number;
  onWaveformChange: (index: number) => void;
  waveformOptions: ButtonRowOption[];
  filter: number;
  onFilterChange: (v: number) => void;
  drive: number;
  onDriveChange: (v: number) => void;
  reverb: number;
  onReverbChange: (v: number) => void;
  glide: number;
  onGlideChange: (v: number) => void;
  attack: number;
  onAttackChange: (v: number) => void;
  sustain: number;
  onSustainChange: (v: number) => void;
  release: number;
  onReleaseChange: (v: number) => void;
  decay: number;
  onDecayChange: (v: number) => void;
  chorusMix: number;
  onChorusMixChange: (v: number) => void;
  chorusDepth: number;
  onChorusDepthChange: (v: number) => void;
  pitchRate: number;
  onPitchRateChange: (v: number) => void;
  pitchDepth: number;
  onPitchDepthChange: (v: number) => void;
  delayTime: number;
  onDelayTimeChange: (v: number) => void;
  feedback: number;
  onFeedbackChange: (v: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EffectsBoard: React.FC<EffectsBoardProps> = ({
  waveformIndex,
  onWaveformChange,
  waveformOptions,
  filter,
  onFilterChange,
  drive,
  onDriveChange,
  reverb,
  onReverbChange,
  glide,
  onGlideChange,
  attack,
  onAttackChange,
  sustain,
  onSustainChange,
  release,
  onReleaseChange,
  decay,
  onDecayChange,
  chorusMix,
  onChorusMixChange,
  chorusDepth,
  onChorusDepthChange,
  pitchRate,
  onPitchRateChange,
  pitchDepth,
  onPitchDepthChange,
  delayTime,
  onDelayTimeChange,
  feedback,
  onFeedbackChange,
  className,
  style,
}) => {
  const toneSliders: ToneControllerSlider[] = useMemo(
    () => [
      {
        title: "Filter",
        value: filter,
        suffix: TONE_FILTER.suffix,
        min: TONE_FILTER.min,
        max: TONE_FILTER.max,
        step: TONE_FILTER.step,
        onChange: onFilterChange,
      },
      {
        title: "Drive",
        value: drive,
        suffix: TONE_DRIVE.suffix,
        min: TONE_DRIVE.min,
        max: TONE_DRIVE.max,
        step: TONE_DRIVE.step,
        onChange: onDriveChange,
      },
      {
        title: "Reverb",
        value: reverb,
        suffix: TONE_REVERB.suffix,
        min: TONE_REVERB.min,
        max: TONE_REVERB.max,
        step: TONE_REVERB.step,
        onChange: onReverbChange,
      },
      {
        title: "Glide",
        value: glide,
        suffix: TONE_GLIDE.suffix,
        min: TONE_GLIDE.min,
        max: TONE_GLIDE.max,
        step: TONE_GLIDE.step,
        onChange: onGlideChange,
      },
    ],
    [
      filter,
      onFilterChange,
      drive,
      onDriveChange,
      reverb,
      onReverbChange,
      glide,
      onGlideChange,
    ],
  );

  const envelopeControllers: SettingsPanelController[] = useMemo(
    () => [
      {
        label: "Attack",
        value: attack,
        suffix: ENV_ATTACK.suffix,
        min: ENV_ATTACK.min,
        max: ENV_ATTACK.max,
        step: ENV_ATTACK.step,
        sliderNorm: toNorm(attack, ENV_ATTACK.min, ENV_ATTACK.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw = ENV_ATTACK.min + norm * (ENV_ATTACK.max - ENV_ATTACK.min);
          const stepped = Math.round(raw / ENV_ATTACK.step) * ENV_ATTACK.step;
          onAttackChange(clamp(stepped, ENV_ATTACK.min, ENV_ATTACK.max));
        },
        onValueChange: (v) =>
          onAttackChange(clamp(v, ENV_ATTACK.min, ENV_ATTACK.max)),
      },
      {
        label: "Sustain",
        value: sustain,
        suffix: ENV_SUSTAIN.suffix,
        min: ENV_SUSTAIN.min,
        max: ENV_SUSTAIN.max,
        step: ENV_SUSTAIN.step,
        sliderNorm: toNorm(sustain, ENV_SUSTAIN.min, ENV_SUSTAIN.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw =
            ENV_SUSTAIN.min + norm * (ENV_SUSTAIN.max - ENV_SUSTAIN.min);
          const stepped = Math.round(raw / ENV_SUSTAIN.step) * ENV_SUSTAIN.step;
          onSustainChange(clamp(stepped, ENV_SUSTAIN.min, ENV_SUSTAIN.max));
        },
        onValueChange: (v) =>
          onSustainChange(clamp(v, ENV_SUSTAIN.min, ENV_SUSTAIN.max)),
      },
      {
        label: "Release",
        value: release,
        suffix: ENV_RELEASE.suffix,
        min: ENV_RELEASE.min,
        max: ENV_RELEASE.max,
        step: ENV_RELEASE.step,
        sliderNorm: toNorm(release, ENV_RELEASE.min, ENV_RELEASE.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw =
            ENV_RELEASE.min + norm * (ENV_RELEASE.max - ENV_RELEASE.min);
          const stepped = Math.round(raw / ENV_RELEASE.step) * ENV_RELEASE.step;
          onReleaseChange(clamp(stepped, ENV_RELEASE.min, ENV_RELEASE.max));
        },
        onValueChange: (v) =>
          onReleaseChange(clamp(v, ENV_RELEASE.min, ENV_RELEASE.max)),
      },
      {
        label: "Decay",
        value: decay,
        suffix: ENV_DECAY.suffix,
        min: ENV_DECAY.min,
        max: ENV_DECAY.max,
        step: ENV_DECAY.step,
        sliderNorm: toNorm(decay, ENV_DECAY.min, ENV_DECAY.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw = ENV_DECAY.min + norm * (ENV_DECAY.max - ENV_DECAY.min);
          const stepped = Math.round(raw / ENV_DECAY.step) * ENV_DECAY.step;
          onDecayChange(clamp(stepped, ENV_DECAY.min, ENV_DECAY.max));
        },
        onValueChange: (v) =>
          onDecayChange(clamp(v, ENV_DECAY.min, ENV_DECAY.max)),
      },
    ],
    [
      attack,
      onAttackChange,
      sustain,
      onSustainChange,
      release,
      onReleaseChange,
      decay,
      onDecayChange,
    ],
  );

  const chorusControllers: SettingsPanelController[] = useMemo(
    () => [
      {
        label: "Mix",
        value: chorusMix,
        suffix: CHORUS_MIX.suffix,
        min: CHORUS_MIX.min,
        max: CHORUS_MIX.max,
        step: CHORUS_MIX.step,
        sliderNorm: toNorm(chorusMix, CHORUS_MIX.min, CHORUS_MIX.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw =
            CHORUS_MIX.min + norm * (CHORUS_MIX.max - CHORUS_MIX.min);
          const stepped =
            Math.round(raw / CHORUS_MIX.step) * CHORUS_MIX.step;
          onChorusMixChange(
            clamp(stepped, CHORUS_MIX.min, CHORUS_MIX.max),
          );
        },
        onValueChange: (v) =>
          onChorusMixChange(clamp(v, CHORUS_MIX.min, CHORUS_MIX.max)),
      },
      {
        label: "Depth",
        value: chorusDepth,
        suffix: CHORUS_DEPTH.suffix,
        min: CHORUS_DEPTH.min,
        max: CHORUS_DEPTH.max,
        step: CHORUS_DEPTH.step,
        sliderNorm: toNorm(chorusDepth, CHORUS_DEPTH.min, CHORUS_DEPTH.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw =
            CHORUS_DEPTH.min + norm * (CHORUS_DEPTH.max - CHORUS_DEPTH.min);
          const stepped =
            Math.round(raw / CHORUS_DEPTH.step) * CHORUS_DEPTH.step;
          onChorusDepthChange(
            clamp(stepped, CHORUS_DEPTH.min, CHORUS_DEPTH.max),
          );
        },
        onValueChange: (v) =>
          onChorusDepthChange(clamp(v, CHORUS_DEPTH.min, CHORUS_DEPTH.max)),
      },
    ],
    [chorusMix, onChorusMixChange, chorusDepth, onChorusDepthChange],
  );

  const lfoControllers: SettingsPanelController[] = useMemo(
    () => [
      {
        label: "Pitch Rate",
        value: pitchRate,
        suffix: LFO_RATE.suffix,
        min: LFO_RATE.min,
        max: LFO_RATE.max,
        step: LFO_RATE.step,
        sliderNorm: toNorm(pitchRate, LFO_RATE.min, LFO_RATE.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw = LFO_RATE.min + norm * (LFO_RATE.max - LFO_RATE.min);
          const stepped = Math.round(raw / LFO_RATE.step) * LFO_RATE.step;
          onPitchRateChange(clamp(stepped, LFO_RATE.min, LFO_RATE.max));
        },
        onValueChange: (v) =>
          onPitchRateChange(clamp(v, LFO_RATE.min, LFO_RATE.max)),
      },
      {
        label: "Pitch Depth",
        value: pitchDepth,
        suffix: LFO_DEPTH.suffix,
        min: LFO_DEPTH.min,
        max: LFO_DEPTH.max,
        step: LFO_DEPTH.step,
        sliderNorm: toNorm(pitchDepth, LFO_DEPTH.min, LFO_DEPTH.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw = LFO_DEPTH.min + norm * (LFO_DEPTH.max - LFO_DEPTH.min);
          const stepped = Math.round(raw / LFO_DEPTH.step) * LFO_DEPTH.step;
          onPitchDepthChange(clamp(stepped, LFO_DEPTH.min, LFO_DEPTH.max));
        },
        onValueChange: (v) =>
          onPitchDepthChange(clamp(v, LFO_DEPTH.min, LFO_DEPTH.max)),
      },
    ],
    [pitchRate, onPitchRateChange, pitchDepth, onPitchDepthChange],
  );

  const delayControllers: SettingsPanelController[] = useMemo(
    () => [
      {
        label: "Time",
        value: delayTime,
        suffix: DELAY_TIME.suffix,
        min: DELAY_TIME.min,
        max: DELAY_TIME.max,
        step: DELAY_TIME.step,
        sliderNorm: toNorm(delayTime, DELAY_TIME.min, DELAY_TIME.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw = DELAY_TIME.min + norm * (DELAY_TIME.max - DELAY_TIME.min);
          const stepped = Math.round(raw / DELAY_TIME.step) * DELAY_TIME.step;
          onDelayTimeChange(clamp(stepped, DELAY_TIME.min, DELAY_TIME.max));
        },
        onValueChange: (v) =>
          onDelayTimeChange(clamp(v, DELAY_TIME.min, DELAY_TIME.max)),
      },
      {
        label: "Feedback",
        value: feedback,
        suffix: DELAY_FEEDBACK.suffix,
        min: DELAY_FEEDBACK.min,
        max: DELAY_FEEDBACK.max,
        step: DELAY_FEEDBACK.step,
        sliderNorm: toNorm(feedback, DELAY_FEEDBACK.min, DELAY_FEEDBACK.max),
        variant: "default",
        onSliderChange: (norm) => {
          const raw =
            DELAY_FEEDBACK.min +
            norm * (DELAY_FEEDBACK.max - DELAY_FEEDBACK.min);
          const stepped =
            Math.round(raw / DELAY_FEEDBACK.step) * DELAY_FEEDBACK.step;
          onFeedbackChange(
            clamp(stepped, DELAY_FEEDBACK.min, DELAY_FEEDBACK.max),
          );
        },
        onValueChange: (v) =>
          onFeedbackChange(clamp(v, DELAY_FEEDBACK.min, DELAY_FEEDBACK.max)),
      },
    ],
    [delayTime, onDelayTimeChange, feedback, onFeedbackChange],
  );

  const scrollStyle: React.CSSProperties = {
    overflowX: "auto",
    overflowY: "visible",
    width: "100%",
    ...style,
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: SECTION_GAP,
    minWidth: SCROLL_CONTENT_MIN_WIDTH,
    minHeight: ROW_HEIGHT,
  };

  return (
    <div className={className} style={scrollStyle}>
      <div style={rowStyle}>
        <ToneController
          waveformIndex={waveformIndex}
          onWaveformChange={onWaveformChange}
          waveformOptions={waveformOptions}
          sliders={toneSliders}
        />
        <div
          aria-orientation="vertical"
          role="separator"
          style={dividerStyle}
        />
        <SettingsPanel
          categoryTitle="Envelope"
          columns={2}
          rows={2}
          controllers={envelopeControllers}
        />
        <div
          aria-orientation="vertical"
          role="separator"
          style={dividerStyle}
        />
        <SettingsPanel
          categoryTitle="Chorus"
          columns={1}
          rows={2}
          controllers={chorusControllers}
        />
        <div
          aria-orientation="vertical"
          role="separator"
          style={dividerStyle}
        />
        <SettingsPanel
          categoryTitle="LFO"
          columns={1}
          rows={2}
          controllers={lfoControllers}
        />
        <div
          aria-orientation="vertical"
          role="separator"
          style={dividerStyle}
        />
        <SettingsPanel
          categoryTitle="Delay"
          columns={1}
          rows={2}
          controllers={delayControllers}
        />
      </div>
    </div>
  );
};

EffectsBoard.displayName = "EffectsBoard";
export default EffectsBoard;
