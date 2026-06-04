'use client'
import { Icon } from '@/components/design/icons'

import { useState } from 'react'
import Link from 'next/link'

type AdminSection = 'overview' | 'quotes' | 'questions' | 'settings'

interface Quote {
  id: string
  gender: string
  semester: string
  quote: string
  active: boolean
}

const defaultQuotes: Quote[] = [
  { id: '1', gender: 'male', semester: 'all', quote: 'The measure of intelligence is the ability to change. – Albert Einstein', active: true },
  { id: '2', gender: 'female', semester: 'all', quote: 'Science is not a boy\'s game, it\'s not a girl\'s game. – Nichelle Nichols', active: true },
  { id: '3', gender: 'other', semester: 'all', quote: 'The beautiful thing about learning is that nobody can take it away from you.', active: true },
  { id: '4', gender: 'male', semester: '1st', quote: 'Every expert was once a beginner.', active: true },
  { id: '5', gender: 'female', semester: '1st', quote: 'She believed she could, so she did.', active: true },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [section, setSection] = useState<AdminSection>('overview')
  const [quotes, setQuotes] = useState<Quote[]>(defaultQuotes)
  const [newQuote, setNewQuote] = useState({ gender: 'all', semester: 'all', quote: '' })
  const [error, setError] = useState('')

  const handleLogin = () => {
    // In production this would verify against ADMIN_PASSWORD env var via API
    if (password === 'admin123') {
      setAuthed(true)
    } else {
      setError('Incorrect password')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
            <p className="text-[var(--muted)] text-sm mt-1">learn·BEE Platform Management</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div>
              <label className="text-sm text-[var(--muted)] block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                placeholder="Enter admin password"
              />
              {error && <p className="text-[var(--rose)] text-xs mt-1">{error}</p>}
            </div>
            <button onClick={handleLogin} className="w-full py-2.5 bg-[var(--accent)] text-[var(--on-mint)] font-bold rounded-lg hover:bg-[var(--accent-2)]">
              Login
            </button>
            <p className="text-[var(--dim)] text-xs text-center">Default: admin123 (change in .env)</p>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-[var(--muted)] hover:text-[var(--ink)] text-sm">Back to site</Link>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Students', value: '—', icon: 'user' },
    { label: 'Certs Issued', value: '—', icon: 'check' },
    { label: 'Avg Score', value: '—', icon: 'chart' },
    { label: 'Active Quotes', value: quotes.filter(q => q.active).length, icon: 'chat' },
  ]

  const navItems: { id: AdminSection; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'chart' },
    { id: 'quotes', label: 'Certificate Quotes', icon: 'chat' },
    { id: 'questions', label: 'Question Bank', icon: '❓' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const addQuote = () => {
    if (!newQuote.quote.trim()) return
    setQuotes(prev => [...prev, {
      id: Date.now().toString(),
      gender: newQuote.gender,
      semester: newQuote.semester,
      quote: newQuote.quote,
      active: true,
    }])
    setNewQuote({ gender: 'all', semester: 'all', quote: '' })
  }

  const toggleQuote = (id: string) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, active: !q.active } : q))
  }

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id))
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[var(--line)] bg-[var(--bg-2)] flex flex-col">
        <div className="p-5 border-b border-[var(--line)]">
          <div className="font-display font-bold text-lg">learn<span className="text-[var(--accent)]">·BEE</span></div>
          <div className="text-[var(--dim)] text-xs mt-0.5">Admin Panel</div>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                section === item.id
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                  : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--line)]">
          <button
            onClick={() => setAuthed(false)}
            className="w-full px-3 py-2 text-xs text-[var(--dim)] hover:text-[var(--rose)] rounded-lg hover:bg-[var(--rose)]/10 transition-colors"
          >
            Logout
          </button>
          <Link href="/" className="block w-full px-3 py-2 text-xs text-[var(--dim)] hover:text-[var(--ink)] rounded-lg text-center mt-1">
            View Site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {section === 'overview' && (
          <div>
            <h1 className="font-display text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5">
                  <div className="mb-2" style={{ color: 'var(--accent)' }}><Icon name={s.icon} size={22} /></div>
                  <div className="font-display text-2xl font-bold text-[var(--accent)]">{s.value}</div>
                  <div className="text-[var(--muted)] text-sm">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Platform Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'Chapters available', value: '6 / 6', ok: true },
                  { label: 'Question bank', value: '142 questions', ok: true },
                  { label: 'Simulators', value: '6 active', ok: true },
                  { label: 'Database', value: 'Connect Neon DB via env vars', ok: false },
                  { label: 'Auth (Clerk)', value: 'Configure CLERK_* env vars', ok: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--surface-2)] last:border-0">
                    <span className="text-sm text-[var(--muted)]">{item.label}</span>
                    <span className={`text-sm font-mono ${item.ok ? 'text-[var(--accent)]' : 'text-[var(--amber)]'}`}>
                      {item.ok ? '' : '⚠ '}{item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'quotes' && (
          <div>
            <h1 className="font-display text-2xl font-bold mb-2">Certificate Quotes</h1>
            <p className="text-[var(--muted)] text-sm mb-6">These quotes appear on certificates based on the student&apos;s gender and semester.</p>

            {/* Add new quote */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 mb-6">
              <h3 className="font-display font-semibold mb-4">Add New Quote</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-[var(--muted)] block mb-1">Gender</label>
                  <select
                    value={newQuote.gender}
                    onChange={e => setNewQuote(q => ({ ...q, gender: e.target.value }))}
                    className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-3 py-2 text-sm text-[var(--ink)]"
                  >
                    <option value="all">All genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)] block mb-1">Semester</label>
                  <select
                    value={newQuote.semester}
                    onChange={e => setNewQuote(q => ({ ...q, semester: e.target.value }))}
                    className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-3 py-2 text-sm text-[var(--ink)]"
                  >
                    <option value="all">All semesters</option>
                    {['1st','2nd','3rd','4th','5th','6th','7th','8th'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                value={newQuote.quote}
                onChange={e => setNewQuote(q => ({ ...q, quote: e.target.value }))}
                placeholder="Enter motivational quote..."
                rows={2}
                className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-3 py-2 text-sm text-[var(--ink)] mb-3 focus:border-[var(--accent)] focus:outline-none"
              />
              <button onClick={addQuote} className="px-5 py-2 bg-[var(--accent)] text-[var(--on-mint)] font-semibold rounded-lg text-sm hover:bg-[var(--accent-2)]">
                + Add Quote
              </button>
            </div>

            {/* Quotes list */}
            <div className="space-y-2">
              {quotes.map(q => (
                <div key={q.id} className={`bg-[var(--surface)] border rounded-xl p-4 flex items-start gap-4 ${q.active ? 'border-[var(--line)]' : 'border-[var(--surface-2)] opacity-50'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        q.gender === 'male' ? 'bg-[var(--blue)]/15 text-[var(--blue)]' :
                        q.gender === 'female' ? 'bg-pink-900/30 text-pink-400' :
                        'bg-purple-900/30 text-purple-400'
                      }`}>{q.gender}</span>
                      <span className="text-xs text-[var(--dim)]">{q.semester} semester</span>
                    </div>
                    <p className="text-sm text-[var(--ink-2)] italic">&ldquo;{q.quote}&rdquo;</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggleQuote(q.id)} className={`text-xs px-2 py-1 rounded border ${q.active ? 'border-[var(--accent)]/35 text-[var(--accent)]' : 'border-[var(--line-2)] text-[var(--dim)]'}`}>
                      {q.active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => deleteQuote(q.id)} className="text-xs px-2 py-1 rounded border border-[var(--rose)]/40 text-[var(--rose)] hover:bg-[var(--rose)]/12">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'questions' && (
          <div>
            <h1 className="font-display text-2xl font-bold mb-2">Question Bank</h1>
            <p className="text-[var(--muted)] text-sm mb-6">142 questions across 6 chapters. Sourced from Sadiku, Boylestad, and Tikle&apos;s Academy.</p>
            
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5">
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div><div className="text-2xl font-bold text-[var(--accent)]">142</div><div className="text-xs text-[var(--muted)]">Total Questions</div></div>
                <div><div className="text-2xl font-bold text-[var(--amber)]">MCQ / T-F / Numerical</div><div className="text-xs text-[var(--muted)]">Question Types</div></div>
                <div><div className="text-2xl font-bold text-[var(--blue)]">Easy / Medium / Hard</div><div className="text-xs text-[var(--muted)]">Difficulty Levels</div></div>
              </div>
              <p className="text-[var(--dim)] text-sm text-center border-t border-[var(--surface-2)] pt-4">
                Questions are defined in <code className="bg-[var(--bg)] px-2 py-0.5 rounded text-[var(--accent)]">src/lib/questions.ts</code>. Add new questions there to expand the bank.
              </p>
            </div>
          </div>
        )}

        {section === 'settings' && (
          <div>
            <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
            <div className="space-y-4">
              {[
                { key: 'ADMIN_PASSWORD', desc: 'Admin panel password (set in .env)', type: 'password' },
                { key: 'DATABASE_URL', desc: 'Neon PostgreSQL connection string', type: 'password' },
                { key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', desc: 'Clerk auth publishable key', type: 'text' },
                { key: 'CLERK_SECRET_KEY', desc: 'Clerk auth secret key', type: 'password' },
              ].map(s => (
                <div key={s.key} className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4">
                  <div className="font-mono text-sm text-[var(--accent)] mb-1">{s.key}</div>
                  <div className="text-[var(--muted)] text-xs mb-2">{s.desc}</div>
                  <div className="bg-[var(--bg)] border border-[var(--surface-2)] rounded px-3 py-2 text-xs text-[var(--dim)] font-mono">
                    Set in Vercel Dashboard Environment Variables
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
