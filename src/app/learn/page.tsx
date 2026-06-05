import Link from 'next/link'
import type { Metadata } from 'next'
import { curriculum, IN_SCOPE_IDS, TOTAL_CHAPTERS } from '@/lib/curriculum'
import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { Icon } from '@/components/design/icons'

export const metadata: Metadata = {
  title: 'All chapters — Basic Electrical Engineering',
  description: 'Browse all 6 in-scope BGCTUB Basic Electrical Engineering chapters: basic concepts, laws, methods of analysis, circuit theorems, capacitors and first-order circuits. Notes, simulators and quizzes.',
  alternates: { canonical: '/learn' },
}

const diffPill = (d?: string) => `pill ${d === 'beginner' ? 'ok' : d === 'intermediate' ? 'warn' : ''}`

const ACTIONS = [
  { href: '/search', icon: 'search', label: 'Search the syllabus' },
  { href: '/cheat-sheet', icon: 'paper', label: 'Cheat sheet — all formulas' },
  { href: '/bonus', icon: 'spark', label: 'Exam prep (Midterm / Final / CT)' },
] as const

export default function LearnPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 1040, paddingTop: 48, paddingBottom: 96 }}>
        {/* Hero */}
        <header style={{ marginBottom: 32 }}>
          <div className="eyebrow">Course overview</div>
          <h1 style={{ fontSize: 'clamp(34px,5vw,52px)', fontWeight: 800, letterSpacing: '-0.035em', margin: '14px 0 12px' }}>
            Basic Electrical Engineering
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15.5, lineHeight: 1.6, maxWidth: 680 }}>
            {TOTAL_CHAPTERS} chapters · BGCTUB 2nd-semester syllabus (EEE 1201) · aligned with Sadiku and Boylestad.
          </p>
        </header>

        {/* Progress */}
        <div className="card" style={{ padding: 22, marginBottom: 28, background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>Your progress</span>
            <span className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>0 / {TOTAL_CHAPTERS} chapters</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: '0%' }} /></div>
          <p style={{ color: 'var(--dim)', fontSize: 12.5, marginTop: 10 }}>
            <Link href="/sign-in" style={{ color: 'var(--muted)' }}>Sign in</Link> to track your progress across chapters.
          </p>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
          {ACTIONS.map(a => (
            <Link key={a.href} href={a.href} className="btn-line btn-sm">
              <Icon name={a.icon} size={14} /> {a.label}
            </Link>
          ))}
        </div>

        {/* Parts + chapters */}
        {(curriculum.parts ?? []).map(part => {
          const visibleChapterIds = part.chapters.filter(id => IN_SCOPE_IDS.has(id))
          if (visibleChapterIds.length === 0) return null
          return (
            <section key={part.id} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ height: 1, flex: 1, background: 'var(--line)' }} />
                <span className="chapter-pill">{part.title}</span>
                <div style={{ height: 1, flex: 1, background: 'var(--line)' }} />
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {visibleChapterIds.map(chId => {
                  const ch = curriculum.chapters.find(c => c.id === chId)!
                  const titles = (ch.topics as Array<string | { title: string }>).map(t => typeof t === 'string' ? t : t.title)
                  const preview = titles.slice(0, 3).join(' · ') + (titles.length > 3 ? ` +${titles.length - 3} more` : '')
                  return (
                    <Link key={chId} href={`/learn/${chId}`} className="chapter-card">
                      <div className="chapter-num mono">{ch.number}</div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 16 }}>{ch.title}</span>
                          <span className={diffPill(ch.difficulty)}>{ch.difficulty}</span>
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {preview}
                        </div>
                      </div>

                      <div className="chapter-steps">
                        {['Theory', 'Sim', 'Quiz'].map(s => <span key={s} className="step-chip mono">{s}</span>)}
                      </div>
                      {ch.sadiku_pages && <div className="mono chapter-pp">p. {ch.sadiku_pages}</div>}
                      <span className="chapter-arrow"><Icon name="arrow" size={18} /></span>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* Bonus / certificate */}
        <div style={{ marginTop: 8, border: '1px dashed var(--line-2)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <div style={{ display: 'inline-grid', placeItems: 'center', width: 52, height: 52, borderRadius: 14, background: 'var(--mint-soft)', color: 'var(--accent)', border: '1px solid var(--mint-line)', marginBottom: 14 }}>
            <Icon name="spark" size={26} />
          </div>
          <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Bonus exam + certificate</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16, maxWidth: 460, margin: '0 auto 16px' }}>
            Sit a timed BGCTUB-style mock (Midterm / Final / CT) drawn from every chapter, then claim your certificate of completion.
          </p>
          <Link href="/bonus" className="btn-primary btn-sm"><Icon name="spark" size={14} /> Go to exam prep</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
