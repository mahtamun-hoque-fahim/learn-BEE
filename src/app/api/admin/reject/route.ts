import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { getDb } from '@/lib/db'
import { certRegistrations, users, emailLog } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { emailRejected } from '@/lib/email/send'

// POST /api/admin/reject
// Body: { registrationId, reason }
export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAdmin()
    const db = getDb()

    const { registrationId, reason } = await req.json()

    if (!registrationId || !reason?.trim()) {
      return NextResponse.json({ error: 'registrationId and reason required' }, { status: 400 })
    }

    const [reg] = await db
      .select()
      .from(certRegistrations)
      .where(eq(certRegistrations.id, registrationId))
      .limit(1)

    if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (reg.status === 'approved') {
      return NextResponse.json({ error: 'Cannot reject an already approved certificate' }, { status: 409 })
    }

    await db
      .update(certRegistrations)
      .set({
        status: 'rejected',
        rejectionReason: reason.trim(),
        reviewedBy: userId,
        reviewedAt: new Date(),
      })
      .where(eq(certRegistrations.id, registrationId))

    // Notify student
    const [student] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, reg.userId))
      .limit(1)

    if (student?.email) {
      emailRejected({
        to: student.email,
        studentName: reg.studentName,
        reason: reason.trim(),
      }).catch(console.error)

      await db.insert(emailLog).values({
        registrationId,
        recipient: student.email,
        type: 'rejected',
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
