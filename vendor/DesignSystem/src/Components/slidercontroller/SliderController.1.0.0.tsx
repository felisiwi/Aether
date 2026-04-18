import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import HandleSlider from "../handleslider/HandleSlider.1.0.0";
import {
  colors,
  fontFamily,
  layout,
  typography,
} from "../../tokens/design-tokens";
import { getPlayerTheme, type ThemeIndex } from "../../tokens/theme-map";

const labelType = typography.label;

export interface SliderControllerProps {
  title: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  variant?: "default" | 1 | 2 | 3 | 4;
  className?: string;
  style?: React.CSSProperties;
}

function playerVariantToThemeIndex(v: 1 | 2 | 3 | 4): ThemeIndex {
  return (v - 1) as ThemeIndex;
}

export const SliderController: React.FC<SliderControllerProps> = ({
  title,
  value,
  suffix,
  min,
  max,
  step = 1,
  onChange,
  variant = "default",
  className,
  style,
}) => {
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [wheelHot, setWheelHot] = useState(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const range = max - min || 1;
  const normalized = Math.max(0, Math.min(1, (value - min) / range));

  const roundToStep = useCallback(
    (v: number) => {
      const s = step;
      return Math.round(v / s) * s;
    },
    [step],
  );

  const interactionRef = useRef({
    value,
    min,
    max,
    step,
    onChange,
    roundToStep,
  });
  interactionRef.current = { value, min, max, step, onChange, roundToStep };

  const bumpWheelActive = useCallback(() => {
    setWheelHot(true);
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    wheelTimerRef.current = setTimeout(() => {
      setWheelHot(false);
      wheelTimerRef.current = null;
    }, 200);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      bumpWheelActive();
      const { value: v, min: lo, max: hi, step: st, onChange: oc, roundToStep: r } =
        interactionRef.current;
      const dir = e.deltaY > 0 ? 1 : -1;
      const raw = v + dir * st;
      const snapped = r(Math.max(lo, Math.min(hi, raw)));
      if (snapped !== v) oc(snapped);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [bumpWheelActive]);

  const handleNorm = useCallback(
    (n: number) => {
      const next = min + n * range;
      const snapped = roundToStep(Math.max(min, Math.min(max, next)));
      if (snapped !== value) onChange(snapped);
    },
    [max, min, onChange, range, roundToStep, value],
  );

  const isThemed = variant !== "default";
  const themeIdx: ThemeIndex | undefined = isThemed
    ? playerVariantToThemeIndex(variant)
    : undefined;

  const visualActive = dragging || wheelHot;

  const valueColor = (() => {
    if (!visualActive) return colors.textHeadingNeutral;
    if (variant === "default") return colors.textHeadingColour;
    return getPlayerTheme(playerVariantToThemeIndex(variant)).primary60;
  })();

  const labelStyle: React.CSSProperties = {
    fontFamily,
    fontSize: labelType.fontSize,
    fontWeight: 660,
    lineHeight: `${labelType.lineHeight}px`,
    letterSpacing: labelType.letterSpacing,
    fontStretch: `${labelType.fontWidth}%`,
    fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
    color: colors.textHeadingNeutral,
    textAlign: "center",
    margin: 0,
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const valueString =
    Number.isInteger(value) || step >= 1
      ? String(Math.round(value))
      : String(value);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: layout.gap48,
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
        gap: layout.gap8,
        ...style,
      }}
    >
      <div
        style={{
          paddingLeft: layout.gap4,
          paddingRight: layout.gap4,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <p id={titleId} style={labelStyle}>
          {title}
        </p>
      </div>

      <HandleSlider
        value={normalized}
        onChange={handleNorm}
        variant={isThemed ? "theme" : "default"}
        themeIndex={themeIdx}
        visualActive={visualActive}
        orientation="vertical"
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
        ariaLabelledBy={titleId}
        style={{ alignSelf: "center" }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "nowrap",
          gap: 0,
          width: "100%",
        }}
      >
        <span
          style={{
            ...labelStyle,
            color: valueColor,
            width: "auto",
          }}
        >
          {valueString}
        </span>
        <span
          style={{
            ...labelStyle,
            color: colors.textBodyNeutral,
            width: "auto",
          }}
        >
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
    </div>
  );
};

SliderController.displayName = "SliderController";
export default SliderController;
