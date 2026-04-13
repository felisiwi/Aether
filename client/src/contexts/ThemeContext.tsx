import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { lightTheme, darkTheme, colourTheme } from '../lib/theme'
import type { Theme, ThemeMode } from '../lib/theme'

interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  toggleTheme: () => void
  setThemeMode: (mode: ThemeMode) => void
}

const ThemeCtx = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'aether_theme'

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light' || stored === 'colour') return stored
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

  const setThemeMode = useCallback((next: ThemeMode) => {
    setMode(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const resolvedTheme: Theme =
    mode === 'dark' ? darkTheme : mode === 'colour' ? colourTheme : lightTheme

  useEffect(() => {
    document.body.style.background = resolvedTheme.pageBg
    document.body.style.transition = 'background-color 0.4s ease'
    document.body.style.colorScheme = mode === 'dark' ? 'dark' : 'light'
  }, [mode, resolvedTheme.pageBg])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: resolvedTheme, mode, toggleTheme, setThemeMode }),
    [resolvedTheme, mode, toggleTheme, setThemeMode],
  )

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
