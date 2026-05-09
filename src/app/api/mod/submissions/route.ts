import { NextRequest, NextResponse } from 'next/server'
import { requireMod } from '@/lib/auth-helpers'
import { getDb } from '@/lib/db'
import { certRegistrations, users } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    await requireMod()
    const db = getDb()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'pending' // 'pending'|'reviewing'|'approved'|'rejected'|'all'
    const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit  = 20
    const offset = (page - 1) * limit

    const where = status === 'all'
      ? undefined
      : eq(certRegistrations.status, status as 'pending' | 'reviewing' | 'approved' | 'rejected')

    const rows = await db
      .select({
        id:                 certRegistrations.id,
        studentName:        certRegistrations.studentName,
        university:         certRegistrations.university,
        department:         certRegistrations.department,
        semester:           certRegistrations.semester,
        gender:             certRegistrations.gender,
        status:             certRegistrations.status,
        submittedAt:        certRegistrations.submittedAt,
        reviewedAt:         certRegistrations.reviewedAt,
        approvedAt:         certRegistrations.approvedAt,
        chaptersCompleted:  certRegistrations.chaptersCompleted,
        bonusScore:         certRegistrations.bonusScore,
        hasCustomQuote:     sql<boolean>`${certRegistrations.adminCustomQuote} IS NOT NULL`,
        studentEmail:       users.email,
        additionalNote:     certRegistrations.additionalNote,
      })
      .from(certRegistrations)
      .leftJoin(users, eq(certRegistrations.userId, users.id))
      .where(where)
      .orderBy(desc(certRegistrations.submittedAt))
      .limit(limit)
      .offset(offset)

    // Counts per status for the sidebar badges
    const counts = await db
      .select({
        status: certRegistrations.status,
        count: sql<number>`count(*)::int`,
      })
      .from(certRegistrations)
      .groupBy(certRegistrations.status)

    return NextResponse.json({ submissions: rows, counts, page, limit })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
