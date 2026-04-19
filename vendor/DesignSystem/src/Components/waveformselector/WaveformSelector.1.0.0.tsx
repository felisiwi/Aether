import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type WaveformType = "sine" | "triangle" | "sawtooth" | "square";
export type WaveformSelectorVariant = "default" | "colour" | "theme";

/** Props for WaveformSelector — radio-button group for oscillator waveform types. */
export interface WaveformSelectorProps {
  /** Currently selected waveform. */
  value: WaveformType;
  /** Called when the user picks a different waveform. */
  onChange: (waveform: WaveformType) => void;
  /** Visual variant: default (neutral), colour (orange/local), theme (purple/remote). */
  variant?: WaveformSelectorVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Disable all options. */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const WAVEFORMS: WaveformType[] = ["sine", "triangle", "sawtooth", "square"];
const bodyS = typography.bodyS;

interface VariantTokens {
  selectedText: string;
  unselectedText: string;
  ringSelected: string;
  ringUnselected: string;
  dotColor: string;
}

function getTokens(variant: WaveformSelectorVariant, dark: boolean): VariantTokens {
  const unselectedText = dark ? colors.textBodyNeutralDark : colors.textBodyNeutral;
  const ringUnselected = dark
    ? semanticColors.strokeInvertedSolid
    : semanticColors.strokeSolid;

  switch (variant) {
    case "colour":
      return {
        selectedText: dark
          ? semanticColors.strokeInvertedSolid
          : colors.textHeadingNeutral,
        unselectedText,
        ringSelected: semanticColors.buttonSurfacePrimary,
        ringUnselected,
        dotColor: semanticColors.buttonSurfacePrimary,
      };
    case "theme":
      return {
        selectedText: dark
          ? semanticColors.strokeInvertedSolid
          : colors.textHeadingNeutral,
        unselectedText,
        ringSelected: semanticColors.backdropSurfaceThemedSurface,
        ringUnselected,
        dotColor: semanticColors.backdropSurfaceThemedSurface,
      };
    default:
      return {
        selectedText: dark
          ? semanticColors.strokeInvertedSolid
          : colors.textHeadingNeutral,
        unselectedText,
        ringSelected: dark
          ? semanticColors.strokeInvertedSolid
          : semanticColors.strokeSolid,
        ringUnselected,
        dotColor: dark
          ? semanticColors.strokeInvertedSolid
          : semanticColors.strokeSolid,
      };
  }
}

const RADIO_SIZE = layout.gap16;
const DOT_SIZE = layout.gap8;

export const WaveformSelector: React.FC<WaveformSelectorProps> = ({
  value,
  onChange,
  variant = "default",
  darkMode = false,
  disabled = false,
  className,
  style,
}) => {
  const tokens = getTokens(variant, darkMode);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: layout.gap4,
    opacity: disabled ? 0.4 : 1,
    ...style,
  };

  return (
    <div className={className} style={containerStyle} role="radiogroup" aria-label="Waveform">
      {WAVEFORMS.map((w) => {
        const selected = value === w;
        return (
          <label
            key={w}
            onClick={() => !disabled && onChange(w)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: layout.gap8,
              fontFamily,
              fontSize: bodyS.fontSize,
              lineHeight: `${bodyS.lineHeight}px`,
              letterSpacing: bodyS.letterSpacing,
              color: selected ? tokens.selectedText : tokens.unselectedText,
              cursor: disabled ? "default" : "pointer",
            }}
          >
            <span
              role="radio"
              aria-checked={selected}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onChange(w);
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: RADIO_SIZE,
                height: RADIO_SIZE,
                borderRadius: layout.radiusRound,
                borderWidth: layout.strokeM,
                borderStyle: "solid",
                borderColor: selected ? tokens.ringSelected : tokens.ringUnselected,
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              {selected && (
                <span
                  style={{
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: layout.radiusRound,
                    backgroundColor: tokens.dotColor,
                  }}
                />
              )}
            </span>
            {w}
          </label>
        );
      })}
    </div>
  );
};

WaveformSelector.displayName = "WaveformSelector";
export default WaveformSelector;
