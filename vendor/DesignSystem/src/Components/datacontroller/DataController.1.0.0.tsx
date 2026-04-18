import React, { useCallback, useId, useState } from "react";
import {
  typography,
  fontFamily,
  colors,
  layout,
} from "../../tokens/design-tokens";
import { getPlayerTheme, type ThemeIndex } from "../../tokens/theme-map";
import { DataWindow } from "../datawindow/DataWindow.1.0.0";
import type { DataWindowVariant } from "../datawindow/DataWindow.1.0.0";
import { HandleSlider } from "../handleslider/HandleSlider.1.0.0";

/** Figma DataController — label + DataWindow + HandleSlider; width 136px (gap128 + gap8). */
export interface DataControllerProps {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  /** 0–1 normalised slider position. */
  sliderNorm: number;
  onSliderChange: (norm: number) => void;
  /** Called when the value changes via DataWindow scroll. */
  onValueChange?: (v: number) => void;
  variant?: DataWindowVariant;
  themeIndex?: ThemeIndex;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;
/** Snapshot: absoluteBoundingBox width 136 — Layout gap128 + gap8. */
const CONTROLLER_WIDTH = layout.gap128 + layout.gap8;
/** Snapshot boundVariables itemSpacing → VariableID:9053:53 → layout.gap8. */
const STACK_GAP = layout.gap8;

export const DataController: React.FC<DataControllerProps> = ({
  label,
  value,
  suffix,
  min,
  max,
  step = 1,
  sliderNorm,
  onSliderChange,
  onValueChange,
  variant = "default",
  themeIndex = 0,
  className,
  style,
}) => {
  const labelId = useId();
  const [sliderPressed, setSliderPressed] = useState(false);

  const labelColor =
    variant === "theme"
      ? getPlayerTheme(themeIndex).primary60
      : colors.textHeadingNeutral;

  const labelStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    color: labelColor,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
  };

  const rootStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: CONTROLLER_WIDTH,
    boxSizing: "border-box",
    gap: STACK_GAP,
    background: "transparent",
    ...style,
  };

  const handleDragStart = useCallback(() => {
    setSliderPressed(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setSliderPressed(false);
  }, []);

  return (
    <div
      className={className}
      style={rootStyle}
      role="group"
      aria-labelledby={labelId}
    >
      <span id={labelId} style={labelStyle}>
        {label}
      </span>
      <DataWindow
        compact
        variant={variant}
        value={value}
        suffix={suffix}
        min={min}
        max={max}
        step={step}
        onChange={onValueChange}
        isActive={sliderPressed}
      />
      <HandleSlider
        variant={variant}
        value={sliderNorm}
        onChange={onSliderChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        ariaLabel={`${label} slider`}
      />
    </div>
  );
};

DataController.displayName = "DataController";
export default DataController;
