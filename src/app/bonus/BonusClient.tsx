'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getBonusQuestions, type Question } from '@/lib/questions'

type Mode = 'landing' | 'timed' | 'practice' | 'results' | 'certificate'

export default function BonusClient() {
  const [mode, setMode] = useState<Mode>('landing')
  const [questions] = useState<Question[]>(() => getBonusQuestions(20))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(180 * 60) // 3 hours
  const [started, setStarted] = useState(false)
  const [showExp, setShowExp] = useState(false)

  const finishExam = useCallback(() => {
    setMode('results')
  }, [])

  // Timer countdown
  useEffect(() => {
    if (mode !== 'timed' || !started) return
    if (timeLeft <= 0) { finishExam(); return }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [mode, started, timeLeft, finishExam])

  const getScore = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (String(q.answer) === answers[idx]) correct++
    })
    return Math.round((correct / questions.length) * 100)
  }

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0')
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <Link href="/learn" className="text-[#888] hover:text-white text-sm mb-8 block">← Back to Chapters</Link>
          
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="font-syne text-4xl font-bold mb-3">Bonus Exam</h1>
            <p className="text-[#888]">20 comprehensive problems across all 19 chapters. Pass with 60%+ to unlock your certificate.</p>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6 space-y-3">
            {[
              ['Questions', '20 (mixed difficulty)'],
              ['Topics', 'All 19 chapters'],
              ['Pass Mark', '60% (12/20)'],
              ['Timed Mode', '3 hours'],
              ['Attempts', 'Unlimited'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#888]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setMode('timed'); setStarted(true) }}
              className="py-4 bg-[#00e676] text-black font-bold rounded-xl hover:bg-[#00b85d] transition-colors"
            >
              ⏱ Timed Mode
            </button>
            <button
              onClick={() => setMode('practice')}
              className="py-4 border border-[#333] rounded-xl hover:border-[#00e676] transition-colors font-semibold"
            >
              📚 Practice Mode
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'results') {
    const score = getScore()
    const passed = score >= 60
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{passed ? '🎓' : '📚'}</div>
            <h1 className="font-syne text-4xl font-bold mb-2">{passed ? 'Exam Passed!' : 'Keep Studying'}</h1>
            <div className={`text-7xl font-bold font-mono my-6 ${passed ? 'text-[#00e676]' : 'text-yellow-400'}`}>{score}%</div>
            <p className="text-[#888]">
              {questions.filter((q, i) => String(q.answer) === answers[i]).length} / {questions.length} correct
            </p>
          </div>

          {/* Answer review */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-4 max-h-96 overflow-y-auto mb-6 space-y-2">
            {questions.map((q, idx) => {
              const correct = String(q.answer) === answers[idx]
              return (
                <div key={idx} className={`p-3 rounded-lg border text-sm ${correct ? 'border-green-900/50 bg-green-900/10' : 'border-red-900/50 bg-red-900/10'}`}>
                  <div className="text-[#ccc] mb-1"><span className="font-mono text-[#555]">Q{idx+1}.</span> {q.question.slice(0, 80)}...</div>
                  <div className={correct ? 'text-green-400' : 'text-red-400'}>
                    {correct ? '✓' : '✗'} {answers[idx] || 'Not answered'}
                    {!correct && <span className="text-[#888] ml-2">→ {String(q.answer)}</span>}
                  </div>
                  <div className="text-[#555] text-xs mt-1">{q.explanation}</div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setMode('landing'); setAnswers({}); setCurrent(0); setTimeLeft(180*60) }}
              className="px-5 py-2.5 border border-[#333] rounded-xl text-sm hover:border-[#666]"
            >
              Retry
            </button>
            {passed && (
              <Link href="/certificate" className="px-6 py-2.5 bg-[#00e676] text-black font-bold rounded-xl hover:bg-[#00b85d]">
                🎓 Get Your Certificate →
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Exam UI (timed or practice)
  const q = questions[current]
  const isAnswered = answers[current] !== undefined
  const isTimed = mode === 'timed'

  const handleSelect = (opt: string) => {
    setAnswers(prev => ({ ...prev, [current]: opt }))
    setShowExp(false)
  }

  const handleNext = () => {
    setShowExp(false)
    if (current < questions.length - 1) setCurrent(c => c + 1)
    else finishExam()
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Timer bar */}
      <div className={`sticky top-0 z-50 border-b border-[#222] ${isTimed && timeLeft < 1800 ? 'bg-red-900/20 border-red-800' : 'bg-[#0a0a0a]'}`}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/learn" className="text-[#555] hover:text-white text-sm">✕</Link>
            <span className="font-syne font-semibold">Bonus Exam</span>
            <span className="text-[#888] text-sm">{answeredCount}/{questions.length} answered</span>
          </div>
          {isTimed && (
            <div className={`font-mono text-lg font-bold ${timeLeft < 600 ? 'text-red-400' : timeLeft < 1800 ? 'text-yellow-400' : 'text-[#00e676]'}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div className="h-1 bg-[#1a1a1a]">
          <div className="h-1 bg-[#00e676] transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Question navigator */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrent(idx); setShowExp(false) }}
              className={`w-8 h-8 rounded text-xs font-mono transition-all ${
                idx === current ? 'bg-[#00e676] text-black' :
                answers[idx] !== undefined ? 'bg-green-900/40 text-green-400 border border-green-800' :
                'bg-[#111] border border-[#222] text-[#888]'
              }`}
            >{idx + 1}</button>
          ))}
        </div>

        {/* Question */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4 text-xs text-[#555]">
            <span className="font-mono bg-[#1a1a1a] px-2 py-0.5 rounded">Q{current + 1}</span>
            <span>{q.topic}</span>
            <span className={`px-2 py-0.5 rounded-full ${q.difficulty === 'easy' ? 'text-green-400 bg-green-900/20' : q.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-900/20' : 'text-red-400 bg-red-900/20'}`}>{q.difficulty}</span>
            <span className="ml-auto">{q.source}</span>
          </div>

          <p className="text-white text-base leading-relaxed mb-5">{q.question}</p>

          {q.type === 'mcq' && q.options && (
            <div className="space-y-2">
              {q.options.map(opt => {
                let cls = 'quiz-option w-full text-left'
                const selected = answers[current]
                if (mode === 'practice' && isAnswered) {
                  if (opt === String(q.answer)) cls += ' correct'
                  else if (opt === selected) cls += ' wrong'
                } else if (opt === selected) cls += ' selected'
                return (
                  <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {q.type === 'true_false' && (
            <div className="flex gap-3">
              {['true', 'false'].map(opt => {
                let cls = 'quiz-option flex-1 text-center'
                const selected = answers[current]
                if (mode === 'practice' && isAnswered) {
                  if (opt === String(q.answer)) cls += ' correct'
                  else if (opt === selected) cls += ' wrong'
                } else if (opt === selected) cls += ' selected'
                return (
                  <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                    {opt === 'true' ? '✓ True' : '✗ False'}
                  </button>
                )
              })}
            </div>
          )}

          {(q.type === 'numerical' || q.type === 'fill_blank') && (
            <div className="space-y-2">
              {!isAnswered ? (
                <button onClick={() => handleSelect(String(q.answer))} className="px-4 py-2 border border-[#333] rounded-lg text-sm hover:border-[#00e676]">
                  Show Answer (Practice)
                </button>
              ) : (
                <div className="formula-card">
                  <div className="text-[#00e676] text-xs mb-1">Answer</div>
                  <div className="font-mono text-white">{String(q.answer)}</div>
                </div>
              )}
            </div>
          )}

          {/* Explanation (practice mode only) */}
          {mode === 'practice' && isAnswered && (
            <div className="mt-4">
              <button onClick={() => setShowExp(s => !s)} className="text-xs text-[#00e676] hover:underline">
                {showExp ? '▲ Hide' : '▼ Show'} Explanation
              </button>
              {showExp && (
                <div className="mt-2 p-3 bg-[#0a0a0a] rounded-lg text-sm text-[#ccc] border border-[#1a1a1a]">
                  {q.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => { if (current > 0) { setCurrent(c => c - 1); setShowExp(false) } }}
            disabled={current === 0}
            className="px-4 py-2 border border-[#222] rounded-lg text-sm disabled:opacity-30 hover:border-[#444]"
          >← Prev</button>

          <div className="flex gap-3">
            {current === questions.length - 1 ? (
              <button onClick={finishExam} className="px-6 py-2 bg-[#00e676] text-black font-bold rounded-lg hover:bg-[#00b85d]">
                Submit Exam →
              </button>
            ) : (
              <button onClick={handleNext} className="px-5 py-2 bg-[#00e676] text-black font-semibold rounded-lg hover:bg-[#00b85d] text-sm">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
