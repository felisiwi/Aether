import React, { useCallback } from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";
import { HandleSlider } from "../handleslider/HandleSlider.1.0.0";
import type { HandleSliderVariant } from "../handleslider/HandleSlider.1.0.0";

export type ParameterControlVariant = "default" | "colour" | "theme";

/** Props for ParameterControl — label + slider + value readout for an audio parameter. */
export interface ParameterControlProps {
  /** Parameter name shown as the label. */
  label: string;
  /** Current raw value in [min, max]. */
  value: number;
  /** Minimum raw value. */
  min: number;
  /** Maximum raw value. */
  max: number;
  /** Step increment. */
  step: number;
  /** Formats the raw value for display (e.g. v => `${v}ms`). */
  format: (value: number) => string;
  /** Called with the new raw value on change. */
  onChange: (value: number) => void;
  /** Visual variant. */
  variant?: ParameterControlVariant;
  /** Use dark-mode token palette. */
  darkMode?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

export const ParameterControl: React.FC<ParameterControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  variant = "default",
  darkMode = false,
  disabled = false,
  className,
  style,
}) => {
  const textColor = darkMode ? colors.textBodyNeutralDark : colors.textBodyNeutral;
  const valueColor = darkMode ? colors.textBodyNeutralDark : colors.textLabel;
  const range = max - min;

  const normalised = range > 0 ? (value - min) / range : 0;

  const handleSliderChange = useCallback(
    (n: number) => {
      const raw = min + n * range;
      const snapped = Math.round(raw / step) * step;
      const clamped = Math.max(min, Math.min(max, snapped));
      onChange(clamped);
    },
    [min, max, step, range, onChange],
  );

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: layout.gap8,
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontWeight: labelType.fontWeight,
    fontStretch: `${labelType.fontWidth}%`,
    color: textColor,
    whiteSpace: "nowrap",
    minWidth: "4em",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const readoutStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    lineHeight: `${labelType.lineHeight}px`,
    fontWeight: labelType.fontWeight,
    fontStretch: `${labelType.fontWidth}%`,
    color: valueColor,
    fontVariantNumeric: "tabular-nums",
    minWidth: "3.5em",
    textAlign: "right",
    whiteSpace: "nowrap",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <div className={className} style={containerStyle}>
      <span style={labelStyle}>{label}</span>
      <HandleSlider
        value={normalised}
        onChange={handleSliderChange}
        variant={variant as HandleSliderVariant}
        darkMode={darkMode}
        disabled={disabled}
        style={{ flex: 1 }}
      />
      <span style={readoutStyle}>{format(value)}</span>
    </div>
  );
};

ParameterControl.displayName = "ParameterControl";
export default ParameterControl;
