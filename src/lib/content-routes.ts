import { NextRequest, NextResponse } from 'next/server'
import { requireMod } from '@/lib/auth-helpers'
import { getDb } from '@/lib/db'
import { lectures, labs, papers, books } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = any

const TABLES = {
  lectures: { table: lectures as AnyTable, name: 'lectures' as const },
  labs:     { table: labs as AnyTable,     name: 'labs' as const },
  papers:   { table: papers as AnyTable,   name: 'papers' as const },
  books:    { table: books as AnyTable,    name: 'books' as const },
}

export type Collection = keyof typeof TABLES

/**
 * Allow-list of writable fields per collection. Anything not in this list is
 * silently dropped from POST/PATCH bodies so clients can't write timestamps,
 * created_by, etc.
 */
const FIELDS: Record<Collection, readonly string[]> = {
  lectures: ['chapterId', 'title', 'date', 'duration', 'type', 'pages', 'ext', 'fileUrl', 'videoUrl', 'sortOrder'],
  labs:     ['number', 'title', 'hasVideo', 'hasManual', 'contributor', 'videoLength', 'videoUrl', 'manualUrl', 'sortOrder'],
  papers:   ['title', 'session', 'type', 'pages', 'qCount', 'fileUrl', 'sortOrder'],
  books:    ['title', 'author', 'edition', 'tag', 'note', 'swatch', 'externalUrl', 'coverUrl', 'sortOrder'],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickFields(collection: Collection, body: Record<string, any>): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, any> = {}
  for (const k of FIELDS[collection]) {
    if (k in body) out[k] = body[k]
  }
  return out
}

/** Build a `{ GET, POST, PATCH, DELETE }` set for a content collection. */
export function buildContentRoutes(collection: Collection) {
  const { table } = TABLES[collection]

  return {
    GET: async () => {
      try {
        const db = getDb()
        const rows = await db.select().from(table).orderBy(asc(table.sortOrder), asc(table.createdAt))
        return NextResponse.json({ [collection]: rows })
      } catch (e) {
        if (e instanceof Response) return e
        console.error(`${collection} GET error:`, e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
      }
    },

    POST: async (req: NextRequest) => {
      try {
        const { userId } = await requireMod()
        const body = await req.json()
        const values = { ...pickFields(collection, body), createdBy: userId }
        const db = getDb()
        const result = await db.insert(table).values(values).returning()
        const inserted = Array.isArray(result) ? result[0] : undefined
        return NextResponse.json({ success: true, item: inserted })
      } catch (e) {
        if (e instanceof Response) return e
        console.error(`${collection} POST error:`, e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
      }
    },

    PATCH: async (req: NextRequest) => {
      try {
        await requireMod()
        const body = await req.json()
        const { id, ...rest } = body
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        const values = { ...pickFields(collection, rest), updatedAt: new Date() }
        const db = getDb()
        const result = await db.update(table).set(values).where(eq(table.id, id)).returning()
        const updated = Array.isArray(result) ? result[0] : undefined
        if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 })
        return NextResponse.json({ success: true, item: updated })
      } catch (e) {
        if (e instanceof Response) return e
        console.error(`${collection} PATCH error:`, e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
      }
    },

    DELETE: async (req: NextRequest) => {
      try {
        await requireMod()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        const db = getDb()
        await db.delete(table).where(eq(table.id, id))
        return NextResponse.json({ success: true })
      } catch (e) {
        if (e instanceof Response) return e
        console.error(`${collection} DELETE error:`, e)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
      }
    },
  }
}
