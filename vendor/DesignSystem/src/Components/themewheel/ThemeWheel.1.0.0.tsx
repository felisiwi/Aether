import React, { useEffect, useRef } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { semanticColors, layout } from "../../tokens/design-tokens";

export type ThemeWheelTheme = "light" | "dark" | "colour";
export type ThemeWheelState = "default" | "disabled";

/** Three-theme step: light → dark → colour → light. */
const CYCLE = {
  light: "dark",
  dark: "colour",
  colour: "light",
} as const satisfies Record<ThemeWheelTheme, ThemeWheelTheme>;

/** Rotation (deg) so the active segment sits at 12 o'clock (three-segment wheel only). */
function themeRotationDeg(theme: ThemeWheelTheme): number {
  switch (theme) {
    case "light":
      return 0;
    case "dark":
      return 120;
    case "colour":
      return 240;
    default:
      return 0;
  }
}

/**
 * Three-segment colour wheel (Dark / Colour / Light) for theme selection UI.
 * Segment fills: Backdrop/Static surface black & white, Primary/50 (buttonSurfacePrimary).
 * Stroke: Stroke/Adaptive stroke/stroke-medium (strokeMedium / strokeInvertedMedium).
 */
export interface ThemeWheelProps {
  /** Reserved for future segment emphasis; wheel geometry matches Figma for all values. */
  theme?: ThemeWheelTheme;
  state?: ThemeWheelState;
  /** Use inverted stroke on dark surfaces. */
  darkMode?: boolean;
  /** Three segments (120° each) or two semicircles (light/dark only). */
  variant?: "three" | "two";
  /** Called with the next theme when the wheel is clicked. */
  onThemeChange?: (next: ThemeWheelTheme) => void;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE = 24;
const CX = 12;
const CY = 12;
const R = 10.5;

/** Unit circle angles (rad): sector from a0 to a1. */
function sectorPath(a0: number, a1: number): string {
  const x0 = CX + R * Math.cos(a0);
  const y0 = CY + R * Math.sin(a0);
  const x1 = CX + R * Math.cos(a1);
  const y1 = CY + R * Math.sin(a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
}

// Three-theme geometry (120° wedges). Fills remapped so light sits at 12 o'clock at 0° rotation.
const A0 = -Math.PI / 2;
const A1 = A0 + (2 * Math.PI) / 3;
const A2 = A1 + (2 * Math.PI) / 3;
const A3 = A2 + (2 * Math.PI) / 3;

// Two-theme: vertical split — light (white) LEFT, dark (black) RIGHT at 0° rotation.
// Left semicircle: θ from π/2 → 3π/2; right semicircle: θ from −π/2 → π/2.
const TWO_LIGHT_A0 = Math.PI / 2;
const TWO_LIGHT_A1 = (3 * Math.PI) / 2;
const TWO_DARK_A0 = -Math.PI / 2;
const TWO_DARK_A1 = Math.PI / 2;

const springTransition = {
  type: "spring" as const,
  stiffness: 160,
  damping: 28,
};

const outerTransition = {
  duration: 0.22,
  ease: [0.33, 1, 0.68, 1] as const,
};

/** Two-segment wheel: 400ms ease-in-out, 180° clockwise per click; theme updates at click start. */
const twoClickTransition = {
  duration: 0.4,
  ease: [0.42, 0, 0.58, 1] as const,
};

function twoThemeBaseDeg(theme: ThemeWheelTheme): number {
  if (theme === "light" || theme === "colour") return 0;
  return 180;
}

export const ThemeWheel: React.FC<ThemeWheelProps> = ({
  theme = "light",
  state = "default",
  darkMode = false,
  variant = "three",
  onThemeChange,
  className,
  style,
}) => {
  const strokeCol = darkMode ? semanticColors.strokeInvertedMedium : semanticColors.strokeMedium;
  const disabled = state === "disabled";
  const wedgeDark = semanticColors.backdropStaticBlack;
  const wedgeColour = semanticColors.buttonSurfacePrimary;
  const wedgeLight = semanticColors.backdropStaticWhite;

  const rotationDeg = themeRotationDeg(theme);
  const interactive = !disabled && Boolean(onThemeChange);

  const rotationTwo = useMotionValue(twoThemeBaseDeg(theme));
  const twoAnimating = useRef(false);

  useEffect(() => {
    if (variant !== "two") return;
    if (twoAnimating.current) return; // don't interrupt in-progress animation
    rotationTwo.set(twoThemeBaseDeg(theme));
  }, [theme, variant, rotationTwo]);

  const handleWheelClick = () => {
    if (!interactive || !onThemeChange) return;

    if (variant === "two") {
      if (twoAnimating.current) return;
      twoAnimating.current = true;
      const start = ((rotationTwo.get() % 360) + 360) % 360;
      const fromTheme = theme === "colour" ? "light" : theme;
      const nextTheme = fromTheme === "light" ? "dark" : "light";
      onThemeChange(nextTheme);
      animate(rotationTwo, start + 180, twoClickTransition).then(() => {
        twoAnimating.current = false;
      });
      return;
    }

    onThemeChange(CYCLE[theme]);
  };

  const svgAnimate =
    variant === "two" ? undefined : { rotate: rotationDeg };
  const svgTransition = variant === "two" ? undefined : springTransition;

  return (
    <motion.div
      className={className}
      style={{ width: SIZE, height: SIZE, flexShrink: 0, ...style }}
      initial={false}
      animate={{ opacity: disabled ? 0.48 : 1, scale: disabled ? 0.96 : 1 }}
      transition={outerTransition}
      aria-hidden={!onThemeChange}
    >
      <motion.svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        initial={false}
        animate={svgAnimate}
        transition={svgTransition}
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          display: "block",
          ...(variant === "two" ? { rotate: rotationTwo } : {}),
        }}
      >
        <title>Theme wheel</title>
        {variant === "three" ? (
          <>
            <path d={sectorPath(A0, A1)} fill={wedgeLight} opacity={disabled ? 0.85 : 1} />
            <path d={sectorPath(A1, A2)} fill={wedgeDark} opacity={disabled ? 0.85 : 1} />
            <path d={sectorPath(A2, A3)} fill={wedgeColour} opacity={disabled ? 0.85 : 1} />
          </>
        ) : (
          <>
            <path
              d={sectorPath(TWO_LIGHT_A0, TWO_LIGHT_A1)}
              fill={wedgeLight}
              opacity={disabled ? 0.85 : 1}
            />
            <path
              d={sectorPath(TWO_DARK_A0, TWO_DARK_A1)}
              fill={wedgeDark}
              opacity={disabled ? 0.85 : 1}
            />
          </>
        )}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={strokeCol}
          strokeWidth={layout.strokeS}
        />
        {interactive ? (
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onClick={handleWheelClick}
          />
        ) : null}
      </motion.svg>
    </motion.div>
  );
};

ThemeWheel.displayName = "ThemeWheel";
export default ThemeWheel;
