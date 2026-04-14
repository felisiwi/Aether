import React from "react";
import Icon from "../icon/Icon.1.2.0";
import { colors, semanticColors, layout } from "../../tokens/design-tokens";

export type WaveformId = "sine" | "triangle" | "sawtooth" | "square";

const ORDER: WaveformId[] = ["sine", "triangle", "sawtooth", "square"];

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
        alignItems: "stretch",
        width: "max-content",
        gap: layout.gap8,
        ...style,
      }}
    >
      {ORDER.map((waveform) => {
        const active = waveform === selectedWaveform;
        const background = active
          ? semanticColors.buttonSurfacePrimary
          : semanticColors.backdropStaticBlack;
        const fg = active ? colors.textLabel : semanticColors.semanticStrokeStaticStrokeWhiteSolid;
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
              justifyContent: "center",
              gap: layout.gap8,
              width: layout.gap40,
              minHeight: layout.gap40,
              paddingLeft: layout.gap8,
              paddingRight: layout.gap8,
              paddingTop: layout.gap4,
              paddingBottom: layout.gap4,
              borderRadius: layout.radiusM,
              border: "none",
              background,
              color: fg,
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <Icon name={ICONS[waveform]} size={32} color={fg} />
          </button>
        );
      })}
    </div>
  );
};

SoundWaveController.displayName = "SoundWaveController";
export default SoundWaveController;
