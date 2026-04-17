import {
  colors,
  semanticColors,
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import { Tag } from '../Tag'
import { useTheme } from '../../contexts/ThemeContext'
import type { InstrumentMode } from '../../lib/midi'

const FONT = `${fontFamily}, sans-serif`

export interface PlayerCardProps {
  username: string
  instrument: InstrumentMode
  latency: number | null
  isConnected: boolean
  onClick?: () => void
  isConnecting?: boolean
}

function latencyBg(ms: number | null, disabledSurface: string): string {
  if (ms === null) return disabledSurface
  if (ms < 20) return semanticColors.backdropFunctionalSuccessSurface
  if (ms <= 50) return semanticColors.backdropFunctionalWarningSurface
  return semanticColors.backdropFunctionalErrorSurface
}

function latencyFg(ms: number | null, disabledText: string): string {
  if (ms === null) return disabledText
  return semanticColors.semanticStrokeStaticStrokeWhiteSolid
}

export default function PlayerCard({
  username,
  instrument,
  latency,
  isConnected,
  onClick,
  isConnecting,
}: PlayerCardProps) {
  const { theme } = useTheme()

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick()
            }
          : undefined
      }
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: layout.gap8,
        padding: layout.gap16,
        borderRadius: layout.radiusM,
        border: `${layout.strokeS}px solid ${
          isConnected
            ? semanticColors.strokeColour
            : theme.strokeSymbolic
        }`,
        background: theme.surfaceCard,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        minWidth: 120,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: layout.radiusRound,
          background: isConnected
            ? semanticColors.buttonSurfacePrimary
            : theme.surfaceDisabled,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isConnected
            ? semanticColors.semanticStrokeStaticStrokeWhiteSolid
            : theme.textDisabled,
          fontFamily: FONT,
          fontSize: typography.titleM.fontSize,
          fontWeight: typography.titleM.fontWeight,
        }}
      >
        {username.charAt(0).toUpperCase()}
      </div>

      {/* Username */}
      <span
        style={{
          fontFamily: FONT,
          fontSize: typography.bodyM.fontSize,
          fontWeight: 600,
          color: theme.textHeading,
          lineHeight: `${typography.bodyM.lineHeight}px`,
        }}
      >
        {username}
      </span>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: layout.gap4, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Tag type="default" state="active">
          {instrument === 'wind' ? 'Aerophone Mini' : 'Piano (keyboard)'}
        </Tag>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingInline: layout.gap4,
            paddingBlock: layout.gap2,
            borderRadius: layout.radiusXs,
            background: latencyBg(latency, theme.surfaceDisabled),
            fontFamily: FONT,
            fontSize: typography.label.fontSize,
            fontWeight: typography.label.fontWeight,
            lineHeight: `${typography.label.lineHeight}px`,
            color: latencyFg(latency, theme.textDisabled),
            whiteSpace: 'nowrap',
          }}
        >
          {latency === null ? '—' : `${latency}ms`}
        </span>
      </div>

      {isConnecting && (
        <span
          style={{
            fontFamily: FONT,
            fontSize: typography.bodyS.fontSize,
            color: theme.textBody,
          }}
        >
          Connecting…
        </span>
      )}
    </div>
  )
}
