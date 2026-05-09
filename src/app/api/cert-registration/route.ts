import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { getDb } from '@/lib/db'
import { certRegistrations, userProgress, bonusAttempts } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { emailNewSubmission } from '@/lib/email/send'

// ─── GET — fetch student's own registration status ───────────────────────────
export async function GET() {
  try {
    const { userId } = await requireAuth()
    const db = getDb()

    const [reg] = await db
      .select()
      .from(certRegistrations)
      .where(eq(certRegistrations.userId, userId))
      .limit(1)

    return NextResponse.json({ registration: reg ?? null })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ─── POST — new submission or resubmission after rejection ───────────────────
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth()
    const db = getDb()

    const body = await req.json()
    const { studentName, university, department, semester, gender, additionalNote } = body

    if (!studentName || !university || !department || !semester || !gender) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    // Count completed chapters
    const [{ value: chaptersCompleted }] = await db
      .select({ value: count() })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)))

    // Best bonus score
    const bonusRows = await db
      .select()
      .from(bonusAttempts)
      .where(and(eq(bonusAttempts.userId, userId), eq(bonusAttempts.passed, true)))
      .orderBy(bonusAttempts.createdAt)

    const bonusScore = bonusRows.length > 0
      ? Math.round((bonusRows[bonusRows.length - 1].score / bonusRows[bonusRows.length - 1].total) * 100)
      : 0

    // Check existing registration
    const [existing] = await db
      .select()
      .from(certRegistrations)
      .where(eq(certRegistrations.userId, userId))
      .limit(1)

    let submissionId: string

    if (existing) {
      // Only allow resubmission if currently rejected
      if (existing.status !== 'rejected') {
        return NextResponse.json(
          { error: `Cannot resubmit while status is '${existing.status}'` },
          { status: 409 }
        )
      }
      // Reset to pending with updated data
      await db
        .update(certRegistrations)
        .set({
          studentName,
          university,
          department,
          semester,
          gender,
          additionalNote: additionalNote ?? null,
          status: 'pending',
          submittedAt: new Date(),
          reviewedBy: null,
          reviewedAt: null,
          approvedBy: null,
          approvedAt: null,
          rejectionReason: null,
          adminCustomQuote: null,
          finalQuote: null,
          bonusScore,
          chaptersCompleted: Number(chaptersCompleted),
        })
        .where(eq(certRegistrations.userId, userId))
      submissionId = existing.id
    } else {
      // Fresh submission
      const [inserted] = await db
        .insert(certRegistrations)
        .values({
          userId,
          studentName,
          university,
          department,
          semester,
          gender,
          additionalNote: additionalNote ?? null,
          status: 'pending',
          bonusScore,
          chaptersCompleted: Number(chaptersCompleted),
        })
        .returning({ id: certRegistrations.id })
      submissionId = inserted.id
    }

    // Notify staff by email (non-blocking)
    emailNewSubmission({
      studentName,
      university,
      department,
      semester,
      bonusScore,
      chaptersCompleted: Number(chaptersCompleted),
      submissionId,
      studentNote: additionalNote,
    }).catch(console.error)

    return NextResponse.json({ success: true, submissionId })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
