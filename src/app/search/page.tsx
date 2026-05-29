'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { searchAll, type Hit } from '@/lib/search'
import { Tex } from '@/components/math/Tex'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const hits = useMemo(() => searchAll(query, 60), [query])
  const grouped = useMemo(() => {
    const g: Record<Hit['kind'], Hit[]> = { chapter: [], topic: [], formula: [], question: [] }
    for (const h of hits) g[h.kind].push(h)
    return g
  }, [hits])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#222] bg-[#0a0a0a]/90 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="font-syne font-bold text-lg">
            learn<span className="text-[#00e676]">·BEE</span>
          </Link>
          <span className="text-[#444]">/</span>
          <span className="text-[#888] text-sm">Search</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-syne text-3xl font-bold mb-4">Search the syllabus</h1>
        <p className="text-[#888] text-sm mb-6">
          Looks across chapter titles, topics, key formulas, and the entire in-scope question bank.
        </p>

        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. Thévenin, KVL, time constant, capacitor energy"
          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-base
                     focus:border-[#00e676] focus:outline-none placeholder-[#555] mb-8"
          autoFocus
        />

        {query.length === 0 && (
          <div className="text-[#555] text-sm">Type at least 2 characters to begin.</div>
        )}

        {query.length >= 2 && hits.length === 0 && (
          <div className="text-[#555] text-sm">No matches.</div>
        )}

        {hits.length > 0 && (
          <div className="space-y-8">
            {grouped.chapter.length > 0 && (
              <Section title="Chapters" count={grouped.chapter.length}>
                {grouped.chapter.map((h, i) => h.kind === 'chapter' && (
                  <Link key={i} href={`/learn/${h.chapterId}`} className="block bg-[#111] border border-[#222] rounded-lg p-3 hover:border-[#00e676]/40">
                    <div className="font-semibold text-[#ccc]">{h.title}</div>
                    <div className="text-xs text-[#666] font-mono">{h.chapterId}</div>
                  </Link>
                ))}
              </Section>
            )}

            {grouped.topic.length > 0 && (
              <Section title="Topics" count={grouped.topic.length}>
                {grouped.topic.map((h, i) => h.kind === 'topic' && (
                  <Link key={i} href={`/learn/${h.chapterId}`} className="block bg-[#111] border border-[#222] rounded-lg p-3 hover:border-[#00e676]/40">
                    <div className="text-[#ccc]">{h.topic}</div>
                    <div className="text-xs text-[#666] font-mono mt-0.5">in {h.chapterTitle}</div>
                  </Link>
                ))}
              </Section>
            )}

            {grouped.formula.length > 0 && (
              <Section title="Formulas" count={grouped.formula.length}>
                {grouped.formula.map((h, i) => h.kind === 'formula' && (
                  <Link key={i} href={`/cheat-sheet`} className="block bg-[#111] border border-[#222] rounded-lg p-3 hover:border-[#00e676]/40">
                    <div className="text-[#00e676] text-xs uppercase tracking-wider font-mono mb-1">{h.name}</div>
                    <div className="text-white overflow-x-auto"><Tex>{h.latex}</Tex></div>
                    <div className="text-xs text-[#666] font-mono mt-1">in {h.chapterTitle}</div>
                  </Link>
                ))}
              </Section>
            )}

            {grouped.question.length > 0 && (
              <Section title="Questions" count={grouped.question.length}>
                {grouped.question.map((h, i) => h.kind === 'question' && (
                  <Link key={i} href={`/learn/${h.chapterId}`} className="block bg-[#111] border border-[#222] rounded-lg p-3 hover:border-[#00e676]/40">
                    <div className="text-xs text-[#666] font-mono mb-1">{h.questionId} · {h.topic}</div>
                    <div className="text-[#ccc] text-sm">{h.snippet}</div>
                  </Link>
                ))}
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-xs font-mono uppercase tracking-wider text-[#666] mb-2">
        {title} <span className="text-[#444]">· {count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}
