'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-client'
import { BeeMark } from '@/components/design/icons'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await signUp.email({ name, email, password })
    setLoading(false)
    if (error) { setError(error.message ?? 'Could not create account.'); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <BeeMark size={26} /><span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18 }}>learnBEE</span>
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Create your account</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Free for the BGCTUB BEE course and everyone after.</p>

        <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
          <input className="auth-input" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          <input className="auth-input" type="password" placeholder="Password (min 8 characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
          {error && <div style={{ color: 'var(--rose)', fontSize: 13 }}>{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 20 }}>
          Already have an account? <Link href="/sign-in" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
      <style>{`.auth-input{width:100%;background:var(--surface);border:1px solid var(--line-2);border-radius:12px;padding:13px 16px;font-size:14px;color:var(--ink)}
        .auth-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--mint-soft)}
        .auth-input::placeholder{color:var(--dim)}`}</style>
    </main>
  )
}
