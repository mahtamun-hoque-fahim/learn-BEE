'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { searchAll, type Hit } from '@/lib/search'
import { Tex } from '@/components/math/Tex'
import { Icon } from './icons'

type Row = { hit: Hit; href: string; label: string; sub: string; icon: string; latex?: string }

const KIND_ICON: Record<Hit['kind'], string> = { chapter: 'book', topic: 'spark', formula: 'paper', question: 'chart' }
const KIND_ORDER: Hit['kind'][] = ['chapter', 'topic', 'formula', 'question']

function toRow(h: Hit): Row {
  switch (h.kind) {
    case 'chapter':  return { hit: h, href: `/learn/${h.chapterId}`, label: h.title, sub: 'Chapter', icon: KIND_ICON.chapter }
    case 'topic':    return { hit: h, href: `/learn/${h.chapterId}`, label: h.topic, sub: `in ${h.chapterTitle}`, icon: KIND_ICON.topic }
    case 'formula':  return { hit: h, href: `/cheat-sheet#${h.chapterId}`, label: h.name, sub: `in ${h.chapterTitle}`, icon: KIND_ICON.formula, latex: h.latex }
    case 'question': return { hit: h, href: `/learn/${h.chapterId}`, label: h.snippet, sub: `${h.questionId} · ${h.topic}`, icon: KIND_ICON.question }
  }
}

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const rows = useMemo<Row[]>(() => {
    if (query.trim().length < 2) return []
    const hits = searchAll(query, 40)
    const byKind: Record<Hit['kind'], Row[]> = { chapter: [], topic: [], formula: [], question: [] }
    for (const h of hits) byKind[h.kind].push(toRow(h))
    return KIND_ORDER.flatMap(k => byKind[k])
  }, [query])

  useEffect(() => { setActive(0) }, [query])

  const close = useCallback(() => { setOpen(false); setQuery(''); setActive(0) }, [])

  const go = useCallback((row: Row) => { close(); router.push(row.href) }, [close, router])

  // Global hotkey + external open event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onOpen)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-command-palette', onOpen) }
  }, [])

  // Focus + scroll lock when open
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 20)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { clearTimeout(t); document.body.style.overflow = prev }
  }, [open])

  // Keep active row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, rows.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (rows[active]) go(rows[active]) }
  }

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, padding: '12vh 20px 20px',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)', animation: 'fade .15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search learnBEE"
        style={{
          width: '100%', maxWidth: 620, background: 'var(--surface)', border: '1px solid var(--line-2)',
          borderRadius: 16, boxShadow: 'var(--shadow-md)', overflow: 'hidden', animation: 'fadeUp .2s ease both',
        }}
      >
        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ color: 'var(--muted)', display: 'inline-flex' }}><Icon name="search" size={18} /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search chapters, topics, formulas, questions…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 16, color: 'var(--ink)' }}
          />
          <span className="kbd">Esc</span>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: '56vh', overflowY: 'auto', padding: 8 }}>
          {query.trim().length < 2 && (
            <div className="mono" style={{ padding: '28px 16px', textAlign: 'center', fontSize: 13, color: 'var(--dim)' }}>
              Type at least 2 characters — try &quot;Thévenin&quot;, &quot;tau&quot;, &quot;KVL&quot;.
            </div>
          )}
          {query.trim().length >= 2 && rows.length === 0 && (
            <div className="mono" style={{ padding: '28px 16px', textAlign: 'center', fontSize: 13, color: 'var(--dim)' }}>
              No matches for &quot;{query}&quot;.
            </div>
          )}
          {rows.map((row, i) => {
            const isActive = i === active
            return (
              <button
                key={`${row.hit.kind}-${i}`}
                data-i={i}
                onMouseMove={() => setActive(i)}
                onClick={() => go(row)}
                style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 2, border: '1px solid transparent',
                  background: isActive ? 'var(--mint-soft)' : 'transparent',
                  borderColor: isActive ? 'var(--mint-line)' : 'transparent',
                }}
              >
                <span style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center',
                  background: isActive ? 'var(--accent)' : 'var(--bg-2)', color: isActive ? 'var(--on-mint)' : 'var(--muted)',
                  border: '1px solid var(--line-2)',
                }}>
                  <Icon name={row.icon} size={15} />
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 14, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.latex ? <Tex>{row.latex}</Tex> : row.label}
                  </span>
                  <span className="mono" style={{ display: 'block', fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.sub}
                  </span>
                </span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
                  {row.hit.kind}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderTop: '1px solid var(--line)', fontSize: 11, color: 'var(--dim)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span className="kbd">↵</span> open</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}>{rows.length > 0 && `${rows.length} result${rows.length === 1 ? '' : 's'}`}</span>
        </div>
      </div>
    </div>
  )
}
