import {
  colors,
  semanticColors,
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import BasicButton from '../components/BasicButton'
import { ThemeWheel } from '@ds/Components/themewheel/ThemeWheel.1.0.0'
import { Tag } from '@ds/Components/tag/Tag.1.0.0'
import LobbyGrid from '../components/jam/LobbyGrid'
import { useTheme } from '../contexts/ThemeContext'
import type { InstrumentMode } from '../lib/midi'
import type { DataChannelState } from '../lib/webrtc'

const FONT = `${fontFamily}, sans-serif`

export interface LobbyProps {
  username: string
  joined: boolean
  onStartJamming: () => void
  onPlaySolo: () => void
  presence: string[]
  connectToPeer: (target: string) => void
  connectingTo: string | null
  connectionState: DataChannelState
  turnConfigured: boolean
  error: string | null
  mode: InstrumentMode
  onLogout: () => void
}

export default function Lobby({
  username,
  joined,
  onStartJamming,
  onPlaySolo,
  presence,
  connectToPeer,
  connectingTo,
  turnConfigured,
  error,
  mode,
  onLogout,
}: LobbyProps) {
  const { theme, mode: themeMode, setThemeMode } = useTheme()
  const isDark = theme.mode === 'dark'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: layout.gap32,
        fontFamily: FONT,
        minHeight: '100vh',
        background: theme.pageBg,
        transition: 'background-color 200ms ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
          marginBottom: layout.gap32,
        }}
      >
        <h1
          style={{
            fontSize: typography.titleL.fontSize,
            fontWeight: typography.titleL.fontWeight,
            color: theme.textColourHeading,
            margin: 0,
          }}
        >
          Aether
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: layout.gap8,
          }}
        >
          <Tag type="default" state="active">
            {username}
          </Tag>
          <Tag type="default" state="active">
            {mode === 'wind' ? 'Aerophone Mini' : 'Piano (keyboard)'}
          </Tag>
          <ThemeWheel
            theme={themeMode}
            onThemeChange={setThemeMode}
            darkMode={isDark}
          />
          <BasicButton variant="secondary" size="small" onClick={onLogout}>
            Log out
          </BasicButton>
        </div>
      </div>

      {/* TURN warning */}
      {!turnConfigured && (
        <div
          style={{
            width: '100%',
            maxWidth: 600,
            padding: `${layout.gap8}px ${layout.gap16}px`,
            borderRadius: layout.radiusS,
            background: semanticColors.backdropFunctionalWarningSurface,
            color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
            fontSize: typography.bodyS.fontSize,
            marginBottom: layout.gap16,
          }}
        >
          TURN credentials missing — real-network connections will likely fail.
          Add them to .env.
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            width: '100%',
            maxWidth: 600,
            padding: `${layout.gap8}px ${layout.gap16}px`,
            borderRadius: layout.radiusS,
            background: semanticColors.backdropFunctionalErrorSurface,
            color: semanticColors.semanticStrokeStaticStrokeWhiteSolid,
            fontSize: typography.bodyS.fontSize,
            marginBottom: layout.gap16,
          }}
        >
          {error}
        </div>
      )}

      {/* Main content */}
      {!joined ? (
        <div style={{ textAlign: 'center', marginTop: layout.gap64 }}>
          <div style={{ display: 'flex', gap: layout.gap8, justifyContent: 'center' }}>
            <BasicButton
              variant="primary"
              colourFill
              size="large"
              onClick={onStartJamming}
            >
              Tethered Jam
            </BasicButton>
            <BasicButton
              variant="secondary"
              size="large"
              onClick={onPlaySolo}
            >
              Aether Synth
            </BasicButton>
          </div>
          <p
            style={{
              fontSize: typography.bodyS.fontSize,
              color: theme.textBody,
              marginTop: layout.gap8,
            }}
          >
            Tethered Jam connects to the server. Aether Synth lets you practice alone.
          </p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 600 }}>
          {presence.filter((u) => u !== username).length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: layout.gap32 }}>
              <p
                style={{
                  fontSize: typography.bodyM.fontSize,
                  color: theme.textBody,
                  marginBottom: layout.gap16,
                }}
              >
                No one else is online yet.
              </p>
              <BasicButton
                variant="secondary"
                size="large"
                onClick={onPlaySolo}
              >
                Aether Synth while you wait
              </BasicButton>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: layout.gap16,
                }}
              >
                <p
                  style={{
                    fontSize: typography.bodyS.fontSize,
                    color: theme.textBody,
                    margin: 0,
                  }}
                >
                  Click a player to start a jam session.
                </p>
                <BasicButton
                  variant="secondary"
                  size="small"
                  onClick={onPlaySolo}
                >
                  Aether Synth
                </BasicButton>
              </div>
              <LobbyGrid
                users={presence.map((u) => ({
                  username: u,
                  instrument: 'keyboard' as const,
                }))}
                localUser={username}
                onSelectUser={connectToPeer}
                connectingTo={connectingTo}
                latencies={{}}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
