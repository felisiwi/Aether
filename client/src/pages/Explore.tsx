import {
  semanticColors,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'

const FONT = `${fontFamily}, sans-serif`

export default function Explore() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: semanticColors.backdropSurfaceThemedSurface,
        fontFamily: FONT,
      }}
    >
      <h1
        style={{
          color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
          fontSize: typography.headlineM.fontSize,
          fontWeight: typography.headlineM.fontWeight,
          letterSpacing: typography.headlineM.letterSpacing,
        }}
      >
        /explore
      </h1>
      <p
        style={{
          color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
          fontSize: typography.bodyS.fontSize,
          opacity: 0.5,
        }}
      >
        coming soon
      </p>
    </div>
  )
}
