import React from "react";
import {
  WaveSine,
  WaveTriangle,
  WaveSawtooth,
  WaveSquare,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../../tokens/design-tokens";

export type WaveformId = "sine" | "triangle" | "sawtooth" | "square";

const ORDER: WaveformId[] = ["sine", "triangle", "sawtooth", "square"];

const LABELS: Record<WaveformId, string> = {
  sine: "Sine",
  triangle: "Triangle",
  sawtooth: "Sawtooth",
  square: "Square",
};

const ICONS: Record<WaveformId, typeof WaveSine> = {
  sine: WaveSine,
  triangle: WaveTriangle,
  sawtooth: WaveSawtooth,
  square: WaveSquare,
};

export interface SoundWaveControllerProps {
  selectedWaveform: WaveformId;
  onWaveformChange: (waveform: WaveformId) => void;
  oscilloscopeVisible: boolean;
  onOscilloscopeToggle: () => void;
  oscilloscopeNode?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const btnType = typography.buttonS;
const labelType = typography.label;

export const SoundWaveController: React.FC<SoundWaveControllerProps> = ({
  selectedWaveform,
  onWaveformChange,
  oscilloscopeVisible,
  onOscilloscopeToggle,
  oscilloscopeNode,
  className,
  style,
}) => {
  const root: React.CSSProperties = {
    display: "flex",
    flexDirection: oscilloscopeVisible ? "row" : "column",
    alignItems: "stretch",
    gap: layout.gap16,
    ...style,
  };

  const wfBtn = (id: WaveformId, mode: "full" | "icon") => {
    const sel = id === selectedWaveform;
    const Icon = ICONS[id];
    const border = sel ? semanticColors.strokeColour : semanticColors.strokeMedium;
    const bg = sel
      ? semanticColors.buttonSurfacePrimary
      : semanticColors.backdropNautralBackground;
    const fg = sel ? semanticColors.buttonTextButtonText : colors.textHeadingNeutral;

    const pad =
      mode === "full"
        ? { padding: layout.gap8 }
        : {
            paddingLeft: layout.gap8,
            paddingRight: layout.gap8,
            paddingTop: layout.gap8,
            paddingBottom: layout.gap8,
            width: layout.gap48,
            justifyContent: "center" as const,
          };

    return (
      <button
        key={id}
        type="button"
        onClick={() => onWaveformChange(id)}
        aria-label={LABELS[id]}
        style={{
          display: "flex",
          flexDirection: mode === "full" ? "row" : "column",
          alignItems: "center",
          gap: layout.gap8,
          borderRadius: layout.radiusXs,
          border: `${layout.strokeS}px solid ${border}`,
          background: bg,
          color: fg,
          cursor: "pointer",
          fontFamily,
          fontSize: btnType.fontSize,
          fontWeight: btnType.fontWeight,
          lineHeight: `${btnType.lineHeight}px`,
          letterSpacing: btnType.letterSpacing,
          fontStretch: `${btnType.fontWidth}%`,
          ...pad,
        }}
      >
        <Icon size={layout.gap24} color={fg} weight="bold" />
        {mode === "full" ? LABELS[id] : null}
      </button>
    );
  };

  const toggleRow: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: layout.gap8,
    width: "100%",
  };

  const toggleLabel: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    color: colors.textHeadingNeutral,
  };

  const toggleBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: layout.gap40,
    height: layout.gap40,
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

  const leftCol: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: layout.gap8,
    minWidth: oscilloscopeVisible ? layout.gap48 : undefined,
    flex: oscilloscopeVisible ? "0 0 auto" : undefined,
  };

  const wfStack: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: layout.gap8,
  };

  const scopePanel: React.CSSProperties = {
    flex: "1 1 auto",
    minHeight: layout.gap128,
    minWidth: 0,
    borderRadius: layout.radiusS,
    border: `${layout.strokeS}px dashed ${semanticColors.strokeMedium}`,
    background: semanticColors.backdropStaticDarkenedWhite,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: layout.gap8,
    boxSizing: "border-box",
  };

  return (
    <div className={className} style={root}>
      <div style={leftCol}>
        <div style={toggleRow}>
          <span style={toggleLabel}>Oscilloscope</span>
          <button
            type="button"
            style={toggleBtn}
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

        <div style={wfStack}>
          {ORDER.map((id) => wfBtn(id, oscilloscopeVisible ? "icon" : "full"))}
        </div>
      </div>

      {oscilloscopeVisible ? (
        <div style={scopePanel} role="region" aria-label="Oscilloscope">
          {oscilloscopeNode ?? (
            <span
              style={{
                ...toggleLabel,
                color: colors.textBodyNeutral,
                textAlign: "center",
              }}
            >
              Oscilloscope canvas
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
};

SoundWaveController.displayName = "SoundWaveController";
export default SoundWaveController;
