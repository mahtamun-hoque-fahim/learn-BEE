'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/design/icons'

type Step = 'form' | 'preview'

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

const DEFAULT_QUOTES = {
  male: [
    'The measure of intelligence is the ability to change. – Albert Einstein',
    'An engineer is a person who solves problems you didn\'t know you had in ways you don\'t understand.',
    'Physics is imagination in a straitjacket. – John Maddox',
    'The science of today is the technology of tomorrow. – Edward Teller',
  ],
  female: [
    'Science is not a boy\'s game, it\'s not a girl\'s game. It\'s everyone\'s game. – Nichelle Nichols',
    'The most courageous act is still to think for yourself. – Coco Chanel',
    'One important key to success is self-confidence. An important key to self-confidence is preparation.',
    'I have not failed. I\'ve just found 10,000 ways that won\'t work. – Thomas Edison',
  ],
  other: [
    'The beautiful thing about learning is that nobody can take it away from you. – B.B. King',
    'Education is the passport to the future. – Malcolm X',
    'The roots of education are bitter, but the fruit is sweet. – Aristotle',
    'Success is not the key to happiness. Happiness is the key to success.',
  ],
}

interface FormData {
  name: string
  university: string
  department: string
  semester: string
  gender: 'male' | 'female' | 'other'
}

export default function CertificatePage() {
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<FormData>({
    name: '', university: '', department: '', semester: '1st', gender: 'male'
  })
  const [quote, setQuote] = useState('')
  const certRef = useRef<HTMLDivElement>(null)

  const handleSubmit = () => {
    const quotes = DEFAULT_QUOTES[form.gender]
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(selectedQuote)
    setStep('preview')
  }

  const handlePrint = () => {
    window.print()
  }

  const isValid = form.name.trim() && form.university.trim() && form.department.trim()

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Link href="/bonus" className="text-[var(--muted)] hover:text-[var(--ink)] text-sm mb-6 inline-flex items-center gap-2">
            <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span> Back to exam
          </Link>

          <div className="text-center mb-8">
            <div style={{ display: 'inline-grid', placeItems: 'center', width: 52, height: 52, borderRadius: 14, background: 'var(--mint-soft)', color: 'var(--accent)', border: '1px solid var(--mint-line)', marginBottom: 14 }}>
              <Icon name="check" size={26} />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Generate certificate</h1>
            <p className="text-[var(--muted)] text-sm">Fill in your details to personalize your certificate of completion.</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-4 py-2.5 text-[var(--ink)] placeholder-[var(--dim)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-1.5">University *</label>
              <input
                type="text"
                value={form.university}
                onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                placeholder="e.g. BUET, RUET, CUET..."
                className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-4 py-2.5 text-[var(--ink)] placeholder-[var(--dim)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-1.5">Department *</label>
              <input
                type="text"
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                placeholder="e.g. Electrical Engineering"
                className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-4 py-2.5 text-[var(--ink)] placeholder-[var(--dim)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1.5">Semester</label>
                <select
                  value={form.semester}
                  onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                  className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                >
                  {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1.5">Gender</label>
                <select
                  value={form.gender}
                  onChange={e => setForm(f => ({ ...f, gender: e.target.value as 'male' | 'female' | 'other' }))}
                  className="w-full bg-[var(--bg)] border border-[var(--line-2)] rounded-lg px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`w-full py-3 rounded-xl font-bold transition-all mt-2 ${
                isValid ? 'bg-[var(--accent)] text-[var(--on-mint)] hover:bg-[var(--accent-2)]' : 'bg-[var(--surface-2)] text-[var(--dim)] cursor-not-allowed'
              }`}
            >
              Generate certificate
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Certificate preview
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button onClick={() => setStep('form')} className="text-[var(--muted)] hover:text-[var(--ink)] text-sm inline-flex items-center gap-2">
            <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span> Edit details
          </button>
          <button onClick={handlePrint} className="btn-primary">
            <Icon name="download" size={15} /> Print / Save PDF
          </button>
        </div>

        {/* THE CERTIFICATE — fixed-design printable artifact (theme-independent) */}
        <div
          ref={certRef}
          className="rounded-2xl overflow-hidden"
          style={{ background: '#ffffff', color: '#0F1311', fontFamily: 'Georgia, serif', minHeight: '600px', border: '1px solid #E3E7E5' }}
        >
          {/* Top bar */}
          <div style={{ background: '#0B0F0D', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#F3F6F4', fontSize: '22px', fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}>
              learn<span style={{ color: '#12B981' }}>BEE</span>
            </div>
            <div style={{ color: '#12B981', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Certificate of Completion
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '48px 64px', textAlign: 'center', borderLeft: '8px solid #12B981', borderRight: '8px solid #12B981' }}>
            <div style={{ color: '#0E9E5C', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
              <Icon name="spark" size={36} />
            </div>

            <p style={{ color: '#5E6B65', fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
              This is to certify that
            </p>

            <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#0F1311', marginBottom: '8px', borderBottom: '3px solid #12B981', display: 'inline-block', paddingBottom: '8px' }}>
              {form.name}
            </h1>

            <p style={{ color: '#5E6B65', fontSize: '14px', marginTop: '16px', marginBottom: '24px' }}>
              {form.department} · {form.university} · {form.semester} Semester
            </p>

            <p style={{ color: '#3A433E', fontSize: '16px', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 32px' }}>
              has successfully completed the
            </p>

            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0F1311', marginBottom: '8px' }}>
              Basic Electrical Engineering
            </h2>
            <p style={{ color: '#5E6B65', fontSize: '14px', marginBottom: '32px' }}>
              University-Level 3-Credit Theory Course
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px' }}>
              {[
                ['6', 'Chapters'],
                ['Bonus', 'Exam passed'],
                ['60%+', 'Score'],
              ].map(([val, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#0E9E5C' }}>{val}</div>
                  <div style={{ fontSize: '11px', color: '#5E6B65', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div style={{ background: '#F6F8F7', border: '1px solid #E3E7E5', borderLeft: '4px solid #12B981', borderRadius: '8px', padding: '16px 24px', maxWidth: '500px', margin: '0 auto 40px', textAlign: 'left' }}>
              <p style={{ color: '#3A433E', fontSize: '13px', fontStyle: 'italic', lineHeight: 1.7 }}>
                &ldquo;{quote}&rdquo;
              </p>
            </div>

            {/* Footer line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '24px', borderTop: '1px solid #E3E7E5' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', color: '#5E6B65', marginBottom: '4px' }}>Date issued</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{today}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#98A29C', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Based on Sadiku 5th Ed. &amp; Boylestad ICA
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#0E9E5C', marginBottom: '4px', display: 'flex', justifyContent: 'flex-end' }}><Icon name="spark" size={22} /></div>
                <div style={{ fontSize: '12px', color: '#5E6B65' }}>learnBEE platform</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ background: '#0B0F0D', padding: '12px 40px', textAlign: 'center' }}>
            <div style={{ color: '#8A938E', fontSize: '11px', fontFamily: 'monospace' }}>
              ISSUED BY LEARNBEE · VERIFIED COMPLETION · {new Date().getFullYear()}
            </div>
          </div>
        </div>

        <p className="text-center text-[var(--dim)] text-sm mt-4 print:hidden">
          Use Ctrl+P (or ⌘+P) to save as PDF. Set paper to A4 landscape for best results.
        </p>
      </div>
    </div>
  )
}
