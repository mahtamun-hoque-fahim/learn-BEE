'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Chapter } from '@/lib/curriculum'
import { getRandomQuestions, type Question } from '@/lib/questions'
import AnimatedSim from '@/components/simulator/animated/AnimatedSim'
import { Tex, RichMath } from '@/components/math/Tex'
import { Markdown } from '@/components/math/Markdown'
import { Nav } from '@/components/design/Nav'
import { Icon } from '@/components/design/icons'

interface Props {
  chapter: Chapter
  prev: Chapter | null
  next: Chapter | null
}

type Tab = 'theory' | 'simulator' | 'quiz'
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'theory', label: 'Theory', icon: 'book' },
  { id: 'simulator', label: 'Simulator', icon: 'spark' },
  { id: 'quiz', label: 'Quiz', icon: 'chart' },
]

export default function ChapterClient({ chapter, prev, next }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('theory')
  const [theoryDone, setTheoryDone] = useState(false)
  const [simDone, setSimDone] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)

  const done: Record<Tab, boolean> = { theory: theoryDone, simulator: simDone, quiz: quizDone }
  const allDone = theoryDone && simDone && quizDone
  const progressCount = [theoryDone, simDone, quizDone].filter(Boolean).length

  const goTab = (t: Tab) => { setActiveTab(t); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />

      {/* Chapter sub-bar: breadcrumb + step progress */}
      <div
        style={{
          position: 'sticky', top: 64, zIndex: 40,
          background: 'color-mix(in oklab, var(--bg) 82%, transparent)',
          backdropFilter: 'saturate(140%) blur(10px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 14, height: 52, maxWidth: 1180 }}>
          <div className="crumb">
            <Link href="/learn" style={{ color: 'var(--muted)' }}>Chapters</Link>
            <span style={{ color: 'var(--dim)' }}>/</span>
            <b>Ch {chapter.number}</b>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="progress-track" style={{ width: 120 }}>
              <div className="progress-fill" style={{ width: `${(progressCount / 3) * 100}%` }} />
            </div>
            <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent)' }}>{progressCount}</span>/3
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1180, padding: '40px 20px 100px' }}>
        {/* Header */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            <span className="eyebrow">Chapter {chapter.number}</span>
            {chapter.difficulty && (
              <span className={`pill ${chapter.difficulty === 'beginner' ? 'ok' : chapter.difficulty === 'intermediate' ? 'warn' : ''}`}>
                {chapter.difficulty}
              </span>
            )}
            {chapter.sadiku_pages && (
              <span className="mono" style={{ fontSize: 12, color: 'var(--dim)' }}>Sadiku pp. {chapter.sadiku_pages}</span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.02, letterSpacing: '-0.035em' }}>{chapter.title}</h1>
        </header>

        {/* Tabs (segmented) */}
        <div
          role="tablist"
          style={{
            display: 'inline-flex', gap: 4, padding: 4, marginBottom: 24,
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 999,
          }}
        >
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 18px', borderRadius: 999, fontSize: 14, fontWeight: 600,
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? 'var(--on-mint)' : 'var(--muted)',
                  transition: 'background-color .15s, color .15s',
                }}
              >
                <Icon name={tab.icon} size={15} />
                {tab.label}
                {done[tab.id] && <Icon name="check" size={13} />}
              </button>
            )
          })}
        </div>

        {/* Two-column: content + Connections rail */}
        <div className="ch-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, alignItems: 'start' }}>
          <div style={{ minWidth: 0 }}>
            {activeTab === 'theory' && (
              <TheoryTab chapter={chapter} goTab={goTab} onComplete={() => { setTheoryDone(true); setActiveTab('simulator') }} />
            )}
            {activeTab === 'simulator' && (
              <SimulatorTab chapter={chapter} goTab={goTab} onComplete={() => { setSimDone(true); setActiveTab('quiz') }} />
            )}
            {activeTab === 'quiz' && (
              <QuizTab chapter={chapter} onComplete={(score) => { setQuizDone(true); setQuizScore(score) }} />
            )}

            {/* Completion */}
            {allDone && (
              <div className="card animate-in" style={{ marginTop: 28, padding: 28, textAlign: 'center', background: 'var(--mint-soft)', borderColor: 'var(--mint-line)' }}>
                <div style={{ display: 'inline-grid', placeItems: 'center', width: 52, height: 52, borderRadius: 999, background: 'var(--accent)', color: 'var(--on-mint)', marginBottom: 14 }}>
                  <Icon name="check" size={26} />
                </div>
                <h3 style={{ fontSize: 22, color: 'var(--accent)', marginBottom: 6 }}>Chapter complete</h3>
                <p style={{ fontSize: 14, marginBottom: 18 }}>
                  Quiz score: <strong style={{ color: 'var(--ink)' }}>{quizScore}%</strong>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {prev && <Link href={`/learn/${prev.id}`} className="btn-ghost">Ch {prev.number}</Link>}
                  {next ? (
                    <Link href={`/learn/${next.id}`} className="btn-primary">Next: Ch {next.number} <Icon name="arrow" size={14} className="arr" /></Link>
                  ) : (
                    <Link href="/bonus" className="btn-primary">Unlock bonus exam <Icon name="arrow" size={14} className="arr" /></Link>
                  )}
                </div>
              </div>
            )}

            {/* Pager */}
            {!allDone && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)', gap: 20 }}>
                {prev ? (
                  <Link href={`/learn/${prev.id}`} style={{ color: 'var(--muted)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span>
                    Ch {prev.number}: {prev.title}
                  </Link>
                ) : <div />}
                {next && (
                  <Link href={`/learn/${next.id}`} style={{ color: 'var(--muted)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, textAlign: 'right' }}>
                    Ch {next.number}: {next.title}<Icon name="arrow" size={14} />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Connections rail — cross-links between surfaces */}
          <aside className="ch-rail" style={{ display: 'none', position: 'sticky', top: 128, alignSelf: 'start' }}>
            <ConnectionsRail chapter={chapter} goTab={goTab} active={activeTab} done={done} />
          </aside>
        </div>
      </div>

      <style>{`
        @media (min-width: 1040px) {
          .ch-grid { grid-template-columns: 1fr 280px !important; }
          .ch-rail { display: block !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Connections rail: the cross-link hub ───────────────────────────── */
function ConnectionsRail({ chapter, goTab, active, done }: { chapter: Chapter; goTab: (t: Tab) => void; active: Tab; done: Record<Tab, boolean> }) {
  const links: { tab?: Tab; href?: string; icon: string; label: string; sub: string }[] = [
    { tab: 'theory', icon: 'book', label: 'Theory & diagrams', sub: `${chapter.topics.length} topics` },
    { tab: 'simulator', icon: 'spark', label: 'Simulator', sub: `${(chapter.simulator_demos ?? []).length || 1} interactive demo` },
    { tab: 'quiz', icon: 'chart', label: 'Exam quiz', sub: '10 chapter questions' },
    { href: `/cheat-sheet#${chapter.id}`, icon: 'paper', label: 'Cheat sheet', sub: `${chapter.key_formulas.length} formulas` },
  ]
  return (
    <div className="card-quiet" style={{ padding: 18 }}>
      <div className="tiny" style={{ marginBottom: 14 }}>Connections</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {links.map((l, i) => {
          const isActive = l.tab && l.tab === active
          const isDone = l.tab && done[l.tab]
          const inner = (
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
              <span style={{
                display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: isActive ? 'var(--accent)' : 'var(--mint-soft)',
                color: isActive ? 'var(--on-mint)' : 'var(--accent)',
                border: '1px solid var(--mint-line)',
              }}>
                <Icon name={l.icon} size={16} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>
                  {l.label}{isDone && <Icon name="check" size={12} className="" />}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{l.sub}</span>
              </span>
              {l.href && <Icon name="external" size={13} />}
            </span>
          )
          const baseStyle: React.CSSProperties = {
            display: 'block', padding: 10, borderRadius: 10, textAlign: 'left', width: '100%',
            border: '1px solid', borderColor: isActive ? 'var(--mint-line)' : 'transparent',
            background: isActive ? 'var(--mint-soft)' : 'transparent', transition: 'background-color .15s',
          }
          return l.href ? (
            <Link key={i} href={l.href} style={baseStyle}>{inner}</Link>
          ) : (
            <button key={i} onClick={() => goTab(l.tab!)} style={baseStyle}>{inner}</button>
          )
        })}
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--dim)', marginTop: 14, lineHeight: 1.5 }}>
        Each diagram, formula and graph here is wired to its simulator slice, exam questions and cheat-sheet row.
      </p>
    </div>
  )
}

/* ── Theory ─────────────────────────────────────────────────────────── */
function TheoryTab({ chapter, goTab, onComplete }: { chapter: Chapter; goTab: (t: Tab) => void; onComplete: () => void }) {
  const [readTopics, setReadTopics] = useState<Set<number>>(new Set())
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggleExpanded = (idx: number) => setExpanded(p => { const n = new Set(p); n.has(idx) ? n.delete(idx) : n.add(idx); return n })
  const toggleTopic = (idx: number) => setReadTopics(p => { const n = new Set(p); n.has(idx) ? n.delete(idx) : n.add(idx); return n })
  const allRead = readTopics.size >= chapter.topics.length

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* Topics */}
      <section className="card" style={{ padding: 24 }}>
        <h3 className="tiny" style={{ marginBottom: 16 }}>Topics covered</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {chapter.topics.map((topic, idx) => {
            const isString = typeof topic === 'string'
            const t = isString ? null : (topic as { title: string; body?: string; examples?: Array<{ q: string; steps: string[]; answer: string }>; pitfalls?: string[] })
            const title = isString ? (topic as string) : t!.title
            const hasBody = !isString && (t!.body || (t!.examples?.length ?? 0) > 0 || (t!.pitfalls?.length ?? 0) > 0)
            const isRead = readTopics.has(idx)
            const isExpanded = expanded.has(idx)
            return (
              <div key={idx} className="card-quiet" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
                  <button
                    onClick={() => toggleTopic(idx)}
                    aria-label={`Mark ${title} as read`}
                    style={{
                      width: 20, height: 20, flexShrink: 0, borderRadius: 6, display: 'grid', placeItems: 'center',
                      border: '1px solid', borderColor: isRead ? 'var(--accent)' : 'var(--line-2)',
                      background: isRead ? 'var(--accent)' : 'transparent', color: 'var(--on-mint)',
                    }}
                  >
                    {isRead && <Icon name="check" size={13} />}
                  </button>
                  <button
                    onClick={() => hasBody && toggleExpanded(idx)}
                    disabled={!hasBody}
                    style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, cursor: hasBody ? 'pointer' : 'default' }}
                  >
                    <span style={{ fontSize: 14.5, color: isRead ? 'var(--dim)' : 'var(--ink)', textDecoration: isRead ? 'line-through' : 'none' }}>{title}</span>
                    {hasBody && (
                      <span style={{ marginLeft: 'auto', color: 'var(--muted)', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .2s', display: 'inline-flex' }}>
                        <Icon name="chevron" size={15} />
                      </span>
                    )}
                  </button>
                </div>

                {hasBody && isExpanded && (
                  <div style={{ padding: '4px 16px 16px', borderTop: '1px solid var(--line)' }}>
                    {t!.body && <div style={{ paddingTop: 12 }}><Markdown source={t!.body} /></div>}

                    {(t!.examples?.length ?? 0) > 0 && (
                      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                        <div className="eyebrow">Solved examples</div>
                        {t!.examples!.map((ex, ei) => (
                          <div key={ei} className="card-quiet" style={{ padding: 14, fontSize: 14 }}>
                            <div style={{ color: 'var(--ink)', marginBottom: 8, fontWeight: 500 }}><RichMath>{ex.q}</RichMath></div>
                            <ol className="steps" style={{ margin: '0 0 8px' }}>
                              {ex.steps.map((s, si) => (
                                <li key={si}><div className="step-d" style={{ color: 'var(--ink-2)' }}><RichMath>{s}</RichMath></div></li>
                              ))}
                            </ol>
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 14 }}>
                              <span className="tiny" style={{ marginRight: 8 }}>Answer</span><RichMath>{ex.answer}</RichMath>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(t!.pitfalls?.length ?? 0) > 0 && (
                      <div className="callout warn" style={{ marginTop: 16 }}>
                        <div className="callout-h"><span className="pip" />Common pitfalls</div>
                        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                          {t!.pitfalls!.map((p, pi) => (
                            <li key={pi} style={{ color: 'var(--ink-2)', fontSize: 14 }}><RichMath>{p}</RichMath></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="progress-track" style={{ marginTop: 16 }}>
          <div className="progress-fill" style={{ width: `${(readTopics.size / chapter.topics.length) * 100}%` }} />
        </div>
      </section>

      {/* Key formulas — each cross-linked */}
      <section className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 20 }}>Key formulas</h3>
          <Link href={`/cheat-sheet#${chapter.id}`} className="mono" style={{ fontSize: 12, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Open in cheat sheet <Icon name="external" size={12} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {chapter.key_formulas.map((f, idx) => (
            <div key={idx} className="formula-card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="tiny" style={{ color: 'var(--accent)' }}>{f.name}</div>
              <div style={{ color: 'var(--ink)', overflowX: 'auto' }} title={f.formula_ascii ?? f.formula}><Tex block>{f.formula}</Tex></div>
              {f.note && <div style={{ color: 'var(--muted)', fontSize: 12, fontStyle: 'italic' }}>{f.note}</div>}
              <div className="mono" style={{ color: 'var(--dim)', fontSize: 11 }}>[{f.unit}]</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                <button onClick={() => goTab('simulator')} className="pill" style={{ cursor: 'pointer' }}><Icon name="spark" size={11} /> Simulate</button>
                <button onClick={() => goTab('quiz')} className="pill" style={{ cursor: 'pointer' }}><Icon name="chart" size={11} /> Practice</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study references */}
      <section className="card" style={{ padding: 24 }}>
        <h3 className="tiny" style={{ marginBottom: 14 }}>Study references</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {chapter.sadiku_pages && <RefCard icon="book" title="Sadiku, 5th ed." sub={`Pages ${chapter.sadiku_pages}`} />}
          {chapter.boylestad_chapters && <RefCard icon="book" title="Boylestad" sub={`Chapter(s) ${chapter.boylestad_chapters}`} />}
          <RefCard icon="play" title="Tikle's Academy" sub="Watch playlist" href="https://www.youtube.com/playlist?list=PLDN15nk5uLiCSOqr7-rUz6-GtdTAjlvul" />
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onComplete} disabled={!allRead} className="btn-primary" style={{ opacity: allRead ? 1 : 0.45, cursor: allRead ? 'pointer' : 'not-allowed' }}>
          {allRead ? <>Theory complete — try simulator <Icon name="arrow" size={14} className="arr" /></> : `Read all ${chapter.topics.length - readTopics.size} remaining topics`}
        </button>
      </div>
    </div>
  )
}

function RefCard({ icon, title, sub, href }: { icon: string; title: string; sub: string; href?: string }) {
  const body = (
    <div className="card-quiet" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14 }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, background: 'var(--mint-soft)', color: 'var(--accent)', border: '1px solid var(--mint-line)', flexShrink: 0 }}>
        <Icon name={icon} size={17} />
      </span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ color: 'var(--muted)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {sub}{href && <Icon name="external" size={11} />}
        </div>
      </div>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{body}</a> : body
}

/* ── Simulator ──────────────────────────────────────────────────────── */
function SimulatorTab({ chapter, goTab, onComplete }: { chapter: Chapter; goTab: (t: Tab) => void; onComplete: () => void }) {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <section className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>Interactive demos</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 14 }}>Drag sliders and watch the diagram and graphs respond in real time.</p>
        <ul style={{ display: 'grid', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
          {(chapter.simulator_demos ?? []).map((demo, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--ink-2)' }}>
              <span style={{ color: 'var(--accent)', marginTop: 2, display: 'inline-flex' }}><Icon name="spark" size={14} /></span>{demo}
            </li>
          ))}
        </ul>
      </section>

      <div className="card" style={{ padding: 8 }}>
        <AnimatedSim chapterId={chapter.id} />
      </div>

      {/* cross-links out of the simulator */}
      <div className="card-quiet" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="tiny">See also</span>
        <Link href={`/cheat-sheet#${chapter.id}`} className="pill"><Icon name="paper" size={11} /> Formulas used</Link>
        <button onClick={() => goTab('quiz')} className="pill" style={{ cursor: 'pointer' }}><Icon name="chart" size={11} /> Questions on this</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onComplete} className="btn-primary">Done with simulator — take quiz <Icon name="arrow" size={14} className="arr" /></button>
      </div>
    </div>
  )
}

/* ── Quiz ───────────────────────────────────────────────────────────── */
function QuizTab({ chapter, onComplete }: { chapter: Chapter; onComplete: (score: number) => void }) {
  const [questions] = useState<Question[]>(() => getRandomQuestions(chapter.id, 10))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Quiz questions for this chapter are being prepared.</p>
        <button onClick={() => onComplete(100)} className="btn-primary" style={{ marginTop: 16 }}>Continue <Icon name="arrow" size={14} className="arr" /></button>
      </div>
    )
  }

  const q = questions[current]
  const totalQ = questions.length
  const isAnswered = answers[current] !== undefined
  const selectedAnswer = answers[current]

  const getScore = () => {
    let correct = 0
    questions.forEach((q, idx) => { if (answers[idx] === String(q.answer)) correct++ })
    return Math.round((correct / totalQ) * 100)
  }
  const handleSelect = (option: string) => { if (submitted) return; setAnswers(p => ({ ...p, [current]: option })); setShowExplanation(false) }
  const handleNext = () => { setShowExplanation(false); current < totalQ - 1 ? setCurrent(c => c + 1) : setSubmitted(true) }

  if (submitted) {
    const score = getScore()
    const passed = score >= 70
    return (
      <div className="qcard" style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-grid', placeItems: 'center', width: 56, height: 56, borderRadius: 999, marginBottom: 14, background: passed ? 'var(--accent)' : 'var(--amber-soft)', color: passed ? 'var(--on-mint)' : 'var(--amber)' }}>
          <Icon name={passed ? 'check' : 'book'} size={26} />
        </div>
        <h3 style={{ fontSize: 24, marginBottom: 6 }}>{passed ? 'Chapter quiz passed' : 'Keep practicing'}</h3>
        <div className="mono" style={{ fontSize: 48, fontWeight: 700, margin: '8px 0', color: passed ? 'var(--accent)' : 'var(--amber)' }}>{score}%</div>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: passed ? 24 : 8 }}>
          {questions.filter((q, idx) => String(q.answer) === answers[idx]).length} / {totalQ} correct
        </p>
        {!passed && <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Need 70% to pass. Review the theory and try again.</p>}

        <div style={{ textAlign: 'left', display: 'grid', gap: 10, marginBottom: 24, maxHeight: 320, overflowY: 'auto' }}>
          {questions.map((q, idx) => {
            const correct = String(q.answer) === answers[idx]
            return (
              <div key={idx} style={{ padding: 12, borderRadius: 10, fontSize: 14, border: '1px solid', borderColor: correct ? 'var(--mint-line)' : 'color-mix(in oklab, var(--rose) 40%, transparent)', background: correct ? 'var(--mint-soft)' : 'color-mix(in oklab, var(--rose) 9%, transparent)' }}>
                <div style={{ color: 'var(--ink-2)', marginBottom: 4, fontWeight: 500 }}>{idx + 1}. <RichMath>{q.question}</RichMath></div>
                <div style={{ color: correct ? 'var(--accent)' : 'var(--rose)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Your answer: <RichMath>{answers[idx] || 'Not answered'}</RichMath><Icon name={correct ? 'check' : 'close'} size={13} />
                </div>
                {!correct && <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Correct: <RichMath>{String(q.answer)}</RichMath></div>}
                <div style={{ color: 'var(--dim)', fontSize: 12, marginTop: 4 }}><RichMath>{q.explanation}</RichMath></div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {!passed && <button onClick={() => { setSubmitted(false); setCurrent(0); setAnswers({}); setShowExplanation(false) }} className="btn-ghost"><Icon name="reset" size={14} /> Retry quiz</button>}
          {passed && <button onClick={() => onComplete(score)} className="btn-primary">Complete chapter <Icon name="check" size={14} /></button>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)' }}>
        <span className="mono">Question {current + 1} of {totalQ}</span>
        <span className={`pill ${q.difficulty === 'easy' ? 'ok' : q.difficulty === 'medium' ? 'warn' : ''}`}>{q.difficulty}</span>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${((current + 1) / totalQ) * 100}%` }} /></div>

      <div className="qcard" style={{ padding: 28 }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 12 }}>{q.topic} · {q.source}</div>
        <p style={{ color: 'var(--ink)', fontSize: 17, marginBottom: 20, lineHeight: 1.5 }}><RichMath>{q.question}</RichMath></p>

        {q.type === 'mcq' && q.options && (
          <div style={{ display: 'grid', gap: 10 }}>
            {q.options.map(opt => {
              let cls = 'qopt'
              if (isAnswered) { if (opt === String(q.answer)) cls += ' correct'; else if (opt === selectedAnswer) cls += ' wrong' }
              else if (opt === selectedAnswer) cls += ' sel'
              return <button key={opt} className={cls} onClick={() => handleSelect(opt)}><RichMath>{opt}</RichMath></button>
            })}
          </div>
        )}

        {q.type === 'true_false' && (
          <div style={{ display: 'flex', gap: 12 }}>
            {['true', 'false'].map(opt => {
              let cls = 'qopt'
              if (isAnswered) { if (opt === String(q.answer)) cls += ' correct'; else if (opt === selectedAnswer) cls += ' wrong' }
              else if (opt === selectedAnswer) cls += ' sel'
              return <button key={opt} className={cls} style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleSelect(opt)}>{opt === 'true' ? 'True' : 'False'}</button>
            })}
          </div>
        )}

        {(q.type === 'numerical' || q.type === 'fill_blank') && (
          <div style={{ display: 'grid', gap: 12 }}>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Work it out, then reveal the answer.</p>
            {!isAnswered ? (
              <button onClick={() => handleSelect(String(q.answer))} className="btn-ghost" style={{ alignSelf: 'flex-start' }}>Reveal answer</button>
            ) : (
              <div className="formula-card"><div className="tiny" style={{ color: 'var(--accent)', marginBottom: 4 }}>Answer</div><div style={{ color: 'var(--ink)' }}><RichMath>{String(q.answer)}</RichMath></div></div>
            )}
          </div>
        )}

        {isAnswered && (
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setShowExplanation(s => !s)} className="mono" style={{ fontSize: 12, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ transform: showExplanation ? 'rotate(90deg)' : 'none', display: 'inline-flex', transition: 'transform .2s' }}><Icon name="chevron" size={12} /></span>
              {showExplanation ? 'Hide' : 'Show'} explanation
            </button>
            {showExplanation && <div style={{ marginTop: 8, padding: 12, background: 'var(--bg-2)', borderRadius: 10, fontSize: 14, color: 'var(--ink-2)', border: '1px solid var(--line)' }}><RichMath>{q.explanation}</RichMath></div>}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => { if (current > 0) { setCurrent(c => c - 1); setShowExplanation(false) } }} disabled={current === 0} className="btn-ghost" style={{ opacity: current === 0 ? 0.4 : 1 }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span> Previous
        </button>
        <button onClick={handleNext} disabled={!isAnswered} className="btn-primary" style={{ opacity: isAnswered ? 1 : 0.45, cursor: isAnswered ? 'pointer' : 'not-allowed' }}>
          {current === totalQ - 1 ? 'Submit quiz' : <>Next <Icon name="arrow" size={14} className="arr" /></>}
        </button>
      </div>
    </div>
  )
}
