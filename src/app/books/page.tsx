import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { Icon } from '@/components/design/icons'
import { getBooks } from '@/lib/content-public'
import { BOOKS as SEED_BOOKS, type Book } from '@/lib/landing-data'

export const metadata = { title: 'Books — learnBEE' }

const TAG_PILL: Record<Book['tag'], string> = {
  Primary:   'pill primary',
  Reference: 'pill',
  Optional:  'pill warn',
}

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
  const BOOKS = await getBooks()
  const isSeed = BOOKS === SEED_BOOKS
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

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 14,
            }}>
              {BOOKS.map(book => (
                <article key={book.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 14, boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                }}>
                  {/* Spine swatch */}
                  <div style={{
                    width: 76, flexShrink: 0,
                    background: book.swatch,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,.85)',
                    position: 'relative',
                  }}>
                    <span className="mono" style={{
                      fontSize: 10, letterSpacing: '0.12em',
                      writingMode: 'vertical-rl',
                      textTransform: 'uppercase',
                      transform: 'rotate(180deg)',
                    }}>
                      {book.edition}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span className={TAG_PILL[book.tag]}>{book.tag}</span>
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--display)', fontWeight: 600, fontSize: 17,
                      letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 4,
                    }}>
                      {book.title}
                    </h3>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 10 }}>
                      {book.author}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, flex: 1 }}>
                      {book.note}
                    </p>

                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <a
                        href="#"
                        style={{
                          flex: 1,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          padding: '8px 14px',
                          background: 'var(--bg)', border: '1px solid var(--line)',
                          borderRadius: 999, fontSize: 12, color: 'var(--ink-2)',
                        }}
                      >
                        <Icon name="external" size={11} /> Find a copy
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
