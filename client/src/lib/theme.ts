import { colors, semanticColors } from '@ds/tokens/design-tokens'

export type ThemeMode = 'light' | 'dark'

export interface Theme {
  mode: ThemeMode
  pageBg: string
  textHeading: string
  textBody: string
  textDisabled: string
  surfaceCard: string
  surfaceInput: string
  surfaceDisabled: string
  strokeSymbolic: string
  strokeSolid: string
  textColour: string
  textColourHeading: string
}

export const lightTheme: Theme = {
  mode: 'light',
  pageBg: semanticColors.backdropNautralBackground,
  textHeading: colors.textHeadingNeutral,
  textBody: colors.textBodyNeutral,
  textDisabled: colors.textDisabled,
  surfaceCard: semanticColors.backdropNautralBackground,
  surfaceInput: semanticColors.backdropNautralBackground,
  surfaceDisabled: semanticColors.backdropStatesDisabledSurface,
  strokeSymbolic: semanticColors.strokeStrong,
  strokeSolid: semanticColors.strokeSolid,
  textColour: colors.textBodyColour,
  textColourHeading: colors.textHeadingColour,
}

export const darkTheme: Theme = {
  mode: 'dark',
  pageBg: semanticColors.backdropInvertedBackground,
  textHeading: semanticColors.strokeInvertedSolid,
  textBody: colors.textBodyNeutralDark,
  textDisabled: semanticColors.strokeInvertedStrong,
  surfaceCard: semanticColors.backdropStatesHoverSurface,
  surfaceInput: semanticColors.backdropStatesHoverSurface,
  surfaceDisabled: semanticColors.backdropOpacityAdaptiveOpacityLightenedStrong,
  strokeSymbolic: semanticColors.strokeInvertedStrong,
  strokeSolid: semanticColors.strokeInvertedSolid,
  textColour: colors.textBodyColourDark,
  textColourHeading: colors.textHeadingColour,
}
