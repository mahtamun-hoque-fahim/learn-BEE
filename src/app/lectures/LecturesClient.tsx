'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Icon } from '@/components/design/icons'
import type { Lecture } from '@/lib/landing-data'

type View = 'card' | 'row'

export default function LecturesClient({
  lectures,
  chapterTitleById,
}: {
  lectures: Lecture[]
  chapterTitleById: Record<string, string>
}) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('card')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return lectures
    return lectures.filter(l =>
      l.title.toLowerCase().includes(q) ||
      (chapterTitleById[l.unit] ?? '').toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q),
    )
  }, [query, lectures, chapterTitleById])

  return (
    <>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        marginBottom: 18, padding: 12,
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 12,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          flex: 1, minWidth: 220,
          padding: '8px 12px', background: 'var(--bg)',
          border: '1px solid var(--line)', borderRadius: 10,
        }}>
          <Icon name="search" size={15} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search lectures by title, type, or chapter…"
            style={{
              flex: 1, border: 0, background: 'transparent', outline: 'none',
              fontSize: 14, color: 'var(--ink)',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10 }}>
          <ViewBtn active={view === 'card'} onClick={() => setView('card')} label="Cards" />
          <ViewBtn active={view === 'row'} onClick={() => setView('row')} label="Rows" />
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
          No lectures match <span className="mono" style={{ color: 'var(--ink-2)' }}>&quot;{query}&quot;</span>.
        </div>
      )}

      {view === 'card' && filtered.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {filtered.map(l => (
            <LectureCard key={l.id} lec={l} chapterTitle={chapterTitleById[l.unit] ?? l.unit} />
          ))}
        </div>
      )}

      {view === 'row' && filtered.length > 0 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {filtered.map((l, i) => (
            <LectureRow
              key={l.id}
              lec={l}
              chapterTitle={chapterTitleById[l.unit] ?? l.unit}
              isLast={i === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </>
  )
}

function ViewBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 7, border: 0,
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--bg)' : 'var(--muted)',
        fontSize: 12, fontWeight: 600,
        transition: 'background-color .15s, color .15s',
      }}
    >
      {label}
    </button>
  )
}

function LectureCard({ lec, chapterTitle }: { lec: Lecture; chapterTitle: string }) {
  return (
    <Link href={`/learn/${lec.unit}`} style={{
      display: 'block', padding: 16,
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 14, boxShadow: 'var(--shadow-sm)',
      transition: 'border-color .15s, transform .15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span className={`pill ${lec.type === 'Tutorial' ? 'primary' : lec.type === 'Review' ? 'warn' : ''}`}>
          {lec.type}
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{lec.date}</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>· {lec.duration}</span>
      </div>
      <h3 style={{
        fontFamily: 'var(--display)', fontWeight: 600, fontSize: 16,
        letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.3,
      }}>
        {lec.title}
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
        <span style={{ color: 'var(--muted)' }}>{chapterTitle}</span>
        <span className="mono" style={{ color: 'var(--accent)' }}>{lec.pages}p · {lec.ext}</span>
      </div>
    </Link>
  )
}

function LectureRow({ lec, chapterTitle, isLast }: { lec: Lecture; chapterTitle: string; isLast: boolean }) {
  return (
    <Link
      href={`/learn/${lec.unit}`}
      style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'center',
        gap: 14, padding: '14px 16px',
        borderBottom: isLast ? 'none' : '1px solid var(--line)',
        fontSize: 14, color: 'var(--ink)',
      }}
    >
      <span className={`pill ${lec.type === 'Tutorial' ? 'primary' : lec.type === 'Review' ? 'warn' : ''}`}>
        {lec.type}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 500, marginBottom: 2 }}>{lec.title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{chapterTitle}</div>
      </div>
      <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{lec.duration}</span>
      <span className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{lec.ext}</span>
    </Link>
  )
}
