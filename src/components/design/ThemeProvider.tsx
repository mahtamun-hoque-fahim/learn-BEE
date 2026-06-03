'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

const ThemeCtx = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Defer reading localStorage until after mount to avoid SSR/CSR mismatch.
  const [theme, setTheme] = useState<Theme>('light')

  // On mount, read saved theme + apply
  useEffect(() => {
    try {
      const saved = localStorage.getItem('learnbee.theme')
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved)
        document.documentElement.setAttribute('data-theme', saved)
        return
      }
    } catch {}
    // No saved value → respect system preference, default light otherwise
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const initial: Theme = prefersDark ? 'dark' : 'light'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = useCallback(() => {
    setTheme(t => {
      const next: Theme = t === 'light' ? 'dark' : 'light'
      try { localStorage.setItem('learnbee.theme', next) } catch {}
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}

export function useTheme() {
  return useContext(ThemeCtx)
}
