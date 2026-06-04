import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { Icon } from '@/components/design/icons'

export const metadata = { title: 'Contributors — learnBEE' }

const REPO = 'https://github.com/mahtamun-hoque-fahim/learn-BEE'
const DISCUSS = 'https://github.com/mahtamun-hoque-fahim/learn-BEE/discussions'

const CONTRIBUTORS = [
  { initials: 'MH', name: 'Mahtamun Hoque Fahim', role: 'Curator · 45th Batch', note: 'CSE, BGCTUB. Built and maintains the knowledge base.' },
  { initials: 'TR', name: 'Tahsin Rahman',        role: 'Lab videos · 45th',   note: 'Recorded experiments 01, 02 and 07.' },
  { initials: 'RA', name: 'Rifat Ahmed',          role: 'Lab videos · 45th',   note: 'Recorded experiments 02 and 08.' },
  { initials: 'AN', name: 'Anika Nawar',          role: 'Lab videos · 45th',   note: 'Recorded experiment 04.' },
]

const FACTS: [string, string][] = [
  ['Department', 'CSE'],
  ['Course code', 'EEE 1201'],
  ['Credit hrs', '3.0'],
  ['Semester', '2nd / Sp'],
]

export default function ContributorsPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 1180, paddingTop: 56, paddingBottom: 24 }}>
        {/* Hero */}
        <div className="eyebrow" style={{ letterSpacing: '0.18em' }}>Contributors / About</div>
        <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', lineHeight: 1.02, letterSpacing: '-0.035em', margin: '16px 0 18px' }}>
          Built by students, for students
        </h1>
        <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'var(--ink-2)', maxWidth: 640, lineHeight: 1.6 }}>
          learnBEE is curated by Mahtamun Hoque Fahim — with lab footage and notes contributed by the
          45th batch, Department of CSE, BGCTUB.
        </p>

        {/* Contributor cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginTop: 36 }}>
          {CONTRIBUTORS.map(c => (
            <div key={c.name} className="card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--surface)' }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                background: 'var(--accent)', color: 'var(--on-mint)',
                fontFamily: 'var(--display)', fontWeight: 700, fontSize: 14,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{c.initials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 15.5 }}>{c.name}</div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--accent)', letterSpacing: '0.04em', margin: '3px 0 8px' }}>{c.role}</div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55 }}>{c.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* BGCTUB feature card — dy/dx dark panel */}
        <section style={{ background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 22, padding: 'clamp(28px,4vw,44px)', marginTop: 36 }}>
          <div className="bgctub-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28, alignItems: 'start' }}>
            <div>
              <div className="eyebrow" style={{ letterSpacing: '0.16em', marginBottom: 14 }}>
                About BGCTUB
              </div>
              <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,36px)', color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}>
                BGC Trust University Bangladesh
              </h2>
              <p style={{ color: 'var(--muted)', maxWidth: 560, fontSize: 14.5, lineHeight: 1.65 }}>
                A private university in Chittagong, Bangladesh. The Department of Computer Science &amp; Engineering
                runs the BEE course in the 2nd semester — this site is a 45th-batch effort to keep the resources
                in one place for the batches that come after.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {FACTS.map(([l, v]) => (
                <div key={l} style={{
                  padding: 18, borderRadius: 14,
                  background: 'rgba(255,255,255,.02)',
                  border: '1px solid var(--line)',
                }}>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: 8 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stuck on a topic? Ask. CTA */}
        <section className="card" style={{ marginTop: 24, padding: 'clamp(24px,3vw,32px)', background: 'var(--surface)' }}>
          <div className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'var(--mint-soft)', color: 'var(--accent)', border: '1px solid var(--mint-line)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="chat" size={20} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Stuck on a topic? Ask.
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, maxWidth: 520 }}>
                  We hang out on a Messenger group and a Discord server — both pinned in the README of the GitHub
                  repo. Solutions, doubts, the occasional meme.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <a href={REPO} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: 'var(--ink)', color: 'var(--bg)', borderColor: 'var(--ink)' }}>
                <Icon name="github" size={16} /> GitHub repo <Icon name="external" size={13} />
              </a>
              <a href={DISCUSS} target="_blank" rel="noopener noreferrer" className="btn-line">
                <Icon name="chat" size={16} /> Join discussion
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (min-width: 860px) {
          .bgctub-grid { grid-template-columns: 1.15fr 0.85fr !important; }
          .cta-grid { grid-template-columns: 1fr auto !important; }
        }
      `}</style>
    </>
  )
}
