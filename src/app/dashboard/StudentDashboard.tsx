'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { curriculum, TOTAL_CHAPTERS } from '@/lib/curriculum'

type RegStatus = 'none' | 'pending' | 'reviewing' | 'approved' | 'rejected'

interface Registration {
  id: string
  status: RegStatus
  studentName: string
  university: string
  department: string
  semester: string
  gender: string
  additionalNote?: string
  rejectionReason?: string
  finalQuote?: string
  chaptersCompleted: number
  bonusScore: number
  submittedAt: string
  approvedAt?: string
}

const STATUS_CONFIG: Record<RegStatus, { label: string; color: string; icon: string; desc: string }> = {
  none:      { label: 'Not submitted', color: '#555',    icon: '○', desc: 'Complete all chapters and the bonus exam to unlock.' },
  pending:   { label: 'Under review',  color: '#f59e0b', icon: '◐', desc: 'Your submission is in the queue. Expect 3 days to 1 week.' },
  reviewing: { label: 'Being reviewed',color: '#3b82f6', icon: '◑', desc: 'A moderator has opened your submission.' },
  approved:  { label: 'Approved',      color: '#00e676', icon: '●', desc: 'Both certificates are ready below.' },
  rejected:  { label: 'Needs changes', color: '#ef4444', icon: '✕', desc: 'See reviewer note and resubmit.' },
}

export default function StudentDashboard() {
  const { user } = useUser()
  const [progress, setProgress]     = useState<any[]>([])
  const [reg, setReg]               = useState<Registration | null>(null)
  const [loading, setLoading]       = useState(true)
  const [formOpen, setFormOpen]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm]             = useState({
    studentName: '', university: '', department: '',
    semester: '1st', gender: 'male', additionalNote: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/progress').then(r => r.json()),
      fetch('/api/cert-registration').then(r => r.json()),
    ]).then(([prog, certData]) => {
      setProgress(prog.progress ?? [])
      setReg(certData.registration)
      if (certData.registration?.status === 'rejected') {
        // pre-fill form for resubmission
        setForm({
          studentName:    certData.registration.studentName,
          university:     certData.registration.university,
          department:     certData.registration.department,
          semester:       certData.registration.semester,
          gender:         certData.registration.gender,
          additionalNote: certData.registration.additionalNote ?? '',
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const completedChapters = progress.filter(p => p.completed).length
  const allDone = completedChapters >= TOTAL_CHAPTERS
  const bonusPassed = progress.some((p: any) => p.bonusPassed)
  const canSubmit = allDone // bonus not strictly required but shown

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/cert-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        const certRes = await fetch('/api/cert-registration')
        const certData = await certRes.json()
        setReg(certData.registration)
        setFormOpen(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const status: RegStatus = reg?.status ?? 'none'
  const cfg = STATUS_CONFIG[status]

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
      Loading…
    </div>
  )

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px', color: '#e5e5e5' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, margin: 0 }}>
          Hi, {user?.firstName ?? 'Student'} 👋
        </h1>
        <p style={{ color: '#888', margin: '6px 0 0' }}>Your learn·BEE dashboard</p>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#141414', borderRadius: 12, padding: 24, marginBottom: 20, border: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>Course progress</span>
          <span style={{ color: '#00e676', fontWeight: 700 }}>{completedChapters} / {TOTAL_CHAPTERS} chapters</span>
        </div>
        <div style={{ background: '#222', borderRadius: 99, height: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, background: '#00e676',
            width: `${Math.round((completedChapters / TOTAL_CHAPTERS) * 100)}%`,
            transition: 'width 0.5s ease'
          }}/>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
          {['DC Circuits', 'AC Circuits', 'Advanced'].map((part, pi) => {
            const chapters = curriculum.filter(c => c.part === pi + 1)
            const done = chapters.filter(c => progress.find(p => p.chapterId === c.id && p.completed)).length
            return (
              <div key={part} style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{part}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: done === chapters.length ? '#00e676' : '#e5e5e5' }}>
                  {done}/{chapters.length}
                </div>
              </div>
            )
          })}
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Bonus exam</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: bonusPassed ? '#00e676' : '#e5e5e5' }}>
              {bonusPassed ? 'Passed ✓' : 'Not yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate status card */}
      <div style={{ background: '#141414', borderRadius: 12, padding: 24, marginBottom: 20, border: `1px solid ${cfg.color}33` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 22, color: cfg.color }}>{cfg.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Certificate status</div>
            <div style={{ color: cfg.color, fontSize: 14, fontWeight: 600 }}>{cfg.label}</div>
          </div>
          {reg?.submittedAt && (
            <div style={{ marginLeft: 'auto', fontSize: 12, color: '#555' }}>
              Submitted {new Date(reg.submittedAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <p style={{ color: '#888', fontSize: 14, margin: '0 0 16px' }}>{cfg.desc}</p>

        {/* Rejection reason */}
        {status === 'rejected' && reg?.rejectionReason && (
          <div style={{ background: '#1a0000', border: '1px solid #ef444433', borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginBottom: 4 }}>Reviewer note</div>
            <p style={{ margin: 0, fontSize: 14, color: '#fca5a5' }}>{reg.rejectionReason}</p>
          </div>
        )}

        {/* Timeline info for pending/reviewing */}
        {(status === 'pending' || status === 'reviewing') && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#666' }}>
            <span>⏱</span>
            <span>Less than 3 days if we're quick — up to a week during busy periods. We'll email you.</span>
          </div>
        )}

        {/* Submit / Resubmit button */}
        {(status === 'none' || status === 'rejected') && canSubmit && (
          <button
            onClick={() => setFormOpen(true)}
            style={{
              marginTop: 4, background: '#00e676', color: '#000', border: 'none',
              borderRadius: 8, padding: '10px 22px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            }}
          >
            {status === 'rejected' ? 'Resubmit registration →' : 'Register for certificate →'}
          </button>
        )}

        {!canSubmit && status === 'none' && (
          <div style={{ fontSize: 13, color: '#555' }}>
            Complete all {TOTAL_CHAPTERS} chapters to unlock registration.
          </div>
        )}
      </div>

      {/* CERTIFICATES — shown only after approval */}
      {status === 'approved' && reg && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Completion Certificate */}
          <CertCard
            title="Completion Certificate"
            subtitle="Course finished"
            color="#00e676"
            quote={reg.finalQuote}
            reg={reg}
            type="completion"
          />
          {/* Verified Certificate */}
          <CertCard
            title="Verified Certificate"
            subtitle="Coursework reviewed"
            color="#3b82f6"
            quote={reg.finalQuote}
            reg={reg}
            type="verified"
          />
        </div>
      )}

      {/* Registration form modal */}
      {formOpen && (
        <RegistrationForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setFormOpen(false)}
          submitting={submitting}
          isResubmit={status === 'rejected'}
        />
      )}
    </div>
  )
}

// ─── Certificate preview card ────────────────────────────────────────────────

function CertCard({ title, subtitle, color, quote, reg, type }: {
  title: string; subtitle: string; color: string;
  quote?: string; reg: Registration; type: 'completion' | 'verified'
}) {
  return (
    <div style={{
      background: '#0d0d0d', borderRadius: 12, border: `1px solid ${color}55`,
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ background: color, padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#000', letterSpacing: 1, textTransform: 'uppercase' }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#000', marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{reg.studentName}</div>
        <div style={{ fontSize: 13, color: '#888' }}>{reg.university} · {reg.department}</div>
        <div style={{ fontSize: 13, color: '#888' }}>{reg.semester} semester</div>
        {quote && (
          <blockquote style={{
            margin: '14px 0 0', padding: '10px 14px',
            borderLeft: `2px solid ${color}`, color: '#aaa', fontSize: 12,
            fontStyle: 'italic',
          }}>
            "{quote}"
          </blockquote>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Link
            href={`/certificate?type=${type}&id=${reg.id}`}
            style={{
              display: 'inline-block', background: color, color: '#000',
              padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            View & Print
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Registration form ────────────────────────────────────────────────────────

function RegistrationForm({ form, onChange, onSubmit, onClose, submitting, isResubmit }: any) {
  const semesters = ['1st','2nd','3rd','4th','5th','6th','7th','8th']

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: '#111', border: '1px solid #222', borderRadius: 14,
        padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              {isResubmit ? 'Update registration' : 'Certificate registration'}
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#666' }}>
              This information will appear on both your certificates.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        {[
          { label: 'Full name', key: 'studentName', placeholder: 'As you want it on the certificate' },
          { label: 'University / Institution', key: 'university', placeholder: 'e.g. CUET, BUET, RUET…' },
          { label: 'Department', key: 'department', placeholder: 'e.g. Electrical & Electronic Engineering' },
        ].map(({ label, key, placeholder }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>{label}</label>
            <input
              type="text"
              value={form[key]}
              onChange={e => onChange({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Semester</label>
            <select
              value={form.semester}
              onChange={e => onChange({ ...form, semester: e.target.value })}
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14,
              }}
            >
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Gender</label>
            <select
              value={form.gender}
              onChange={e => onChange({ ...form, gender: e.target.value })}
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14,
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
            Note to reviewer <span style={{ color: '#555' }}>(optional)</span>
          </label>
          <textarea
            rows={3}
            value={form.additionalNote}
            onChange={e => onChange({ ...form, additionalNote: e.target.value })}
            placeholder="Anything you'd like the reviewer to know…"
            style={{
              width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14,
              resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Processing time note */}
        <div style={{
          background: '#1a1500', border: '1px solid #f59e0b33', borderRadius: 8,
          padding: '12px 14px', marginBottom: 20, fontSize: 13, color: '#d97706',
        }}>
          ⏱ Once submitted, your coursework will be reviewed by our team. Expect a response in <strong>less than 3 days</strong> — though busier periods may take <strong>up to a week or more</strong>. We'll email you when it's done.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, background: 'none', border: '1px solid #333',
              borderRadius: 8, padding: '11px', color: '#888', cursor: 'pointer', fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting || !form.studentName || !form.university || !form.department}
            style={{
              flex: 2, background: '#00e676', color: '#000', border: 'none',
              borderRadius: 8, padding: '11px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Submitting…' : isResubmit ? 'Resubmit →' : 'Submit registration →'}
          </button>
        </div>
      </div>
    </div>
  )
}
