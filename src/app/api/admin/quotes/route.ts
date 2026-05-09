import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { getDb } from '@/lib/db'
import { defaultQuotes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    await requireAdmin()
    const db = getDb()
    const quotes = await db.select().from(defaultQuotes).orderBy(defaultQuotes.createdAt)
    return NextResponse.json({ quotes })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAdmin()
    const db = getDb()
    const { quote, gender } = await req.json()
    if (!quote?.trim()) return NextResponse.json({ error: 'quote required' }, { status: 400 })
    const [inserted] = await db
      .insert(defaultQuotes)
      .values({ quote: quote.trim(), gender: gender ?? 'all', isActive: true, addedBy: userId })
      .returning()
    return NextResponse.json({ success: true, quote: inserted })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const db = getDb()
    const { id, isActive } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await db.update(defaultQuotes).set({ isActive }).where(eq(defaultQuotes.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const db = getDb()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await db.delete(defaultQuotes).where(eq(defaultQuotes.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
