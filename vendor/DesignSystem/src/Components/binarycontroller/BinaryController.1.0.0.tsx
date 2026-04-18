import React, { useId } from "react";
import {
  typography,
  fontFamily,
  colors,
  layout,
} from "../../tokens/design-tokens";
import { DataWindow } from "../datawindow/DataWindow.1.0.0";
import BasicButton from "../basicbutton/BasicButton.1.2.0";
import type { IconName } from "../icon/icon-names";

/**
 * BinaryController v1.0.0 — Figma `15414:267797`.
 * Title + display-only DataWindow (transparent, centred value) + chevron BasicButtons.
 *
 * Layout: root itemSpacing VariableID:9053:53 → `layout.gap8`; width 52px → `gap48 + gap4`.
 * Title fill VariableID:9006:3 → `colors.textHeadingNeutral`.
 * DataWindow fill in snapshot VariableID:13010:18093 — overridden to transparent per product spec.
 * DataWindow stroke VariableID:9006:168 → default variant panel uses `semanticColors.strokeMedium`.
 * Button stack spacing VariableID:9053:52 → `layout.gap4`.
 */
export interface BinaryControllerProps {
  title: string;
  value: string;
  onUp: () => void;
  onDown: () => void;
  upIcon?: IconName;
  downIcon?: IconName;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const labelType = typography.label;
const valueType = typography.titleS;
/** Snapshot `absoluteBoundingBox.width` 52 — Layout gap-48 + gap-4. */
const ROOT_WIDTH = layout.gap48 + layout.gap4;

export const BinaryController: React.FC<BinaryControllerProps> = ({
  title,
  value,
  onUp,
  onDown,
  upIcon = "chevron-up" as IconName,
  downIcon = "chevron-down" as IconName,
  disabled = false,
  className,
  style,
}) => {
  const titleId = useId();

  const titleStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: labelType.fontWeight,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    color: colors.textHeadingNeutral,
    textTransform: "uppercase",
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
    width: "100%",
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
    width: "100%",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    margin: 0,
    padding: 0,
  };

  const rootStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: ROOT_WIDTH,
    boxSizing: "border-box",
    gap: layout.gap8,
    ...style,
  };

  return (
    <div
      className={className}
      style={rootStyle}
      role="group"
      aria-labelledby={titleId}
    >
      <span id={titleId} style={titleStyle}>
        {title}
      </span>
      <DataWindow
        compact
        variant="default"
        panelStyle={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <span style={valueStyle}>{value}</span>
      </DataWindow>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: layout.gap4,
          width: "100%",
        }}
      >
        <BasicButton
          type="button"
          variant="primary"
          size="small"
          colourFill={false}
          showText={false}
          showIcon
          iconName={upIcon}
          disabled={disabled}
          aria-label={`Increase ${title}`}
          onClick={onUp}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {title}
        </BasicButton>
        <BasicButton
          type="button"
          variant="primary"
          size="small"
          colourFill={false}
          showText={false}
          showIcon
          iconName={downIcon}
          disabled={disabled}
          aria-label={`Decrease ${title}`}
          onClick={onDown}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {title}
        </BasicButton>
      </div>
    </div>
  );
};

BinaryController.displayName = "BinaryController";
export default BinaryController;
