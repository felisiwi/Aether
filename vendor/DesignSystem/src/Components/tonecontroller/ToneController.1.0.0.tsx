import React, { useId } from "react";
import ButtonRow, {
  type ButtonRowOption,
} from "../buttonrow/ButtonRow.1.0.0";
import SliderController from "../slidercontroller/SliderController.1.0.0";
import {
  typography,
  fontFamily,
  colors,
  layout,
} from "../../tokens/design-tokens";

export interface ToneControllerSlider {
  title: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

/**
 * TONE section for EffectsBoard: optional waveform {@link ButtonRow} + 1–4 {@link SliderController}s.
 * Spacing from Figma `ToneController` (15398:180688): `itemSpacing` → `VariableID:9053:54` → `layout.gap16` (title ↔ content row; ButtonRow ↔ sliders).
 */
export interface ToneControllerProps {
  waveformIndex: number;
  onWaveformChange: (index: number) => void;
  /** Icon keys must be valid {@link import("../icon/icon-names").IconName} values for SimpleButton. */
  waveformOptions: ButtonRowOption[];
  sliders: ToneControllerSlider[];
  showButtonRow?: boolean;
  categoryTitle?: string;
  className?: string;
  style?: React.CSSProperties;
}

const labelStyle = typography.label;

export const ToneController: React.FC<ToneControllerProps> = ({
  waveformIndex,
  onWaveformChange,
  waveformOptions,
  sliders,
  showButtonRow = true,
  categoryTitle,
  className,
  style,
}) => {
  const titleId = useId();
  const resolvedCategory = categoryTitle ?? "TONE";
  const showCategory = resolvedCategory.length > 0;
  const sliderItems = sliders.slice(0, 4);

  const categoryTextStyle: React.CSSProperties = {
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

  const rootStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: showCategory ? layout.gap16 : 0,
    minWidth: 0,
    ...style,
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: layout.gap16,
    minWidth: 0,
  };

  const slidersRowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 0,
    flex: 1,
    minWidth: 0,
  };

  return (
    <section
      className={className}
      style={rootStyle}
      aria-labelledby={showCategory ? titleId : undefined}
      aria-label={showCategory ? undefined : "Tone"}
    >
      {showCategory ? (
        <div id={titleId} style={categoryTextStyle}>
          {resolvedCategory}
        </div>
      ) : null}
      <div style={rowStyle}>
        {showButtonRow ? (
          <ButtonRow
            options={waveformOptions}
            activeIndex={waveformIndex}
            onChange={onWaveformChange}
          />
        ) : null}
        <div style={slidersRowStyle}>
          {sliderItems.map((s, index) => (
            <SliderController
              key={`${s.title}-${index}`}
              title={s.title}
              value={s.value}
              suffix={s.suffix}
              min={s.min}
              max={s.max}
              step={s.step}
              onChange={s.onChange}
              variant="default"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

ToneController.displayName = "ToneController";
export default ToneController;
