import { colors, semanticColors } from '@ds/tokens/design-tokens'

export type ThemeMode = 'light' | 'dark' | 'colour'

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
  accentColour: string
  strokeWeak: string
}

export const lightTheme: Theme = {
  mode: 'light',
  pageBg: semanticColors.backdropStaticWhite,
  textHeading: colors.textHeadingNeutral,
  textBody: colors.textBodyNeutral,
  textDisabled: colors.textDisabled,
  surfaceCard: semanticColors.backdropStaticWhite,
  surfaceInput: semanticColors.backdropStaticWhite,
  surfaceDisabled: semanticColors.backdropStatesDisabledSurface,
  strokeSymbolic: semanticColors.strokeStrong,
  strokeSolid: semanticColors.strokeSolid,
  textColour: colors.textBodyColour,
  textColourHeading: colors.textHeadingColour,
  accentColour: semanticColors.buttonSurfacePrimary,
  strokeWeak: semanticColors.strokeWeak,
}

export const darkTheme: Theme = {
  mode: 'dark',
  pageBg: semanticColors.backdropInvertedBackground,
  textHeading: semanticColors.strokeInvertedSolid,
  textBody: colors.textBodyNeutralDark,
  textDisabled: semanticColors.strokeInvertedStrong,
  surfaceCard: semanticColors.backdropInvertedBackground,
  surfaceInput: semanticColors.backdropInvertedBackground,
  surfaceDisabled: semanticColors.backdropOpacityAdaptiveOpacityLightenedStrong,
  strokeSymbolic: semanticColors.strokeInvertedStrong,
  strokeSolid: semanticColors.strokeInvertedSolid,
  textColour: colors.textBodyColourDark,
  textColourHeading: colors.textHeadingColour,
  accentColour: semanticColors.buttonSurfacePrimary,
  strokeWeak: semanticColors.strokeInvertedWeak,
}

export const colourTheme: Theme = {
  mode: 'colour',
  pageBg: semanticColors.backdropStaticColour,
  textHeading: semanticColors.semanticStrokeStaticStrokeBlackSolid,
  textBody: semanticColors.semanticStrokeStaticStrokeBlackSolid,
  textDisabled: semanticColors.backdropSurfaceColouredSurfaceDark,
  surfaceCard: semanticColors.backdropSurfaceColouredSurfaceDark,
  surfaceInput: semanticColors.backdropSurfaceColouredSurfaceDark,
  surfaceDisabled: semanticColors.disabledSurfaceColour,
  strokeSymbolic: semanticColors.semanticStrokeStaticStrokeBlackSolid,
  strokeSolid: semanticColors.semanticStrokeStaticStrokeBlackSolid,
  textColour: semanticColors.semanticStrokeStaticStrokeBlackSolid,
  textColourHeading: semanticColors.semanticStrokeStaticStrokeBlackSolid,
  accentColour: semanticColors.semanticStrokeStaticStrokeBlackSolid,
  strokeWeak: semanticColors.backdropOpacityAdaptiveOpacityDarkenedWeak,
}
