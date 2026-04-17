import type { ReactNode } from 'react'
import {
  colors,
  fontFamily,
  layout,
  semanticColors,
  typography,
} from '@ds/tokens/design-tokens'

/** Small pill badge — Aether API (not DS Tag). Preserves children + type + state props used across DebugPanel, Lobby, etc. */
export interface TagProps {
  children: ReactNode
  type?: 'default' | 'success'
  state?: 'active'
}

const label = typography.label

export function Tag({ children, type = 'default', state = 'active' }: TagProps) {
  const isActive = state === 'active'
  const isSuccess = type === 'success'
  const background = isSuccess
    ? semanticColors.backdropFunctionalSuccessSurface
    : semanticColors.backdropStaticWhite
  const color = isSuccess
    ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
    : colors.textBodyNeutral

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: layout.gap4,
        paddingBottom: layout.gap4,
        paddingLeft: layout.gap8,
        paddingRight: layout.gap8,
        borderRadius: layout.radiusS,
        background,
        opacity: isActive ? 1 : 0.6,
        boxSizing: 'border-box',
        fontFamily,
        fontSize: label.fontSize,
        fontWeight: label.fontWeight,
        lineHeight: `${label.lineHeight}px`,
        letterSpacing: label.letterSpacing,
        fontStretch: `${label.fontWidth}%`,
        color,
        fontFeatureSettings: "'ss01' 1, 'lnum' 1, 'tnum' 1",
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
