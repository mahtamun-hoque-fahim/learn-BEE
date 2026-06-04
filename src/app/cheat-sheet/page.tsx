import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
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
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 1080, paddingTop: 48, paddingBottom: 96 }}>
        <header style={{ marginBottom: 8 }}>
          <div className="eyebrow">Cheat sheet</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', letterSpacing: '-0.035em', margin: '14px 0 12px' }}>
            Every formula, one page
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: 640, fontSize: 15, lineHeight: 1.6 }}>
            {totalFormulas} formulas across {chapters.length} chapters, KaTeX-rendered. Search by name,
            formula or chapter — or hit <kbd className="kbd">⌘/Ctrl + F</kbd> for browser find.
          </p>
        </header>

        <CheatSheetClient chapters={chapters} />
      </main>
      <Footer />
    </>
  )
}
