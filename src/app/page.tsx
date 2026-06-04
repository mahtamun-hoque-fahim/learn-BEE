import Link from 'next/link'
import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { Icon } from '@/components/design/icons'
import { inScopeChapters } from '@/lib/curriculum'
import { questionBank } from '@/lib/questions'

const IN_SCOPE_QS = questionBank.filter(q =>
  ['ch1','ch2','ch3','ch4','ch6','ch7'].includes(q.chapter)
).length

const TOTAL_TOPICS = inScopeChapters.reduce((s, c) => s + c.topics.length, 0)
const TOTAL_FORMULAS = inScopeChapters.reduce((s, c) => s + c.key_formulas.length, 0)

const STATS = [
  { label: 'Chapters', value: String(inScopeChapters.length), sub: 'in-scope · BGCTUB syllabus' },
  { label: 'Topics',  value: String(TOTAL_TOPICS),       sub: 'with full notes + examples' },
  { label: 'Formulas', value: String(TOTAL_FORMULAS),     sub: 'KaTeX-rendered' },
  { label: 'Questions', value: String(IN_SCOPE_QS),       sub: 'verified, exam-style' },
]

const CONTRIBUTORS = [
  { initials: 'MH', name: 'Mahtamun Hoque Fahim', role: 'Curator · 45th Batch',
    note: 'CSE, BGCTUB. Built and maintains the knowledge base.' },
  { initials: 'TR', name: 'Tahsin Rahman',        role: 'Lab videos · 45th',
    note: 'Recorded experiments 01, 02 and 07.' },
  { initials: 'RA', name: 'Rifat Ahmed',          role: 'Lab videos · 45th',
    note: 'Recorded experiments 02 and 08.' },
  { initials: 'AN', name: 'Anika Nawar',          role: 'Lab videos · 45th',
    note: 'Recorded experiment 04.' },
]

const SECTION_TEASERS: Array<{
  href: string
  icon: 'book' | 'play' | 'flask' | 'paper' | 'chart' | 'spark'
  eyebrow: string
  title: string
  body: string
}> = [
  { href: '/syllabus', icon: 'book',  eyebrow: '01 · Course outline',
    title: 'Syllabus',  body: '6 in-scope chapters · 44 topics · ~24 hours of class material, week-by-week.' },
  { href: '/lectures', icon: 'play',  eyebrow: '02 · Recorded lectures',
    title: 'Lectures',  body: 'Watch the original BGCTUB lecture playlist alongside the syllabus.' },
  { href: '/labs',     icon: 'flask', eyebrow: '03 · Lab manuals',
    title: 'Labs',      body: 'Experiment guides, oscilloscope screenshots, and the 45th-batch lab recordings.' },
  { href: '/papers',   icon: 'paper', eyebrow: '04 · Past papers',
    title: 'Papers',    body: 'Midterm, finals and CTs from previous batches — typed out, not photographs.' },
  { href: '/books',    icon: 'book',  eyebrow: '05 · Textbooks',
    title: 'Books',     body: 'Sadiku, Boylestad, and the supplementary references the course uses.' },
  { href: '/cheat-sheet', icon: 'spark', eyebrow: '06 · Quick reference',
    title: 'Cheat sheet', body: 'Every formula, KaTeX-typeset, in one searchable page. Built for the exam hall.' },
]

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', paddingTop: 48, paddingBottom: 56 }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
              <span className="pill primary dot">CSE · 2nd Semester</span>
              <span className="pill">BGCTUB</span>
              <span className="pill">45th Batch</span>
              <span className="pill">Spring 2026</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 7.5vw, 80px)',
              lineHeight: 1,
              marginBottom: 22,
              letterSpacing: '-0.03em',
              maxWidth: 920,
            }}>
              Basic Electrical<br/>
              Engineering,{' '}
              <span style={{ color: 'var(--accent)' }}>
                organised.
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 2.2vw, 18px)',
              maxWidth: 660,
              marginBottom: 32,
              color: 'var(--ink-2)',
            }}>
              Lecture notes, lab manuals, past papers, animated simulators and exam-ready quizzes
              for the 2nd-semester BEE course at BGCTUB — curated by students of the 45th batch,
              for everyone who comes after. One place. No Google Drive maze.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 44 }}>
              <Link href="/syllabus" className="btn-primary">
                Start with the syllabus
                <Icon name="arrow" size={15} />
              </Link>
              <Link href="/learn" className="btn-ghost">
                Jump into a chapter
              </Link>
            </div>

            {/* Stats strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 12,
            }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{
                  padding: 18,
                  background: i === 0 ? 'var(--ink)' : 'var(--surface)',
                  color: i === 0 ? 'var(--bg)' : 'var(--ink)',
                  border: i === 0 ? '1px solid var(--ink)' : '1px solid var(--line)',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}>
                  <div className="mono" style={{
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: i === 0 ? 'color-mix(in oklab, var(--bg) 70%, transparent)' : 'var(--muted)',
                  }}>{s.label}</div>
                  <div style={{
                    fontFamily: 'var(--display)',
                    fontSize: 40, fontWeight: 600,
                    letterSpacing: '-0.03em', lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: i === 0 ? 'color-mix(in oklab, var(--bg) 60%, transparent)' : 'var(--muted)' }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section teasers ─────────────────────────────────────── */}
        <section style={{ paddingTop: 24, paddingBottom: 72 }}>
          <div className="container">
            <SectionHeader
              eyebrow="What's inside"
              title="Six pages, one BGCTUB BEE course"
              sub="Every section below is its own page. Pick where you are — notes, videos, lab manuals, past papers, books, or the formula cheat-sheet."
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}>
              {SECTION_TEASERS.map(t => (
                <Link key={t.href} href={t.href} style={{
                  display: 'block',
                  padding: 22,
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 18,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color .15s ease, transform .15s ease',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'color-mix(in oklab, var(--accent) 14%, transparent)',
                    color: 'var(--accent)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                    <Icon name={t.icon} size={18} />
                  </div>
                  <div className="mono" style={{
                    fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--muted)', marginBottom: 6,
                  }}>{t.eyebrow}</div>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, marginBottom: 8, letterSpacing: '-0.02em' }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                    {t.body}
                  </p>
                  <div style={{
                    marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 13, fontWeight: 500, color: 'var(--accent)',
                  }}>
                    Open <Icon name="arrow" size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About + Contributors + BGCTUB ─────────────────────── */}
        <section style={{
          paddingTop: 56, paddingBottom: 72,
          background: 'var(--surface)', borderTop: '1px solid var(--line)',
        }}>
          <div className="container">
            <SectionHeader
              eyebrow="About"
              title="A site built because we got tired of losing the Drive link"
            />

            {/* Story */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 18,
              maxWidth: 760,
              marginBottom: 44,
              fontSize: 16,
              lineHeight: 1.65,
              color: 'var(--ink-2)',
            }}>
              <p>
                learnBEE started as a complaint. Every semester at BGCTUB, the Basic Electrical
                Engineering course turned into a scavenger hunt — Google Drive folders shared three
                times over, lecture slides that lived only on one classmate&apos;s laptop, lab
                manuals that were photocopies of photocopies. The 45th batch of CSE decided to
                stop putting up with it.
              </p>
              <p>
                What began as one folder grew into a structured site. Lecture notes paired with the
                chapter they belong to. Past papers organised by exam type. An interactive simulator
                where you can watch a capacitor charge in real time. A formula cheat-sheet you can
                actually search during exam week. Forty thousand characters of original theory
                prose, sourced from Sadiku and Boylestad, all typeset with proper math typography
                instead of inline images.
              </p>
              <p>
                The site is and will stay free. The code is on GitHub. Content is curated by the
                45th batch, for the batches who come after. If you spot a mistake or a missing
                lecture, open an issue — the next semester will thank you.
              </p>
            </div>

            {/* Contributors */}
            <div style={{ marginBottom: 32 }}>
              <div className="mono" style={{
                fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--accent)', marginBottom: 16,
              }}>
                Contributors
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 12,
              }}>
                {CONTRIBUTORS.map(c => (
                  <div key={c.name} style={{
                    padding: 16,
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: 14,
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'var(--primary)', color: 'var(--on-mint)',
                      fontFamily: 'var(--display)', fontWeight: 700, fontSize: 14,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>{c.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.04em' }}>{c.role}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{c.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BGCTUB band — dy/dx dark panel */}
            <div style={{
              padding: 'clamp(24px,3.5vw,40px)',
              background: 'var(--bg-2)',
              border: '1px solid var(--line-2)',
              borderRadius: 20,
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 28,
            }} className="bgctub-grid">
              <div>
                <div className="eyebrow" style={{ letterSpacing: '0.16em', marginBottom: 12 }}>
                  About BGCTUB
                </div>
                <h3 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 'clamp(24px,3vw,32px)', color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.08 }}>
                  BGC Trust University Bangladesh
                </h3>
                <p style={{ color: 'var(--muted)', maxWidth: 540, fontSize: 14.5, lineHeight: 1.65 }}>
                  A private university in Chittagong. The Department of Computer Science &amp; Engineering
                  runs the BEE course in the 2nd semester — this site is a 45th-batch effort to keep the
                  resources in one place for the batches that come after.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                  ['Department', 'CSE'],
                  ['Course code', 'EEE 1201'],
                  ['Credit hrs', '3.0'],
                  ['Semester', '2nd / Sp'],
                ].map(([l, v]) => (
                  <div key={l} style={{
                    padding: 16, borderRadius: 12,
                    background: 'rgba(255,255,255,.02)',
                    border: '1px solid var(--line)',
                  }}>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {l}
                    </div>
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 26, color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: 6 }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stuck on a topic? Ask. */}
            <div className="card" style={{ marginTop: 16, padding: 'clamp(22px,3vw,30px)', background: 'var(--surface)' }}>
              <div className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 22, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'var(--mint-soft)', color: 'var(--accent)', border: '1px solid var(--mint-line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="chat" size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', marginBottom: 8 }}>Stuck on a topic? Ask.</h3>
                    <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, maxWidth: 520 }}>
                      We hang out on a Messenger group and a Discord server — both pinned in the README of the
                      GitHub repo. Solutions, doubts, the occasional meme.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href="https://github.com/mahtamun-hoque-fahim/learn-BEE" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: 'var(--ink)', color: 'var(--bg)', borderColor: 'var(--ink)' }}>
                    <Icon name="github" size={16} /> GitHub repo <Icon name="external" size={13} />
                  </a>
                  <a href="https://github.com/mahtamun-hoque-fahim/learn-BEE/discussions" target="_blank" rel="noopener noreferrer" className="btn-line">
                    <Icon name="chat" size={16} /> Join discussion
                  </a>
                </div>
              </div>
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
