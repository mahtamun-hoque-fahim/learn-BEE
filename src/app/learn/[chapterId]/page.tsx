import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getChapter, inScopeChapters } from '@/lib/curriculum'
import { SITE_URL } from '@/lib/seo'
import ChapterClient from './ChapterClient'

interface Props {
  params: Promise<{ chapterId: string }>
}

export async function generateStaticParams() {
  // Pre-render only the BGCTUB 2nd-semester in-scope chapters.
  return inScopeChapters.map(ch => ({ chapterId: ch.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params
  const chapter = getChapter(chapterId)
  if (!chapter || chapter.inScope === false) return { title: 'Chapter not found' }
  const topicList = chapter.topics.map(t => (typeof t === 'string' ? t : t.title)).slice(0, 4).join(', ')
  const desc = `Chapter ${chapter.number}: ${chapter.title} — ${chapter.topics.length} topics (${topicList}), ${chapter.key_formulas.length} key formulas, an interactive simulator and a quiz. BGCTUB 2nd-semester Basic Electrical Engineering, aligned with Sadiku & Boylestad.`
  return {
    title: `${chapter.title} — Chapter ${chapter.number}`,
    description: desc,
    alternates: { canonical: `/learn/${chapter.id}` },
    openGraph: { title: `${chapter.title} — learnBEE`, description: desc, url: `${SITE_URL}/learn/${chapter.id}`, type: 'article' },
  }
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params
  const chapter = getChapter(chapterId)
  if (!chapter || chapter.inScope === false) notFound()

  const chapterIdx = inScopeChapters.findIndex(c => c.id === chapterId)
  const prev = chapterIdx > 0 ? inScopeChapters[chapterIdx - 1] : null
  const next = chapterIdx < inScopeChapters.length - 1 ? inScopeChapters[chapterIdx + 1] : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${chapter.title} — Basic Electrical Engineering`,
    url: `${SITE_URL}/learn/${chapter.id}`,
    learningResourceType: 'Chapter',
    educationalLevel: 'University',
    inLanguage: 'en',
    isPartOf: { '@type': 'Course', name: 'Basic Electrical Engineering (EEE 1201)', url: `${SITE_URL}/learn` },
    teaches: chapter.topics.map(t => (typeof t === 'string' ? t : t.title)),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ChapterClient chapter={chapter} prev={prev} next={next} />
    </>
  )
}
