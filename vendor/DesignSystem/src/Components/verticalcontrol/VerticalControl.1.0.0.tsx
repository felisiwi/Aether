import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export interface VerticalControlProps {
  title: string;
  value: string;
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;
const valueType = typography.buttonS;

function ChevronUpIcon(): React.ReactElement {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDownIcon(): React.ReactElement {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export const VerticalControl: React.FC<VerticalControlProps> = ({
  title,
  value,
  onUp,
  onDown,
  disabled = false,
  className,
  style,
}) => {
  const fg = disabled ? colors.textDisabled : colors.textHeadingNeutral;

  const titleStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    color: colors.textHeadingNeutral,
    textAlign: "center",
    textTransform: "uppercase",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const valueStyle: React.CSSProperties = {
    fontFamily,
    fontSize: valueType.fontSize,
    fontWeight: valueType.fontWeight,
    lineHeight: `${valueType.lineHeight}px`,
    letterSpacing: valueType.letterSpacing,
    fontStretch: `${valueType.fontWidth}%`,
    color: colors.textHeadingNeutral,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: layout.gap48,
    minHeight: layout.gap48,
    padding: 0,
    margin: 0,
    borderRadius: layout.radiusM,
    border: `${layout.strokeL}px solid ${semanticColors.strokeWeak}`,
    background: "transparent",
    color: fg,
    cursor: disabled ? "not-allowed" : "pointer",
    boxSizing: "border-box",
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: layout.gap4,
        background: "transparent",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <span style={titleStyle}>{title}</span>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Increase ${title}`}
        onClick={disabled ? undefined : onUp}
        style={buttonStyle}
      >
        <ChevronUpIcon />
      </button>
      <span style={valueStyle}>{value}</span>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Decrease ${title}`}
        onClick={disabled ? undefined : onDown}
        style={buttonStyle}
      >
        <ChevronDownIcon />
      </button>
    </div>
  );
};

VerticalControl.displayName = "VerticalControl";
export default VerticalControl;
