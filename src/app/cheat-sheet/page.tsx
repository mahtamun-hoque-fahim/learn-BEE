import Link from 'next/link'
import { inScopeChapters } from '@/lib/curriculum'
import CheatSheetClient from './CheatSheetClient'

export const metadata = { title: 'Cheat Sheet — learnBEE' }

export default function CheatSheetPage() {
  const chapters = inScopeChapters.map(ch => ({
    id: ch.id,
    title: ch.title,
    number: ch.number,
    formulas: ch.key_formulas,
  }))
  const totalFormulas = chapters.reduce((s, c) => s + c.formulas.length, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#222] bg-[#0a0a0a]/90 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="font-syne font-bold text-lg">
            learn<span className="text-[#00e676]">·BEE</span>
          </Link>
          <span className="text-[#444]">/</span>
          <span className="text-[#888] text-sm">Cheat sheet</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="font-syne text-4xl font-bold mb-2">Cheat sheet</h1>
          <p className="text-[#888]">
            {totalFormulas} formulas across {chapters.length} chapters. All math rendered with KaTeX.
            Search by name, formula, or chapter; use <kbd className="px-1.5 py-0.5 text-xs bg-[#1a1a1a] border border-[#222] rounded font-mono">Ctrl/⌘ + F</kbd> for in-page browser search.
          </p>
        </header>

        <CheatSheetClient chapters={chapters} />
      </div>
    </div>
  )
}
