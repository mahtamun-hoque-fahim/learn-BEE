import Link from 'next/link'
import { curriculum } from '@/lib/curriculum'

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* TOP NAV */}
      <nav className="border-b border-[#222] bg-[#0a0a0a]/90 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="font-syne font-bold text-lg">
            learn<span className="text-[#00e676]">·BEE</span>
          </Link>
          <span className="text-[#444]">/</span>
          <span className="text-[#888] text-sm">Course Overview</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-syne text-4xl font-bold mb-3">
            Basic Electrical Engineering
          </h1>
          <p className="text-[#888]">19 chapters · Start from Ch 1 and unlock each chapter sequentially</p>
        </div>

        {/* Progress overview - client will handle state */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="font-syne font-semibold">Your Progress</span>
            <span className="text-[#00e676] text-sm font-mono">0 / 19 chapters</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '0%' }} />
          </div>
          <p className="text-[#555] text-xs mt-2">Sign in to track your progress</p>
        </div>

        {curriculum.parts.map(part => (
          <div key={part.id} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              <h2 className="font-syne text-lg font-bold px-4 py-2 bg-[#111] border border-[#222] rounded-xl">
                {part.title}
              </h2>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
            </div>

            <div className="space-y-3">
              {part.chapters.map((chId, idx) => {
                const ch = curriculum.chapters.find(c => c.id === chId)!
                const locked = idx > 0 // first chapter always open; rest sequentially unlock
                return (
                  <Link
                    key={chId}
                    href={`/learn/${chId}`}
                    className={`flex items-center gap-5 p-5 rounded-xl border transition-all group ${
                      locked
                        ? 'border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#333]'
                        : 'border-[#222] bg-[#111] hover:border-[#00e676]'
                    }`}
                  >
                    {/* Chapter number */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 ${
                      locked ? 'bg-[#1a1a1a] text-[#444]' : 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20'
                    }`}>
                      {ch.number}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-syne font-semibold ${locked ? 'text-[#555]' : 'group-hover:text-[#00e676] transition-colors'}`}>
                          {ch.title}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ch.difficulty === 'beginner' ? 'text-green-400 bg-green-900/20' :
                          ch.difficulty === 'intermediate' ? 'text-yellow-400 bg-yellow-900/20' :
                          'text-red-400 bg-red-900/20'
                        }`}>{ch.difficulty}</span>
                      </div>
                      <div className="text-[#555] text-sm truncate">
                        {ch.topics.slice(0, 3).join(' · ')}{ch.topics.length > 3 ? ` +${ch.topics.length - 3} more` : ''}
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="hidden md:flex items-center gap-2">
                      {['Theory', 'Sim', 'Quiz'].map(step => (
                        <span key={step} className="text-xs px-2 py-1 rounded bg-[#1a1a1a] text-[#555]">
                          {step}
                        </span>
                      ))}
                    </div>

                    {/* Sadiku pages */}
                    <div className="hidden lg:block text-[#444] text-xs font-mono">
                      p.{ch.sadiku_pages}
                    </div>

                    <div className={`text-lg flex-shrink-0 ${locked ? 'text-[#333]' : 'text-[#444] group-hover:text-[#00e676]'}`}>
                      →
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Bonus section */}
        <div className="mt-12 border border-dashed border-[#333] rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🎓</div>
          <h3 className="font-syne text-xl font-bold mb-2">Bonus Problems + Certificate</h3>
          <p className="text-[#888] text-sm mb-4">Unlocks after completing all 19 chapters. 20 comprehensive problems from all topics.</p>
          <div className="inline-flex items-center gap-2 text-[#555] text-sm border border-[#222] rounded-lg px-4 py-2">
            🔒 Complete all chapters to unlock
          </div>
        </div>
      </div>
    </div>
  )
}
