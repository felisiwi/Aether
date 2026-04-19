import { themeTokens } from './design-tokens'

// GUARD: themeTokens keys are purple/pink/green/blue — do NOT rename to Figma
// internal mode names (components/bubbleGum/developedComponents/prototypes).
// These names were deliberately changed to be human-readable. See theme-map.ts.

/**
 * Player theme mapping — index corresponds to external player slot.
 * Player 1 = index 0 (purple), Player 2 = index 1 (pink),
 * Player 3 = index 2 (green), Player 4 = index 3 (blue).
 * Names match themeTokens keys in design-tokens.ts.
 */
export const THEME_KEYS = [
  'purple',
  'pink',
  'green',
  'blue',
] as const
export type ThemeIndex = 0 | 1 | 2 | 3

export function getPlayerTheme(index: ThemeIndex) {
  return themeTokens[THEME_KEYS[index]]
}

export const playerThemes = [
  themeTokens.purple,
  themeTokens.pink,
  themeTokens.green,
  themeTokens.blue,
] as const
