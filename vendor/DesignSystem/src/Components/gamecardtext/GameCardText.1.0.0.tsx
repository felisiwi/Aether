import React from "react";
import { TagRow, TagConfig } from "../tagrow/TagRow.1.0.0";
import {
  typography,
  fontFamily,
  colors,
  layout,
  semanticColors,
} from "../../tokens/design-tokens";

export type GameCardTextState = "inactive" | "default" | "active";

export interface GameCardTextProps {
  state?: GameCardTextState;
  hasPadding?: boolean;
  title?: string;
  showTitle?: boolean;
  showTags?: boolean;
  tags?: TagConfig[];
  primaryData?: string;
  /** When false, primary line is hidden (e.g. title-only overlay). Default true. */
  showPrimaryData?: boolean;
  secondaryData?: string;
  showSecondaryData?: boolean;
  bodyText?: string;
  showBodyText?: boolean;
  secondaryDataColor?: string;
  onMediaOverlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const titleTypo = typography.titleS;
const bodyTypo = typography.bodyS;

function getTitleColor(
  state: GameCardTextState,
  onMediaOverlay: boolean
): string {
  if (state === "inactive") return colors.textDisabled;
  if (onMediaOverlay) return semanticColors.semanticStrokeStaticStrokeWhiteSolid;
  return colors.textHeadingNeutral;
}

function getPrimaryDataColor(
  state: GameCardTextState,
  onMediaOverlay: boolean
): string {
  if (state === "inactive") return colors.textDisabled;
  if (onMediaOverlay) return semanticColors.semanticStrokeStaticStrokeWhiteSolid;
  return colors.textHeadingNeutral;
}

/** Secondary + body use the same `Text/Practical text/body-neutral` token as the default card (no overlay-specific tint). */
function getSecondaryColor(state: GameCardTextState): string {
  if (state === "inactive") return colors.textDisabled;
  return colors.textBodyNeutral;
}

function getBodyColor(state: GameCardTextState): string {
  if (state === "inactive") return colors.textDisabled;
  return colors.textBodyNeutral;
}

function mapTagState(state: GameCardTextState): "inactive" | "default" | "active" {
  return state;
}

export const GameCardText: React.FC<GameCardTextProps> = ({
  state = "inactive",
  hasPadding = false,
  title = "Game title",
  showTitle = true,
  showTags = true,
  tags = [
    { label: "Tag 1" },
    { label: "Tag 2" },
    { label: "Tag 3" },
    { label: "Tag 4" },
    { label: "Tag 5" },
  ],
  primaryData = "£18.89",
  showPrimaryData = true,
  secondaryData = "£20.99",
  showSecondaryData = true,
  bodyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  showBodyText = true,
  secondaryDataColor,
  onMediaOverlay = false,
  className,
  style,
}) => {
  const tagState = mapTagState(state);
  const tagsWithState = tags.map((t) => ({
    ...t,
    state: t.state ?? tagState,
  }));

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: layout.gap8,
    ...(hasPadding && {
      padding: layout.gap16,
    }),
    ...style,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily,
    fontSize: titleTypo.fontSize,
    lineHeight: `${titleTypo.lineHeight}px`,
    letterSpacing: titleTypo.letterSpacing,
    fontWeight: titleTypo.fontWeight,
    fontStretch: `${titleTypo.fontWidth}%`,
    color: getTitleColor(state, onMediaOverlay),
    margin: 0,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const dataRowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: layout.gap8,
    flexWrap: "nowrap",
  };

  const primaryStyle: React.CSSProperties = {
    fontFamily,
    fontSize: bodyTypo.fontSize,
    lineHeight: `${bodyTypo.lineHeight}px`,
    letterSpacing: bodyTypo.letterSpacing,
    fontWeight: 550,
    color: getPrimaryDataColor(state, onMediaOverlay),
    margin: 0,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
  };

  const resolvedSecondaryColor =
    secondaryDataColor ?? getSecondaryColor(state);

  const secondaryStyle: React.CSSProperties = {
    fontFamily,
    fontSize: bodyTypo.fontSize,
    lineHeight: `${bodyTypo.lineHeight}px`,
    letterSpacing: bodyTypo.letterSpacing,
    color: resolvedSecondaryColor,
    margin: 0,
  };

  const bulletStyle: React.CSSProperties = {
    fontFamily,
    fontSize: bodyTypo.fontSize,
    lineHeight: `${bodyTypo.lineHeight}px`,
    color: resolvedSecondaryColor,
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily,
    fontSize: bodyTypo.fontSize,
    lineHeight: `${bodyTypo.lineHeight}px`,
    letterSpacing: bodyTypo.letterSpacing,
    color: getBodyColor(state),
    margin: 0,
  };

  const showDataRow =
    showTags || showPrimaryData || showSecondaryData;
  const showBulletBeforeSecondary =
    showSecondaryData && (showPrimaryData || showTags);

  return (
    <div className={className} style={containerStyle}>
      {showTitle && <p style={titleStyle}>{title}</p>}

      {showDataRow && (
        <div style={dataRowStyle}>
          {showTags && <TagRow tags={tagsWithState} />}
          {showPrimaryData && (
            <span style={primaryStyle}>{primaryData}</span>
          )}
          {showSecondaryData && (
            <>
              {showBulletBeforeSecondary && (
                <span style={bulletStyle}>•</span>
              )}
              <span style={secondaryStyle}>{secondaryData}</span>
            </>
          )}
        </div>
      )}

      {showBodyText && <p style={bodyStyle}>{bodyText}</p>}
    </div>
  );
};

export default GameCardText;
