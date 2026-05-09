'use client'

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="font-syne text-2xl font-bold">Admin Panel</h1>
            <p className="text-[#888] text-sm mt-1">learn·BEE Platform Management</p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
            <div>
              <label className="text-sm text-[#888] block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e676]"
                placeholder="Enter admin password"
              />
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
            <button onClick={handleLogin} className="w-full py-2.5 bg-[#00e676] text-black font-bold rounded-lg hover:bg-[#00b85d]">
              Login
            </button>
            <p className="text-[#555] text-xs text-center">Default: admin123 (change in .env)</p>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-[#888] hover:text-white text-sm">← Back to site</Link>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Students', value: '—', icon: '👥' },
    { label: 'Certs Issued', value: '—', icon: '🎓' },
    { label: 'Avg Score', value: '—', icon: '📊' },
    { label: 'Active Quotes', value: quotes.filter(q => q.active).length, icon: '💬' },
  ]

  const navItems: { id: AdminSection; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'quotes', label: 'Certificate Quotes', icon: '💬' },
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
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[#222] bg-[#0d0d0d] flex flex-col">
        <div className="p-5 border-b border-[#222]">
          <div className="font-syne font-bold text-lg">learn<span className="text-[#00e676]">·BEE</span></div>
          <div className="text-[#555] text-xs mt-0.5">Admin Panel</div>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                section === item.id
                  ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20'
                  : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[#222]">
          <button
            onClick={() => setAuthed(false)}
            className="w-full px-3 py-2 text-xs text-[#555] hover:text-red-400 rounded-lg hover:bg-red-900/10 transition-colors"
          >
            Logout
          </button>
          <Link href="/" className="block w-full px-3 py-2 text-xs text-[#555] hover:text-white rounded-lg text-center mt-1">
            View Site →
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {section === 'overview' && (
          <div>
            <h1 className="font-syne text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="bg-[#111] border border-[#222] rounded-xl p-5">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-syne text-2xl font-bold text-[#00e676]">{s.value}</div>
                  <div className="text-[#888] text-sm">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#111] border border-[#222] rounded-xl p-6">
              <h3 className="font-syne font-semibold mb-4">Platform Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'Chapters available', value: '19 / 19', ok: true },
                  { label: 'Question bank', value: '200+ questions', ok: true },
                  { label: 'Simulators', value: '12 active', ok: true },
                  { label: 'Database', value: 'Connect Neon DB via env vars', ok: false },
                  { label: 'Auth (Clerk)', value: 'Configure CLERK_* env vars', ok: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                    <span className="text-sm text-[#888]">{item.label}</span>
                    <span className={`text-sm font-mono ${item.ok ? 'text-green-400' : 'text-yellow-400'}`}>
                      {item.ok ? '✓ ' : '⚠ '}{item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'quotes' && (
          <div>
            <h1 className="font-syne text-2xl font-bold mb-2">Certificate Quotes</h1>
            <p className="text-[#888] text-sm mb-6">These quotes appear on certificates based on the student&apos;s gender and semester.</p>

            {/* Add new quote */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-5 mb-6">
              <h3 className="font-syne font-semibold mb-4">Add New Quote</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-[#888] block mb-1">Gender</label>
                  <select
                    value={newQuote.gender}
                    onChange={e => setNewQuote(q => ({ ...q, gender: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="all">All genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#888] block mb-1">Semester</label>
                  <select
                    value={newQuote.semester}
                    onChange={e => setNewQuote(q => ({ ...q, semester: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white"
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
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white mb-3 focus:border-[#00e676] focus:outline-none"
              />
              <button onClick={addQuote} className="px-5 py-2 bg-[#00e676] text-black font-semibold rounded-lg text-sm hover:bg-[#00b85d]">
                + Add Quote
              </button>
            </div>

            {/* Quotes list */}
            <div className="space-y-2">
              {quotes.map(q => (
                <div key={q.id} className={`bg-[#111] border rounded-xl p-4 flex items-start gap-4 ${q.active ? 'border-[#222]' : 'border-[#1a1a1a] opacity-50'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        q.gender === 'male' ? 'bg-blue-900/30 text-blue-400' :
                        q.gender === 'female' ? 'bg-pink-900/30 text-pink-400' :
                        'bg-purple-900/30 text-purple-400'
                      }`}>{q.gender}</span>
                      <span className="text-xs text-[#555]">{q.semester} semester</span>
                    </div>
                    <p className="text-sm text-[#ccc] italic">&ldquo;{q.quote}&rdquo;</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggleQuote(q.id)} className={`text-xs px-2 py-1 rounded border ${q.active ? 'border-green-800 text-green-400' : 'border-[#333] text-[#555]'}`}>
                      {q.active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => deleteQuote(q.id)} className="text-xs px-2 py-1 rounded border border-red-900 text-red-400 hover:bg-red-900/20">
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
            <h1 className="font-syne text-2xl font-bold mb-2">Question Bank</h1>
            <p className="text-[#888] text-sm mb-6">200+ questions across 19 chapters. Sourced from Sadiku, Boylestad, and Tikle&apos;s Academy.</p>
            
            <div className="bg-[#111] border border-[#222] rounded-xl p-5">
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div><div className="text-2xl font-bold text-[#00e676]">200+</div><div className="text-xs text-[#888]">Total Questions</div></div>
                <div><div className="text-2xl font-bold text-yellow-400">MCQ / T-F / Numerical</div><div className="text-xs text-[#888]">Question Types</div></div>
                <div><div className="text-2xl font-bold text-blue-400">Easy / Medium / Hard</div><div className="text-xs text-[#888]">Difficulty Levels</div></div>
              </div>
              <p className="text-[#555] text-sm text-center border-t border-[#1a1a1a] pt-4">
                Questions are defined in <code className="bg-[#0a0a0a] px-2 py-0.5 rounded text-[#00e676]">src/lib/questions.ts</code>. Add new questions there to expand the bank.
              </p>
            </div>
          </div>
        )}

        {section === 'settings' && (
          <div>
            <h1 className="font-syne text-2xl font-bold mb-6">Settings</h1>
            <div className="space-y-4">
              {[
                { key: 'ADMIN_PASSWORD', desc: 'Admin panel password (set in .env)', type: 'password' },
                { key: 'DATABASE_URL', desc: 'Neon PostgreSQL connection string', type: 'password' },
                { key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', desc: 'Clerk auth publishable key', type: 'text' },
                { key: 'CLERK_SECRET_KEY', desc: 'Clerk auth secret key', type: 'password' },
              ].map(s => (
                <div key={s.key} className="bg-[#111] border border-[#222] rounded-xl p-4">
                  <div className="font-mono text-sm text-[#00e676] mb-1">{s.key}</div>
                  <div className="text-[#888] text-xs mb-2">{s.desc}</div>
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded px-3 py-2 text-xs text-[#555] font-mono">
                    Set in Vercel Dashboard → Environment Variables
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
