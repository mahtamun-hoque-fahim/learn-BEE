import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400',
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  }
  return map[difficulty] || 'text-gray-400'
}

export function getPartLabel(partId: string): string {
  const map: Record<string, string> = {
    part1: 'DC Circuits',
    part2: 'AC Circuits',
    part3: 'Advanced Analysis',
  }
  return map[partId] || partId
}

export function isChapterUnlocked(
  chapterId: string,
  completedChapters: Set<string>
): boolean {
  const num = parseInt(chapterId.replace('ch', ''))
  if (num === 1) return true
  return completedChapters.has(`ch${num - 1}`)
}
