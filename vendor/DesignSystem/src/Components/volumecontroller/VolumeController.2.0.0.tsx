import React from "react";
import SliderController from "../slidercontroller/SliderController.1.0.0";
import { layout } from "../../tokens/design-tokens";

export interface VolumeControllerChannel {
  value: number;
  onChange: (v: number) => void;
}

/**
 * Horizontal fader row: Master + up to four player channels. Channel index `i` uses `SliderController`
 * variant `i + 1` (aligned with `playerThemes` / `THEME_KEYS` in `theme-map.ts`).
 * Spacing from Figma `VolumeController` (15398:175545): `itemSpacing` → `VariableID:9053:54` → `layout.gap16`;
 * vertical padding → `VariableID:9053:53` → `layout.gap8`.
 */
export interface VolumeControllerProps {
  masterValue: number;
  onMasterChange: (v: number) => void;
  channels?: VolumeControllerChannel[];
  className?: string;
  style?: React.CSSProperties;
}

const rootStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  gap: layout.gap16,
  paddingTop: layout.gap8,
  paddingBottom: layout.gap8,
  boxSizing: "border-box",
  height: "100%",
  minHeight: 0,
  minWidth: 0,
};

export const VolumeController: React.FC<VolumeControllerProps> = ({
  masterValue,
  onMasterChange,
  channels = [],
  className,
  style,
}) => {
  const channelList = channels.slice(0, 4);

  return (
    <div
      className={className}
      style={{ ...rootStyle, ...style }}
      role="group"
      aria-label="Volume"
    >
      <SliderController
        title="Master"
        value={masterValue}
        suffix="%"
        min={0}
        max={100}
        step={1}
        onChange={onMasterChange}
        variant="default"
      />
      {channelList.map((ch, index) => {
        const themedVariant = (index + 1) as 1 | 2 | 3 | 4;
        return (
          <SliderController
            key={index}
            title={String(index + 1)}
            value={ch.value}
            suffix="%"
            min={0}
            max={100}
            step={1}
            onChange={ch.onChange}
            variant={themedVariant}
          />
        );
      })}
    </div>
  );
};

VolumeController.displayName = "VolumeController";
export default VolumeController;
