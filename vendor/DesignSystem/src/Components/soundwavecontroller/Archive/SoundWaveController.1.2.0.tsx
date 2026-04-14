import React from "react";
import Icon from "../icon/Icon.1.2.0";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type WaveformId = "sine" | "triangle" | "sawtooth" | "square";

const ORDER: WaveformId[] = ["sine", "triangle", "sawtooth", "square"];

const LABELS: Record<WaveformId, string> = {
  sine: "Sine",
  triangle: "Triangle",
  sawtooth: "Sawtooth",
  square: "Square",
};

const ICONS: Record<WaveformId, "waveform-sine" | "waveform-triangle" | "waveform-sawtooth" | "waveform-square"> = {
  sine: "waveform-sine",
  triangle: "waveform-triangle",
  sawtooth: "waveform-sawtooth",
  square: "waveform-square",
};

export interface SoundWaveControllerProps {
  selectedWaveform: WaveformId;
  onWaveformChange: (waveform: WaveformId) => void;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

export const SoundWaveController: React.FC<SoundWaveControllerProps> = ({
  selectedWaveform,
  onWaveformChange,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: layout.gap8,
        ...style,
      }}
    >
      {ORDER.map((waveform) => {
        const active = waveform === selectedWaveform;
        const fg = active ? colors.textHeadingNeutral : semanticColors.backdropStaticWhite;
        return (
          <button
            key={waveform}
            type="button"
            onClick={() => onWaveformChange(waveform)}
            aria-pressed={active}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: layout.gap4,
              minHeight: layout.gap40,
              paddingLeft: layout.gap8,
              paddingRight: layout.gap8,
              paddingTop: layout.gap4,
              paddingBottom: layout.gap4,
              borderRadius: layout.radiusS,
              border: `${layout.strokeS}px solid ${
                active ? semanticColors.strokeColour : semanticColors.strokeMedium
              }`,
              background: active
                ? semanticColors.wrapperColourPressed
                : semanticColors.backdropInvertedBackground,
              color: fg,
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <Icon name={ICONS[waveform]} size={32} color={fg} />
            <span
              style={{
                fontFamily,
                fontSize: labelType.fontSize,
                fontWeight: labelType.fontWeight,
                lineHeight: `${labelType.lineHeight}px`,
                letterSpacing: labelType.letterSpacing,
                fontStretch: `${labelType.fontWidth}%`,
                color: fg,
                fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
              }}
            >
              {LABELS[waveform]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

SoundWaveController.displayName = "SoundWaveController";
export default SoundWaveController;
