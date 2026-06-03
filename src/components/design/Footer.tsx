import Link from 'next/link'
import { BeeMark } from './icons'

const FOOTER_LINKS = [
  { href: '/syllabus', label: 'Syllabus' },
  { href: '/lectures', label: 'Lectures' },
  { href: '/labs',     label: 'Labs' },
  { href: '/papers',   label: 'Papers' },
  { href: '/books',    label: 'Books' },
  { href: '/cheat-sheet', label: 'Cheat sheet' },
  { href: '/bonus',    label: 'Exam prep' },
  { href: '/learn',    label: 'Study' },
]

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', paddingTop: 36, paddingBottom: 28, marginTop: 96 }}>
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 28,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <BeeMark size={26} />
            <div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
                learn<span style={{ color: 'var(--accent)' }}>BEE</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                v0.2 · spring 2026
              </div>
            </div>
          </div>

          <nav
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              rowGap: 4,
            }}
          >
            {FOOTER_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  color: 'var(--muted)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: 18,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'baseline',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          <div style={{ maxWidth: 620 }}>
            A 45th-batch effort. Not officially affiliated with the BGCTUB administration —
            just students who got tired of losing the Drive link.
          </div>
          <div className="mono">Made with KaTeX, Next.js, and a lot of Sadiku.</div>
        </div>
      </div>
    </footer>
  )
}
