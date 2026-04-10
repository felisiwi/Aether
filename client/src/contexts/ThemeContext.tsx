import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { lightTheme, darkTheme } from '../lib/theme'
import type { Theme, ThemeMode } from '../lib/theme'

interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeCtx = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'aether_theme'

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  useEffect(() => {
    document.body.style.background = mode === 'dark' ? darkTheme.pageBg : lightTheme.pageBg
    document.body.style.colorScheme = mode
  }, [mode])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: mode === 'dark' ? darkTheme : lightTheme, mode, toggleTheme }),
    [mode, toggleTheme],
  )

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
