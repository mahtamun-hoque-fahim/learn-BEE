import Link from 'next/link'
import { curriculum } from '@/lib/curriculum'

export default function HomePage() {
  const totalChapters = curriculum.chapters.length

  return (
    <main className="min-h-screen circuit-bg">
      {/* NAV */}
      <nav className="border-b border-[#222] bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-syne text-xl font-bold">
            learn<span className="text-[#00e676]">·BEE</span>
          </span>
          <div className="flex gap-3">
            <Link href="/learn" className="px-4 py-2 rounded-lg bg-[#00e676] text-black font-semibold text-sm hover:bg-[#00b85d] transition-colors">
              Start Learning
            </Link>
            <Link href="/admin" className="px-4 py-2 rounded-lg border border-[#222] text-sm hover:border-[#00e676] transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-[#111] border border-[#222] rounded-full px-4 py-2 text-sm text-[#00e676] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
          University-Level · 4 Credit Theory Course
        </div>
        
        <h1 className="font-syne text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Master<br />
          <span className="text-[#00e676]">Basic Electrical</span><br />
          Engineering
        </h1>
        
        <p className="text-[#888] text-lg max-w-2xl mx-auto mb-10">
          {totalChapters} chapters of structured theory, interactive circuit simulators, randomized quizzes, 
          and a personalized certificate of completion — based on Sadiku & Boylestad.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/learn" className="px-8 py-4 bg-[#00e676] text-black font-bold rounded-xl hover:bg-[#00b85d] transition-colors text-lg">
            Start Course →
          </Link>
          <Link href="/learn#chapters" className="px-8 py-4 border border-[#333] rounded-xl hover:border-[#00e676] transition-colors text-lg">
            Browse Chapters
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Chapters', value: totalChapters },
            { label: 'Topics', value: curriculum.chapters.reduce((s,c) => s + c.topics.length, 0) },
            { label: 'Quiz Questions', value: '200+' },
            { label: 'Simulators', value: '12+' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111] border border-[#222] rounded-xl p-6 text-center hover:border-[#00e676] transition-colors">
              <div className="font-syne text-3xl font-bold text-[#00e676]">{stat.value}</div>
              <div className="text-[#888] text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAPTERS PREVIEW */}
      <section className="max-w-6xl mx-auto px-6 pb-24" id="chapters">
        <h2 className="font-syne text-3xl font-bold mb-2">Course Curriculum</h2>
        <p className="text-[#888] mb-8">3 Parts · 19 Chapters · DC → AC → Advanced</p>
        
        {curriculum.parts.map(part => (
          <div key={part.id} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-[#222]" />
              <span className="text-[#00e676] font-semibold text-sm px-3 py-1 border border-[#00e676]/30 rounded-full bg-[#00e676]/5">
                {part.title}
              </span>
              <div className="h-px flex-1 bg-[#222]" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {part.chapters.map(chId => {
                const ch = curriculum.chapters.find(c => c.id === chId)!
                return (
                  <Link key={chId} href={`/learn/${chId}`}
                    className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#00e676] transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#00e676] font-mono">CH {ch.number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        ch.difficulty === 'beginner' ? 'border-green-800 text-green-400 bg-green-900/20' :
                        ch.difficulty === 'intermediate' ? 'border-yellow-800 text-yellow-400 bg-yellow-900/20' :
                        'border-red-800 text-red-400 bg-red-900/20'
                      }`}>{ch.difficulty}</span>
                    </div>
                    <div className="font-syne font-semibold text-sm group-hover:text-[#00e676] transition-colors">
                      {ch.title}
                    </div>
                    <div className="text-[#666] text-xs mt-1">{ch.topics.length} topics</div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="border-t border-[#222] bg-[#111]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Circuit Simulators', desc: 'Interactive simulators for every major chapter — tweak values, see live results.' },
            { icon: '🎯', title: 'Randomized Quizzes', desc: '200+ questions from Sadiku & Boylestad. Randomized each attempt for genuine practice.' },
            { icon: '🏆', title: 'Certificate', desc: 'Complete all chapters + bonus exam to earn a personalized certificate of completion.' },
          ].map(f => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-syne font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-[#888] text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#222] py-8 text-center text-[#555] text-sm">
        learn·BEE · Built from Sadiku (5th Ed), Boylestad & Tikle&apos;s Academy
      </footer>
    </main>
  )
}
