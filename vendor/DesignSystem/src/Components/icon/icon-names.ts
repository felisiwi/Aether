/**
 * Flat list of icon names. Matches Figma Icon collection (node 13960-3118).
 * Categories (calculate, socials, navigation, media) are for organization only.
 * Use these as the `name` prop for the Icon component.
 */
export const ICON_NAMES = [
  'close',
  'arrow-left',
  'arrow-right',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'chevron-down',
  'hamburger',
  'search',
  'filter',
  'home',
  'component', // grid (four squares)
  'plus',
  'minus',
  'rewind',
  'fast-forward',
  'play',
  'pause',
  'stop',
  'instagram',
  'facebook',
  'pinterest',
  'tiktok',
  'x',
  'youtube',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** Figma path → code name (for design-to-code reference) */
export const FIGMA_PATH_TO_NAME: Record<string, IconName> = {
  '.icons/navigation/Close': 'close',
  '.icons/navigation/arrow left': 'arrow-left',
  '.icons/navigation/arrow right': 'arrow-right',
  '.icons/navigation/chevron left': 'chevron-left',
  '.icons/navigation/chevron right': 'chevron-right',
  '.icons/navigation/chevron up': 'chevron-up',
  '.icons/navigation/chevron down': 'chevron-down',
  '.icons/navigation/hamburger': 'hamburger',
  '.icons/navigation/search': 'search',
  '.icons/navigation/filter': 'filter',
  '.icons/navigation/home': 'home',
  '.icons/navigation/component': 'component',
  '.icons/calculate/plus': 'plus',
  '.icons/calculate/minus': 'minus',
  '.icons/media/Rewind': 'rewind',
  '.icons/media/Fast-forward': 'fast-forward',
  '.icons/media/Play': 'play',
  '.icons/media/Pause': 'pause',
  '.icons/media/Stop': 'stop',
  '.icons/socials/Instagram': 'instagram',
  '.icons/socials/Facebook': 'facebook',
  '.icons/socials/Pinterest': 'pinterest',
  '.icons/socials/Tiktok': 'tiktok',
  '.icons/socials/X': 'x',
  '.icons/socials/YouTube': 'youtube',
};
