import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import ContentCRUD, { type FieldType } from '@/components/admin/ContentCRUD'
import { requireMod } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Books · admin' }

export default async function AdminBooksPage() {
  try { await requireMod() } catch { redirect('/') }

  const fields: FieldType[] = [
    { type: 'text',     key: 'title',       label: 'Title', placeholder: 'Fundamentals of Electric Circuits' },
    { type: 'text',     key: 'author',      label: 'Author', placeholder: 'Alexander & Sadiku' },
    { type: 'text',     key: 'edition',     label: 'Edition', placeholder: '5th Ed' },
    { type: 'select',   key: 'tag',         label: 'Tag', options: ['Primary','Reference','Optional'] as const },
    { type: 'textarea', key: 'note',        label: 'Note', placeholder: 'A one-line description for the card.' },
    { type: 'color',    key: 'swatch',      label: 'Spine colour' },
    { type: 'text',     key: 'externalUrl', label: 'External URL (Amazon / Library)' },
    { type: 'number',   key: 'sortOrder',   label: 'Sort order' },
    { type: 'file',     key: 'coverUrl',    label: 'Cover image', folder: 'books', accept: 'image/*' },
  ]

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <ContentCRUD
              collection="books"
              title="Books"
              description="Textbook references. Primary books are listed first on the public /books page."
              fields={fields}
              initial={{ tag: 'Primary', swatch: '#1F3A5F', sortOrder: 0 }}
              listColumns={[
                { key: 'title',  label: 'Title' },
                { key: 'author', label: 'Author' },
                { key: 'tag',    label: 'Tag' },
                { key: 'edition', label: 'Edition' },
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
