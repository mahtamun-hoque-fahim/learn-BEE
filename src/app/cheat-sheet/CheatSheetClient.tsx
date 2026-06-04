'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Tex } from '@/components/math/Tex'
import type { Formula } from '@/lib/curriculum'

interface ChapterSummary {
  id: string
  number?: number
  title: string
  formulas: Formula[]
}

export default function CheatSheetClient({ chapters }: { chapters: ChapterSummary[] }) {
  const [query, setQuery] = useState('')

  const filteredChapters = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chapters
    return chapters
      .map(ch => ({
        ...ch,
        formulas: ch.formulas.filter(f =>
          f.name.toLowerCase().includes(q) ||
          (f.formula_ascii ?? '').toLowerCase().includes(q) ||
          f.formula.toLowerCase().includes(q) ||
          (f.unit ?? '').toLowerCase().includes(q) ||
          (f.note ?? '').toLowerCase().includes(q) ||
          ch.title.toLowerCase().includes(q),
        ),
      }))
      .filter(ch => ch.formulas.length > 0)
  }, [chapters, query])

  const hits = filteredChapters.reduce((s, c) => s + c.formulas.length, 0)

  return (
    <>
      <div className="sticky top-14 z-40 -mx-2 mb-8 bg-[#0a0a0a]/95 backdrop-blur px-2 py-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search formulas — try 'Thévenin', 'tau', 'capacitor energy'…"
          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm
                     focus:border-[#00e676] focus:outline-none placeholder-[#555]"
          autoFocus
        />
        {query && (
          <div className="mt-2 text-xs text-[#666] font-mono">
            {hits} match{hits === 1 ? '' : 'es'}
          </div>
        )}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-20 text-[#555]">
          No formulas match <span className="font-mono text-[#888]">&quot;{query}&quot;</span>.
        </div>
      )}

      {filteredChapters.map(ch => (
        <section key={ch.id} id={ch.id} className="mb-12" style={{ scrollMarginTop: '140px' }}>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-xs text-[#00e676] font-mono uppercase tracking-wider">Chapter {ch.number}</span>
            <h2 className="font-syne text-2xl font-bold">{ch.title}</h2>
            <Link href={`/learn/${ch.id}`} className="ml-auto text-xs text-[#666] hover:text-[#00e676] font-mono">
              study →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {ch.formulas.map((f, idx) => (
              <div key={idx} className="bg-[#111] border border-[#222] rounded-xl p-4">
                <div className="text-[#00e676] text-[11px] mb-2 uppercase tracking-wider font-mono">
                  {f.name}
                </div>
                <div
                  className="text-white text-base overflow-x-auto py-1"
                  title={f.formula_ascii ?? f.formula}
                >
                  <Tex block>{f.formula}</Tex>
                </div>
                {f.note && (
                  <div className="text-[#888] text-xs mt-1 italic">{f.note}</div>
                )}
                <div className="text-[#555] text-[11px] mt-2 font-mono">
                  [{f.unit ?? '—'}]
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
