/**
 * Icon — single atom component for the design system icon set.
 * Figma: Icon collection (node 13960-3118), sizes 32 / 24 / 16.
 * Colour from design system tokens only. Phosphor and custom icons both support weight (regular/fill).
 * Custom media icons use size-based corner radius: 16 → 0, 24 → 0.5px, 32 → 1px.
 *
 * Archived v1.0.0 — superseded by Icon.1.1.0 (custom icon geometry from Icons/custom Figma snapshot).
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
import { colors } from '../../../tokens/design-tokens';
import type { IconName } from '../icon-names';
import { CUSTOM_ICON_MAP, getCustomIconRadius, getCustomIconRadiusViewBox } from '../custom-icons';

const ICON_SIZE = [16, 24, 32] as const;
export type IconSize = (typeof ICON_SIZE)[number];

/** regular (outline) or fill. Applies to both Phosphor and custom icons. */
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

export interface IconProps {
  /** Icon name (flat list from icon-names). */
  name: IconName;
  /** Size in px: 16, 24, or 32. */
  size?: IconSize;
  /** 'regular' (outline) or 'fill'. Same for Phosphor and custom icons. */
  weight?: IconWeight;
  /** Optional className / style (e.g. for layout). Colour is from design system only. */
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
  className,
  style,
}: IconProps) {
  const color = DEFAULT_COLOR;

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
