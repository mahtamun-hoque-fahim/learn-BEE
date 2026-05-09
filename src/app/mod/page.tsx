'use client'

import { useState, useEffect } from 'react'

type Status = 'pending' | 'reviewing' | 'approved' | 'rejected'

interface Submission {
  id: string
  studentName: string
  university: string
  department: string
  semester: string
  gender: string
  status: Status
  submittedAt: string
  chaptersCompleted: number
  bonusScore: number
  hasCustomQuote: boolean
  studentEmail: string
  additionalNote?: string
}

interface StatusCounts { status: Status; count: number }[]

const STATUS_COLOR: Record<Status, string> = {
  pending:   '#f59e0b',
  reviewing: '#3b82f6',
  approved:  '#00e676',
  rejected:  '#ef4444',
}

export default function ModDashboard() {
  const [filter, setFilter]           = useState<Status | 'all'>('pending')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [counts, setCounts]           = useState<any[]>([])
  const [selected, setSelected]       = useState<string | null>(null)
  const [detail, setDetail]           = useState<any | null>(null)
  const [quote, setQuote]             = useState('')
  const [savingQuote, setSavingQuote] = useState(false)
  const [loading, setLoading]         = useState(true)

  const load = async (f = filter) => {
    setLoading(true)
    const res = await fetch(`/api/mod/submissions?status=${f}`)
    const data = await res.json()
    setSubmissions(data.submissions ?? [])
    setCounts(data.counts ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const openDetail = async (id: string) => {
    setSelected(id)
    setDetail(null)
    const res = await fetch(`/api/mod/submissions/${id}`)
    const data = await res.json()
    setDetail(data)
    setQuote(data.registration?.adminCustomQuote ?? '')
  }

  const saveQuote = async () => {
    if (!selected) return
    setSavingQuote(true)
    await fetch(`/api/mod/submissions/${selected}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminCustomQuote: quote }),
    })
    setSavingQuote(false)
    load()
  }

  const countFor = (s: Status) => counts.find(c => c.status === s)?.count ?? 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', color: '#e5e5e5', background: '#0a0a0a' }}>

      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid #1a1a1a', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #1a1a1a', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Moderator</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>Submissions</div>
        </div>
        {(['pending','reviewing','approved','rejected','all'] as const).map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setSelected(null); setDetail(null) }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 20px', background: filter === s ? '#1a1a1a' : 'none',
              border: 'none', color: filter === s ? '#fff' : '#666', cursor: 'pointer',
              fontSize: 14, textTransform: 'capitalize', borderLeft: filter === s ? `2px solid ${STATUS_COLOR[s as Status] ?? '#00e676'}` : '2px solid transparent',
            }}
          >
            <span>{s}</span>
            {s !== 'all' && (
              <span style={{
                background: '#1e1e1e', borderRadius: 99, padding: '1px 8px',
                fontSize: 12, color: STATUS_COLOR[s as Status],
              }}>{countFor(s as Status)}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ width: 320, borderRight: '1px solid #1a1a1a', overflowY: 'auto' }}>
        <div style={{ padding: '18px 16px', borderBottom: '1px solid #1a1a1a', fontSize: 13, color: '#555' }}>
          {loading ? 'Loading…' : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''}`}
        </div>
        {submissions.map(sub => (
          <button
            key={sub.id}
            onClick={() => openDetail(sub.id)}
            style={{
              display: 'block', width: '100%', padding: '16px', textAlign: 'left',
              background: selected === sub.id ? '#141414' : 'none',
              border: 'none', borderBottom: '1px solid #1a1a1a',
              cursor: 'pointer',
              borderLeft: selected === sub.id ? `2px solid #00e676` : '2px solid transparent',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{sub.studentName}</span>
              <span style={{ fontSize: 11, color: STATUS_COLOR[sub.status], fontWeight: 700 }}>{sub.status}</span>
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>{sub.university}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: '#555' }}>
              <span>Ch: {sub.chaptersCompleted}/19</span>
              <span>Bonus: {sub.bonusScore}%</span>
              {sub.hasCustomQuote && <span style={{ color: '#00e676' }}>✓ quote</span>}
            </div>
          </button>
        ))}
        {!loading && submissions.length === 0 && (
          <div style={{ padding: 24, color: '#444', fontSize: 14, textAlign: 'center' }}>
            No submissions here
          </div>
        )}
      </div>

      {/* Detail pane */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {!selected && (
          <div style={{ color: '#444', textAlign: 'center', marginTop: 80, fontSize: 15 }}>
            Select a submission to review
          </div>
        )}

        {selected && !detail && (
          <div style={{ color: '#555', textAlign: 'center', marginTop: 80 }}>Loading…</div>
        )}

        {detail && (
          <div style={{ maxWidth: 640 }}>
            {/* Student info */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{detail.registration.studentName}</div>
              <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>{detail.student?.email}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'University', value: detail.registration.university },
                { label: 'Department', value: detail.registration.department },
                { label: 'Semester', value: detail.registration.semester },
                { label: 'Gender', value: detail.registration.gender },
                { label: 'Chapters done', value: `${detail.registration.chaptersCompleted} / 19` },
                { label: 'Bonus score', value: `${detail.registration.bonusScore}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#111', borderRadius: 8, padding: '12px 14px', border: '1px solid #1e1e1e' }}>
                  <div style={{ fontSize: 11, color: '#555', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Student note */}
            {detail.registration.additionalNote && (
              <div style={{ background: '#0f1000', border: '1px solid #f59e0b33', borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 4 }}>Student note</div>
                <p style={{ margin: 0, fontSize: 14, color: '#d97706', fontStyle: 'italic' }}>
                  "{detail.registration.additionalNote}"
                </p>
              </div>
            )}

            {/* Quiz summary */}
            <div style={{ background: '#111', borderRadius: 8, padding: '14px 16px', marginBottom: 20, border: '1px solid #1e1e1e' }}>
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Quiz performance</div>
              <div style={{ display: 'flex', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#555' }}>Attempts</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{detail.quizzesSummary.total}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#555' }}>Passed</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#00e676' }}>{detail.quizzesSummary.passed}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#555' }}>Bonus passed</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: detail.bonusSummary.passed ? '#00e676' : '#ef4444' }}>
                    {detail.bonusSummary.passed ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#555' }}>Best bonus</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{detail.bonusSummary.best}%</div>
                </div>
              </div>
            </div>

            {/* Custom quote input */}
            {detail.registration.status !== 'approved' && (
              <div style={{ background: '#111', borderRadius: 8, padding: '16px', marginBottom: 20, border: '1px solid #1e1e1e' }}>
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
                  Personal quote for {detail.registration.studentName.split(' ')[0]}
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>
                  Write a custom quote to appear on their certificates. Leave blank to use a default from the quote pool.
                </div>
                <textarea
                  rows={3}
                  value={quote}
                  onChange={e => setQuote(e.target.value)}
                  placeholder="e.g. Your dedication to mastering circuits reflects the engineer you are becoming…"
                  style={{
                    width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
                    borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14,
                    resize: 'vertical', boxSizing: 'border-box', outline: 'none',
                  }}
                />
                <button
                  onClick={saveQuote}
                  disabled={savingQuote}
                  style={{
                    marginTop: 8, background: '#1e3a2a', color: '#00e676',
                    border: '1px solid #00e67633', borderRadius: 6, padding: '8px 16px',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {savingQuote ? 'Saving…' : 'Save quote draft'}
                </button>
              </div>
            )}

            {/* Approved state — show final quote */}
            {detail.registration.status === 'approved' && detail.registration.finalQuote && (
              <div style={{ background: '#001a0a', border: '1px solid #00e67633', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#00e676', marginBottom: 6 }}>Quote on certificate</div>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#6ee7b7', fontSize: 14 }}>
                  "{detail.registration.finalQuote}"
                </p>
              </div>
            )}

            {/* Action note for mods */}
            {detail.registration.status !== 'approved' && (
              <div style={{ color: '#555', fontSize: 13, padding: '12px 0', borderTop: '1px solid #1a1a1a' }}>
                ℹ️ Save your quote draft here. Final approval and rejection are admin-only actions.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
