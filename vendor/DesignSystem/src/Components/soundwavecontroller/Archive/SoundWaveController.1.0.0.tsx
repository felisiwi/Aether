import React from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
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
  sawtooth: "Saw",
  square: "Square",
};

export interface SoundWaveControllerProps {
  selectedWaveform: WaveformId;
  onWaveformChange: (waveform: WaveformId) => void;
  oscilloscopeVisible: boolean;
  onOscilloscopeToggle: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const btnType = typography.buttonS;

export const SoundWaveController: React.FC<SoundWaveControllerProps> = ({
  selectedWaveform,
  onWaveformChange,
  oscilloscopeVisible,
  onOscilloscopeToggle,
  className,
  style,
}) => {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: layout.gap8,
    flexWrap: "wrap",
    ...style,
  };

  const wfBtn = (id: WaveformId) => {
    const sel = id === selectedWaveform;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onWaveformChange(id)}
        style={{
          fontFamily,
          fontSize: btnType.fontSize,
          fontWeight: btnType.fontWeight,
          lineHeight: `${btnType.lineHeight}px`,
          letterSpacing: btnType.letterSpacing,
          fontStretch: `${btnType.fontWidth}%`,
          paddingLeft: layout.gap8,
          paddingRight: layout.gap8,
          paddingTop: layout.gap4,
          paddingBottom: layout.gap4,
          borderRadius: layout.radiusXs,
          border: `${layout.strokeS}px solid ${
            sel ? semanticColors.strokeColour : semanticColors.strokeMedium
          }`,
          background: sel
            ? semanticColors.buttonSurfaceSmallbuttonDefault
            : semanticColors.backdropNautralBackground,
          color: sel ? colors.textHeadingColour : colors.textHeadingNeutral,
          cursor: "pointer",
        }}
      >
        {LABELS[id]}
      </button>
    );
  };

  const scopeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: layout.gap40,
    height: layout.gap40,
    marginLeft: layout.gap8,
    borderRadius: layout.radiusRound,
    border: `${layout.strokeS}px solid ${semanticColors.strokeMedium}`,
    background: oscilloscopeVisible
      ? semanticColors.backdropSurfaceColouredSurface
      : semanticColors.backdropStatesDisabledSurface,
    cursor: "pointer",
  };

  const iconColor = oscilloscopeVisible
    ? semanticColors.buttonTextButtonText
    : colors.textHeadingNeutral;

  return (
    <div className={className} style={rowStyle}>
      {ORDER.map((id) => wfBtn(id))}
      <button
        type="button"
        style={scopeStyle}
        onClick={onOscilloscopeToggle}
        aria-pressed={oscilloscopeVisible}
        aria-label={
          oscilloscopeVisible ? "Hide oscilloscope" : "Show oscilloscope"
        }
      >
        {oscilloscopeVisible ? (
          <Eye size={layout.gap24} color={iconColor} weight="bold" />
        ) : (
          <EyeSlash size={layout.gap24} color={iconColor} weight="bold" />
        )}
      </button>
    </div>
  );
};

SoundWaveController.displayName = "SoundWaveController";
export default SoundWaveController;
