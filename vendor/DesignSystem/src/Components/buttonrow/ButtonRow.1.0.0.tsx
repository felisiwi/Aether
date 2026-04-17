import React from "react";
import SimpleButton from "../simplebutton/SimpleButton.1.2.0";
import type { IconName } from "../icon/icon-names";
import {
  typography,
  fontFamily,
  colors,
  layout,
} from "../../tokens/design-tokens";

export interface ButtonRowOption {
  /** Icon name for {@link SimpleButton} (`waveform-sine`, etc.). */
  icon: IconName;
  /** Shown under the column when this option is active (e.g. `"Sine"`). */
  label: string;
}

export interface ButtonRowProps {
  options: ButtonRowOption[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;

/**
 * Vertical stack of icon-only {@link SimpleButton}s plus a label for the active waveform.
 * Snapshot label text (`Sine--…-15414-267455.json`): `VariableID:9006:3` → `colors.textHeadingNeutral`, Text Variable/Label.
 */
export const ButtonRow: React.FC<ButtonRowProps> = ({
  options,
  activeIndex,
  onChange,
  className,
  style,
}) => {
  const active = options[activeIndex];
  const caption = active?.label ?? "";

  const captionStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: 660,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    color: colors.textHeadingNeutral,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    textAlign: "center",
    margin: 0,
    width: "100%",
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: layout.gap4,
        ...style,
      }}
      role="group"
      aria-label="Waveform options"
    >
      {options.map((opt, index) => (
        <SimpleButton
          key={`${opt.icon}-${index}`}
          iconName={opt.icon}
          ariaLabel={opt.label}
          state={index === activeIndex ? "active" : "default"}
          onClick={() => onChange(index)}
        />
      ))}
      <p style={captionStyle}>{caption}</p>
    </div>
  );
};

ButtonRow.displayName = "ButtonRow";
export default ButtonRow;
