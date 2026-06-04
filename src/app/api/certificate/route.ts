import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { certRegistrations, defaultQuotes } from '@/lib/db/schema'
import { eq, and, or } from 'drizzle-orm'

/**
 * Fallback motivational quotes if the admin-managed pool is empty.
 * Used only when no `defaultQuotes` rows exist for the student's gender.
 */
const DEFAULT_QUOTES: Record<string, string[]> = {
  male: [
    'Knowledge is power. Electricity is energy. Together, you are unstoppable.',
    'Every great engineer was once a student who refused to give up.',
    "Ohm's Law may be simple, but your potential is infinite.",
  ],
  female: [
    "You've proven that brilliance knows no boundaries.",
    'She who masters the circuit, masters her future.',
    'Charge forward. The world needs engineers like you.',
  ],
  other: [
    'The language of electricity speaks to all who listen.',
    "You've wired yourself for a brighter future.",
    'The spark of knowledge you carry will light the way for others.',
  ],
}

/**
 * POST /api/certificate
 * Creates a certificate registration for the authenticated user. Once
 * submitted, the row enters the mod-review → admin-quote → approved pipeline.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      studentName,
      university,
      department,
      semester,
      gender,
      bonusScore,
      chaptersCompleted,
      additionalNote,
    } = body

    if (!studentName || !university || !department || !semester || !gender) {
      return NextResponse.json(
        { error: 'studentName, university, department, semester, gender are required' },
        { status: 400 },
      )
    }

    const db = getDb()

    // Pre-pick a fallback "auto" quote (used if no admin custom quote is written
    // before approval). Filter by gender; if no match, fall back to 'all'.
    let autoQuote = ''
    try {
      const pool = await db
        .select()
        .from(defaultQuotes)
        .where(
          and(
            eq(defaultQuotes.isActive, true),
            or(eq(defaultQuotes.gender, gender), eq(defaultQuotes.gender, 'all')),
          ),
        )
      if (pool.length > 0) {
        autoQuote = pool[Math.floor(Math.random() * pool.length)].quote
      }
    } catch {
      // Quote pool unavailable — fall through to hard-coded defaults.
    }
    if (!autoQuote) {
      const fallbackPool = DEFAULT_QUOTES[gender as keyof typeof DEFAULT_QUOTES] ?? DEFAULT_QUOTES.other
      autoQuote = fallbackPool[Math.floor(Math.random() * fallbackPool.length)]
    }

    // Insert the registration. `finalQuote` defaults to `autoQuote` here; admin
    // can override during review by writing `adminCustomQuote`.
    const [registration] = await db
      .insert(certRegistrations)
      .values({
        userId,
        studentName,
        university,
        department,
        semester,
        gender,
        additionalNote: additionalNote ?? null,
        bonusScore: bonusScore ?? 0,
        chaptersCompleted: chaptersCompleted ?? 0,
        finalQuote: autoQuote,
      })
      .returning()

    return NextResponse.json({ success: true, registration })
  } catch (error) {
    console.error('Certificate POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/certificate
 * Returns the authenticated user's certificate registration(s).
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = getDb()
    const rows = await db
      .select()
      .from(certRegistrations)
      .where(eq(certRegistrations.userId, userId))
    return NextResponse.json({ certificates: rows })
  } catch (error) {
    console.error('Certificate GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
