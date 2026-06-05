import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import ContentCRUD, { type FieldType } from '@/components/admin/ContentCRUD'
import { requireMod } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { gateAdmin } from '@/lib/page-guards'

export const metadata = { title: 'Past papers · admin' }

export default async function AdminPapersPage() {
  await gateAdmin('/admin/content/papers')
  try { await requireMod() } catch { redirect('/') }

  const fields: FieldType[] = [
    { type: 'text',   key: 'title',     label: 'Title', placeholder: 'Midterm 2024 — Set A' },
    { type: 'text',   key: 'session',   label: 'Session', placeholder: 'Spring 2024' },
    { type: 'select', key: 'type',      label: 'Type', options: ['Midterm','Final','CT','Quiz'] as const },
    { type: 'number', key: 'pages',     label: 'Pages' },
    { type: 'number', key: 'qCount',    label: 'Question count' },
    { type: 'number', key: 'sortOrder', label: 'Sort order' },
    { type: 'file',   key: 'fileUrl',   label: 'PDF file', folder: 'papers', accept: '.pdf' },
  ]

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <ContentCRUD
              collection="papers"
              title="Past papers"
              description="Midterm, final, CT and quiz banks from previous semesters. Sorted into groups by type on the public page."
              fields={fields}
              initial={{ type: 'Midterm', pages: 0, qCount: 0, sortOrder: 0 }}
              listColumns={[
                { key: 'title',   label: 'Title' },
                { key: 'session', label: 'Session' },
                { key: 'type',    label: 'Type' },
                { key: 'qCount',  label: 'Q count' },
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
