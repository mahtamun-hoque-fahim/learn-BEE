import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import ContentCRUD, { type FieldType } from '@/components/admin/ContentCRUD'
import { requireMod } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { inScopeChapters } from '@/lib/curriculum'

export const metadata = { title: 'Lectures · admin' }

export default async function AdminLecturesPage() {
  try { await requireMod() } catch { redirect('/') }

  const chapterIds = inScopeChapters.map(c => c.id)
  const fields: FieldType[] = [
    { type: 'text',   key: 'title',     label: 'Title', required: true, placeholder: 'KCL, KVL & the art of writing equations' },
    { type: 'select', key: 'chapterId', label: 'Chapter', options: chapterIds },
    { type: 'select', key: 'type',      label: 'Type',  options: ['Lecture','Tutorial','Review'] as const },
    { type: 'text',   key: 'date',      label: 'Date label', placeholder: 'Jan 14' },
    { type: 'text',   key: 'duration',  label: 'Duration label', placeholder: '42 min' },
    { type: 'number', key: 'pages',     label: 'Pages' },
    { type: 'select', key: 'ext',       label: 'File type', options: ['PDF','PPT','DOC'] as const },
    { type: 'number', key: 'sortOrder', label: 'Sort order' },
    { type: 'file',   key: 'fileUrl',   label: 'Notes file', folder: 'lectures', accept: '.pdf,.ppt,.pptx,.doc,.docx' },
    { type: 'file',   key: 'videoUrl',  label: 'Video file or URL', folder: 'lectures' },
  ]

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <ContentCRUD
              collection="lectures"
              title="Lectures"
              description="Recorded lectures, tutorial sessions and review-class slides. Each item appears on the public /lectures page, grouped by chapter."
              fields={fields}
              initial={{ type: 'Lecture', ext: 'PDF', pages: 0, sortOrder: 0, chapterId: chapterIds[0] }}
              listColumns={[
                { key: 'title', label: 'Title' },
                { key: 'chapterId', label: 'Chapter' },
                { key: 'type', label: 'Type' },
                { key: 'duration', label: 'Duration' },
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
