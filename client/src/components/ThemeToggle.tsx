import { fontFamily, layout } from '@ds/tokens/design-tokens'
import { useTheme } from '../contexts/ThemeContext'

const FONT = `${fontFamily}, sans-serif`

export default function ThemeToggle() {
  const { mode, toggleTheme, theme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'none',
        border: `${layout.strokeS}px solid ${theme.strokeSymbolic}`,
        borderRadius: layout.radiusRound,
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontFamily: FONT,
        fontSize: 18,
        color: theme.textBody,
        transition: 'border-color 200ms ease, color 200ms ease',
      }}
    >
      {mode === 'dark' ? '☀' : '☾'}
    </button>
  )
}
