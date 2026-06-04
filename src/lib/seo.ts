/** Central SEO config. Override the canonical origin with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://learn-basic-electrical-engineering.vercel.app').replace(/\/+$/, '')

export const SITE_NAME = 'learnBEE'
export const SITE_TAGLINE = 'Basic Electrical Engineering, organised — BGCTUB'
export const SITE_DESCRIPTION =
  'Lecture notes, lab manuals, past papers, animated circuit simulators and exam-ready quizzes for the 2nd-semester Basic Electrical Engineering (EEE 1201) course at BGCTUB. Aligned with Sadiku and Boylestad. Free for the 45th batch and everyone after.'

/** Public, indexable routes (excludes /api, /admin, /mod, /dashboard, /search, /certificate). */
export const INDEXABLE_STATIC_ROUTES = [
  '/', '/syllabus', '/lectures', '/labs', '/papers', '/books', '/cheat-sheet', '/learn', '/bonus', '/contributors',
] as const

export const abs = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
