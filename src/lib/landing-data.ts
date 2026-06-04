/**
 * Lecture / lab / paper / book catalogues for the landing-section routes.
 *
 * Sample content carried over from the design tool's prototype. Replace
 * with actual links and contributors as the 45th batch publishes them.
 */

export interface Lecture {
  id: string
  title: string
  unit: string
  date: string
  duration: string
  type: 'Lecture' | 'Tutorial' | 'Review'
  pages: number
  ext: 'PDF' | 'PPT' | 'DOC'
}

export interface Lab {
  id: string
  n: string
  title: string
  hasVideo: boolean
  hasManual: boolean
  contributor: string
  length: string
}

export interface Paper {
  id: string
  title: string
  session: string
  type: 'Midterm' | 'Final' | 'Quiz' | 'CT'
  pages: number
  qCount: number
}

export interface Book {
  id: string
  title: string
  author: string
  edition: string
  tag: 'Primary' | 'Reference' | 'Optional'
  note: string
  swatch: string
  /** Admin-uploaded cover image (Vercel Blob). */
  coverUrl?: string | null
  /** Admin-uploaded PDF (Vercel Blob) — download source when present. */
  fileUrl?: string | null
  /** Admin-set link to obtain a copy (Amazon / library / Drive). */
  externalUrl?: string | null
}

export const LECTURES: Lecture[] = [
  { id: 'l1', title: 'Welcome to BEE — what you’re signing up for', unit: 'ch1', date: 'Jan 14', duration: '42 min', type: 'Lecture',  pages: 12, ext: 'PDF' },
  { id: 'l2', title: 'Charge, current, voltage — building the vocabulary', unit: 'ch1', date: 'Jan 16', duration: '48 min', type: 'Lecture',  pages: 18, ext: 'PDF' },
  { id: 'l3', title: 'Ohm’s law done properly',                            unit: 'ch2', date: 'Jan 21', duration: '39 min', type: 'Lecture',  pages: 14, ext: 'PDF' },
  { id: 'l4', title: 'KCL, KVL & the art of writing equations',            unit: 'ch2', date: 'Jan 23', duration: '52 min', type: 'Lecture',  pages: 22, ext: 'PDF' },
  { id: 'l5', title: 'Mesh analysis worked problems',                      unit: 'ch3', date: 'Jan 28', duration: '55 min', type: 'Tutorial', pages:  9, ext: 'PDF' },
  { id: 'l6', title: 'Supernode + supermesh — the awkward cases',          unit: 'ch3', date: 'Jan 30', duration: '45 min', type: 'Lecture',  pages: 11, ext: 'PDF' },
  { id: 'l7', title: 'Thévenin & Norton — the one-resistor trick',         unit: 'ch4', date: 'Feb 04', duration: '47 min', type: 'Lecture',  pages: 16, ext: 'PDF' },
  { id: 'l8', title: 'Superposition + maximum power transfer',             unit: 'ch4', date: 'Feb 06', duration: '41 min', type: 'Lecture',  pages: 12, ext: 'PDF' },
  { id: 'l9', title: 'Capacitors — structure, energy, series/parallel',    unit: 'ch6', date: 'Feb 11', duration: '50 min', type: 'Lecture',  pages: 17, ext: 'PDF' },
  { id: 'l10', title: 'RC transients & the τ intuition',                   unit: 'ch7', date: 'Feb 13', duration: '44 min', type: 'Lecture',  pages: 19, ext: 'PDF' },
  { id: 'l11', title: 'Mid-term review session',                           unit: 'ch3', date: 'Feb 18', duration: '60 min', type: 'Review',   pages:  8, ext: 'PDF' },
  { id: 'l12', title: 'Final review session — RC, theorems, energy',      unit: 'ch7', date: 'Apr 22', duration: '70 min', type: 'Review',   pages: 14, ext: 'PDF' },
]

export const LABS: Lab[] = [
  { id: 'lab1', n: '01', title: 'Verification of Ohm’s Law',          hasVideo: true,  hasManual: true, contributor: 'Tahsin · 45B',   length: '06:24' },
  { id: 'lab2', n: '02', title: 'Verification of KVL and KCL',        hasVideo: true,  hasManual: true, contributor: 'Rifat · 45B',    length: '08:11' },
  { id: 'lab3', n: '03', title: 'Series–Parallel Resistor Networks',  hasVideo: false, hasManual: true, contributor: 'Mahtamun · 45B', length: '—' },
  { id: 'lab4', n: '04', title: 'Thévenin’s & Norton’s Theorems',     hasVideo: true,  hasManual: true, contributor: 'Anika · 45B',    length: '11:02' },
  { id: 'lab5', n: '05', title: 'RC / RL Transient Response',         hasVideo: true,  hasManual: true, contributor: 'Sajid · 45B',    length: '09:47' },
  { id: 'lab6', n: '06', title: 'Capacitor Charging & Discharging',   hasVideo: false, hasManual: true, contributor: 'Mahtamun · 45B', length: '—' },
  { id: 'lab7', n: '07', title: 'Maximum Power Transfer',             hasVideo: true,  hasManual: true, contributor: 'Tahsin · 45B',   length: '07:33' },
  { id: 'lab8', n: '08', title: 'Superposition Verification',         hasVideo: true,  hasManual: true, contributor: 'Rifat · 45B',    length: '10:18' },
]

export const PAPERS: Paper[] = [
  { id: 'p1', title: 'Midterm 2024 — Set A', session: 'Spring 2024', type: 'Midterm', pages: 4, qCount: 5 },
  { id: 'p2', title: 'Final 2024',            session: 'Spring 2024', type: 'Final',   pages: 8, qCount: 8 },
  { id: 'p3', title: 'Midterm 2023 — Set B',  session: 'Spring 2023', type: 'Midterm', pages: 4, qCount: 5 },
  { id: 'p4', title: 'Final 2023',            session: 'Spring 2023', type: 'Final',   pages: 8, qCount: 8 },
  { id: 'p5', title: 'CT-1 2024',             session: 'Spring 2024', type: 'CT',      pages: 2, qCount: 4 },
  { id: 'p6', title: 'CT-2 2024',             session: 'Spring 2024', type: 'CT',      pages: 2, qCount: 4 },
  { id: 'p7', title: 'Quiz Bank — Ch1–Ch3',   session: 'Compiled',    type: 'Quiz',    pages: 12, qCount: 40 },
  { id: 'p8', title: 'Quiz Bank — Ch4, Ch6, Ch7', session: 'Compiled', type: 'Quiz',   pages: 14, qCount: 45 },
]

export const BOOKS: Book[] = [
  { id: 'b1', title: 'Fundamentals of Electric Circuits', author: 'Alexander & Sadiku',     edition: '5th Ed',  tag: 'Primary',
    note: 'The course textbook. Chapters 1–7 cover this syllabus end-to-end.', swatch: '#1F3A5F' },
  { id: 'b2', title: 'Introductory Circuit Analysis',     author: 'Robert L. Boylestad',    edition: '13th Ed', tag: 'Primary',
    note: 'Friendly explanations of transients and resistor color codes.', swatch: '#2F6F4F' },
  { id: 'b3', title: 'Engineering Circuit Analysis',      author: 'Hayt, Kemmerly & Durbin', edition: '9th Ed', tag: 'Reference',
    note: 'Stronger problems for mesh/nodal analysis and Thévenin.', swatch: '#B5811E' },
  { id: 'b4', title: 'Electrical Technology, Vol I',      author: 'B. L. Theraja',          edition: '23rd Ed', tag: 'Optional',
    note: 'Older notation but rock-solid worked examples for the basics.', swatch: '#C44536' },
]
