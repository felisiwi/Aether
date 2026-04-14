import { useState } from 'react'
import {
  semanticColors,
  layout,
  typography,
  fontFamily,
} from '@ds/tokens/design-tokens'
import BasicButton from '../components/BasicButton'
import { useTheme } from '../contexts/ThemeContext'
import type { InstrumentMode } from '../lib/midi'
import { serverApiUrl } from '../lib/serverOrigin'

const FONT = `${fontFamily}, sans-serif`

interface LoginProps {
  onLogin: (username: string, mode: InstrumentMode) => void
}

export default function Login({ onLogin }: LoginProps) {
  const { theme } = useTheme()
  const isDark = theme.mode === 'dark'
  const [username, setUsername] = useState('')
  const [mode, setMode] = useState<InstrumentMode>('keyboard')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) {
      setError('Pick a name first')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(serverApiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed }),
      })
      const data = (await res.json()) as { ok: boolean }
      if (data.ok) {
        localStorage.setItem('aether_user', trimmed)
        onLogin(trimmed, mode)
      } else {
        setError('Something went wrong — try again')
      }
    } catch {
      setError('Could not reach server — is it running?')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: layout.gap32,
        fontFamily: FONT,
        background: theme.pageBg,
        transition: 'background-color 200ms ease',
      }}
    >
      <img
        src="/aether-wordmark.svg"
        alt="Aether"
        style={{
          height: 40,
          marginBottom: layout.gap4,
          filter: isDark ? 'invert(1)' : 'none',
        }}
      />
      <p
        style={{
          fontSize: typography.bodyM.fontSize,
          color: theme.textBody,
          marginBottom: layout.gap40,
        }}
      >
        The invisible wire between musicians
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: layout.gap24,
          width: '100%',
          maxWidth: 340,
        }}
      >
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: layout.gap4,
          }}
        >
          <span
            style={{
              fontSize: typography.label.fontSize,
              fontWeight: typography.label.fontWeight,
              color: theme.textBody,
            }}
          >
            Your name
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a display name"
            autoFocus
            style={{
              padding: `${layout.gap8}px`,
              borderRadius: layout.radiusS,
              border: `${layout.strokeS}px solid ${theme.strokeSymbolic}`,
              background: theme.surfaceInput,
              fontFamily: FONT,
              fontSize: typography.bodyM.fontSize,
              color: theme.textHeading,
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </label>

        <div>
          <span
            style={{
              fontSize: typography.label.fontSize,
              fontWeight: typography.label.fontWeight,
              color: theme.textBody,
              display: 'block',
              marginBottom: layout.gap8,
            }}
          >
            Instrument
          </span>
          <div style={{ display: 'flex', gap: layout.gap8 }}>
            <BasicButton
              variant="secondary"
              colourFill={mode === 'keyboard'}
              size="small"
              onClick={() => setMode('keyboard')}
              type="button"
            >
              Piano (keyboard)
            </BasicButton>
            <BasicButton
              variant="secondary"
              colourFill={mode === 'wind'}
              size="small"
              onClick={() => setMode('wind')}
              type="button"
            >
              Aerophone Mini
            </BasicButton>
            <BasicButton
              variant="secondary"
              colourFill={mode !== 'nanokey'}
              size="small"
              onClick={() => setMode('nanokey')}
              type="button"
            >
              Korg nanoKEY2
            </BasicButton>
          </div>
        </div>

        {error && (
          <p
            style={{
              color: semanticColors.textFunctionalError,
              fontSize: typography.bodyS.fontSize,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        <BasicButton
          variant="primary"
          colourFill
          size="large"
          type="submit"
          state={submitting ? 'disabled' : undefined}
        >
          {submitting ? 'Connecting…' : 'Enter'}
        </BasicButton>
      </form>
    </div>
  )
}
