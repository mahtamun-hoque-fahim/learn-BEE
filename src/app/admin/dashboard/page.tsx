'use client'

import { useState, useEffect } from 'react'

type Status = 'pending' | 'reviewing' | 'approved' | 'rejected'

const STATUS_COLOR: Record<Status, string> = {
  pending:   '#f59e0b',
  reviewing: '#3b82f6',
  approved:  '#00e676',
  rejected:  '#ef4444',
}

type View = 'submissions' | 'quotes' | 'settings'

export default function AdminDashboard() {
  const [view, setView]               = useState<View>('submissions')
  const [filter, setFilter]           = useState<Status | 'all'>('pending')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [counts, setCounts]           = useState<any[]>([])
  const [selected, setSelected]       = useState<string | null>(null)
  const [detail, setDetail]           = useState<any | null>(null)
  const [quote, setQuote]             = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [acting, setActing]           = useState(false)
  const [loading, setLoading]         = useState(true)

  // Default quotes state
  const [defQuotes, setDefQuotes]     = useState<any[]>([])
  const [newQuote, setNewQuote]       = useState('')
  const [newGender, setNewGender]     = useState('all')
  const [addingQuote, setAddingQuote] = useState(false)

  const loadSubs = async (f = filter) => {
    setLoading(true)
    const res = await fetch(`/api/mod/submissions?status=${f}`)
    const data = await res.json()
    setSubmissions(data.submissions ?? [])
    setCounts(data.counts ?? [])
    setLoading(false)
  }

  const loadDefQuotes = async () => {
    const res = await fetch('/api/admin/quotes')
    const data = await res.json()
    setDefQuotes(data.quotes ?? [])
  }

  useEffect(() => {
    loadSubs()
    loadDefQuotes()
  }, [filter])

  const openDetail = async (id: string) => {
    setSelected(id)
    setDetail(null)
    setRejectReason('')
    const res = await fetch(`/api/mod/submissions/${id}`)
    const data = await res.json()
    setDetail(data)
    setQuote(data.registration?.adminCustomQuote ?? '')
  }

  const handleApprove = async () => {
    if (!selected) return
    setActing(true)
    await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: selected, adminCustomQuote: quote }),
    })
    setActing(false)
    setSelected(null)
    setDetail(null)
    loadSubs()
  }

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) return
    setActing(true)
    await fetch('/api/admin/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: selected, reason: rejectReason }),
    })
    setActing(false)
    setSelected(null)
    setDetail(null)
    loadSubs()
  }

  const addDefaultQuote = async () => {
    if (!newQuote.trim()) return
    setAddingQuote(true)
    await fetch('/api/admin/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote: newQuote, gender: newGender }),
    })
    setNewQuote('')
    setAddingQuote(false)
    loadDefQuotes()
  }

  const toggleQuote = async (id: string, isActive: boolean) => {
    await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive }),
    })
    loadDefQuotes()
  }

  const deleteQuote = async (id: string) => {
    await fetch(`/api/admin/quotes?id=${id}`, { method: 'DELETE' })
    loadDefQuotes()
  }

  const countFor = (s: Status) => counts.find(c => c.status === s)?.count ?? 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', color: '#e5e5e5', background: '#0a0a0a' }}>

      {/* Sidebar */}
      <div style={{ width: 220, borderRight: '1px solid #1a1a1a', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #1a1a1a', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Admin</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>Dashboard</div>
        </div>

        {([
          { key: 'submissions', label: 'Submissions', badge: countFor('pending') + countFor('reviewing') },
          { key: 'quotes',      label: 'Default quotes',    badge: 0 },
          { key: 'settings',    label: 'Settings',          badge: 0 },
        ] as { key: View; label: string; badge: number }[]).map(({ key, label, badge }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '10px 20px',
              background: view === key ? '#1a1a1a' : 'none',
              border: 'none', color: view === key ? '#fff' : '#666',
              borderLeft: view === key ? '2px solid #f59e0b' : '2px solid transparent',
              cursor: 'pointer', fontSize: 14,
            }}
          >
            <span>{label}</span>
            {badge > 0 && (
              <span style={{ background: '#2a1a00', borderRadius: 99, padding: '1px 8px', fontSize: 12, color: '#f59e0b' }}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── SUBMISSIONS VIEW ─────────────────────────────────────────────── */}
      {view === 'submissions' && (
        <>
          {/* Sub-filter */}
          <div style={{ width: 300, borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a' }}>
              {(['pending','reviewing','approved','rejected','all'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setFilter(s); setSelected(null); setDetail(null) }}
                  style={{
                    flex: 1, padding: '10px 4px', background: filter === s ? '#141414' : 'none',
                    border: 'none', borderBottom: filter === s ? `2px solid ${STATUS_COLOR[s as Status] ?? '#00e676'}` : '2px solid transparent',
                    color: filter === s ? '#fff' : '#555', cursor: 'pointer', fontSize: 11,
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {loading && <div style={{ padding: 20, color: '#444', fontSize: 13 }}>Loading…</div>}
              {submissions.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => openDetail(sub.id)}
                  style={{
                    display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left',
                    background: selected === sub.id ? '#141414' : 'none',
                    border: 'none', borderBottom: '1px solid #111',
                    cursor: 'pointer',
                    borderLeft: selected === sub.id ? '2px solid #f59e0b' : '2px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{sub.studentName}</span>
                    <span style={{ fontSize: 11, color: STATUS_COLOR[sub.status as Status], fontWeight: 700 }}>{sub.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{sub.university}</div>
                  <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
                    Ch {sub.chaptersCompleted}/19 · Bonus {sub.bonusScore}%
                    {sub.hasCustomQuote && <span style={{ color: '#00e676', marginLeft: 8 }}>✓ quote</span>}
                  </div>
                </button>
              ))}
              {!loading && submissions.length === 0 && (
                <div style={{ padding: 24, color: '#333', textAlign: 'center', fontSize: 13 }}>None here</div>
              )}
            </div>
          </div>

          {/* Detail + actions */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            {!selected && (
              <div style={{ color: '#333', textAlign: 'center', marginTop: 80 }}>
                Select a submission
              </div>
            )}
            {selected && !detail && (
              <div style={{ color: '#444', textAlign: 'center', marginTop: 80 }}>Loading…</div>
            )}
            {detail && (
              <div style={{ maxWidth: 600 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{detail.registration.studentName}</div>
                  <div style={{ color: '#666', fontSize: 14 }}>{detail.student?.email}</div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{
                      background: STATUS_COLOR[detail.registration.status as Status] + '22',
                      color: STATUS_COLOR[detail.registration.status as Status],
                      borderRadius: 99, padding: '3px 10px', fontSize: 12, fontWeight: 700,
                    }}>
                      {detail.registration.status}
                    </span>
                  </div>
                </div>

                {/* Info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[
                    { l: 'University', v: detail.registration.university },
                    { l: 'Department', v: detail.registration.department },
                    { l: 'Semester', v: detail.registration.semester },
                    { l: 'Gender', v: detail.registration.gender },
                    { l: 'Chapters', v: `${detail.registration.chaptersCompleted}/19` },
                    { l: 'Bonus', v: `${detail.registration.bonusScore}%` },
                  ].map(({ l, v }) => (
                    <div key={l} style={{ background: '#111', borderRadius: 8, padding: '10px 12px', border: '1px solid #1e1e1e' }}>
                      <div style={{ fontSize: 10, color: '#555', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Student note */}
                {detail.registration.additionalNote && (
                  <div style={{ background: '#0f1000', border: '1px solid #f59e0b33', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 3 }}>Student note</div>
                    <p style={{ margin: 0, fontSize: 13, color: '#d97706', fontStyle: 'italic' }}>"{detail.registration.additionalNote}"</p>
                  </div>
                )}

                {/* Quiz */}
                <div style={{ background: '#111', borderRadius: 8, padding: '12px 14px', marginBottom: 16, border: '1px solid #1e1e1e' }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Performance snapshot</div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
                    <div><span style={{ color: '#555' }}>Quizzes passed: </span><strong>{detail.quizzesSummary.passed}/{detail.quizzesSummary.total}</strong></div>
                    <div><span style={{ color: '#555' }}>Bonus: </span><strong style={{ color: detail.bonusSummary.passed ? '#00e676' : '#ef4444' }}>{detail.bonusSummary.passed ? 'Passed' : 'Failed'}</strong></div>
                  </div>
                </div>

                {/* ACTIONS — only for non-approved */}
                {detail.registration.status !== 'approved' && (
                  <>
                    {/* Quote input */}
                    <div style={{ background: '#111', borderRadius: 8, padding: '14px 16px', marginBottom: 16, border: '1px solid #00e67622' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                        Personal quote
                        <span style={{ fontWeight: 400, color: '#555', marginLeft: 8 }}>— unique to this student</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>
                        Leave blank to auto-pick from the default quote pool.
                      </div>
                      <textarea
                        rows={3}
                        value={quote}
                        onChange={e => setQuote(e.target.value)}
                        placeholder={`Write something personal for ${detail.registration.studentName.split(' ')[0]}…`}
                        style={{
                          width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
                          borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14,
                          resize: 'vertical', boxSizing: 'border-box', outline: 'none',
                        }}
                      />
                    </div>

                    {/* Approve */}
                    <button
                      onClick={handleApprove}
                      disabled={acting}
                      style={{
                        width: '100%', background: '#00e676', color: '#000',
                        border: 'none', borderRadius: 8, padding: '12px',
                        fontWeight: 700, cursor: acting ? 'not-allowed' : 'pointer',
                        fontSize: 15, marginBottom: 10, opacity: acting ? 0.6 : 1,
                      }}
                    >
                      {acting ? 'Processing…' : '✓ Approve — issue both certificates'}
                    </button>

                    {/* Reject */}
                    <div style={{ background: '#1a0000', borderRadius: 8, padding: '14px 16px', border: '1px solid #ef444422' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#ef4444', marginBottom: 6 }}>Reject submission</div>
                      <textarea
                        rows={2}
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Explain what the student needs to fix…"
                        style={{
                          width: '100%', background: '#2a0000', border: '1px solid #ef444433',
                          borderRadius: 8, padding: '10px 12px', color: '#fca5a5', fontSize: 14,
                          resize: 'vertical', boxSizing: 'border-box', outline: 'none',
                          marginBottom: 8,
                        }}
                      />
                      <button
                        onClick={handleReject}
                        disabled={acting || !rejectReason.trim()}
                        style={{
                          background: '#ef4444', color: '#fff', border: 'none',
                          borderRadius: 6, padding: '8px 16px', fontWeight: 600,
                          cursor: acting || !rejectReason.trim() ? 'not-allowed' : 'pointer',
                          fontSize: 13, opacity: !rejectReason.trim() ? 0.5 : 1,
                        }}
                      >
                        Send back to student
                      </button>
                    </div>
                  </>
                )}

                {/* Approved — show final quote */}
                {detail.registration.status === 'approved' && (
                  <div style={{ background: '#001a0a', border: '1px solid #00e67633', borderRadius: 8, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#00e676', marginBottom: 6 }}>Final quote on certificate</div>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#6ee7b7', fontSize: 14 }}>
                      "{detail.registration.finalQuote}"
                    </p>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 8 }}>
                      Approved {detail.registration.approvedAt ? new Date(detail.registration.approvedAt).toLocaleString() : ''}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── DEFAULT QUOTES VIEW ──────────────────────────────────────────── */}
      {view === 'quotes' && (
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>Default quote pool</h2>
          <p style={{ color: '#666', fontSize: 14, margin: '0 0 24px' }}>
            These are used when an admin does not write a personal quote for a student.
            The system picks a random active quote matching the student's gender.
          </p>

          {/* Add new */}
          <div style={{ background: '#111', borderRadius: 10, padding: 20, marginBottom: 24, border: '1px solid #1e1e1e' }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Add quote to pool</div>
            <textarea
              rows={2}
              value={newQuote}
              onChange={e => setNewQuote(e.target.value)}
              placeholder="Enter a motivational quote…"
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14,
                resize: 'vertical', boxSizing: 'border-box', outline: 'none', marginBottom: 10,
              }}
            />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select
                value={newGender}
                onChange={e => setNewGender(e.target.value)}
                style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14,
                }}
              >
                <option value="all">All genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <button
                onClick={addDefaultQuote}
                disabled={addingQuote || !newQuote.trim()}
                style={{
                  background: '#00e676', color: '#000', border: 'none',
                  borderRadius: 8, padding: '8px 18px', fontWeight: 700,
                  cursor: !newQuote.trim() ? 'not-allowed' : 'pointer', fontSize: 14,
                  opacity: !newQuote.trim() ? 0.5 : 1,
                }}
              >
                {addingQuote ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {defQuotes.map(q => (
              <div
                key={q.id}
                style={{
                  background: '#111', borderRadius: 8, padding: '14px 16px',
                  border: `1px solid ${q.isActive ? '#1e1e1e' : '#0a0a0a'}`,
                  opacity: q.isActive ? 1 : 0.45,
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontStyle: 'italic', color: '#ccc' }}>"{q.quote}"</p>
                  <span style={{
                    background: '#1e1e1e', borderRadius: 99, padding: '2px 8px',
                    fontSize: 11, color: '#888',
                  }}>{q.gender}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => toggleQuote(q.id, !q.isActive)}
                    style={{
                      background: q.isActive ? '#1a2a1a' : '#1a1a1a',
                      color: q.isActive ? '#00e676' : '#555',
                      border: '1px solid #2a2a2a', borderRadius: 6,
                      padding: '5px 10px', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    {q.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => deleteQuote(q.id)}
                    style={{
                      background: '#1a0000', color: '#ef4444',
                      border: '1px solid #ef444422', borderRadius: 6,
                      padding: '5px 10px', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {defQuotes.length === 0 && (
              <div style={{ color: '#444', fontSize: 14, textAlign: 'center', padding: 24 }}>
                No default quotes yet. Add some above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SETTINGS VIEW ────────────────────────────────────────────────── */}
      {view === 'settings' && (
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>Settings</h2>
          <p style={{ color: '#666', fontSize: 14, margin: '0 0 24px' }}>Required environment variables for the platform.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'DATABASE_URL', desc: 'Neon pooled connection string' },
              { key: 'DATABASE_URL_UNPOOLED', desc: 'Neon direct (for migrations)' },
              { key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', desc: 'Clerk publishable key' },
              { key: 'CLERK_SECRET_KEY', desc: 'Clerk secret key' },
              { key: 'CLERK_WEBHOOK_SECRET', desc: 'For syncing users from Clerk' },
              { key: 'RESEND_API_KEY', desc: 'Email via Resend (optional — logs to console if missing)' },
              { key: 'ADMIN_EMAIL', desc: 'Comma-separated admin email(s) for notifications' },
              { key: 'MOD_EMAIL', desc: 'Comma-separated moderator email(s) for notifications' },
              { key: 'NEXT_PUBLIC_APP_URL', desc: 'e.g. https://learnbee.app' },
            ].map(({ key, desc }) => (
              <div key={key} style={{ background: '#111', borderRadius: 8, padding: '12px 16px', border: '1px solid #1e1e1e' }}>
                <code style={{ fontSize: 13, color: '#00e676' }}>{key}</code>
                <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
