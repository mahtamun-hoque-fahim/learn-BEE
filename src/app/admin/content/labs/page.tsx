import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import ContentCRUD, { type FieldType } from '@/components/admin/ContentCRUD'
import { requireMod } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Labs · admin' }

export default async function AdminLabsPage() {
  try { await requireMod() } catch { redirect('/') }

  const fields: FieldType[] = [
    { type: 'text',    key: 'number',      label: 'Lab number', placeholder: '01' },
    { type: 'text',    key: 'title',       label: 'Title', placeholder: 'Verification of Ohm’s Law' },
    { type: 'text',    key: 'contributor', label: 'Contributor', placeholder: 'Tahsin · 45B' },
    { type: 'text',    key: 'videoLength', label: 'Video length', placeholder: '06:24' },
    { type: 'boolean', key: 'hasVideo',    label: 'Has video' },
    { type: 'boolean', key: 'hasManual',   label: 'Has manual' },
    { type: 'number',  key: 'sortOrder',   label: 'Sort order' },
    { type: 'file',    key: 'manualUrl',   label: 'Lab manual', folder: 'labs', accept: '.pdf' },
    { type: 'file',    key: 'videoUrl',    label: 'Video file or URL', folder: 'labs' },
  ]

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <ContentCRUD
              collection="labs"
              title="Labs"
              description="Lab experiments — both the manual PDFs and any 45th-batch video walkthroughs. Order them with sortOrder for the public list."
              fields={fields}
              initial={{ hasVideo: false, hasManual: true, sortOrder: 0 }}
              listColumns={[
                { key: 'number', label: '#' },
                { key: 'title',  label: 'Title' },
                { key: 'contributor', label: 'Contributor' },
                { key: 'hasVideo', label: 'Video', render: (i) => i.hasVideo ? 'Yes' : '—' },
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
