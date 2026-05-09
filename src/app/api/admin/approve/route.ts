import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { getDb } from '@/lib/db'
import { certRegistrations, defaultQuotes, users, emailLog } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { emailApproved } from '@/lib/email/send'

// POST /api/admin/approve
// Body: { registrationId, adminCustomQuote? }
//
// Quote resolution:
//   1. adminCustomQuote in body (admin typed it right now)
//   2. adminCustomQuote already saved on the record (mod saved a draft earlier)
//   3. Random active defaultQuote filtered by student gender
//   4. Hardcoded fallback (should never reach this)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAdmin()
    const db = getDb()

    const body = await req.json()
    const { registrationId, adminCustomQuote } = body as {
      registrationId: string
      adminCustomQuote?: string
    }

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId required' }, { status: 400 })
    }

    // Load the registration
    const [reg] = await db
      .select()
      .from(certRegistrations)
      .where(eq(certRegistrations.id, registrationId))
      .limit(1)

    if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (reg.status === 'approved') {
      return NextResponse.json({ error: 'Already approved' }, { status: 409 })
    }

    // ── Quote resolution ──────────────────────────────────────────────────────
    let finalQuote =
      // Priority 1: fresh quote typed by admin right now
      (adminCustomQuote?.trim()) ||
      // Priority 2: quote a mod/admin saved earlier on the record
      (reg.adminCustomQuote?.trim()) ||
      null

    if (!finalQuote) {
      // Priority 3: random active default quote filtered by gender
      const genderMatch = await db
        .select({ quote: defaultQuotes.quote })
        .from(defaultQuotes)
        .where(
          and(
            eq(defaultQuotes.isActive, true),
            eq(defaultQuotes.gender, reg.gender)
          )
        )

      const allMatch = genderMatch.length > 0
        ? genderMatch
        : await db
            .select({ quote: defaultQuotes.quote })
            .from(defaultQuotes)
            .where(and(eq(defaultQuotes.isActive, true), eq(defaultQuotes.gender, 'all')))

      if (allMatch.length > 0) {
        finalQuote = allMatch[Math.floor(Math.random() * allMatch.length)].quote
      }
    }

    // Priority 4: absolute fallback
    if (!finalQuote) {
      finalQuote = 'You have proven that with dedication, every circuit can be mastered. Well done.'
    }

    // ── Approve ──────────────────────────────────────────────────────────────
    await db
      .update(certRegistrations)
      .set({
        status: 'approved',
        adminCustomQuote: adminCustomQuote?.trim() || reg.adminCustomQuote,
        finalQuote,
        approvedBy: userId,
        approvedAt: new Date(),
      })
      .where(eq(certRegistrations.id, registrationId))

    // ── Notify student ────────────────────────────────────────────────────────
    const [student] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, reg.userId))
      .limit(1)

    if (student?.email) {
      emailApproved({
        to: student.email,
        studentName: reg.studentName,
        finalQuote,
      }).catch(console.error)

      // Log the email
      await db.insert(emailLog).values({
        registrationId,
        recipient: student.email,
        type: 'approved',
      })
    }

    return NextResponse.json({ success: true, finalQuote })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
