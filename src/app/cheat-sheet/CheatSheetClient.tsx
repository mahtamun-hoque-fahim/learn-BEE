'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Tex } from '@/components/math/Tex'
import { Icon } from '@/components/design/icons'
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
      <div style={{
        position: 'sticky', top: 64, zIndex: 40, marginBottom: 32, paddingTop: 12, paddingBottom: 12,
        background: 'color-mix(in oklab, var(--bg) 85%, transparent)', backdropFilter: 'saturate(140%) blur(10px)',
      }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>
            <Icon name="search" size={16} />
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search formulas — try 'Thévenin', 'tau', 'capacitor energy'…"
            className="cs-input"
            autoFocus
            style={{
              width: '100%', background: 'var(--surface)', border: '1px solid var(--line-2)',
              borderRadius: 12, padding: '13px 16px 13px 44px', fontSize: 14, color: 'var(--ink)',
            }}
          />
        </div>
        {query && (
          <div className="mono" style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
            {hits} match{hits === 1 ? '' : 'es'}
          </div>
        )}
      </div>

      {filteredChapters.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--dim)' }}>
          No formulas match <span className="mono" style={{ color: 'var(--muted)' }}>&quot;{query}&quot;</span>.
        </div>
      )}

      {filteredChapters.map(ch => (
        <section key={ch.id} id={ch.id} style={{ marginBottom: 44, scrollMarginTop: 140 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="eyebrow">Chapter {ch.number}</span>
            <h2 style={{ fontSize: 'clamp(20px,3vw,26px)', letterSpacing: '-0.02em' }}>{ch.title}</h2>
            <Link href={`/learn/${ch.id}`} className="mono" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              Study <Icon name="arrow" size={12} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {ch.formulas.map((f, idx) => (
              <div key={idx} style={{ background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 12, padding: 16 }}>
                <div className="tiny" style={{ color: 'var(--accent)', marginBottom: 8 }}>{f.name}</div>
                <div style={{ color: 'var(--ink)', fontSize: 16, overflowX: 'auto', padding: '2px 0' }} title={f.formula_ascii ?? f.formula}>
                  <Tex block>{f.formula}</Tex>
                </div>
                {f.note && <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>{f.note}</div>}
                <div className="mono" style={{ color: 'var(--dim)', fontSize: 11, marginTop: 8 }}>[{f.unit ?? '—'}]</div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <style>{`.cs-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--mint-soft); }
        .cs-input::placeholder { color: var(--dim); }`}</style>
    </>
  )
}
