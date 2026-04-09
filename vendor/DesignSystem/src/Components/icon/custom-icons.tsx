/**
 * Custom icons (media only): rewind, fast-forward, play, pause, stop.
 * Same weight API as Phosphor: regular (outline) and fill.
 *
 * **Outline (`regular`):** stroke the same paths/rects as before (24×24 viewBox).
 * **Fill (`fill`):** the identical shape — same `path d` or rects — with `fill` instead of stroke (no separate “rounded fill” geometry).
 *
 * Corner radius on rects (pause/stop): 16 → 0, 24 → 0.5, 32 → 1px via `radiusViewBox`.
 * Stroke: **1.5** viewBox units → ~1 / 1.5 / 2 px at 16 / 24 / 32 display size.
 */
import React from 'react';
import type { IconName } from './icon-names';

export type IconWeight = 'regular' | 'fill';

export interface CustomIconProps {
  size: number;
  color: string;
  weight: IconWeight;
  /** Corner radius in viewBox units for pause/stop rects. */
  radiusViewBox: number;
}

export type CustomIconComponent = React.ComponentType<CustomIconProps>;

/** Pixel radius for custom icon wrapper: 16 → 0, 24 → 0.5, 32 → 1. */
export function getCustomIconRadius(size: number): number {
  if (size <= 16) return 0;
  if (size <= 24) return 0.5;
  return 1;
}

/** Radius in viewBox units (24×24): 16 → 0, 24 → 0.5, 32 → 0.75 (1px at 32px). */
export function getCustomIconRadiusViewBox(size: number): number {
  if (size <= 16) return 0;
  if (size <= 24) return 0.5;
  return (1 * 24) / 32;
}

export const CUSTOM_ICON_NAMES: IconName[] = ['rewind', 'fast-forward', 'play', 'pause', 'stop'];

const STROKE_VIEWBOX = 1.5;

const PLAY_D = 'M8 5.5v13l10.5-6.5L8 5.5z';
const REWIND_D = 'M11 17V7L3 12l8 5zm1-5l8 5V7l-8 5z';
const FAST_FORWARD_D = 'M13 17V7l8 5-8 5zm-1-5l-8-5v10l8-5z';

function CustomPlay({ size, color, weight }: CustomIconProps) {
  const isFill = weight === 'fill';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {isFill ? (
        <path d={PLAY_D} fill={color} />
      ) : (
        <path
          d={PLAY_D}
          stroke={color}
          strokeWidth={STROKE_VIEWBOX}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

function CustomPause({ size, color, weight, radiusViewBox }: CustomIconProps) {
  const isFill = weight === 'fill';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {isFill ? (
        <>
          <rect x="6" y="4" width="4" height="16" rx={radiusViewBox} ry={radiusViewBox} fill={color} />
          <rect x="14" y="4" width="4" height="16" rx={radiusViewBox} ry={radiusViewBox} fill={color} />
        </>
      ) : (
        <>
          <rect
            x="6"
            y="4"
            width="4"
            height="16"
            rx={radiusViewBox}
            ry={radiusViewBox}
            stroke={color}
            strokeWidth={STROKE_VIEWBOX}
            fill="none"
          />
          <rect
            x="14"
            y="4"
            width="4"
            height="16"
            rx={radiusViewBox}
            ry={radiusViewBox}
            stroke={color}
            strokeWidth={STROKE_VIEWBOX}
            fill="none"
          />
        </>
      )}
    </svg>
  );
}

function CustomRewind({ size, color, weight }: CustomIconProps) {
  const isFill = weight === 'fill';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {isFill ? (
        <path d={REWIND_D} fill={color} fillRule="nonzero" />
      ) : (
        <path
          d={REWIND_D}
          stroke={color}
          strokeWidth={STROKE_VIEWBOX}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

function CustomFastForward({ size, color, weight }: CustomIconProps) {
  const isFill = weight === 'fill';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {isFill ? (
        <path d={FAST_FORWARD_D} fill={color} fillRule="nonzero" />
      ) : (
        <path
          d={FAST_FORWARD_D}
          stroke={color}
          strokeWidth={STROKE_VIEWBOX}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

function CustomStop({ size, color, weight, radiusViewBox }: CustomIconProps) {
  const isFill = weight === 'fill';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {isFill ? (
        <rect x="6" y="6" width="12" height="12" rx={radiusViewBox} ry={radiusViewBox} fill={color} />
      ) : (
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          rx={radiusViewBox}
          ry={radiusViewBox}
          stroke={color}
          strokeWidth={STROKE_VIEWBOX}
          fill="none"
        />
      )}
    </svg>
  );
}

export const CUSTOM_ICON_MAP: Partial<Record<IconName, CustomIconComponent>> = {
  rewind: CustomRewind,
  'fast-forward': CustomFastForward,
  play: CustomPlay,
  pause: CustomPause,
  stop: CustomStop,
};
