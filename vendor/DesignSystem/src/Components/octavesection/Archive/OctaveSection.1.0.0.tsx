import React from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export interface OctaveSectionProps {
  /** Current octave index (e.g. 4 for “4th octave”). */
  octave: number;
  onOctaveChange: (value: number) => void;
  /** Inclusive range for `octave`. */
  minOctave?: number;
  maxOctave?: number;
  /** `piano` matches Figma Instrument=Piano spacing; `keyboard` uses tighter gaps. */
  variant?: "piano" | "keyboard";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function ordinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export const OctaveSection: React.FC<OctaveSectionProps> = ({
  octave,
  onOctaveChange,
  minOctave = 1,
  maxOctave = 7,
  variant = "piano",
  disabled = false,
  className,
  style,
}) => {
  const gap =
    variant === "keyboard" ? layout.gap4 : layout.gap8;
  const label = `${octave}${ordinalSuffix(octave)} Octave`;

  const canDec = !disabled && octave > minOctave;
  const canInc = !disabled && octave < maxOctave;

  const labelType = typography.titleS;

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap,
    ...style,
  };

  const chevronBtn = (dir: "up" | "down") => {
    const Icon = dir === "up" ? CaretUp : CaretDown;
    const onClick =
      dir === "up"
        ? () => canInc && onOctaveChange(octave + 1)
        : () => canDec && onOctaveChange(octave - 1);
    const active = dir === "up" ? canInc : canDec;
    return (
      <button
        type="button"
        disabled={!active}
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: layout.gap32,
          height: layout.gap32,
          padding: 0,
          border: `${layout.strokeS}px solid ${semanticColors.strokeMedium}`,
          borderRadius: layout.radiusXs,
          background: semanticColors.backdropNautralBackground,
          cursor: active ? "pointer" : "not-allowed",
          opacity: active ? 1 : 0.45,
        }}
        aria-label={dir === "up" ? "Octave up" : "Octave down"}
      >
        <Icon
          size={layout.gap16}
          color={colors.textHeadingNeutral}
          weight="bold"
        />
      </button>
    );
  };

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    fontStretch: `${labelType.fontWidth}%`,
    letterSpacing: labelType.letterSpacing,
    color: colors.textHeadingNeutral,
    textAlign: "center",
    minWidth: layout.gap96,
  };

  return (
    <div className={className} style={rowStyle} role="group" aria-label="Octave selection">
      {chevronBtn("up")}
      <span style={textStyle}>{label}</span>
      {chevronBtn("down")}
    </div>
  );
};

OctaveSection.displayName = "OctaveSection";
export default OctaveSection;
