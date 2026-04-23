import React from "react";
import { Link } from "react-router-dom";
import type { To } from "react-router-dom";
import { colors, fontFamily, layout, typography } from "../../tokens/design-tokens";

export type LandingPageLinkState = "Default" | "Hover" | "Hint" | "Hidden";

export interface LandingPageLinkProps {
  pageLink: string;
  hoverMessage: string;
  state?: LandingPageLinkState;
  className?: string;
  style?: React.CSSProperties;
  /** When set, root renders as `<Link>`; interactivity is enabled only in `Hover` state. */
  to?: To;
  /** When set (and `to` is not set), root renders as `<a>`; interactivity is enabled only in `Hover` state. */
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}

/** Figma smart animate duration (landing link transitions). */
const STATE_TRANSITION_MS = 1200;
const transitionColorOpacity = `color ${STATE_TRANSITION_MS}ms ease-in-out, opacity ${STATE_TRANSITION_MS}ms ease-in-out`;
const transitionPaddingTop = `padding-top ${STATE_TRANSITION_MS}ms ease-in-out`;
const transitionContainer = `padding-top ${STATE_TRANSITION_MS}ms ease-in-out, height ${STATE_TRANSITION_MS}ms ease-in-out`;

/** Message row height matches Figma: just the label line height (16px). Padding pushes text out; overflow clips it. */
const messageRowHeight = typography.label.lineHeight;

const visibleStackHeight =
  layout.gap16 + layout.gap64 + layout.gap8 + messageRowHeight;
const hiddenStackHeight =
  layout.gap48 + layout.gap64 + layout.gap8 + messageRowHeight;

export const LandingPageLink: React.FC<LandingPageLinkProps> = ({
  pageLink,
  hoverMessage,
  state = "Default",
  className,
  style,
  to,
  href,
  target,
  rel,
  onMouseEnter,
  onMouseLeave,
}) => {
  const isHover = state === "Hover";
  const isHint = state === "Hint";
  const isHidden = state === "Hidden";

  const containerHeight = isHidden ? hiddenStackHeight : visibleStackHeight;

  const hasRouterLink = Boolean(to);
  const hasExternalAnchor = Boolean(href) && !to;
  const isInteractiveHover = isHover && (hasRouterLink || hasExternalAnchor);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.gap8,
    height: containerHeight,
    paddingTop: isHidden ? layout.gap48 : layout.gap16,
    boxSizing: "border-box",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    cursor: isInteractiveHover ? "pointer" : "default",
    transition: transitionContainer,
    ...style,
  };

  const headlineStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontSize: layout.gap56,
    lineHeight: `${layout.gap64}px`,
    letterSpacing: typography.headlineM.letterSpacing,
    fontWeight: typography.headlineM.fontWeight,
    fontStretch: `${typography.headlineM.fontWidth}%`,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    whiteSpace: "nowrap",
    color: isHint || isHidden ? colors.textDisabled : colors.textInverted,
    opacity: isHidden ? 0 : 1,
    transition: transitionColorOpacity,
  };

  /** HoverMessageWrapper — top padding 16px (Default/Hint/Hidden) → 0 (Hover) reveals hover line (Figma Frame 1312). */
  const hoverMessageWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: messageRowHeight,
    minHeight: 0,
    flexShrink: 0,
    paddingTop: isHover ? 0 : layout.gap16,
    boxSizing: "border-box",
    overflow: "clip",
    transition: transitionPaddingTop,
  };

  const hoverMessageStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontSize: typography.label.fontSize,
    lineHeight: `${typography.label.lineHeight}px`,
    letterSpacing: typography.label.letterSpacing,
    fontWeight: typography.label.fontWeight,
    fontStretch: `${typography.label.fontWidth}%`,
    textAlign: "center",
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    whiteSpace: "nowrap",
    color: colors.textInverted,
    opacity: isHover && !isHidden ? 1 : 0,
    transition: transitionColorOpacity,
  };

  const body = (
    <>
      <span style={headlineStyle}>{pageLink}</span>
      <div style={hoverMessageWrapperStyle}>
        <span style={hoverMessageStyle}>{hoverMessage}</span>
      </div>
    </>
  );

  const ariaLabel = `${pageLink}, ${hoverMessage}`;

  if (hasRouterLink && to != null) {
    return (
      <Link
        className={className}
        style={containerStyle}
        to={to}
        aria-label={ariaLabel}
        aria-disabled={!isHover}
        tabIndex={isHover ? 0 : -1}
        onClick={
          isHover
            ? undefined
            : (event) => {
                event.preventDefault();
              }
        }
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {body}
      </Link>
    );
  }

  if (hasExternalAnchor) {
    return (
      <a
        className={className}
        style={containerStyle}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
        aria-disabled={!isHover}
        tabIndex={isHover ? 0 : -1}
        onClick={
          isHover
            ? undefined
            : (event) => {
                event.preventDefault();
              }
        }
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {body}
      </a>
    );
  }

  return (
    <div
      className={className}
      style={containerStyle}
      role="group"
      aria-label={ariaLabel}
      aria-hidden={isHidden ? true : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {body}
    </div>
  );
};

LandingPageLink.displayName = "LandingPageLink";
export default LandingPageLink;
