// Email sender — uses Resend in production, logs to console in dev/missing key
// Set RESEND_API_KEY in env to enable real emails.
// Set ADMIN_EMAIL and MOD_EMAIL (comma-separated) for routing.

const RESEND_KEY = process.env.RESEND_API_KEY
const APP_URL   = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const FROM      = 'learn·BEE <no-reply@learnbee.app>'

// Recipients
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean)
const MOD_EMAILS   = (process.env.MOD_EMAIL   ?? '').split(',').map(e => e.trim()).filter(Boolean)
const STAFF_EMAILS = [...new Set([...ADMIN_EMAILS, ...MOD_EMAILS])]

interface SendOptions {
  to: string | string[]
  subject: string
  html: string
}

async function sendEmail(opts: SendOptions): Promise<void> {
  if (!RESEND_KEY) {
    console.log('[EMAIL - dev mode]', opts.subject, '→', opts.to)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('[EMAIL ERROR]', err)
  }
}

// ─── Email templates ─────────────────────────────────────────────────────────

export async function emailNewSubmission(data: {
  studentName: string
  university: string
  department: string
  semester: string
  bonusScore: number
  chaptersCompleted: number
  submissionId: string
  studentNote?: string | null
}) {
  if (STAFF_EMAILS.length === 0) return
  await sendEmail({
    to: STAFF_EMAILS,
    subject: `📋 New cert request — ${data.studentName}`,
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="background:#00e676;padding:20px 24px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:20px;color:#000">New Certificate Request</h1>
    <p style="margin:4px 0 0;font-size:14px;color:#003319">learn·BEE platform</p>
  </div>
  <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e5e5">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#666;width:140px">Student</td><td style="font-weight:600">${data.studentName}</td></tr>
      <tr><td style="padding:8px 0;color:#666">University</td><td>${data.university}</td></tr>
      <tr><td style="padding:8px 0;color:#666">Department</td><td>${data.department}</td></tr>
      <tr><td style="padding:8px 0;color:#666">Semester</td><td>${data.semester}</td></tr>
      <tr><td style="padding:8px 0;color:#666">Chapters done</td><td><strong>${data.chaptersCompleted}/19</strong></td></tr>
      <tr><td style="padding:8px 0;color:#666">Bonus score</td><td><strong>${data.bonusScore}%</strong></td></tr>
      ${data.studentNote ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Student note</td><td style="font-style:italic">"${data.studentNote}"</td></tr>` : ''}
    </table>
    <div style="margin-top:20px">
      <a href="${APP_URL}/mod/submissions/${data.submissionId}" 
         style="display:inline-block;background:#0a0a0a;color:#00e676;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">
        Review submission →
      </a>
    </div>
    <p style="margin-top:16px;font-size:12px;color:#999">
      Certificates will be issued only after admin approval.<br>
      Expected turnaround: 3 days to 1 week.
    </p>
  </div>
</div>`,
  })
}

export async function emailApproved(data: {
  to: string
  studentName: string
  finalQuote: string
}) {
  await sendEmail({
    to: data.to,
    subject: `🎓 Your learn·BEE certificate is ready!`,
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="background:#00e676;padding:20px 24px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:20px;color:#000">Your certificate is approved!</h1>
    <p style="margin:4px 0 0;font-size:14px;color:#003319">learn·BEE — Basic Electrical Engineering</p>
  </div>
  <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e5e5">
    <p style="font-size:16px">Congratulations, <strong>${data.studentName}</strong>!</p>
    <p style="font-size:14px;color:#444">Your coursework has been verified. Both your <strong>Completion Certificate</strong> and <strong>Verified Certificate</strong> are now available on your dashboard.</p>
    <div style="margin:20px 0;padding:16px;background:#fff;border-left:3px solid #00e676;border-radius:0 6px 6px 0">
      <p style="margin:0;font-style:italic;color:#333;font-size:15px">"${data.finalQuote}"</p>
    </div>
    <a href="${APP_URL}/dashboard" 
       style="display:inline-block;background:#0a0a0a;color:#00e676;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">
      View my certificates →
    </a>
  </div>
</div>`,
  })
}

export async function emailRejected(data: {
  to: string
  studentName: string
  reason: string
}) {
  await sendEmail({
    to: data.to,
    subject: `learn·BEE — Certificate request needs attention`,
    html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="background:#1a1a1a;padding:20px 24px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:20px;color:#fff">Action required</h1>
    <p style="margin:4px 0 0;font-size:14px;color:#999">learn·BEE certificate request</p>
  </div>
  <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e5e5">
    <p style="font-size:16px">Hi <strong>${data.studentName}</strong>,</p>
    <p style="font-size:14px;color:#444">Your certificate request has been reviewed and needs some changes before it can be approved.</p>
    <div style="margin:16px 0;padding:14px;background:#fff3f3;border-left:3px solid #e53e3e;border-radius:0 6px 6px 0">
      <p style="margin:0;font-size:14px;color:#c53030"><strong>Reviewer note:</strong> ${data.reason}</p>
    </div>
    <p style="font-size:14px;color:#444">Please update your submission and resubmit. Your progress data is still saved.</p>
    <a href="${APP_URL}/dashboard" 
       style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">
      Update my submission →
    </a>
  </div>
</div>`,
  })
}
