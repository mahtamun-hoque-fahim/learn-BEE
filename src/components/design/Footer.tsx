import Link from 'next/link'
import { BeeMark, Icon } from './icons'

const REPO = 'https://github.com/mahtamun-hoque-fahim/learn-BEE'
const DISCUSS = 'https://github.com/mahtamun-hoque-fahim/learn-BEE/discussions'

const COURSE: { href: string; label: string; icon: string }[] = [
  { href: '/syllabus', label: 'Syllabus', icon: 'book' },
  { href: '/lectures', label: 'Lectures', icon: 'play' },
  { href: '/labs',     label: 'Labs',     icon: 'flask' },
  { href: '/papers',   label: 'Papers',   icon: 'paper' },
  { href: '/books',    label: 'Books',    icon: 'book' },
]

const PROJECT: { href: string; label: string; external?: boolean }[] = [
  { href: '/', label: 'Home' },
  { href: '/contributors', label: 'Contributors' },
  { href: DISCUSS, label: 'Discussion', external: true },
  { href: REPO, label: 'GitHub', external: true },
]

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--bg-2)', marginTop: 96 }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 36 }}>
        <div className="foot-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 36 }}>
          {/* Brand + tagline */}
          <div style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <BeeMark size={26} />
              <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
                learn<span style={{ color: 'var(--accent)' }}>BEE</span>
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
              A 45th-batch effort. Not officially affiliated with the BGCTUB administration — just students who got tired of losing the Drive link.
            </p>
          </div>

          <FootCol title="Course">
            {COURSE.map(l => (
              <Link key={l.href} href={l.href} className="foot-link" style={footLink}>
                <Icon name={l.icon} size={15} /> {l.label}
              </Link>
            ))}
          </FootCol>

          <FootCol title="Project">
            {PROJECT.map(l => (
              l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="foot-link" style={footLink}>
                  {l.label === 'GitHub' && <Icon name="github" size={15} />} {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} className="foot-link" style={footLink}>
                  {l.label}
                </Link>
              )
            ))}
          </FootCol>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: '1px solid var(--line)', marginTop: 40, paddingTop: 22,
            display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline', justifyContent: 'space-between',
          }}
        >
          <div className="mono" style={{ fontSize: 12, color: 'var(--dim)', letterSpacing: '0.04em' }}>
            v0.2 · spring 2026 · BGCTUB CSE
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Built for the batches that come after.
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 760px) {
          .foot-grid { grid-template-columns: 1.4fr 1fr 1fr !important; }
        }
        .foot-link:hover { color: var(--ink) !important; }
      `}</style>
    </footer>
  )
}

const footLink: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 9,
  fontSize: 14, color: 'var(--muted)', transition: 'color .15s',
}

function FootCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="tiny" style={{ marginBottom: 16 }}>{title}</div>
      <nav style={{ display: 'grid', gap: 12 }}>{children}</nav>
    </div>
  )
}
