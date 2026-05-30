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

export interface TopicExample {
  q: string
  steps: string[]
  answer: string
}

export interface TopicBody {
  id?: string
  title: string
  body?: string
  examples?: TopicExample[]
  pitfalls?: string[]
  refs?: string[]
}

export interface Chapter {
  id: string
  part?: string
  number?: number
  title: string
  sadiku_pages?: string | null
  boylestad_chapters?: string | null
  /** Topics may be plain strings (legacy / out-of-scope) or rich objects (in-scope, fully authored). */
  topics: Array<string | TopicBody>
  key_formulas: Formula[]
  simulator_demos?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  /** True if the chapter is part of the BGCTUB 2nd-semester syllabus (per instruction.txt). */
  inScope?: boolean
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

// Coerce JSON into our Chapter shape, normalising chapter `number` from id like 'ch7'.
// Topics pass through unchanged — they may be plain strings (out-of-scope) or rich
// TopicBody objects (in-scope, authored). Consumers handle both shapes via typeof checks.
const raw = curriculumJson as unknown as Curriculum
export const curriculum: Curriculum = {
  ...raw,
  chapters: raw.chapters.map((c, i) => ({
    ...c,
    number: c.number ?? (parseInt(c.id.replace(/[^\d]/g, ''), 10) || i + 1),
  })),
}

export const chapterMap = new Map(curriculum.chapters.map(ch => [ch.id, ch]))

/** All chapters that belong to the BGCTUB 2nd-semester syllabus. */
export const inScopeChapters: Chapter[] = curriculum.chapters.filter(c => c.inScope !== false)
/** Set of in-scope chapter IDs for fast lookup. */
export const IN_SCOPE_IDS = new Set(inScopeChapters.map(c => c.id))

export function getChapter(id: string): Chapter | undefined {
  return chapterMap.get(id)
}

export function getPartChapters(partId: string): Chapter[] {
  const part = curriculum.parts?.find(p => p.id === partId)
  if (!part) return []
  return part.chapters.map(id => chapterMap.get(id)).filter((c): c is Chapter => Boolean(c))
}

/** Count of in-scope chapters — used for syllabus completion / certificate eligibility. */
export const TOTAL_CHAPTERS = inScopeChapters.length
