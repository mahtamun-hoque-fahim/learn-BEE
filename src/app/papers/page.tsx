import Link from 'next/link'
import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { Icon } from '@/components/design/icons'
import { getPapers } from '@/lib/content-public'
import { PAPERS as SEED_PAPERS, type Paper } from '@/lib/landing-data'

export const metadata = { title: 'Past papers — learnBEE' }

const TYPE_ORDER: Paper['type'][] = ['Midterm', 'Final', 'CT', 'Quiz']

const TYPE_BLURB: Record<Paper['type'], string> = {
  Midterm: 'Mid-semester exams (20 marks each). Cover Ch1–Ch3 — beginning through supernode analysis.',
  Final:   'Final exams (50 marks each). Cover Ch4, Ch6, Ch7 — supernode onward.',
  CT:      'Class tests (10 marks each). CT-1 follows the midterm syllabus, CT-2 follows the final syllabus.',
  Quiz:    'Compiled quizzes from past lecture sessions. Useful for warm-ups.',
}

export const dynamic = 'force-dynamic'

export default async function PapersPage() {
  const PAPERS = await getPapers()
  const isSeed = PAPERS === SEED_PAPERS
  const groups = TYPE_ORDER.map(type => ({
    type,
    items: PAPERS.filter(p => p.type === type),
  })).filter(g => g.items.length > 0)

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <SectionHeader
              eyebrow={`Past papers · ${PAPERS.length} entries`}
              title="Past exams, CTs, and quizzes"
              sub="Real BGCTUB BEE papers from previous batches, organised by exam type. The most valuable hour you can spend before any exam."
              action={
                <Link
                  href="/bonus"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '9px 14px',
                    background: 'var(--accent)', color: '#0A0A0A',
                    borderRadius: 999, fontWeight: 600, fontSize: 13,
                  }}
                >
                  <Icon name="chart" size={13} /> Try generated exam
                </Link>
              }
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <span className="pill">{PAPERS.filter(p => p.type === 'Midterm').length} midterms</span>
              <span className="pill">{PAPERS.filter(p => p.type === 'Final').length} finals</span>
              <span className="pill">{PAPERS.filter(p => p.type === 'CT').length} CTs</span>
              <span className="pill">{PAPERS.filter(p => p.type === 'Quiz').length} quiz banks</span>
              {isSeed && <span className="pill warn">Sample data — admin can add real PDFs</span>}
            </div>

            <div style={{ display: 'grid', gap: 28 }}>
              {groups.map(g => (
                <section key={g.type}>
                  <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, letterSpacing: '-0.02em' }}>{g.type}</h3>
                      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, maxWidth: 580 }}>
                        {TYPE_BLURB[g.type]}
                      </p>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {g.items.length} {g.items.length === 1 ? 'paper' : 'papers'}
                    </span>
                  </header>

                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 14, overflow: 'hidden',
                  }}>
                    {g.items.map((p, i) => (
                      <article
                        key={p.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr auto auto',
                          alignItems: 'center', gap: 14,
                          padding: '14px 16px',
                          borderBottom: i === g.items.length - 1 ? 'none' : '1px solid var(--line)',
                        }}
                      >
                        <div style={{
                          width: 36, height: 44, borderRadius: 6,
                          background: 'var(--bg)', border: '1px solid var(--line)',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--muted)',
                        }}>
                          <Icon name="paper" size={16} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{p.title}</div>
                          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                            {p.session} · {p.pages} pages · {p.qCount} questions
                          </div>
                        </div>
                        <a
                          href="#"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '7px 12px',
                            background: 'var(--bg)', border: '1px solid var(--line)',
                            borderRadius: 999, fontSize: 12, color: 'var(--ink-2)',
                          }}
                        >
                          <Icon name="download" size={12} /> Download
                        </a>
                        <a
                          href="#"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '7px 12px',
                            background: 'var(--bg)', border: '1px solid var(--line)',
                            borderRadius: 999, fontSize: 12, color: 'var(--ink-2)',
                          }}
                        >
                          <Icon name="external" size={12} /> View
                        </a>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
