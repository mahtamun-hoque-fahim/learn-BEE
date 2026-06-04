'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { searchAll, type Hit } from '@/lib/search'
import { Tex } from '@/components/math/Tex'
import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { Icon } from '@/components/design/icons'

const cardStyle: React.CSSProperties = {
  display: 'block', background: 'var(--surface)', border: '1px solid var(--line)',
  borderRadius: 12, padding: 14, transition: 'border-color .15s',
}

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const hits = useMemo(() => searchAll(query, 60), [query])
  const grouped = useMemo(() => {
    const g: Record<Hit['kind'], Hit[]> = { chapter: [], topic: [], formula: [], question: [] }
    for (const h of hits) g[h.kind].push(h)
    return g
  }, [hits])

  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 880, paddingTop: 48, paddingBottom: 96 }}>
        <div className="eyebrow">Search</div>
        <h1 style={{ fontSize: 'clamp(30px,4.5vw,44px)', letterSpacing: '-0.035em', margin: '14px 0 10px' }}>
          Search the syllabus
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
          Across chapter titles, topics, key formulas and the whole in-scope question bank.
          Tip: press <kbd className="kbd">⌘/Ctrl + K</kbd> anywhere for the quick palette.
        </p>

        <div style={{ position: 'relative', marginBottom: 32 }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>
            <Icon name="search" size={18} />
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Thévenin, KVL, time constant, capacitor energy"
            className="search-page-input"
            autoFocus
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 12, padding: '14px 16px 14px 46px', fontSize: 16, color: 'var(--ink)' }}
          />
        </div>

        {query.length === 0 && <div style={{ color: 'var(--dim)', fontSize: 14 }}>Type at least 2 characters to begin.</div>}
        {query.length >= 2 && hits.length === 0 && <div style={{ color: 'var(--dim)', fontSize: 14 }}>No matches.</div>}

        {hits.length > 0 && (
          <div style={{ display: 'grid', gap: 28 }}>
            {grouped.chapter.length > 0 && (
              <Section title="Chapters" count={grouped.chapter.length}>
                {grouped.chapter.map((h, i) => h.kind === 'chapter' && (
                  <Link key={i} href={`/learn/${h.chapterId}`} className="result-card" style={cardStyle}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{h.title}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{h.chapterId}</div>
                  </Link>
                ))}
              </Section>
            )}

            {grouped.topic.length > 0 && (
              <Section title="Topics" count={grouped.topic.length}>
                {grouped.topic.map((h, i) => h.kind === 'topic' && (
                  <Link key={i} href={`/learn/${h.chapterId}`} className="result-card" style={cardStyle}>
                    <div style={{ color: 'var(--ink)' }}>{h.topic}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>in {h.chapterTitle}</div>
                  </Link>
                ))}
              </Section>
            )}

            {grouped.formula.length > 0 && (
              <Section title="Formulas" count={grouped.formula.length}>
                {grouped.formula.map((h, i) => h.kind === 'formula' && (
                  <Link key={i} href={`/cheat-sheet#${h.chapterId}`} className="result-card" style={cardStyle}>
                    <div className="tiny" style={{ color: 'var(--accent)', marginBottom: 6 }}>{h.name}</div>
                    <div style={{ color: 'var(--ink)', overflowX: 'auto' }}><Tex>{h.latex}</Tex></div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>in {h.chapterTitle}</div>
                  </Link>
                ))}
              </Section>
            )}

            {grouped.question.length > 0 && (
              <Section title="Questions" count={grouped.question.length}>
                {grouped.question.map((h, i) => h.kind === 'question' && (
                  <Link key={i} href={`/learn/${h.chapterId}`} className="result-card" style={cardStyle}>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{h.questionId} · {h.topic}</div>
                    <div style={{ color: 'var(--ink-2)', fontSize: 14 }}>{h.snippet}</div>
                  </Link>
                ))}
              </Section>
            )}
          </div>
        )}
      </main>
      <Footer />

      <style>{`
        .search-page-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--mint-soft); }
        .search-page-input::placeholder { color: var(--dim); }
        .result-card:hover { border-color: var(--mint-line) !important; }
      `}</style>
    </>
  )
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="tiny" style={{ marginBottom: 10 }}>
        {title} <span style={{ color: 'var(--dim)' }}>· {count}</span>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>{children}</div>
    </section>
  )
}
