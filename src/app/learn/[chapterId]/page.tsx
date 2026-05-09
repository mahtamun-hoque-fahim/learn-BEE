import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getChapter, curriculum } from '@/lib/curriculum'
import ChapterClient from './ChapterClient'

interface Props {
  params: Promise<{ chapterId: string }>
}

export async function generateStaticParams() {
  return curriculum.chapters.map(ch => ({ chapterId: ch.id }))
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params
  const chapter = getChapter(chapterId)
  if (!chapter) notFound()

  const chapterIdx = curriculum.chapters.findIndex(c => c.id === chapterId)
  const prev = chapterIdx > 0 ? curriculum.chapters[chapterIdx - 1] : null
  const next = chapterIdx < curriculum.chapters.length - 1 ? curriculum.chapters[chapterIdx + 1] : null

  return <ChapterClient chapter={chapter} prev={prev} next={next} />
}
