import { NextRequest, NextResponse } from 'next/server'
import { requireMod } from '@/lib/auth-helpers'
import { getDb } from '@/lib/db'
import { certRegistrations, users, userProgress, quizAttempts, bonusAttempts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/mod/submissions/[id]  — full detail view for a single submission
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireMod()
    const db = getDb()

    const [reg] = await db
      .select()
      .from(certRegistrations)
      .where(eq(certRegistrations.id, params.id))
      .limit(1)

    if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Pull all progress for this student
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, reg.userId))

    // Quiz attempts summary
    const quizzes = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, reg.userId))

    // Bonus attempts
    const bonus = await db
      .select()
      .from(bonusAttempts)
      .where(eq(bonusAttempts.userId, reg.userId))

    // Student user info
    const [student] = await db
      .select({ email: users.email, name: users.name, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, reg.userId))
      .limit(1)

    // Mark as 'reviewing' if it was pending and this mod opens it
    if (reg.status === 'pending') {
      await db
        .update(certRegistrations)
        .set({ status: 'reviewing', reviewedBy: userId, reviewedAt: new Date() })
        .where(eq(certRegistrations.id, params.id))
    }

    return NextResponse.json({
      registration: { ...reg, status: reg.status === 'pending' ? 'reviewing' : reg.status },
      student,
      progress,
      quizzesSummary: {
        total: quizzes.length,
        passed: quizzes.filter(q => q.passed).length,
        byChapter: Object.fromEntries(
          quizzes.reduce((map, q) => {
            const best = map.get(q.chapterId)
            if (!best || q.score > best.score) map.set(q.chapterId, q)
            return map
          }, new Map())
        ),
      },
      bonusSummary: {
        attempts: bonus.length,
        best: bonus.reduce((max, b) => (b.score > max ? b.score : max), 0),
        passed: bonus.some(b => b.passed),
      },
    })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/mod/submissions/[id]  — moderator saves a custom quote draft
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireMod()
    const db = getDb()

    const { adminCustomQuote } = await req.json()

    await db
      .update(certRegistrations)
      .set({ adminCustomQuote: adminCustomQuote ?? null })
      .where(eq(certRegistrations.id, params.id))

    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
