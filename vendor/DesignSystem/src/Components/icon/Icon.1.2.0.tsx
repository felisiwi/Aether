/**
 * Icon — single atom component for the design system icon set.
 *
 * v1.2.0 — adds custom waveform icon names from Figma:
 * WaveformSine, WaveformTriangle, WaveformSawtooth, WaveformSquare.
 */
import React from 'react';
import {
  X,
  XLogo,
  ArrowLeft,
  ArrowRight,
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretDown,
  List,
  MagnifyingGlass,
  SlidersHorizontal,
  House,
  SquaresFour,
  Plus,
  Minus,
  InstagramLogo,
  FacebookLogo,
  PinterestLogo,
  TiktokLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';
import { colors } from '../../tokens/design-tokens';
import type { IconName } from './icon-names';
import { CUSTOM_ICON_MAP, getCustomIconRadius, getCustomIconRadiusViewBox } from './custom-icons';

const ICON_SIZE = [16, 24, 32] as const;
export type IconSize = (typeof ICON_SIZE)[number];

export type IconWeight = 'regular' | 'fill';

const PHOSPHOR_MAP: Partial<Record<IconName, React.ComponentType<{ size?: number; color?: string; weight?: IconWeight }>>> = {
  close: X,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'chevron-left': CaretLeft,
  'chevron-right': CaretRight,
  'chevron-up': CaretUp,
  'chevron-down': CaretDown,
  hamburger: List,
  search: MagnifyingGlass,
  filter: SlidersHorizontal,
  home: House,
  component: SquaresFour,
  plus: Plus,
  minus: Minus,
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  pinterest: PinterestLogo,
  tiktok: TiktokLogo,
  x: XLogo,
  youtube: YoutubeLogo,
};

const PHOSPHOR_PATH_MAP: Partial<Record<IconName, string>> = {
  shuffle:
    "M237.66,178.34a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L212.69,192H200.94a72.12,72.12,0,0,1-58.59-30.15l-41.72-58.4A56.1,56.1,0,0,0,55.06,80H32a8,8,0,0,1,0-16H55.06a72.12,72.12,0,0,1,58.59,30.15l41.72,58.4A56.1,56.1,0,0,0,200.94,176h11.75l-10.35-10.34a8,8,0,0,1,11.32-11.32ZM143,107a8,8,0,0,0,11.16-1.86l1.2-1.67A56.1,56.1,0,0,1,200.94,80h11.75L202.34,90.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L212.69,64H200.94a72.12,72.12,0,0,0-58.59,30.15l-1.2,1.67A8,8,0,0,0,143,107Zm-30,42a8,8,0,0,0-11.16,1.86l-1.2,1.67A56.1,56.1,0,0,1,55.06,176H32a8,8,0,0,0,0,16H55.06a72.12,72.12,0,0,0,58.59-30.15l1.2-1.67A8,8,0,0,0,113,149Z",
  "music-notes-plus":
    "M232,48a8,8,0,0,1-8,8H208V72a8,8,0,0,1-16,0V56H176a8,8,0,0,1,0-16h16V24a8,8,0,0,1,16,0V40h16A8,8,0,0,1,232,48Zm-16,64v52a36,36,0,1,1-16-29.92V112a8,8,0,0,1,16,0Zm-16,52a20,20,0,1,0-20,20A20,20,0,0,0,200,164ZM88,110.25V196a36,36,0,1,1-16-29.92V56a8,8,0,0,1,6.06-7.76l56-14a8,8,0,0,1,3.88,15.52L88,62.25v31.5l70.06-17.51a8,8,0,0,1,3.88,15.52ZM72,196a20,20,0,1,0-20,20A20,20,0,0,0,72,196Z",
  "arrow-u-up-left":
    "M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z",
  "arrows-out-line-horizontal":
    "M136,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM96,120H35.31l18.35-18.34A8,8,0,0,0,42.34,90.34l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.32-11.32L35.31,136H96a8,8,0,0,0,0-16Zm149.66,2.34-32-32a8,8,0,0,0-11.32,11.32L220.69,120H160a8,8,0,0,0,0,16h60.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,245.66,122.34Z",
};

export interface IconProps {
  name: IconName;
  size?: IconSize;
  weight?: IconWeight;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_SIZE: IconSize = 24;
const DEFAULT_WEIGHT: IconWeight = 'regular';
const DEFAULT_COLOR = colors.textHeadingNeutral;

export default function Icon({
  name,
  size = DEFAULT_SIZE,
  weight = DEFAULT_WEIGHT,
  color: colorProp,
  className,
  style,
}: IconProps) {
  const color = colorProp ?? DEFAULT_COLOR;

  const CustomIcon = CUSTOM_ICON_MAP[name];
  if (CustomIcon) {
    const radiusPx = getCustomIconRadius(size);
    const radiusViewBox = getCustomIconRadiusViewBox(size);
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radiusPx,
          overflow: 'hidden',
          ...style,
        }}
        role="img"
        aria-hidden
      >
        <CustomIcon size={size} color={color} weight={weight} radiusViewBox={radiusViewBox} />
      </span>
    );
  }

  const PhosphorIcon = PHOSPHOR_MAP[name];
  const pathD = PHOSPHOR_PATH_MAP[name];
  if (pathD) {
    return (
      <span
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color, ...style }}
        role="img"
        aria-hidden
      >
        <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden>
          <path d={pathD} />
        </svg>
      </span>
    );
  }
  if (!PhosphorIcon) {
    return null;
  }
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
      role="img"
      aria-hidden
    >
      <PhosphorIcon size={size} color={color} weight={weight} />
    </span>
  );
}
