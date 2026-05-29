// Curriculum & formulas are sourced from /knowledge-base/curriculum.json — single source of truth.
// JSON is bundled at build time via direct import (Next.js supports JSON imports).

import curriculumJson from '../../knowledge-base/curriculum.json'

export interface Formula {
  name: string
  /** KaTeX-ready LaTeX. Always present after the LaTeX migration. */
  formula: string
  /** Original ASCII form, retained for accessibility / fallback / copy-paste. */
  formula_ascii?: string
  /** Optional prose note that was split off from the original formula. */
  note?: string
  unit: string
}

export interface Chapter {
  id: string
  part?: string
  number?: number
  title: string
  sadiku_pages?: string | null
  boylestad_chapters?: string | null
  topics: string[] | Array<{ title: string; [k: string]: unknown }>
  key_formulas: Formula[]
  simulator_demos?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface Part {
  id: string
  title: string
  chapters: string[]
}

export interface Curriculum {
  course: string
  level: string
  description: string
  parts?: Part[]
  chapters: Chapter[]
}

// Normalise topic list: JSON may store strings or objects. Expose strings to existing consumers.
function normaliseTopicList(t: Chapter['topics']): string[] {
  return (t as Array<string | { title: string }>).map(x => typeof x === 'string' ? x : x.title)
}

// Coerce JSON into our Chapter shape, normalising chapter `number` from id like 'ch7'.
const raw = curriculumJson as unknown as Curriculum
export const curriculum: Curriculum = {
  ...raw,
  chapters: raw.chapters.map((c, i) => ({
    ...c,
    number: c.number ?? (parseInt(c.id.replace(/[^\d]/g, ''), 10) || i + 1),
    topics: normaliseTopicList(c.topics),
  })),
}

export const chapterMap = new Map(curriculum.chapters.map(ch => [ch.id, ch]))

export function getChapter(id: string): Chapter | undefined {
  return chapterMap.get(id)
}

export function getPartChapters(partId: string): Chapter[] {
  const part = curriculum.parts?.find(p => p.id === partId)
  if (!part) return []
  return part.chapters.map(id => chapterMap.get(id)).filter((c): c is Chapter => Boolean(c))
}

export const TOTAL_CHAPTERS = curriculum.chapters.length
