'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Chapter } from '@/lib/curriculum'
import { getRandomQuestions, type Question } from '@/lib/questions'
import CircuitSimulator from '@/components/simulator/CircuitSimulator'

interface Props {
  chapter: Chapter
  prev: Chapter | null
  next: Chapter | null
}

type Tab = 'theory' | 'simulator' | 'quiz'

export default function ChapterClient({ chapter, prev, next }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('theory')
  const [theoryDone, setTheoryDone] = useState(false)
  const [simDone, setSimDone] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'theory', label: 'Theory', icon: '📖' },
    { id: 'simulator', label: 'Simulator', icon: '⚡' },
    { id: 'quiz', label: 'Quiz', icon: '🎯' },
  ]

  const allDone = theoryDone && simDone && quizDone
  const progressCount = [theoryDone, simDone, quizDone].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* NAV */}
      <nav className="border-b border-[#222] bg-[#0a0a0a]/90 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/learn" className="text-[#888] hover:text-white text-sm transition-colors">
            ← Chapters
          </Link>
          <span className="text-[#333]">/</span>
          <span className="font-syne font-semibold text-sm">Ch {chapter.number}: {chapter.title}</span>
          <div className="ml-auto flex items-center gap-2 text-xs text-[#888]">
            <span className="text-[#00e676]">{progressCount}/3</span> steps done
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[#00e676] text-sm">Chapter {chapter.number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              chapter.difficulty === 'beginner' ? 'text-green-400 bg-green-900/20 border border-green-900' :
              chapter.difficulty === 'intermediate' ? 'text-yellow-400 bg-yellow-900/20 border border-yellow-900' :
              'text-red-400 bg-red-900/20 border border-red-900'
            }`}>{chapter.difficulty}</span>
            {chapter.sadiku_pages && (
              <span className="text-xs text-[#555]">Sadiku pp. {chapter.sadiku_pages}</span>
            )}
          </div>
          <h1 className="font-syne text-3xl font-bold mb-2">{chapter.title}</h1>

          {/* Mini progress */}
          <div className="flex gap-2 mt-4">
            {tabs.map(tab => (
              <div key={tab.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border ${
                (tab.id === 'theory' && theoryDone) || (tab.id === 'simulator' && simDone) || (tab.id === 'quiz' && quizDone)
                  ? 'border-[#00e676]/40 bg-[#00e676]/10 text-[#00e676]'
                  : 'border-[#222] text-[#555]'
              }`}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {((tab.id === 'theory' && theoryDone) || (tab.id === 'simulator' && simDone) || (tab.id === 'quiz' && quizDone)) && (
                  <span>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-[#111] p-1 rounded-xl border border-[#222]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00e676] text-black font-semibold'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'theory' && (
          <TheoryTab chapter={chapter} onComplete={() => { setTheoryDone(true); setActiveTab('simulator') }} />
        )}
        {activeTab === 'simulator' && (
          <SimulatorTab chapter={chapter} onComplete={() => { setSimDone(true); setActiveTab('quiz') }} />
        )}
        {activeTab === 'quiz' && (
          <QuizTab chapter={chapter} onComplete={(score) => { setQuizDone(true); setQuizScore(score) }} />
        )}

        {/* COMPLETED CHAPTER */}
        {allDone && (
          <div className="mt-8 bg-[#00e676]/5 border border-[#00e676]/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-syne text-xl font-bold text-[#00e676] mb-1">Chapter Complete!</h3>
            <p className="text-[#888] text-sm mb-4">
              Quiz score: <span className="text-white font-semibold">{quizScore}%</span>
            </p>
            <div className="flex justify-center gap-3">
              {prev && (
                <Link href={`/learn/${prev.id}`} className="px-4 py-2 border border-[#333] rounded-lg text-sm hover:border-[#666]">
                  ← Ch {prev.number}
                </Link>
              )}
              {next ? (
                <Link href={`/learn/${next.id}`} className="px-6 py-2 bg-[#00e676] text-black font-semibold rounded-lg text-sm hover:bg-[#00b85d]">
                  Next: Ch {next.number} →
                </Link>
              ) : (
                <Link href="/bonus" className="px-6 py-2 bg-[#00e676] text-black font-semibold rounded-lg text-sm hover:bg-[#00b85d]">
                  🏆 Unlock Bonus Exam →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Chapter nav */}
        {!allDone && (
          <div className="flex justify-between mt-8 pt-6 border-t border-[#1a1a1a]">
            {prev ? (
              <Link href={`/learn/${prev.id}`} className="flex items-center gap-2 text-[#888] hover:text-white text-sm transition-colors">
                ← Ch {prev.number}: {prev.title}
              </Link>
            ) : <div />}
            {next && (
              <Link href={`/learn/${next.id}`} className="flex items-center gap-2 text-[#888] hover:text-white text-sm transition-colors">
                Ch {next.number}: {next.title} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ===== THEORY TAB =====
function TheoryTab({ chapter, onComplete }: { chapter: Chapter; onComplete: () => void }) {
  const [readTopics, setReadTopics] = useState<Set<number>>(new Set())

  const toggleTopic = (idx: number) => {
    setReadTopics(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  const allRead = readTopics.size >= chapter.topics.length

  return (
    <div className="space-y-6">
      {/* Topics */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <h3 className="font-syne font-semibold mb-4 text-[#888] text-sm uppercase tracking-wider">Topics Covered</h3>
        <div className="space-y-2">
          {chapter.topics.map((topic, idx) => (
            <label key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] cursor-pointer group">
              <input
                type="checkbox"
                checked={readTopics.has(idx)}
                onChange={() => toggleTopic(idx)}
                className="mt-0.5 accent-[#00e676]"
              />
              <span className={`text-sm transition-colors ${readTopics.has(idx) ? 'line-through text-[#555]' : 'text-white'}`}>
                {topic}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 h-1 bg-[#1a1a1a] rounded">
          <div
            className="h-1 bg-[#00e676] rounded transition-all"
            style={{ width: `${(readTopics.size / chapter.topics.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Key Formulas */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <h3 className="font-syne font-semibold mb-4">Key Formulas</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {chapter.key_formulas.map((f, idx) => (
            <div key={idx} className="formula-card">
              <div className="text-[#00e676] text-xs mb-1">{f.name}</div>
              <div className="text-white font-mono text-sm">{f.formula}</div>
              <div className="text-[#555] text-xs mt-1">[{f.unit}]</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <h3 className="font-syne font-semibold mb-3 text-sm text-[#888] uppercase tracking-wider">Study References</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {chapter.sadiku_pages && (
            <div className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
              <span className="text-2xl">📘</span>
              <div>
                <div className="font-semibold text-sm">Sadiku 5th Edition</div>
                <div className="text-[#888] text-xs">Pages {chapter.sadiku_pages}</div>
              </div>
            </div>
          )}
          {chapter.boylestad_chapters && (
            <div className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
              <span className="text-2xl">📗</span>
              <div>
                <div className="font-semibold text-sm">Boylestad</div>
                <div className="text-[#888] text-xs">Chapter(s) {chapter.boylestad_chapters}</div>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
            <span className="text-2xl">📺</span>
            <div>
              <div className="font-semibold text-sm">Tikle&apos;s Academy</div>
              <a
                href="https://www.youtube.com/playlist?list=PLDN15nk5uLiCSOqr7-rUz6-GtdTAjlvul"
                target="_blank" rel="noopener noreferrer"
                className="text-[#00e676] text-xs hover:underline"
              >
                Watch playlist →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onComplete}
          disabled={!allRead}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            allRead
              ? 'bg-[#00e676] text-black hover:bg-[#00b85d]'
              : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
          }`}
        >
          {allRead ? '✓ Theory Complete — Try Simulator →' : `Read all ${chapter.topics.length - readTopics.size} remaining topics to continue`}
        </button>
      </div>
    </div>
  )
}

// ===== SIMULATOR TAB =====
function SimulatorTab({ chapter, onComplete }: { chapter: Chapter; onComplete: () => void }) {
  const [interacted, setInteracted] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h3 className="font-syne font-semibold mb-1">Interactive Demos</h3>
        <p className="text-[#888] text-sm mb-4">Available simulations for this chapter:</p>
        <ul className="space-y-2">
          {chapter.simulator_demos.map((demo, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-[#ccc]">
              <span className="text-[#00e676] mt-0.5">⚡</span>
              {demo}
            </li>
          ))}
        </ul>
      </div>

      {/* Embedded simulator */}
      <div onClick={() => setInteracted(true)}>
        <CircuitSimulator chapterId={chapter.id} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-[#00e676] text-black rounded-xl font-semibold hover:bg-[#00b85d] transition-colors"
        >
          ✓ Done with Simulator — Take Quiz →
        </button>
      </div>
    </div>
  )
}

// ===== QUIZ TAB =====
function QuizTab({ chapter, onComplete }: { chapter: Chapter; onComplete: (score: number) => void }) {
  const [questions] = useState<Question[]>(() => getRandomQuestions(chapter.id, 10))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center">
        <p className="text-[#888]">Quiz questions for this chapter are being prepared.</p>
        <button onClick={() => onComplete(100)} className="mt-4 px-6 py-2 bg-[#00e676] text-black rounded-lg font-semibold">
          Continue →
        </button>
      </div>
    )
  }

  const q = questions[current]
  const totalQ = questions.length
  const isAnswered = answers[current] !== undefined
  const selectedAnswer = answers[current]

  const getScore = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      const ans = answers[idx]
      const correct_ans = String(q.answer)
      if (ans === correct_ans) correct++
    })
    return Math.round((correct / totalQ) * 100)
  }

  const handleSelect = (option: string) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [current]: option }))
    setShowExplanation(false)
  }

  const handleNext = () => {
    setShowExplanation(false)
    if (current < totalQ - 1) {
      setCurrent(c => c + 1)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    const score = getScore()
    const passed = score >= 70
    return (
      <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">{passed ? '🎉' : '📚'}</div>
        <h3 className="font-syne text-2xl font-bold mb-2">
          {passed ? 'Chapter Quiz Passed!' : 'Keep Practicing'}
        </h3>
        <div className={`text-5xl font-bold font-mono my-4 ${passed ? 'text-[#00e676]' : 'text-yellow-400'}`}>
          {score}%
        </div>
        <p className="text-[#888] text-sm mb-2">
          {questions.filter((q, idx) => String(q.answer) === answers[idx]).length} / {totalQ} correct
        </p>
        {!passed && <p className="text-[#888] text-sm mb-6">Need 70% to pass. Review the theory and try again.</p>}

        {/* Answer review */}
        <div className="text-left space-y-3 mb-6 max-h-80 overflow-y-auto">
          {questions.map((q, idx) => {
            const correct = String(q.answer) === answers[idx]
            return (
              <div key={idx} className={`p-3 rounded-lg border text-sm ${correct ? 'border-green-800 bg-green-900/10' : 'border-red-800 bg-red-900/10'}`}>
                <div className="font-medium text-[#ccc] mb-1">{idx+1}. {q.question}</div>
                <div className={correct ? 'text-green-400' : 'text-red-400'}>
                  Your answer: {answers[idx] || 'Not answered'} {correct ? '✓' : '✗'}
                </div>
                {!correct && <div className="text-[#888] text-xs mt-1">Correct: {String(q.answer)}</div>}
                <div className="text-[#666] text-xs mt-1">{q.explanation}</div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 justify-center">
          {!passed && (
            <button
              onClick={() => { setSubmitted(false); setCurrent(0); setAnswers({}); setShowExplanation(false) }}
              className="px-5 py-2 border border-[#333] rounded-lg text-sm hover:border-[#666]"
            >
              Retry Quiz
            </button>
          )}
          {passed && (
            <button
              onClick={() => onComplete(score)}
              className="px-6 py-3 bg-[#00e676] text-black rounded-xl font-bold hover:bg-[#00b85d]"
            >
              Complete Chapter ✓
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-[#888] mb-2">
        <span>Question {current + 1} of {totalQ}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          q.difficulty === 'easy' ? 'text-green-400 bg-green-900/20' :
          q.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-900/20' :
          'text-red-400 bg-red-900/20'
        }`}>{q.difficulty}</span>
      </div>
      <div className="progress-bar mb-4">
        <div className="progress-fill" style={{ width: `${((current + 1) / totalQ) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <div className="text-xs text-[#555] mb-3 font-mono">{q.topic} · {q.source}</div>
        <p className="text-white text-base mb-5 leading-relaxed">{q.question}</p>

        {/* Options for MCQ */}
        {q.type === 'mcq' && q.options && (
          <div className="space-y-2">
            {q.options.map(opt => {
              let cls = 'quiz-option'
              if (isAnswered) {
                if (opt === String(q.answer)) cls += ' correct'
                else if (opt === selectedAnswer) cls += ' wrong'
              } else if (opt === selectedAnswer) {
                cls += ' selected'
              }
              return (
                <button key={opt} className={`${cls} w-full text-left`} onClick={() => handleSelect(opt)}>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* True/False */}
        {q.type === 'true_false' && (
          <div className="flex gap-3">
            {['true', 'false'].map(opt => {
              let cls = 'quiz-option flex-1 text-center'
              if (isAnswered) {
                if (opt === String(q.answer)) cls += ' correct'
                else if (opt === selectedAnswer) cls += ' wrong'
              } else if (opt === selectedAnswer) cls += ' selected'
              return (
                <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                  {opt === 'true' ? '✓ True' : '✗ False'}
                </button>
              )
            })}
          </div>
        )}

        {/* Numerical / Fill blank — user types or selects reveal */}
        {(q.type === 'numerical' || q.type === 'fill_blank') && (
          <div className="space-y-3">
            <p className="text-[#888] text-sm">Type your answer or attempt in your notebook, then check the answer.</p>
            {!isAnswered ? (
              <button
                onClick={() => handleSelect(String(q.answer))}
                className="px-4 py-2 border border-[#333] rounded-lg text-sm hover:border-[#00e676] transition-colors"
              >
                Reveal Answer
              </button>
            ) : (
              <div className="formula-card">
                <div className="text-[#00e676] text-xs mb-1">Answer</div>
                <div className="text-white font-mono">{String(q.answer)}</div>
              </div>
            )}
          </div>
        )}

        {/* Explanation toggle */}
        {isAnswered && (
          <div className="mt-4">
            <button
              onClick={() => setShowExplanation(s => !s)}
              className="text-xs text-[#00e676] hover:underline"
            >
              {showExplanation ? '▲ Hide' : '▼ Show'} Explanation
            </button>
            {showExplanation && (
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
          onClick={() => { if (current > 0) { setCurrent(c => c - 1); setShowExplanation(false) } }}
          disabled={current === 0}
          className="px-4 py-2 border border-[#222] rounded-lg text-sm disabled:opacity-30 hover:border-[#444]"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            isAnswered ? 'bg-[#00e676] text-black hover:bg-[#00b85d]' : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
          }`}
        >
          {current === totalQ - 1 ? 'Submit Quiz' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
