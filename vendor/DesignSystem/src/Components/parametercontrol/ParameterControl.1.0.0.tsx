import React, { useCallback } from "react";
import { typography, fontFamily, colors, semanticColors, layout } from "../../tokens/design-tokens";
import { HandleSlider } from "../handleslider/HandleSlider.1.0.0";
import type { HandleSliderVariant } from "../handleslider/HandleSlider.1.0.0";

export type ParameterControlVariant = "default" | "colour" | "theme";
export interface ParameterControlProps { label: string; value: number; min: number; max: number; step: number; format: (value: number) => string; onChange: (value: number) => void; variant?: ParameterControlVariant; darkMode?: boolean; disabled?: boolean; className?: string; style?: React.CSSProperties; }

const labelType = typography.label;

export const ParameterControl: React.FC<ParameterControlProps> = ({ label, value, min, max, step, format, onChange, variant = "default", darkMode = false, disabled = false, className, style }) => {
  const textColor = darkMode ? colors.textBodyNeutralDark : colors.textBodyNeutral;
  const valueColor = darkMode ? colors.textBodyNeutralDark : colors.textLabel;
  const range = max - min;
  const normalised = range > 0 ? (value - min) / range : 0;
  const handleSliderChange = useCallback((n: number) => { const raw = min + n * range; const snapped = Math.round(raw / step) * step; onChange(Math.max(min, Math.min(max, snapped))); }, [min, max, step, range, onChange]);
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: layout.gap8, ...style }}>
      <span style={{ fontFamily, fontSize: labelType.fontSize, lineHeight: `${labelType.lineHeight}px`, letterSpacing: labelType.letterSpacing, fontWeight: labelType.fontWeight, fontStretch: `${labelType.fontWidth}%`, color: textColor, whiteSpace: "nowrap", minWidth: "4em", fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>{label}</span>
      <HandleSlider value={normalised} onChange={handleSliderChange} variant={variant as HandleSliderVariant} darkMode={darkMode} disabled={disabled} style={{ flex: 1 }} />
      <span style={{ fontFamily, fontSize: labelType.fontSize, lineHeight: `${labelType.lineHeight}px`, fontWeight: labelType.fontWeight, fontStretch: `${labelType.fontWidth}%`, color: valueColor, fontVariantNumeric: "tabular-nums", minWidth: "3.5em", textAlign: "right", whiteSpace: "nowrap", fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1" }}>{format(value)}</span>
    </div>
  );
};
ParameterControl.displayName = "ParameterControl";
export default ParameterControl;
