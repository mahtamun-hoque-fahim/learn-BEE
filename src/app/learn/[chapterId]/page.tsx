import { notFound } from 'next/navigation'
import { getChapter, inScopeChapters } from '@/lib/curriculum'
import ChapterClient from './ChapterClient'

interface Props {
  params: Promise<{ chapterId: string }>
}

export async function generateStaticParams() {
  // Pre-render only the BGCTUB 2nd-semester in-scope chapters.
  return inScopeChapters.map(ch => ({ chapterId: ch.id }))
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params
  const chapter = getChapter(chapterId)
  if (!chapter || chapter.inScope === false) notFound()

  const chapterIdx = inScopeChapters.findIndex(c => c.id === chapterId)
  const prev = chapterIdx > 0 ? inScopeChapters[chapterIdx - 1] : null
  const next = chapterIdx < inScopeChapters.length - 1 ? inScopeChapters[chapterIdx + 1] : null

  return <ChapterClient chapter={chapter} prev={prev} next={next} />
}
