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
  /** When `state` is `Hover` and `to` is set, the root renders as `<Link>` (client-side routing). */
  to?: To;
  /** When `state` is `Hover`, `href` is set, and `to` is not set, the root renders as `<a>`. */
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}

const visibleStackHeight =
  layout.gap16 + layout.gap64 + layout.gap8 + typography.label.lineHeight;
const hiddenStackHeight =
  layout.gap48 + layout.gap64 + layout.gap8 + typography.label.lineHeight;

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

  const useRouterLink = Boolean(to) && isHover;
  const useExternalAnchor = Boolean(href) && isHover && !to;
  const isInteractiveHover = isHover && (useRouterLink || useExternalAnchor);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.gap8,
    height: containerHeight,
    paddingTop: isHidden ? layout.gap48 : layout.gap16,
    boxSizing: "border-box",
    minWidth: 0,
    textDecoration: "none",
    color: "inherit",
    cursor: isInteractiveHover ? "pointer" : "default",
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
    color: isHint ? colors.textDisabled : colors.textInverted,
    opacity: isHidden ? 0 : 1,
  };

  const hoverFrameStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: typography.label.lineHeight,
    paddingTop: isHover ? 0 : layout.gap16,
    boxSizing: "border-box",
    overflow: "clip",
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
  };

  const body = (
    <>
      <span style={headlineStyle}>{pageLink}</span>
      <div style={hoverFrameStyle}>
        <span style={hoverMessageStyle}>{hoverMessage}</span>
      </div>
    </>
  );

  const ariaLabel = `${pageLink}, ${hoverMessage}`;

  if (useRouterLink && to != null) {
    return (
      <Link
        className={className}
        style={containerStyle}
        to={to}
        aria-label={ariaLabel}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {body}
      </Link>
    );
  }

  if (useExternalAnchor) {
    return (
      <a
        className={className}
        style={containerStyle}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
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
