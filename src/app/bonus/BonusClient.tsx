'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getBonusQuestions, type Question, type ExamMode, chaptersForMode } from '@/lib/questions'
import { RichMath } from '@/components/math/Tex'
import { Icon } from '@/components/design/icons'

type Mode = 'landing' | 'timed' | 'practice' | 'results' | 'certificate'

const EXAM_PRESETS: Array<{ mode: ExamMode; label: string; marks: string; count: number; durationMin: number; desc: string }> = [
  { mode: 'midterm', label: 'Midterm', marks: '20 marks', count: 15, durationMin: 90,
    desc: 'Ch1 → Ch3 (up through Supernode). Mix of easy/medium with a few hard problems.' },
  { mode: 'final',   label: 'Final term', marks: '50 marks', count: 25, durationMin: 180,
    desc: 'Ch4, Ch6, Ch7 (Supernode onward). Heavier on theorems, capacitors, RC transients.' },
  { mode: 'ct1',     label: 'CT-1',    marks: '10 marks', count: 8,  durationMin: 30,
    desc: 'Class test on midterm syllabus. Quick coverage of basics, KCL/KVL, simple analysis.' },
  { mode: 'ct2',     label: 'CT-2',    marks: '10 marks', count: 8,  durationMin: 30,
    desc: 'Class test on final-term syllabus. Theorems, capacitors, transients.' },
  { mode: 'full',    label: 'Full mock', marks: '— marks', count: 20, durationMin: 150,
    desc: 'Random mix across the entire in-scope syllabus. Best for final review.' },
]

const diffPill = (d: string) => `pill ${d === 'easy' ? 'ok' : d === 'medium' ? 'warn' : ''}`

export default function BonusClient() {
  const [mode, setMode] = useState<Mode>('landing')
  const [, setExamMode] = useState<ExamMode>('full')
  const [questions, setQuestions] = useState<Question[]>(() => getBonusQuestions(20, 'full'))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(150 * 60)
  const [started, setStarted] = useState(false)
  const [showExp, setShowExp] = useState(false)

  const finishExam = useCallback(() => { setMode('results') }, [])

  useEffect(() => {
    if (mode !== 'timed' || !started) return
    if (timeLeft <= 0) { finishExam(); return }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [mode, started, timeLeft, finishExam])

  function startExam(target: Mode, preset: typeof EXAM_PRESETS[number]) {
    setExamMode(preset.mode)
    setQuestions(getBonusQuestions(preset.count, preset.mode))
    setTimeLeft(preset.durationMin * 60)
    setAnswers({})
    setCurrent(0)
    setMode(target)
    if (target === 'timed') setStarted(true)
  }

  const getScore = () => {
    let correct = 0
    questions.forEach((q, idx) => { if (String(q.answer) === answers[idx]) correct++ })
    return Math.round((correct / questions.length) * 100)
  }

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0')
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  /* ── Landing ─────────────────────────────────────────────── */
  if (mode === 'landing') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 720, width: '100%' }}>
          <Link href="/learn" style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span> Back to chapters
          </Link>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-grid', placeItems: 'center', width: 56, height: 56, borderRadius: 16, background: 'var(--mint-soft)', color: 'var(--accent)', border: '1px solid var(--mint-line)', marginBottom: 16 }}>
              <Icon name="spark" size={28} />
            </div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Exam prep</div>
            <h1 style={{ fontSize: 'clamp(30px,5vw,44px)', letterSpacing: '-0.035em', marginBottom: 10 }}>Sit a mock exam</h1>
            <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
              BGCTUB-aligned: Midterm, Final, CT-1, CT-2. Pick a mode to start a timed or practice session.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {EXAM_PRESETS.map(preset => (
              <div key={preset.mode} className="card" style={{ padding: 20, background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18 }}>{preset.label}</h3>
                    <span className="mono" style={{ color: 'var(--accent)', fontSize: 12 }}>{preset.marks}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{chaptersForMode(preset.mode).join(' · ')}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.55 }}>{preset.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--dim)' }}>{preset.count} questions · {preset.durationMin} min timed</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => startExam('practice', preset)} className="btn-line btn-sm"><Icon name="book" size={13} /> Practice</button>
                    <button onClick={() => startExam('timed', preset)} className="btn-primary btn-sm"><Icon name="clock" size={13} /> Timed</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── Results ─────────────────────────────────────────────── */
  if (mode === 'results') {
    const score = getScore()
    const passed = score >= 60
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 720, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-grid', placeItems: 'center', width: 60, height: 60, borderRadius: 999, marginBottom: 14, background: passed ? 'var(--accent)' : 'var(--amber-soft)', color: passed ? 'var(--on-mint)' : 'var(--amber)' }}>
              <Icon name={passed ? 'check' : 'book'} size={28} />
            </div>
            <h1 style={{ fontSize: 'clamp(28px,4.5vw,40px)', letterSpacing: '-0.03em', marginBottom: 4 }}>{passed ? 'Exam passed' : 'Keep studying'}</h1>
            <div className="mono" style={{ fontSize: 'clamp(48px,9vw,72px)', fontWeight: 700, margin: '12px 0', color: passed ? 'var(--accent)' : 'var(--amber)' }}>{score}%</div>
            <p style={{ color: 'var(--muted)' }}>
              {questions.filter((q, i) => String(q.answer) === answers[i]).length} / {questions.length} correct
            </p>
          </div>

          <div className="card" style={{ padding: 14, maxHeight: 384, overflowY: 'auto', marginBottom: 24, display: 'grid', gap: 8, background: 'var(--surface)' }}>
            {questions.map((q, idx) => {
              const correct = String(q.answer) === answers[idx]
              return (
                <div key={idx} style={{ padding: 12, borderRadius: 10, fontSize: 14, border: '1px solid', borderColor: correct ? 'var(--mint-line)' : 'color-mix(in oklab, var(--rose) 40%, transparent)', background: correct ? 'var(--mint-soft)' : 'color-mix(in oklab, var(--rose) 9%, transparent)' }}>
                  <div style={{ color: 'var(--ink-2)', marginBottom: 4 }}>
                    <span className="mono" style={{ color: 'var(--dim)' }}>Q{idx + 1}.</span> <RichMath>{q.question.slice(0, 80) + (q.question.length > 80 ? '...' : '')}</RichMath>
                  </div>
                  <div style={{ color: correct ? 'var(--accent)' : 'var(--rose)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon name={correct ? 'check' : 'close'} size={13} /> {answers[idx] || 'Not answered'}
                    {!correct && <span style={{ color: 'var(--muted)', marginLeft: 6 }}>→ <RichMath>{String(q.answer)}</RichMath></span>}
                  </div>
                  <div style={{ color: 'var(--dim)', fontSize: 12, marginTop: 4 }}><RichMath>{q.explanation}</RichMath></div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { setMode('landing'); setAnswers({}); setCurrent(0); setTimeLeft(180 * 60) }} className="btn-line">
              <Icon name="reset" size={14} /> Retry
            </button>
            {passed && (
              <Link href="/certificate" className="btn-primary"><Icon name="check" size={14} /> Get your certificate <Icon name="arrow" size={14} className="arr" /></Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ── Exam (timed / practice) ─────────────────────────────── */
  const q = questions[current]
  const isAnswered = answers[current] !== undefined
  const isTimed = mode === 'timed'

  const handleSelect = (opt: string) => { setAnswers(prev => ({ ...prev, [current]: opt })); setShowExp(false) }
  const handleNext = () => { setShowExp(false); if (current < questions.length - 1) setCurrent(c => c + 1); else finishExam() }
  const answeredCount = Object.keys(answers).length
  const timeColor = timeLeft < 600 ? 'var(--rose)' : timeLeft < 1800 ? 'var(--amber)' : 'var(--accent)'

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Timer bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--line)',
        background: isTimed && timeLeft < 1800 ? 'color-mix(in oklab, var(--rose) 12%, var(--bg))' : 'color-mix(in oklab, var(--bg) 85%, transparent)',
        backdropFilter: 'saturate(140%) blur(10px)',
      }}>
        <div className="container" style={{ maxWidth: 820, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/learn" aria-label="Exit exam" style={{ color: 'var(--muted)', display: 'inline-flex' }}><Icon name="close" size={16} /></Link>
            <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>Bonus exam</span>
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>{answeredCount}/{questions.length} answered</span>
          </div>
          {isTimed && (
            <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: timeColor, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon name="clock" size={16} /> {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div style={{ height: 3, background: 'var(--bg-2)' }}>
          <div style={{ height: 3, background: 'var(--accent)', transition: 'width .3s', width: `${(answeredCount / questions.length) * 100}%`, boxShadow: '0 0 10px var(--accent)' }} />
        </div>
      </div>

      <div className="container" style={{ maxWidth: 820, paddingTop: 32, paddingBottom: 64 }}>
        {/* Navigator */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          {questions.map((_, idx) => {
            const isCur = idx === current
            const ans = answers[idx] !== undefined
            return (
              <button
                key={idx}
                onClick={() => { setCurrent(idx); setShowExp(false) }}
                className="mono"
                style={{
                  width: 32, height: 32, borderRadius: 8, fontSize: 12, transition: 'all .15s',
                  background: isCur ? 'var(--accent)' : ans ? 'var(--mint-soft)' : 'var(--surface)',
                  color: isCur ? 'var(--on-mint)' : ans ? 'var(--accent)' : 'var(--muted)',
                  border: '1px solid', borderColor: isCur ? 'var(--accent)' : ans ? 'var(--mint-line)' : 'var(--line-2)',
                }}
              >{idx + 1}</button>
            )
          })}
        </div>

        {/* Question */}
        <div className="qcard" style={{ padding: 28, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 12, color: 'var(--dim)', flexWrap: 'wrap' }}>
            <span className="mono" style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', padding: '3px 8px', borderRadius: 6 }}>Q{current + 1}</span>
            <span>{q.topic}</span>
            <span className={diffPill(q.difficulty)}>{q.difficulty}</span>
            <span className="mono" style={{ marginLeft: 'auto' }}>{q.source}</span>
          </div>

          <p style={{ color: 'var(--ink)', fontSize: 16.5, lineHeight: 1.55, marginBottom: 20 }}><RichMath>{q.question}</RichMath></p>

          {q.type === 'mcq' && q.options && (
            <div style={{ display: 'grid', gap: 10 }}>
              {q.options.map(opt => {
                let cls = 'qopt'
                const selected = answers[current]
                if (mode === 'practice' && isAnswered) { if (opt === String(q.answer)) cls += ' correct'; else if (opt === selected) cls += ' wrong' }
                else if (opt === selected) cls += ' sel'
                return <button key={opt} className={cls} onClick={() => handleSelect(opt)}><RichMath>{opt}</RichMath></button>
              })}
            </div>
          )}

          {q.type === 'true_false' && (
            <div style={{ display: 'flex', gap: 12 }}>
              {['true', 'false'].map(opt => {
                let cls = 'qopt'
                const selected = answers[current]
                if (mode === 'practice' && isAnswered) { if (opt === String(q.answer)) cls += ' correct'; else if (opt === selected) cls += ' wrong' }
                else if (opt === selected) cls += ' sel'
                return <button key={opt} className={cls} style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleSelect(opt)}>{opt === 'true' ? 'True' : 'False'}</button>
              })}
            </div>
          )}

          {(q.type === 'numerical' || q.type === 'fill_blank') && (
            <div style={{ display: 'grid', gap: 10 }}>
              {!isAnswered ? (
                <button onClick={() => handleSelect(String(q.answer))} className="btn-line btn-sm" style={{ alignSelf: 'flex-start' }}>Show answer (practice)</button>
              ) : (
                <div className="formula-card"><div className="tiny" style={{ color: 'var(--accent)', marginBottom: 4 }}>Answer</div><div style={{ color: 'var(--ink)' }}><RichMath>{String(q.answer)}</RichMath></div></div>
              )}
            </div>
          )}

          {mode === 'practice' && isAnswered && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setShowExp(s => !s)} className="mono" style={{ fontSize: 12, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ transform: showExp ? 'rotate(90deg)' : 'none', display: 'inline-flex', transition: 'transform .2s' }}><Icon name="chevron" size={12} /></span>
                {showExp ? 'Hide' : 'Show'} explanation
              </button>
              {showExp && (
                <div style={{ marginTop: 8, padding: 12, background: 'var(--bg-2)', borderRadius: 10, fontSize: 14, color: 'var(--ink-2)', border: '1px solid var(--line)' }}>
                  <RichMath>{q.explanation}</RichMath>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => { if (current > 0) { setCurrent(c => c - 1); setShowExp(false) } }} disabled={current === 0} className="btn-line" style={{ opacity: current === 0 ? 0.4 : 1 }}>
            <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span> Prev
          </button>
          {current === questions.length - 1 ? (
            <button onClick={finishExam} className="btn-primary">Submit exam <Icon name="arrow" size={14} className="arr" /></button>
          ) : (
            <button onClick={handleNext} className="btn-primary">Next <Icon name="arrow" size={14} className="arr" /></button>
          )}
        </div>
      </div>
    </div>
  )
}
