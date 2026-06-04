'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { type Chapter } from '@/lib/curriculum'
import { getRandomQuestions, type Question } from '@/lib/questions'
import AnimatedSim from '@/components/simulator/animated/AnimatedSim'
import { Tex, RichMath } from '@/components/math/Tex'
import { Markdown } from '@/components/math/Markdown'
import { Nav } from '@/components/design/Nav'
import { Icon } from '@/components/design/icons'

interface Props { chapter: Chapter; prev: Chapter | null; next: Chapter | null }
type TopicObj = { title: string; body?: string; examples?: Array<{ q: string; steps: string[]; answer: string }>; pitfalls?: string[] }

const QUIZ_N = 10

export default function ChapterClient({ chapter, prev, next }: Props) {
  const topics = chapter.topics
  const sections = useMemo(() => {
    const list = topics.map((t, i) => ({ id: `t${i}`, label: typeof t === 'string' ? (t as string) : (t as TopicObj).title }))
    list.push({ id: 'formulas', label: 'Key formulas' })
    list.push({ id: 'simulator', label: 'Simulator' })
    list.push({ id: 'quiz', label: 'Quiz' })
    return list
  }, [topics])

  const [active, setActive] = useState(sections[0]?.id ?? 't0')
  const [read, setRead] = useState<Set<number>>(new Set())
  const articleRef = useRef<HTMLDivElement>(null)

  const toggleRead = (i: number) => setRead(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n })
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Scrollspy
  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: 0 },
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [sections])

  const lead = `Everything for ${chapter.title} in one place — ${topics.length} topics, ${chapter.key_formulas.length} key formulas, a live simulator and a ${QUIZ_N}-question quiz.`

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <div className="container">
        <div className="reader">
          {/* TOC */}
          <aside className="toc">
            <div className="toc-l">On this page</div>
            <ol>
              {sections.map(s => (
                <li key={s.id} className={active === s.id ? 'active' : ''} onClick={() => jump(s.id)}>{s.label}</li>
              ))}
            </ol>
          </aside>

          {/* Article */}
          <article className="article" ref={articleRef}>
            <div className="crumb">
              <Link href="/learn" style={{ color: 'var(--muted)' }}>Chapters</Link>
              <span style={{ color: 'var(--dim)' }}>/</span>
              <b>Ch {chapter.number}</b>
              {chapter.difficulty && <span style={{ color: 'var(--dim)' }}>· {chapter.difficulty}</span>}
            </div>

            <h1>{chapter.title}</h1>
            <p className="lead">{lead}</p>

            {/* Topics */}
            {topics.map((topic, i) => {
              const isStr = typeof topic === 'string'
              const t = isStr ? null : (topic as TopicObj)
              const title = isStr ? (topic as string) : t!.title
              const isRead = read.has(i)
              return (
                <section id={`t${i}`} key={i}>
                  <h2><span className="h2num">{String(i + 1).padStart(2, '0')}</span>{title}</h2>
                  {t?.body && <Markdown source={t.body} />}

                  {(t?.examples?.length ?? 0) > 0 && (
                    <>
                      <div className="eyebrow" style={{ marginTop: 18 }}>Solved examples</div>
                      {t!.examples!.map((ex, ei) => (
                        <div key={ei} className="card-quiet" style={{ padding: 16, margin: '12px 0' }}>
                          <div style={{ color: 'var(--ink)', marginBottom: 8, fontWeight: 500 }}><RichMath>{ex.q}</RichMath></div>
                          <ol className="steps" style={{ margin: 0 }}>
                            {ex.steps.map((s, si) => <li key={si}><div className="step-d"><RichMath>{s}</RichMath></div></li>)}
                          </ol>
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)', color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 14 }}>
                            <span className="tiny" style={{ marginRight: 8 }}>Answer</span><RichMath>{ex.answer}</RichMath>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {(t?.pitfalls?.length ?? 0) > 0 && (
                    <div className="callout warn">
                      <div className="callout-h"><span className="pip" />Common pitfalls</div>
                      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                        {t!.pitfalls!.map((p, pi) => <li key={pi}><RichMath>{p}</RichMath></li>)}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => toggleRead(i)}
                    className="pill"
                    style={{ marginTop: 14, cursor: 'pointer', borderColor: isRead ? 'var(--mint-line)' : 'var(--line-2)', color: isRead ? 'var(--accent)' : 'var(--muted)', background: isRead ? 'var(--mint-soft)' : 'transparent' }}
                  >
                    <Icon name="check" size={12} /> {isRead ? 'Read' : 'Mark as read'}
                  </button>
                </section>
              )
            })}

            {/* Key formulas */}
            <section id="formulas">
              <h2><span className="h2num">{'\u00A7'}</span>Key formulas</h2>
              {chapter.key_formulas.map((f, i) => (
                <div className="eqn" key={i} title={f.formula_ascii ?? f.formula}>
                  <span style={{ minWidth: 0 }}><Tex block>{f.formula}</Tex></span>
                  <span className="eqn-tag">{f.name}{f.unit ? ` · ${f.unit}` : ''}</span>
                </div>
              ))}
              <Link href={`/cheat-sheet#${chapter.id}`} className="mono" style={{ fontSize: 12, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                Open in cheat sheet <Icon name="external" size={12} />
              </Link>
            </section>

            {/* Simulator */}
            <section id="simulator">
              <h2><span className="h2num" style={{ display: 'inline-flex', alignItems: 'center' }}><Icon name="spark" size={12} /></span>Simulator</h2>
              {(chapter.simulator_demos?.length ?? 0) > 0 && (
                <ul style={{ display: 'grid', gap: 6, margin: '0 0 16px', padding: 0, listStyle: 'none' }}>
                  {chapter.simulator_demos!.map((d, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--accent)', marginTop: 2, display: 'inline-flex' }}><Icon name="spark" size={14} /></span>{d}
                    </li>
                  ))}
                </ul>
              )}
              <div className="card" style={{ padding: 8 }}><AnimatedSim chapterId={chapter.id} /></div>
            </section>

            {/* Quiz */}
            <section id="quiz">
              <h2><span className="h2num">Q</span>Chapter quiz</h2>
              <QuizSection chapter={chapter} next={next} />
            </section>

            {/* Pager */}
            <div className="pager">
              {prev ? (
                <Link className="prev" href={`/learn/${prev.id}`}>
                  <div className="pg-tag">Previous</div>
                  <div className="pg-t">Ch {prev.number}: {prev.title}</div>
                </Link>
              ) : <div />}
              {next ? (
                <Link className="next" href={`/learn/${next.id}`}>
                  <div className="pg-tag">Next</div>
                  <div className="pg-t">Ch {next.number}: {next.title}</div>
                </Link>
              ) : (
                <Link className="next" href="/bonus">
                  <div className="pg-tag">Next</div>
                  <div className="pg-t">Bonus exam</div>
                </Link>
              )}
            </div>
          </article>

          {/* Rail */}
          <aside className="rail">
            <div className="rail-card">
              <div className="tiny" style={{ marginBottom: 10 }}>Progress</div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${topics.length ? (read.size / topics.length) * 100 : 0}%` }} /></div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                <span style={{ color: 'var(--accent)' }}>{read.size}</span>/{topics.length} topics read
              </div>
            </div>

            <div className="rail-card">
              <div className="tiny" style={{ marginBottom: 8 }}>This chapter</div>
              <div className="rail-stat"><span>Topics</span><b>{topics.length}</b></div>
              <div className="rail-stat"><span>Formulas</span><b>{chapter.key_formulas.length}</b></div>
              <div className="rail-stat"><span>Quiz</span><b>{QUIZ_N} Q</b></div>
              {chapter.sadiku_pages && <div className="rail-stat"><span>Sadiku</span><b>pp. {chapter.sadiku_pages}</b></div>}
            </div>

            <div className="rail-card">
              <div className="tiny" style={{ marginBottom: 10 }}>Connections</div>
              <div style={{ display: 'grid', gap: 4 }}>
                <button className={`rail-link ${active === 'simulator' ? 'active' : ''}`} onClick={() => jump('simulator')}><Icon name="spark" size={15} /> Simulator</button>
                <button className={`rail-link ${active === 'quiz' ? 'active' : ''}`} onClick={() => jump('quiz')}><Icon name="chart" size={15} /> Quiz</button>
                <Link className="rail-link" href={`/cheat-sheet#${chapter.id}`}><Icon name="paper" size={15} /> Cheat sheet</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ── Quiz section (qcard) ───────────────────────────────────────────── */
function QuizSection({ chapter, next }: { chapter: Chapter; next: Chapter | null }) {
  const [questions] = useState<Question[]>(() => getRandomQuestions(chapter.id, QUIZ_N))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showExp, setShowExp] = useState(false)

  if (questions.length === 0) {
    return <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>Quiz questions for this chapter are being prepared.</div>
  }

  const q = questions[current]
  const total = questions.length
  const isAnswered = answers[current] !== undefined
  const selected = answers[current]
  const score = () => Math.round((questions.filter((q, i) => answers[i] === String(q.answer)).length / total) * 100)
  const pick = (o: string) => { if (!submitted) { setAnswers(p => ({ ...p, [current]: o })); setShowExp(false) } }
  const nextQ = () => { setShowExp(false); current < total - 1 ? setCurrent(c => c + 1) : setSubmitted(true) }

  if (submitted) {
    const s = score(); const passed = s >= 70
    return (
      <div className="qcard" style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-grid', placeItems: 'center', width: 54, height: 54, borderRadius: 999, marginBottom: 12, background: passed ? 'var(--accent)' : 'var(--amber-soft)', color: passed ? 'var(--on-mint)' : 'var(--amber)' }}>
          <Icon name={passed ? 'check' : 'book'} size={26} />
        </div>
        <h3 style={{ fontSize: 22, marginBottom: 6 }}>{passed ? 'Quiz passed' : 'Keep practicing'}</h3>
        <div className="mono" style={{ fontSize: 44, fontWeight: 700, color: passed ? 'var(--accent)' : 'var(--amber)', margin: '6px 0' }}>{s}%</div>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>{questions.filter((q, i) => String(q.answer) === answers[i]).length} / {total} correct</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setSubmitted(false); setCurrent(0); setAnswers({}); setShowExp(false) }} className="btn-line"><Icon name="reset" size={14} /> Retry</button>
          {passed && next && <Link href={`/learn/${next.id}`} className="btn-primary">Next chapter <Icon name="arrow" size={14} className="arr" /></Link>}
          {passed && !next && <Link href="/bonus" className="btn-primary">Bonus exam <Icon name="arrow" size={14} className="arr" /></Link>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="chapter-pill" style={{ marginBottom: 14 }}><span className="pip" /> Question {current + 1} of {total}</div>
      <div className="qcard">
        <div className="mono" style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 12 }}>{q.topic} · {q.source}</div>
        <p style={{ color: 'var(--ink)', fontSize: 17, lineHeight: 1.4, marginBottom: 20 }}><RichMath>{q.question}</RichMath></p>

        {q.type === 'mcq' && q.options && (
          <div style={{ display: 'grid', gap: 10 }}>
            {q.options.map(opt => {
              let cls = 'qopt'
              if (isAnswered) { if (opt === String(q.answer)) cls += ' correct'; else if (opt === selected) cls += ' wrong' }
              else if (opt === selected) cls += ' sel'
              return <button key={opt} className={cls} onClick={() => pick(opt)}><RichMath>{opt}</RichMath></button>
            })}
          </div>
        )}
        {q.type === 'true_false' && (
          <div style={{ display: 'flex', gap: 12 }}>
            {['true', 'false'].map(opt => {
              let cls = 'qopt'
              if (isAnswered) { if (opt === String(q.answer)) cls += ' correct'; else if (opt === selected) cls += ' wrong' }
              else if (opt === selected) cls += ' sel'
              return <button key={opt} className={cls} style={{ flex: 1, justifyContent: 'center' }} onClick={() => pick(opt)}>{opt === 'true' ? 'True' : 'False'}</button>
            })}
          </div>
        )}
        {(q.type === 'numerical' || q.type === 'fill_blank') && (
          !isAnswered
            ? <button onClick={() => pick(String(q.answer))} className="btn-line btn-sm">Reveal answer</button>
            : <div className="formula-card"><div className="tiny" style={{ color: 'var(--accent)', marginBottom: 4 }}>Answer</div><div style={{ color: 'var(--ink)' }}><RichMath>{String(q.answer)}</RichMath></div></div>
        )}

        {isAnswered && (
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setShowExp(s => !s)} className="mono" style={{ fontSize: 12, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ transform: showExp ? 'rotate(90deg)' : 'none', display: 'inline-flex', transition: 'transform .2s' }}><Icon name="chevron" size={12} /></span>
              {showExp ? 'Hide' : 'Show'} explanation
            </button>
            {showExp && <div style={{ marginTop: 8, padding: 12, background: 'var(--bg-2)', borderRadius: 10, fontSize: 14, color: 'var(--ink-2)', border: '1px solid var(--line)' }}><RichMath>{q.explanation}</RichMath></div>}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => { if (current > 0) { setCurrent(c => c - 1); setShowExp(false) } }} disabled={current === 0} className="btn-line" style={{ opacity: current === 0 ? 0.4 : 1 }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span> Prev
        </button>
        <button onClick={nextQ} disabled={!isAnswered} className="btn-primary" style={{ opacity: isAnswered ? 1 : 0.45 }}>
          {current === total - 1 ? 'Submit quiz' : <>Next <Icon name="arrow" size={14} className="arr" /></>}
        </button>
      </div>
    </div>
  )
}
