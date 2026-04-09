import React from "react";
import {
  typography,
  fontFamily,
  colors,
  semanticColors,
  layout,
} from "../../tokens/design-tokens";

export type TagType = "default" | "success";
export type TagState = "default" | "active" | "inactive";

export interface TagProps {
  children: string;
  type?: TagType;
  state?: TagState;
  className?: string;
  style?: React.CSSProperties;
}

const label = typography.label;

interface VariantStyle {
  backgroundColor: string;
  backgroundOpacity?: number;
  borderColor: string;
  borderOpacity?: number;
  textColor: string;
  textOpacity?: number;
}

function getVariantStyle(type: TagType, state: TagState): VariantStyle {
  if (state === "inactive") {
    return {
      backgroundColor: semanticColors.backdropStatesDisabledSurface,
      borderColor: "transparent",
      textColor: colors.textDisabled,
    };
  }

  if (type === "success") {
    if (state === "active") {
      return {
        backgroundColor: semanticColors.backdropFunctionalSuccessSurface,
        borderColor: "transparent",
        textColor: semanticColors.buttonTextButtonText,
      };
    }
    return {
      backgroundColor: "transparent",
      borderColor: semanticColors.strokeSuccess,
      textColor: semanticColors.textFunctionalSuccess,
    };
  }

  // type === "default"
  if (state === "active") {
    return {
      backgroundColor: semanticColors.backdropSurfaceElevatedSurface,
      borderColor: "transparent",
      textColor: colors.textHeadingColour,
    };
  }
  return {
    backgroundColor: "transparent",
    borderColor: semanticColors.strokeSolid,
    textColor: colors.textLabel,
  };
}

export const Tag: React.FC<TagProps> = ({
  children,
  type = "default",
  state = "active",
  className,
  style,
}) => {
  const v = getVariantStyle(type, state);

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: layout.gap4,
    paddingRight: layout.gap4,
    paddingTop: layout.gap2,
    paddingBottom: layout.gap2,
    borderRadius: layout.radiusXs,
    borderWidth: layout.strokeS,
    borderStyle: "solid",
    borderColor: v.borderColor,
    backgroundColor: v.backgroundColor,
    boxSizing: "border-box",
    ...style,
  };

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: label.fontSize,
    lineHeight: `${label.lineHeight}px`,
    letterSpacing: label.letterSpacing,
    fontWeight: label.fontWeight,
    fontStretch: `${label.fontWidth}%`,
    color: v.textColor,
    whiteSpace: "nowrap",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  return (
    <span className={className} style={containerStyle}>
      <span style={textStyle}>{children}</span>
    </span>
  );
};

export default Tag;
