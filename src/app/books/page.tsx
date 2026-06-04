import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { getBooks } from '@/lib/content-public'
import BooksGrid from './BooksGrid'

export const metadata = { title: 'Books — learnBEE' }

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
  const BOOKS = await getBooks()
  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <SectionHeader
              eyebrow={`Books · ${BOOKS.length} titles`}
              title="Textbooks the course uses"
              sub="Primary references first. The lectures, sample problems and exam-pool questions all map to these books — Sadiku and Boylestad cover almost every formula on this site."
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <span className="pill primary dot">{BOOKS.filter(b => b.tag === 'Primary').length} primary</span>
              <span className="pill">{BOOKS.filter(b => b.tag === 'Reference').length} reference</span>
              <span className="pill warn">{BOOKS.filter(b => b.tag === 'Optional').length} optional</span>
            </div>

            <BooksGrid books={BOOKS} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
