import React from "react";
import { GameCardText } from "../gamecardtext/GameCardText.1.0.0";
import { TagConfig } from "../tagrow/TagRow.1.0.0";
import { semanticColors, layout } from "../../tokens/design-tokens";

export type VideoPreviewCardType = "video" | "text";
export type VideoPreviewCardState =
  | "inactive"
  | "default"
  | "hover"
  | "active"
  | "action"
  | "actionTap";

export interface VideoPreviewCardProps {
  type?: VideoPreviewCardType;
  state?: VideoPreviewCardState;
  backgroundImage?: string;
  title?: string;
  primaryData?: string;
  /**
   * Reserved for alternate primary copy when `type` is `text` and `state` is `active`.
   * The **text + active** overlay is **title-only** (primary and secondary lines are hidden), so this is not shown in the overlay until the layout changes.
   */
  primaryDataActive?: string;
  secondaryData?: string;
  tags?: TagConfig[];
  bodyText?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface CardVisuals {
  strokeColor: string;
  strokeWidth: number;
  /** Darkens the entire card (video action / actionTap only). */
  showFullCardOverlay: boolean;
  showOverlay: boolean;
  showPlayIcon: boolean;
  /** Icon frame size in px — matches Figma Basic/Icon Size 24 / 32 */
  playIconSize: number;
  overlayShowTitle: boolean;
  /** Primary line in overlay (e.g. false for text + active = title only). */
  overlayShowPrimary: boolean;
  overlayShowSecondary: boolean;
  /** Whether the gradient bar above the overlay is visible (hover only). */
  overlayShowGradient: boolean;
}

function getVisuals(
  type: VideoPreviewCardType,
  state: VideoPreviewCardState
): CardVisuals {
  const base: CardVisuals = {
    strokeColor: "transparent",
    strokeWidth: 1,
    showFullCardOverlay: false,
    showOverlay: false,
    showPlayIcon: false,
    playIconSize: 32,
    overlayShowTitle: true,
    overlayShowPrimary: true,
    overlayShowSecondary: true,
    overlayShowGradient: false,
  };

  if (state === "inactive") return base;

  if (state === "default") {
    return {
      ...base,
      strokeColor: semanticColors.strokeInvertedSymbolic,
    };
  }

  if (state === "hover") {
    if (type === "video") {
      return {
        ...base,
        strokeColor: semanticColors.strokeStaticWhiteSymbolic,
        strokeWidth: layout.strokeM,
        showPlayIcon: true,
        playIconSize: 24,
      };
    }
    /** Text hover: primary + secondary only, no title, gradient bar visible. */
    return {
      ...base,
      strokeColor: semanticColors.strokeStaticWhiteSymbolic,
      strokeWidth: layout.strokeM,
      showOverlay: true,
      overlayShowTitle: false,
      overlayShowPrimary: true,
      overlayShowSecondary: true,
      overlayShowGradient: true,
    };
  }

  if (state === "active") {
    if (type === "video") {
      return {
        ...base,
        strokeColor: semanticColors.strokeStaticWhite,
        strokeWidth: layout.strokeM,
        showPlayIcon: true,
        playIconSize: 32,
      };
    }
    /** Text active: title + primary only, no secondary. */
    return {
      ...base,
      strokeColor: semanticColors.strokeStaticWhite,
      strokeWidth: layout.strokeM,
      showOverlay: true,
      overlayShowTitle: true,
      overlayShowPrimary: true,
      overlayShowSecondary: false,
    };
  }

  if (state === "action") {
    if (type === "text") {
      return {
        ...base,
        strokeColor: semanticColors.strokeColourPressed,
        showOverlay: true,
        overlayShowTitle: true,
        overlayShowPrimary: true,
        overlayShowSecondary: true,
      };
    }
    /** Video action: full card darkened + overlay text. */
    return {
      ...base,
      strokeColor: semanticColors.strokeColourPressed,
      showFullCardOverlay: true,
      showOverlay: true,
    };
  }

  if (state === "actionTap") {
    if (type === "text") {
      return {
        ...base,
        showOverlay: true,
        overlayShowTitle: true,
        overlayShowPrimary: true,
        overlayShowSecondary: true,
      };
    }
    /** Video actionTap: full card darkened + overlay text. */
    return {
      ...base,
      showFullCardOverlay: true,
      showOverlay: true,
    };
  }

  return base;
}

/** Matches Figma component frame (2:1). */
export const VIDEO_PREVIEW_CARD_WIDTH = 451;
export const VIDEO_PREVIEW_CARD_HEIGHT = 225;
const GRADIENT_BAR_HEIGHT = 32;

/** Same rgba as `backdropOpacityStaticOpacityDarkenedOverlaySurface` (#00000099) for gradient stops */
const DARKENED_OVERLAY_RGBA = "rgba(0, 0, 0, 0.6)";

export const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({
  type = "text",
  state = "inactive",
  backgroundImage,
  title = "Game title",
  primaryData = "Played 2w ago",
  primaryDataActive,
  secondaryData = "75h total",
  tags,
  bodyText,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
  style,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  /**
   * When `state` is "default" the component self-manages hover/press so it
   * responds naturally without needing a wrapper. Any other explicit state
   * (hover, active, action, inactive, …) takes full precedence.
   */
  const effectiveState: VideoPreviewCardState =
    state === "default"
      ? pressed
        ? "active"
        : hovered
        ? "hover"
        : "default"
      : state;

  const v = getVisuals(type, effectiveState);

  const primaryLine =
    type === "text" && effectiveState === "active"
      ? primaryDataActive ?? primaryData
      : primaryData;

  const selfManaged = state === "default";

  const cardStyle: React.CSSProperties = {
    position: "relative",
    /** Locked 2:1 frame (451×225) per Figma */
    width: VIDEO_PREVIEW_CARD_WIDTH,
    maxWidth: "100%",
    aspectRatio: `${VIDEO_PREVIEW_CARD_WIDTH} / ${VIDEO_PREVIEW_CARD_HEIGHT}`,
    height: "auto",
    minHeight: 0,
    borderRadius: layout.radiusM,
    overflow: "hidden",
    borderWidth: v.strokeWidth,
    borderStyle: "solid",
    borderColor: v.strokeColor,
    boxSizing: "border-box",
    transform: selfManaged && pressed ? "scale(0.99)" : "scale(1)",
    transformOrigin: "center",
    transition:
      "border-color 150ms ease, border-width 150ms ease, transform 200ms ease-out",
    cursor:
      type === "text" &&
      (effectiveState === "default" || effectiveState === "hover")
        ? "pointer"
        : undefined,
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  };

  const TRANSITION = "opacity 150ms ease";

  /** Only darkens the full card for video action/actionTap; text states use a local overlay instead. */
  const darkenedOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor:
      semanticColors.backdropOpacityStaticOpacityDarkenedOverlaySurface,
    zIndex: 0,
    pointerEvents: "none",
    opacity: v.showFullCardOverlay ? 1 : 0,
    transition: TRANSITION,
  };

  /** Gradient strip: bottom matches GameCardText overlay; fade to transparent upward (Figma Rectangle 313). */
  const gradientBarStyle: React.CSSProperties = {
    width: "100%",
    height: GRADIENT_BAR_HEIGHT,
    flexShrink: 0,
    background: `linear-gradient(to top, ${DARKENED_OVERLAY_RGBA} 0%, transparent 100%)`,
    pointerEvents: "none",
    opacity: v.overlayShowGradient ? 1 : 0,
    transition: TRANSITION,
  };

  const bottomStackStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    zIndex: 2,
    opacity: v.showOverlay ? 1 : 0,
    transition: TRANSITION,
    pointerEvents: v.showOverlay ? undefined : "none",
  };

  const overlayContainerStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor:
      semanticColors.backdropOpacityStaticOpacityDarkenedOverlaySurface,
  };

  const playIconContainerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 3,
    opacity: v.showPlayIcon ? 1 : 0,
    transition: TRANSITION,
  };

  const playIconFrameStyle: React.CSSProperties = {
    width: v.playIconSize,
    height: v.playIconSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "width 150ms ease, height 150ms ease",
  };

  return (
    <div
      className={className}
      style={cardStyle}
      onMouseEnter={() => { setHovered(true); onMouseEnter?.(); }}
      onMouseLeave={() => { setHovered(false); setPressed(false); onMouseLeave?.(); }}
      onPointerDown={(e) => {
        if (state === "default" && e.button === 0) setPressed(true);
      }}
      onPointerUp={() => { if (state === "default") setPressed(false); }}
      onPointerCancel={() => { if (state === "default") setPressed(false); }}
      onClick={onClick}
    >
      {backgroundImage && (
        <img src={backgroundImage} alt="" style={imageStyle} />
      )}
      <div style={darkenedOverlayStyle} aria-hidden />

      <div style={playIconContainerStyle} aria-hidden>
        <div style={playIconFrameStyle}>
          <svg
            width={v.playIconSize}
            height={v.playIconSize}
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div style={bottomStackStyle}>
        <div style={gradientBarStyle} aria-hidden />
        <div style={overlayContainerStyle}>
          <GameCardText
            state="default"
            hasPadding
            onMediaOverlay
            title={title}
            showTitle={v.overlayShowTitle}
            showTags={false}
            tags={tags}
            primaryData={primaryLine}
            showPrimaryData={v.overlayShowPrimary}
            secondaryData={secondaryData}
            showSecondaryData={v.overlayShowSecondary}
            showBodyText={false}
            bodyText={bodyText}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewCard;
