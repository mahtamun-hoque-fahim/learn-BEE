import { getDb } from '@/lib/db'
import { lectures, labs, papers, books } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import {
  LECTURES as SEED_LECTURES,
  LABS as SEED_LABS,
  PAPERS as SEED_PAPERS,
  BOOKS as SEED_BOOKS,
  type Lecture, type Lab, type Paper, type Book,
} from '@/lib/landing-data'

/**
 * Each public catalogue page calls one of these. They fetch from the DB; if the
 * table is empty or the DB is unreachable, they fall back to the seed sample
 * data from `landing-data.ts` so the page never goes blank on first deploy.
 */

export async function getLectures(): Promise<Lecture[]> {
  try {
    const db = getDb()
    const rows = await db.select().from(lectures).orderBy(asc(lectures.sortOrder), asc(lectures.createdAt))
    if (rows.length === 0) return SEED_LECTURES
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      unit: r.chapterId,
      date: r.date ?? '',
      duration: r.duration ?? '',
      type: r.type,
      pages: r.pages ?? 0,
      ext: r.ext,
    }))
  } catch {
    return SEED_LECTURES
  }
}

export async function getLabs(): Promise<Lab[]> {
  try {
    const db = getDb()
    const rows = await db.select().from(labs).orderBy(asc(labs.sortOrder), asc(labs.createdAt))
    if (rows.length === 0) return SEED_LABS
    return rows.map(r => ({
      id: r.id,
      n: r.number,
      title: r.title,
      hasVideo: r.hasVideo,
      hasManual: r.hasManual,
      contributor: r.contributor ?? '',
      length: r.videoLength ?? '—',
    }))
  } catch {
    return SEED_LABS
  }
}

export async function getPapers(): Promise<Paper[]> {
  try {
    const db = getDb()
    const rows = await db.select().from(papers).orderBy(asc(papers.sortOrder), asc(papers.createdAt))
    if (rows.length === 0) return SEED_PAPERS
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      session: r.session ?? '',
      type: r.type,
      pages: r.pages ?? 0,
      qCount: r.qCount ?? 0,
    }))
  } catch {
    return SEED_PAPERS
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const db = getDb()
    const rows = await db.select().from(books).orderBy(asc(books.sortOrder), asc(books.createdAt))
    if (rows.length === 0) return SEED_BOOKS
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      author: r.author,
      edition: r.edition ?? '',
      tag: r.tag,
      note: r.note ?? '',
      swatch: r.swatch,
    }))
  } catch {
    return SEED_BOOKS
  }
}

/**
 * Variant of public-list fetchers that surfaces whether the data is real (from
 * the DB) or just the placeholder seed. The catalogue pages show a "Sample
 * data" pill when the result is from seed.
 */
export async function listingMeta<T>(
  fetcher: () => Promise<T[]>,
  seed: T[],
): Promise<{ items: T[]; isSeed: boolean }> {
  const items = await fetcher()
  return { items, isSeed: items === seed }
}
