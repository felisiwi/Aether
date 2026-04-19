import React from "react";
import { layout, semanticColors } from "../../tokens/design-tokens";

/**
 * Figma COMPONENT_SET `TestComponent` (node 14809:16191).
 * Variants: Property 1 = Frame 938 | Frame 939 (REST snapshot child components).
 *
 * Token mapping (boundVariables → design-tokens.ts):
 * - Fill Frame 938: VariableID:9277:1271 → Backdrop/Surface/coloured-surface → `semanticColors.backdropSurfaceColouredSurface`
 * - Fill Frame 939: VariableID:11088:59076 → …/wrapper-colour-pressed → `semanticColors.wrapperColourPressed`
 * - Corner radius: VariableID:2010:199 → Radius/radius-m → `layout.radiusM`
 *
 * Dimensions from snapshot `absoluteBoundingBox`: 341 × 143 (both variants).
 */
export type TestComponentVariant = "frame938" | "frame939";

/** Maps to Figma variant names `Property 1=Frame 938` / `Property 1=Frame 939`. */
const VARIANT_FILL: Record<TestComponentVariant, string> = {
  /** VariableID:9277:1271 */
  frame938: semanticColors.backdropSurfaceColouredSurface,
  /** VariableID:11088:59076 */
  frame939: semanticColors.wrapperColourPressed,
};

export const TEST_COMPONENT_WIDTH = 341;
export const TEST_COMPONENT_HEIGHT = 143;

/** Figma Frame 938: ON_PRESS → Frame 939 with dissolve ~300ms ease-out. */
const PRESS_TRANSITION_MS = 300;
const PRESS_EASING = "ease-out";

export interface TestComponentProps {
  variant?: TestComponentVariant;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /**
   * When there are no children, the surface is treated as decorative (aria-hidden + role="presentation").
   * With children, those attributes are omitted so assistive tech can reach the content.
   */
  decorative?: boolean;
  /**
   * When true (default), pointer down animates like the Figma prototype: Frame 938 shows Frame 939 fill
   * while pressed; Frame 939 gets a slight scale press. Set false when wrapped in another clickable
   * control (e.g. Storybook PressToToggle).
   */
  animatePress?: boolean;
}

export const TestComponent: React.FC<TestComponentProps> = ({
  variant = "frame938",
  className,
  style,
  children,
  decorative,
  animatePress = true,
}) => {
  const isDecorative = decorative ?? !children;
  const [pressed, setPressed] = React.useState(false);

  const backgroundColor =
    animatePress && variant === "frame938" && pressed
      ? VARIANT_FILL.frame939
      : VARIANT_FILL[variant];

  /** Colour swap (938) + light scale on both variants so the press reads clearly in Storybook. */
  const transform =
    animatePress && pressed
      ? variant === "frame938"
        ? "scale(0.98)"
        : "scale(0.97)"
      : "scale(1)";

  const containerStyle: React.CSSProperties = {
    width: TEST_COMPONENT_WIDTH,
    maxWidth: "100%",
    height: TEST_COMPONENT_HEIGHT,
    overflow: "hidden",
    boxSizing: "border-box",
    borderRadius: layout.radiusM,
    backgroundColor,
    transform,
    transformOrigin: "center",
    transition: `background-color ${PRESS_TRANSITION_MS}ms ${PRESS_EASING}, transform ${PRESS_TRANSITION_MS}ms ${PRESS_EASING}`,
    touchAction: "manipulation",
    cursor: animatePress ? "pointer" : undefined,
    ...style,
  };

  const release = React.useCallback(() => {
    setPressed(false);
  }, []);

  const pointerHandlers = animatePress
    ? {
        onPointerDown: () => setPressed(true),
        onPointerUp: release,
        onPointerCancel: release,
        onPointerLeave: release,
      }
    : {};

  return (
    <div
      className={className}
      style={containerStyle}
      role={isDecorative ? "presentation" : undefined}
      aria-hidden={isDecorative ? true : undefined}
      {...pointerHandlers}
    >
      {children}
    </div>
  );
};

export default TestComponent;
