import React, { useState } from "react";
import logoUrl from "../../assets/aetherlogo.svg";
import { LandingPageLink } from "../landingpagelink/LandingPageLink.1.1.0";
import type { LandingPageLinkState } from "../landingpagelink/LandingPageLink.1.1.0";
import { layout, semanticColors } from "../../tokens/design-tokens";

/** Figma `LandingComponent` variant names (exact strings). */
export type LandingComponentState =
  | "Default"
  | "Left hover"
  | "Left hint"
  | "Right hover"
  | "Right hint";

export interface LandingComponentProps {
  /** Controlled Figma state; when omitted, hover on the side columns drives state. */
  state?: LandingComponentState;
  className?: string;
  style?: React.CSSProperties;
}

/** Side column width from snapshot (`LeftPageLinkWrapper` / `PagelinkWrappers` absoluteBoundingBox.width). */
const PAGE_LINK_COLUMN_WIDTH = 400;

type PointerZone = "none" | "leftWrap" | "leftLink" | "rightWrap" | "rightLink";

function zoneToLandingState(zone: PointerZone): LandingComponentState {
  switch (zone) {
    case "leftWrap":
      return "Left hint";
    case "leftLink":
      return "Left hover";
    case "rightWrap":
      return "Right hint";
    case "rightLink":
      return "Right hover";
    default:
      return "Default";
  }
}

function sideColumnShell(clip: boolean): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: PAGE_LINK_COLUMN_WIDTH,
    flexShrink: 0,
    boxSizing: "border-box",
    alignSelf: "stretch",
    minHeight: 0,
    paddingTop: layout.gap24,
    overflow: clip ? "clip" : "visible",
  };
}

const hoverWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: layout.paddingWrapperVertical,
  paddingBottom: layout.paddingWrapperVertical,
  flex: 1,
  alignSelf: "stretch",
  minHeight: 0,
  boxSizing: "border-box",
};

const logoColumnStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  alignSelf: "stretch",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
};

const LOGO_ASPECT = 1057 / 249;

/**
 * Full-screen landing layout (Figma `LandingComponent`, node `15762:387254`).
 * Row: `layout.screenWidth` (VariableID:10898:12356), gap `layout.sectionS` (VariableID:11155:8615), vertical fill.
 */
export const LandingComponent: React.FC<LandingComponentProps> = ({
  state: controlledState,
  className,
  style,
}) => {
  const [zone, setZone] = useState<PointerZone>("none");
  const isControlled = controlledState != null;
  const effectiveState = isControlled ? controlledState : zoneToLandingState(zone);

  const isLeftActive = effectiveState === "Left hover" || effectiveState === "Left hint";
  const isRightActive = effectiveState === "Right hover" || effectiveState === "Right hint";

  const leftLinkState: LandingPageLinkState =
    effectiveState === "Left hover"
      ? "Hover"
      : effectiveState === "Left hint"
        ? "Hint"
        : "Hidden";

  const rightLinkState: LandingPageLinkState =
    effectiveState === "Right hover"
      ? "Hover"
      : effectiveState === "Right hint"
        ? "Hint"
        : "Hidden";

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    gap: layout.sectionS,
    width: layout.screenWidth,
    maxWidth: "100%",
    flex: 1,
    minHeight: 0,
    boxSizing: "border-box",
  };

  const shellStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: semanticColors.backdropStaticBlack,
    boxSizing: "border-box",
    ...style,
  };

  const bindLeftWrapper = !isControlled && !isRightActive;
  const bindRightWrapper = !isControlled && !isLeftActive;

  return (
    <section className={className} style={shellStyle} aria-label="Aether Studios landing">
      <div style={rowStyle}>
        {isRightActive ? (
          <div style={sideColumnShell(false)}>
            <div style={hoverWrapperStyle}>
              <LandingPageLink pageLink="play." hoverMessage="Enter" state="Hidden" />
            </div>
          </div>
        ) : (
          <div
            style={sideColumnShell(true)}
            onMouseEnter={bindLeftWrapper ? () => setZone("leftWrap") : undefined}
            onMouseLeave={bindLeftWrapper ? () => setZone("none") : undefined}
          >
            <div style={hoverWrapperStyle}>
              <LandingPageLink
                pageLink="play."
                hoverMessage="Enter"
                state={leftLinkState}
                to={leftLinkState === "Hover" ? "/play" : undefined}
                onMouseEnter={bindLeftWrapper ? () => setZone("leftLink") : undefined}
                onMouseLeave={bindLeftWrapper ? () => setZone("leftWrap") : undefined}
              />
            </div>
          </div>
        )}

        <div style={logoColumnStyle}>
          <div
            role="img"
            aria-label="Aether"
            style={{
              width: "100%",
              maxWidth: "100%",
              aspectRatio: `${LOGO_ASPECT}`,
              backgroundColor: semanticColors.backdropNautralBackground,
              maskImage: `url(${logoUrl})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: `url(${logoUrl})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </div>

        {isLeftActive ? (
          <div style={sideColumnShell(false)}>
            <div style={hoverWrapperStyle}>
              <LandingPageLink
                pageLink="studios.co.uk"
                hoverMessage="coming soon"
                state="Hidden"
              />
            </div>
          </div>
        ) : (
          <div
            style={sideColumnShell(false)}
            onMouseEnter={bindRightWrapper ? () => setZone("rightWrap") : undefined}
            onMouseLeave={bindRightWrapper ? () => setZone("none") : undefined}
          >
            <div style={hoverWrapperStyle}>
              <LandingPageLink
                pageLink="studios.co.uk"
                hoverMessage="coming soon"
                state={rightLinkState}
                onMouseEnter={bindRightWrapper ? () => setZone("rightLink") : undefined}
                onMouseLeave={bindRightWrapper ? () => setZone("rightWrap") : undefined}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

LandingComponent.displayName = "LandingComponent";
export default LandingComponent;
