// Auto-generated from dependency-graph.json. Do not edit by hand.
// Run: node scripts/generate-design-tokens.js (or after build-dependency-graph / import from Figma).
// Re-export Figma variables → rebuild graph → run this script to update.
// Naming: see header comment in scripts/generate-design-tokens.js (camelCase from Figma paths).

/** Design system font (Dimensions/Text variable/Font-Family/Font in Figma). Use this for typography in components. */
export const fontFamily = "Mona Sans";

export const typography = {
  display: {
    fontSize: 72,
    fontWeight: 660,
    fontWidth: 120,
    lineHeight: 80,
    letterSpacing: -2  },
  headlineL: {
    fontSize: 64,
    fontWeight: 660,
    fontWidth: 120,
    lineHeight: 72,
    letterSpacing: -1.5  },
  headlineM: {
    fontSize: 40,
    fontWeight: 660,
    fontWidth: 120,
    lineHeight: 48,
    letterSpacing: -1  },
  titleL: {
    fontSize: 32,
    fontWeight: 660,
    fontWidth: 120,
    lineHeight: 40,
    letterSpacing: -0.5  },
  bodyL: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0  },
  bodyM: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3  },
  bodyS: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.2  },
  label: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: 660,
    fontWidth: 120  },
  buttonM: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: 660,
    fontWidth: 108  },
  buttonS: {
    fontSize: 14,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: 660,
    fontWidth: 108  },
  titleM: {
    fontSize: 24,
    fontWeight: 660,
    fontWidth: 120,
    lineHeight: 32,
    letterSpacing: -0.5  },
  titleS: {
    fontSize: 16,
    fontWeight: 660,
    fontWidth: 120,
    lineHeight: 24,
    letterSpacing: 0  },
  overline: {
    fontSize: 14,
    fontWeight: 660,
    fontWidth: 120,
    lineHeight: 16,
    letterSpacing: 0.5  },
  buttonMActive: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: 660,
    fontWidth: 108  },
  buttonSActive: {
    fontSize: 14,
    lineHeight: 28,
    letterSpacing: 0.2,
    fontWeight: 660,
    fontWidth: 108  },
  h6: {
    lineHeight: 24,
    letterSpacing: 0  }
} as const;

export type TypographyStyle = keyof typeof typography;

/** Text/Practical text colours from Figma. `textHeadingNeutral`, `textBodyNeutral`, `textDisabled`, `textLabel` are `var(--ds-…)` (see semantic-tokens.css); other keys are static hex. `textBodyNeutralDark` / `textBodyColourDark` are Dark mode (27:3) for overlays & dark surfaces. */
export const colors = {
  textHeadingNeutral: "var(--ds-text-heading-neutral)",
  textBodyNeutral: "var(--ds-text-body-neutral)",
  textBodyNeutralDark: "#ffffff99",
  textHeadingColour: "#F04700",
  textDisabled: "var(--ds-text-disabled)",
  textBodyColour: "#A33200",
  textBodyColourDark: "#FFA986",
  textPressed: "#FF8152",
  textLabel: "var(--ds-text-label)"
} as const;

/** Semantic colours as CSS variable references (see semantic-tokens.css). Resolved per [data-theme] on documentElement. */
export const semanticColors = {
  buttonSurfacePrimary: "var(--ds-button-surface-primary)",
  buttonSurfaceSmallbuttonDefault: "var(--ds-button-surface-smallbutton-default)",
  buttonSurfaceHoverPrimary: "var(--ds-button-surface-hover-primary)",
  backdropNautralBackground: "var(--ds-backdrop-nautral-background)",
  backdropStatesDisabledSurface: "var(--ds-backdrop-states-disabled-surface)",
  backdropStatesHoverSurface: "var(--ds-backdrop-states-hover-surface)",
  backdropOpacityStaticOpacityDarkenedStrong: "var(--ds-backdrop-opacity-static-opacity-darkened-strong)",
  strokeMedium: "var(--ds-stroke-medium)",
  strokeSolid: "var(--ds-stroke-solid)",
  strokeInvertedMedium: "var(--ds-stroke-inverted-medium)",
  strokeColour: "var(--ds-stroke-colour)",
  strokeDisabled: "var(--ds-stroke-disabled)",
  textFunctionalError: "var(--ds-text-functional-error)",
  textFunctionalSuccess: "var(--ds-text-functional-success)",
  backdropSurfaceThemedSurface: "var(--ds-backdrop-surface-themed-surface)",
  backdropSurfaceColouredSurface: "var(--ds-backdrop-surface-coloured-surface)",
  backdropOpacityAdaptiveShadowsDropshadowMid: "var(--ds-backdrop-opacity-adaptive-shadows-dropshadow-mid)",
  backdropOpacityAdaptiveShadowsInnerglow: "var(--ds-backdrop-opacity-adaptive-shadows-innerglow)",
  textFunctionalWarning: "var(--ds-text-functional-warning)",
  textFunctionalLink: "var(--ds-text-functional-link)",
  textFunctionalVisitedLink: "var(--ds-text-functional-visited-link)",
  semanticStrokeStaticStrokeBlackSolid: "var(--ds-semantic-stroke-static-stroke-black-solid)",
  semanticStrokeStaticStrokeBlackWeak: "var(--ds-semantic-stroke-static-stroke-black-weak)",
  semanticStrokeStaticStrokeBlackStrong: "var(--ds-semantic-stroke-static-stroke-black-strong)",
  semanticStrokeStaticStrokeWhiteSolid: "var(--ds-semantic-stroke-static-stroke-white-solid)",
  semanticStrokeStaticStrokeWhiteWeak: "var(--ds-semantic-stroke-static-stroke-white-weak)",
  strokeElevatedSurface: "var(--ds-stroke-elevated-surface)",
  semanticStrokeStaticStrokeDisabledStatic: "var(--ds-semantic-stroke-static-stroke-disabled-static)",
  backdropOpacityStaticOpacityDarkenedWeak: "var(--ds-backdrop-opacity-static-opacity-darkened-weak)",
  backdropOpacityStaticOpacityLightenedWeak: "var(--ds-backdrop-opacity-static-opacity-lightened-weak)",
  backdropStaticWhite: "var(--ds-backdrop-static-white)",
  backdropStaticBlack: "var(--ds-backdrop-static-black)",
  backdropStaticStaticDisabledSurface: "var(--ds-backdrop-static-static-disabled-surface)",
  backdropOpacityAdaptiveShadowsDropshadowHigh: "var(--ds-backdrop-opacity-adaptive-shadows-dropshadow-high)",
  buttonStrokeTertiary: "var(--ds-button-stroke-tertiary)",
  buttonStrokeSecondary: "var(--ds-button-stroke-secondary)",
  buttonSurfaceSecondarySurface: "var(--ds-button-surface-secondary-surface)",
  buttonSurfaceDisabled: "var(--ds-button-surface-disabled)",
  buttonTextDisabled: "var(--ds-button-text-disabled)",
  buttonStrokeDisabled: "var(--ds-button-stroke-disabled)",
  disabledSurfaceColour: "var(--ds-disabled-surface-colour)",
  buttonTextDisabledTextColour: "var(--ds-button-text-disabled-text-colour)",
  buttonStrokeDisabledColour: "var(--ds-button-stroke-disabled-colour)",
  buttonTextButtonText: "var(--ds-button-text-button-text)",
  buttonTextTertiary: "var(--ds-button-text-tertiary)",
  buttonTextButtonTextTertiaryColour: "var(--ds-button-text-button-text-tertiary-colour)",
  buttonSurfaceSecondaryDarkened: "var(--ds-button-surface-secondary-darkened)",
  buttonTextPrimary: "var(--ds-button-text-primary)",
  buttonTextSecondary: "var(--ds-button-text-secondary)",
  buttonSurfaceHoverTertiary: "var(--ds-button-surface-hover-tertiary)",
  buttonStrokePrimary: "var(--ds-button-stroke-primary)",
  buttonStrokeSecondaryDarkened: "var(--ds-button-stroke-secondary-darkened)",
  buttonStrokeTertiaryDarkened: "var(--ds-button-stroke-tertiary-darkened)",
  buttonTextSecondaryDarkened: "var(--ds-button-text-secondary-darkened)",
  buttonTextTertiaryDarkened: "var(--ds-button-text-tertiary-darkened)",
  buttonTextSecondaryColour: "var(--ds-button-text-secondary-colour)",
  buttonStrokeTertiaryColour: "var(--ds-button-stroke-tertiary-colour)",
  buttonSurfaceSecondarySurfaceS: "var(--ds-button-surface-secondary-surface-s)",
  buttonTextTertiaryS: "var(--ds-button-text-tertiary-s)",
  buttonStrokeTertiaryS: "var(--ds-button-stroke-tertiary-s)",
  backdropSurfaceElevatedSurface: "var(--ds-backdrop-surface-elevated-surface)",
  backdropOpacityStaticOpacityLightenedStrong: "var(--ds-backdrop-opacity-static-opacity-lightened-strong)",
  strokeInvertedSolid: "var(--ds-stroke-inverted-solid)",
  buttonStrokeSubtleColour: "var(--ds-button-stroke-subtle-colour)",
  buttonSurfaceSmallbuttonHover: "var(--ds-button-surface-smallbutton-hover)",
  buttonSurfaceSmallbuttonPressed: "var(--ds-button-surface-smallbutton-pressed)",
  wrapperColourPressed: "var(--ds-wrapper-colour-pressed)",
  backdropOpacityAdaptiveShadowsInnershadow: "var(--ds-backdrop-opacity-adaptive-shadows-innershadow)",
  wrapperElevatedPressed: "var(--ds-wrapper-elevated-pressed)",
  backdropOpacityAdaptiveOpacityDarkenedMedium: "var(--ds-backdrop-opacity-adaptive-opacity-darkened-medium)",
  backdropOpacityAdaptiveOpacityLightenedMedium: "var(--ds-backdrop-opacity-adaptive-opacity-lightened-medium)",
  backdropOpacityAdaptiveOpacityDarkenedStrong: "var(--ds-backdrop-opacity-adaptive-opacity-darkened-strong)",
  backdropOpacityAdaptiveOpacityLightenedStrong: "var(--ds-backdrop-opacity-adaptive-opacity-lightened-strong)",
  backdropOpacityAdaptiveOpacityDarkenedWeak: "var(--ds-backdrop-opacity-adaptive-opacity-darkened-weak)",
  backdropOpacityAdaptiveOpacityLightenedWeak: "var(--ds-backdrop-opacity-adaptive-opacity-lightened-weak)",
  backdropSurfaceMidgreySurface: "var(--ds-backdrop-surface-midgrey-surface)",
  strokeColourPressed: "var(--ds-stroke-colour-pressed)",
  backdropInvertedBackground: "var(--ds-backdrop-inverted-background)",
  strokeStrong: "var(--ds-stroke-strong)",
  strokeInvertedStrong: "var(--ds-stroke-inverted-strong)",
  strokeWeak: "var(--ds-stroke-weak)",
  strokeInvertedWeak: "var(--ds-stroke-inverted-weak)",
  backdropStaticColour: "var(--ds-backdrop-static-colour)",
  strokeColourDark: "var(--ds-stroke-colour-dark)",
  backdropSurfaceColouredSurfaceDark: "var(--ds-backdrop-surface-coloured-surface-dark)",
  backdropSurfaceTransparentSurfaceLight: "var(--ds-backdrop-surface-transparent-surface-light)",
  backdropSurfaceTransparentSurfaceDark: "var(--ds-backdrop-surface-transparent-surface-dark)",
  backdropFunctionalWarningSurface: "var(--ds-backdrop-functional-warning-surface)",
  backdropFunctionalSuccessSurface: "var(--ds-backdrop-functional-success-surface)",
  backdropFunctionalInformationSurface: "var(--ds-backdrop-functional-information-surface)",
  backdropFunctionalErrorSurface: "var(--ds-backdrop-functional-error-surface)",
  strokeFocus: "var(--ds-stroke-focus)",
  strokeSuccess: "var(--ds-stroke-success)",
  semanticStrokeStaticStrokeWhiteStrong: "var(--ds-semantic-stroke-static-stroke-white-strong)",
  backdropStaticDarkenedWhite: "var(--ds-backdrop-static-darkened-white)",
  backdropStaticLightenedBlack: "var(--ds-backdrop-static-lightened-black)",
  strokeTheme: "var(--ds-stroke-theme)",
  backdropSurfaceThemedElevatedSurface: "var(--ds-backdrop-surface-themed-elevated-surface)",
  backdropStaticThemedElevatedSurface: "var(--ds-backdrop-static-themed-elevated-surface)",
  backdropStaticElevatedSurface: "var(--ds-backdrop-static-elevated-surface)",
  strokeThemePressed: "var(--ds-stroke-theme-pressed)",
  backdropSurfaceThemedSurfacePressed: "var(--ds-backdrop-surface-themed-surface-pressed)"
} as const;

/** Same references as {@link semanticColors}; actual values switch via semantic-tokens.css [data-theme="dark"]. */
export const semanticColorsDark = semanticColors;

/** Spacing gaps, radii, stroke weights (Desktop breakpoint in graph; gaps often identical per mode). */
export const layout = {
  radiusRound: 999,
  radiusXl: 64,
  radiusXs: 4,
  radiusM: 16,
  radiusS: 8,
  radiusNone: 0,
  radiusL: 32,
  strokeS: 1,
  strokeM: 1.5,
  strokeL: 2,
  verticalWrapper: 32,
  paddingWrapperHorizontal: 48,
  paddingSubtle: 16,
  paddingSymbolic: 8,
  gap2: 2,
  gap4: 4,
  gap8: 8,
  gap16: 16,
  gap24: 24,
  gap32: 32,
  gap40: 40,
  gap48: 48,
  gap56: 56,
  gap64: 64,
  gap80: 80,
  gap96: 96,
  gap112: 112,
  gap128: 128,
  gap144: 144,
  gap160: 160,
  gap192: 192,
  gap224: 224,
  gap256: 256,
  strokeXl: 3,
  paddingHorizontalSection: 96,
  paddingVerticalSection: 72,
  paddingWrapperVertical: 48,
  paddingWrapperVerticalHover: 40,
  stroke2Xl: 4,
  buttonInnerItemSpacing: 10
} as const;

/** Focus ring — light backgrounds (WCAG). Prefer over raw stroke-focus hex when matching product spec. */
export const focusRingLight = "#007B7F";
/** Focus ring — dark / colour backgrounds (WCAG). */
export const focusRingDark = "#64FFDA";

export const derivedTokens = {
  radiusButtonContainer: 24,
  paddingButton: 16,
  _formula: {
    radiusButtonContainer: "radiusM + paddingSubtle",
    paddingButton: "paddingSubtle * 2"  }
} as const;

/** Theme colour ramps from Figma Themes collection. Keys: purple, pink, green, blue (see theme-map.ts). */
export const themeTokens = {
  purple: {
    primary20: "#C6ADEB",
    primary30: "#A984E1",
    primary60: "#5618B4",
    primary10: "#E2D6F5",
    primary70: "#400E8B",
    primary40: "#8C5AD8",
    primary50: "#7031CE",
    primary80: "#2A0462",
    primary90: "#160A29",
    primaryInverse50: "#000000"  },
  pink: {
    primary20: "#EBADD3",
    primary30: "#E184BD",
    primary60: "#A42874",
    primary10: "#F5D6E9",
    primary70: "#7B1E57",
    primary40: "#D75BA7",
    primary50: "#CD3291",
    primary80: "#52143A",
    primary90: "#290A1D",
    primaryInverse50: "#000000"  },
  green: {
    primary20: "#68DF89",
    primary30: "#3DD669",
    primary60: "#166A2E",
    primary10: "#92E8AA",
    primary70: "#0F481F",
    primary40: "#27B951",
    primary50: "#1C873B",
    primary80: "#0A2911",
    primary90: "#041509",
    primaryInverse50: "#000000"  },
  blue: {
    primary20: "#7BAFEB",
    primary30: "#4E94E4",
    primary60: "#144986",
    primary10: "#A8CBF3",
    primary70: "#0D3159",
    primary40: "#237ADD",
    primary50: "#1A62B3",
    primary80: "#07182D",
    primary90: "#030C16",
    primaryInverse50: "#000000"  }
} as const;

export type ThemeMode = keyof typeof themeTokens;
