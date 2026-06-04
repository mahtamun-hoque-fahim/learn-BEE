'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@/components/design/icons'

interface Unit {
  id: string
  code: string
  title: string
  summary: string
  topicCount: number
  formulaCount: number
  topics: string[]
}

export default function SyllabusClient({ units }: { units: Unit[] }) {
  const [openId, setOpenId] = useState<string | null>(units[0]?.id ?? null)
  const [done, setDone] = useState<Set<string>>(new Set())

  // Restore done state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('learnbee.syllabus.done')
      if (raw) setDone(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  const toggleDone = useCallback((id: string) => {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try { localStorage.setItem('learnbee.syllabus.done', JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setDone(new Set())
    try { localStorage.removeItem('learnbee.syllabus.done') } catch {}
  }, [])

  return (
    <>
      {/* Progress bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18,
        padding: '12px 16px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 12,
      }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
          {done.size} / {units.length} done
        </div>
        <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${(done.size / Math.max(1, units.length)) * 100}%`,
            background: 'var(--accent)', borderRadius: 999, transition: 'width .25s ease',
          }} />
        </div>
        <button
          onClick={reset}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 12px', border: '1px solid var(--line)',
            background: 'var(--bg)', borderRadius: 8, color: 'var(--muted)', fontSize: 13,
          }}
        >
          <Icon name="reset" size={13} /> Reset
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {units.map(u => {
          const isOpen = openId === u.id
          const isDone = done.has(u.id)
          return (
            <div key={u.id} style={{
              border: `1px solid ${isOpen ? 'var(--ink-2)' : 'var(--line)'}`,
              borderRadius: 14,
              background: isOpen ? 'var(--surface)' : 'transparent',
              overflow: 'hidden',
              transition: 'border-color .15s, background-color .15s',
            }}>
              {/* Header row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 14,
                alignItems: 'center',
                padding: 16,
              }}>
                {/* Checkbox */}
                <button
                  onClick={() => toggleDone(u.id)}
                  aria-label={isDone ? 'Mark not done' : 'Mark done'}
                  style={{
                    width: 28, height: 28, borderRadius: 8,
                    border: `1.5px solid ${isDone ? 'var(--ok)' : 'var(--line)'}`,
                    background: isDone ? 'var(--ok)' : 'transparent',
                    color: isDone ? 'white' : 'transparent',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="check" size={14} stroke={2.5} />
                </button>

                {/* Title (expand toggle) */}
                <button
                  onClick={() => setOpenId(isOpen ? null : u.id)}
                  style={{
                    background: 'transparent', border: 0, padding: 0,
                    textAlign: 'left', color: 'inherit',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: 14,
                    alignItems: 'center',
                    minWidth: 0,
                  }}
                >
                  <span className="mono" style={{
                    fontSize: 12,
                    color: 'var(--muted)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    padding: '3px 8px', borderRadius: 6,
                    letterSpacing: '0.04em',
                  }}>
                    {u.code}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--display)',
                      fontWeight: 600, fontSize: 16,
                      letterSpacing: '-0.01em',
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--muted)' : 'var(--ink)',
                    }}>{u.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                      {u.summary}
                    </div>
                  </div>
                </button>

                {/* Right meta + chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span className="mono" style={{
                    fontSize: 11, color: 'var(--muted)',
                    display: 'inline-block',
                  }}>
                    {u.topicCount} topics
                  </span>
                  <button
                    onClick={() => setOpenId(isOpen ? null : u.id)}
                    aria-label="Toggle"
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: '1px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--muted)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform .2s',
                      transform: isOpen ? 'rotate(90deg)' : 'none',
                    }}
                  >
                    <Icon name="chevron" size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div style={{
                  padding: '4px 18px 20px 64px',
                  borderTop: '1px solid var(--line)',
                  marginTop: 0,
                  display: 'grid',
                  gap: 16,
                }}>
                  <div style={{ paddingTop: 14 }}>
                    <div className="mono" style={{
                      fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--muted)', marginBottom: 10,
                    }}>
                      {u.topicCount} topics · {u.formulaCount} formulas
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
                      {u.topics.map((t, ti) => (
                        <li key={ti} style={{
                          display: 'flex', alignItems: 'baseline', gap: 10,
                          fontSize: 14, color: 'var(--ink-2)',
                        }}>
                          <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', minWidth: 22 }}>
                            {String(ti + 1).padStart(2, '0')}
                          </span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link
                      href={`/learn/${u.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '9px 14px',
                        background: 'var(--accent)', color: '#0A0A0A',
                        borderRadius: 999, fontWeight: 600, fontSize: 13,
                      }}
                    >
                      Study {u.title} <Icon name="arrow" size={13} />
                    </Link>
                    <Link
                      href={`/cheat-sheet#${u.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '9px 14px', border: '1px solid var(--line)',
                        background: 'var(--bg)', borderRadius: 999,
                        fontSize: 13, color: 'var(--ink-2)',
                      }}
                    >
                      <Icon name="spark" size={13} /> Formulas
                    </Link>
                    <Link
                      href={`/bonus`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '9px 14px', border: '1px solid var(--line)',
                        background: 'var(--bg)', borderRadius: 999,
                        fontSize: 13, color: 'var(--ink-2)',
                      }}
                    >
                      <Icon name="chart" size={13} /> Practice exam
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
