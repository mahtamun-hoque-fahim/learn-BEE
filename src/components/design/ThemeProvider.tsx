'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

const ThemeCtx = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

/**
 * Blocking inline script that runs *before* React hydrates so the first paint
 * already has the right theme — dark is the default; honour a saved choice.
 * Logic mirrors ThemeProvider's mount effect.
 */
export const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('learnbee.theme');
    var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // We assume the inline script already set data-theme on <html>. Mirror it here.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'dark'
    const attr = document.documentElement.getAttribute('data-theme')
    return attr === 'light' ? 'light' : 'dark'
  })

  // Dark is the default. Re-sync state to whatever the blocking script set
  // on first mount (covers a saved 'light' choice) without ever auto-switching
  // based on OS preference.
  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme')
    setTheme(attr === 'light' ? 'light' : 'dark')
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
