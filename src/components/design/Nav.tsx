'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BeeMark, Icon } from './icons'
import { useTheme } from './ThemeProvider'

const LINKS = [
  { href: '/syllabus', label: 'Syllabus' },
  { href: '/lectures', label: 'Lectures' },
  { href: '/labs',     label: 'Labs' },
  { href: '/papers',   label: 'Papers' },
  { href: '/books',    label: 'Books' },
  { href: '/cheat-sheet', label: 'Cheat sheet' },
  { href: '/dashboard', label: 'Dashboard' },
] as const

export function Nav() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'saturate(140%) blur(10px)',
        WebkitBackdropFilter: 'saturate(140%) blur(10px)',
        background: scrolled
          ? 'color-mix(in oklab, var(--bg) 82%, transparent)'
          : 'color-mix(in oklab, var(--bg) 60%, transparent)',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        transition: 'background-color .2s, border-color .2s',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 12 }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BeeMark size={28} />
          <span
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.02em',
            }}
          >
            learn<span style={{ color: 'var(--accent)' }}>BEE</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="nav-desktop" style={{ marginLeft: 24, gap: 4, display: 'none' }}>
          {LINKS.map(l => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  color: active ? 'var(--ink)' : 'var(--ink-2)',
                  fontSize: 14,
                  fontWeight: 500,
                  background: active ? 'var(--surface)' : 'transparent',
                  border: active ? '1px solid var(--line)' : '1px solid transparent',
                  transition: 'background-color .15s, color .15s',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Search button (desktop only) — opens the command palette */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
          aria-label="Search the syllabus"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            color: 'var(--muted)',
            fontSize: 13,
          }}
          className="search-btn"
        >
          <Icon name="search" size={15} />
          <span>Search</span>
          <span className="kbd" style={{ marginLeft: 8 }}>⌘K</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            color: 'var(--ink-2)',
          }}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
        </button>

        {/* Start studying CTA — desktop */}
        <Link
          href="/learn"
          className="cta-desktop"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 6,
            padding: '9px 14px',
            background: 'var(--accent)',
            color: 'var(--on-mint)',
            border: '1px solid var(--accent)',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Start studying
          <Icon name="arrow" size={14} />
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="mobile-menu-btn"
          style={{
            width: 38,
            height: 38,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            color: 'var(--ink-2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={16} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--line)',
            background: 'var(--bg)',
          }}
        >
          <div
            className="container"
            style={{ display: 'grid', gap: 4, padding: '12px 20px 16px' }}
          >
            {LINKS.map(l => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    display: 'block',
                    padding: '12px 14px',
                    borderRadius: 10,
                    color: active ? 'var(--ink)' : 'var(--ink-2)',
                    background: active ? 'var(--surface)' : 'transparent',
                    border: active ? '1px solid var(--line)' : '1px solid transparent',
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {l.label}
                </Link>
              )
            })}
            <div className="divider" style={{ margin: '8px 0' }} />
            <Link
              href="/search"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                color: 'var(--muted)',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
              }}
            >
              <Icon name="search" size={15} /> Search the syllabus
            </Link>
            <Link
              href="/learn"
              style={{
                marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px 14px',
                background: 'var(--accent)',
                color: 'var(--on-mint)',
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              Start studying <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Responsive helpers — hidden by default, show on md+ */}
      <style jsx>{`
        @media (min-width: 880px) {
          :global(.nav-desktop) { display: flex !important; }
          :global(.search-btn) { display: inline-flex !important; }
          :global(.cta-desktop) { display: inline-flex !important; }
          :global(.mobile-menu-btn) { display: none !important; }
        }
      `}</style>
    </header>
  )
}
