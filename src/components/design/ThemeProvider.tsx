'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

const ThemeCtx = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'light', toggle: () => {} })

/**
 * Blocking inline script that runs *before* React hydrates so the first paint
 * already has the right theme — no light-flash on dark-OS users.
 * Logic mirrors ThemeProvider's mount effect.
 */
export const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('learnbee.theme');
    var theme = (saved === 'dark' || saved === 'light')
      ? saved
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // We assume the inline script already set data-theme on <html>. Mirror it here.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light'
    const attr = document.documentElement.getAttribute('data-theme')
    return attr === 'dark' ? 'dark' : 'light'
  })

  // Track system preference changes when user hasn't explicitly chosen a theme
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      let saved = null
      try { saved = localStorage.getItem('learnbee.theme') } catch {}
      if (saved !== 'light' && saved !== 'dark') {
        const next: Theme = e.matches ? 'dark' : 'light'
        setTheme(next)
        document.documentElement.setAttribute('data-theme', next)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
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
