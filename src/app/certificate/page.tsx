'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Link href="/bonus" className="text-[#888] hover:text-white text-sm mb-6 block">← Back to Exam</Link>
          
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎓</div>
            <h1 className="font-syne text-3xl font-bold mb-2">Generate Certificate</h1>
            <p className="text-[#888] text-sm">Fill in your details to personalize your certificate of completion.</p>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-[#888] mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#00e676] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#888] mb-1.5">University *</label>
              <input
                type="text"
                value={form.university}
                onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                placeholder="e.g. BUET, RUET, CUET..."
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#00e676] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#888] mb-1.5">Department *</label>
              <input
                type="text"
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                placeholder="e.g. Electrical Engineering"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#00e676] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#888] mb-1.5">Semester</label>
                <select
                  value={form.semester}
                  onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e676] transition-colors"
                >
                  {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-1.5">Gender</label>
                <select
                  value={form.gender}
                  onChange={e => setForm(f => ({ ...f, gender: e.target.value as 'male' | 'female' | 'other' }))}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e676] transition-colors"
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
                isValid ? 'bg-[#00e676] text-black hover:bg-[#00b85d]' : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
              }`}
            >
              Generate Certificate 🎓
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Certificate preview
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button onClick={() => setStep('form')} className="text-[#888] hover:text-white text-sm">← Edit Details</button>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="px-5 py-2.5 bg-[#00e676] text-black font-bold rounded-xl hover:bg-[#00b85d] flex items-center gap-2">
              🖨 Print / Save PDF
            </button>
          </div>
        </div>

        {/* THE CERTIFICATE */}
        <div
          ref={certRef}
          className="bg-white text-black rounded-2xl overflow-hidden"
          style={{ fontFamily: 'Georgia, serif', minHeight: '600px' }}
        >
          {/* Top bar */}
          <div style={{ background: '#0a0a0a', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#fff', fontSize: '22px', fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}>
              learn<span style={{ color: '#00e676' }}>·BEE</span>
            </div>
            <div style={{ color: '#00e676', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Certificate of Completion
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '48px 64px', textAlign: 'center', borderLeft: '8px solid #00e676', borderRight: '8px solid #00e676' }}>
            {/* Decorative top */}
            <div style={{ color: '#00b85d', fontSize: '36px', marginBottom: '8px' }}>⚡</div>
            
            <p style={{ color: '#888', fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
              This is to certify that
            </p>

            <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#0a0a0a', marginBottom: '8px', borderBottom: '3px solid #00e676', display: 'inline-block', paddingBottom: '8px' }}>
              {form.name}
            </h1>

            <p style={{ color: '#555', fontSize: '14px', marginTop: '16px', marginBottom: '24px' }}>
              {form.department} · {form.university} · {form.semester} Semester
            </p>

            <p style={{ color: '#333', fontSize: '16px', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 32px' }}>
              has successfully completed the
            </p>

            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0a0a0a', marginBottom: '8px' }}>
              Basic Electrical Engineering
            </h2>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>
              University-Level 4-Credit Theory Course
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px' }}>
              {[
                ['19', 'Chapters'],
                ['Bonus', 'Exam Passed'],
                ['60%+', 'Score'],
              ].map(([val, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#00b85d' }}>{val}</div>
                  <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div style={{
              background: '#f9f9f9',
              border: '1px solid #e0e0e0',
              borderLeft: '4px solid #00e676',
              borderRadius: '8px',
              padding: '16px 24px',
              maxWidth: '500px',
              margin: '0 auto 40px',
              textAlign: 'left'
            }}>
              <p style={{ color: '#555', fontSize: '13px', fontStyle: 'italic', lineHeight: 1.7 }}>
                &ldquo;{quote}&rdquo;
              </p>
            </div>

            {/* Footer line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '24px', borderTop: '1px solid #eee' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Date Issued</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{today}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Based on Sadiku 5th Ed. & Boylestad ICA
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚡</div>
                <div style={{ fontSize: '12px', color: '#888' }}>learn·BEE Platform</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ background: '#0a0a0a', padding: '12px 40px', textAlign: 'center' }}>
            <div style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace' }}>
              ISSUED BY LEARN·BEE · VERIFIED COMPLETION · {new Date().getFullYear()}
            </div>
          </div>
        </div>

        <p className="text-center text-[#555] text-sm mt-4 print:hidden">
          Use Ctrl+P (or ⌘+P) to save as PDF. Set paper to A4 landscape for best results.
        </p>
      </div>
    </div>
  )
}
