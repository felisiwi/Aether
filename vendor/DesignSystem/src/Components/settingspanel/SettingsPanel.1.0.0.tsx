import React, { useId } from "react";
import {
  typography,
  fontFamily,
  colors,
  layout,
} from "../../tokens/design-tokens";
import { DataController } from "../datacontroller/DataController.1.0.0";

export interface SettingsPanelController {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  sliderNorm: number;
  onSliderChange: (norm: number) => void;
  onValueChange?: (v: number) => void;
  variant?: "default" | "colour" | "theme";
}

/**
 * SettingsPanel — optional category label and a grid of DataControllers (Figma node 15186:65449).
 * Spacing: root itemSpacing → layout.gap16; column gap (Frame 1061) → layout.gap64; row gap (SettingsList) → layout.gap16.
 */
export interface SettingsPanelProps {
  categoryTitle?: string;
  columns: 1 | 2;
  rows: 1 | 2;
  controllers: SettingsPanelController[];
  className?: string;
  style?: React.CSSProperties;
}

const labelStyle = typography.label;

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  categoryTitle,
  columns,
  rows,
  controllers,
  className,
  style,
}) => {
  const titleId = useId();
  const rowGap = rows >= 2 ? layout.gap16 : 0;
  const columnGap = columns >= 2 ? layout.gap64 : 0;
  const maxSlots = columns * rows;
  const items = controllers.slice(0, maxSlots);

  const rootStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: categoryTitle ? layout.gap16 : 0,
    minWidth: 0,
    ...style,
  };

  const categoryStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelStyle.fontSize,
    fontWeight: 660,
    lineHeight: `${labelStyle.lineHeight}px`,
    letterSpacing: labelStyle.letterSpacing,
    fontStretch: `${labelStyle.fontWidth}%`,
    color: colors.textHeadingNeutral,
    textTransform: "uppercase",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      columns === 2 ? "repeat(2, max-content)" : "max-content",
    gridTemplateRows: rows === 2 ? "repeat(2, auto)" : "auto",
    columnGap,
    rowGap,
    justifyContent: "start",
  };

  return (
    <section
      className={className}
      style={rootStyle}
      aria-labelledby={categoryTitle ? titleId : undefined}
      aria-label={categoryTitle ? undefined : "Settings"}
    >
      {categoryTitle ? (
        <div id={titleId} style={categoryStyle}>
          {categoryTitle}
        </div>
      ) : null}
      <div style={gridStyle}>
        {items.map((c, index) => (
          <DataController
            key={`${c.label}-${index}`}
            label={c.label}
            value={c.value}
            suffix={c.suffix}
            min={c.min}
            max={c.max}
            step={c.step}
            sliderNorm={c.sliderNorm}
            onSliderChange={c.onSliderChange}
            onValueChange={c.onValueChange}
            variant={c.variant}
          />
        ))}
      </div>
    </section>
  );
};

SettingsPanel.displayName = "SettingsPanel";
export default SettingsPanel;
