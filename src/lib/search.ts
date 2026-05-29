'use client'

/**
 * Lightweight client-side full-text search across:
 *   - in-scope chapter titles + topic names
 *   - in-scope key formulas (name, ASCII form, note)
 *   - in-scope question bank entries (question, options, explanation, topic)
 *
 * The index is built once on module load. ~150 items, plenty fast for substring
 * matching on every keystroke.
 */

import { inScopeChapters, IN_SCOPE_IDS } from '@/lib/curriculum'
import { questionBank } from '@/lib/questions'

export type Hit =
  | { kind: 'chapter';  chapterId: string; title: string; snippet: string }
  | { kind: 'topic';    chapterId: string; chapterTitle: string; topic: string }
  | { kind: 'formula';  chapterId: string; chapterTitle: string; name: string; ascii: string; latex: string }
  | { kind: 'question'; chapterId: string; chapterTitle: string; questionId: string; topic: string; snippet: string }

interface IndexedItem {
  hit: Hit
  haystack: string  // lowercased
}

function buildIndex(): IndexedItem[] {
  const out: IndexedItem[] = []

  for (const ch of inScopeChapters) {
    const chapterTitle = ch.title

    // Chapter title itself
    out.push({
      hit: { kind: 'chapter', chapterId: ch.id, title: chapterTitle, snippet: chapterTitle },
      haystack: chapterTitle.toLowerCase(),
    })

    // Topics
    for (const t of (ch.topics as Array<string | { title: string }>)) {
      const topic = typeof t === 'string' ? t : t.title
      out.push({
        hit: { kind: 'topic', chapterId: ch.id, chapterTitle, topic },
        haystack: topic.toLowerCase(),
      })
    }

    // Formulas
    for (const f of ch.key_formulas) {
      out.push({
        hit: {
          kind: 'formula',
          chapterId: ch.id,
          chapterTitle,
          name: f.name,
          ascii: f.formula_ascii ?? f.formula,
          latex: f.formula,
        },
        haystack: `${f.name} ${f.formula_ascii ?? ''} ${f.note ?? ''}`.toLowerCase(),
      })
    }
  }

  // Questions (only in-scope chapters)
  for (const q of questionBank) {
    if (!IN_SCOPE_IDS.has(q.chapter)) continue
    const ch = inScopeChapters.find(c => c.id === q.chapter)
    if (!ch) continue
    const opts = q.options ? q.options.join(' ') : ''
    out.push({
      hit: {
        kind: 'question',
        chapterId: q.chapter,
        chapterTitle: ch.title,
        questionId: q.id,
        topic: q.topic,
        snippet: q.question.length > 140 ? q.question.slice(0, 140) + '…' : q.question,
      },
      haystack: `${q.question} ${opts} ${q.explanation} ${q.topic}`.toLowerCase(),
    })
  }

  return out
}

let _index: IndexedItem[] | null = null
function getIndex(): IndexedItem[] {
  if (!_index) _index = buildIndex()
  return _index
}

export function searchAll(query: string, max: number = 40): Hit[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const idx = getIndex()
  const out: Hit[] = []
  for (const item of idx) {
    if (item.haystack.includes(q)) {
      out.push(item.hit)
      if (out.length >= max) break
    }
  }
  return out
}
