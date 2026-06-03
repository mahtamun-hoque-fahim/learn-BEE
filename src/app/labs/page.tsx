import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { Icon } from '@/components/design/icons'
import { getLabs } from '@/lib/content-public'
import { LABS as SEED_LABS } from '@/lib/landing-data'

export const metadata = { title: 'Labs — learnBEE' }

export const dynamic = 'force-dynamic'

export default async function LabsPage() {
  const LABS = await getLabs()
  const isSeed = LABS === SEED_LABS
  const withVideo = LABS.filter(l => l.hasVideo).length

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <SectionHeader
              eyebrow={`Labs · ${LABS.length} experiments`}
              title="Lab manuals & batch recordings"
              sub="Every experiment from the BEE lab manual. Where a 45th-batch student has filmed it, the recording is linked."
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <span className="pill">{LABS.length} experiments</span>
              <span className="pill ok dot">{withVideo} with video</span>
              <span className="pill">{LABS.length} with manual</span>
              {isSeed && <span className="pill warn">Sample data — admin can add real entries</span>}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 12,
            }}>
              {LABS.map(lab => (
                <article key={lab.id} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  boxShadow: 'var(--shadow-sm)',
                  padding: 18,
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="mono" style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 16,
                      color: 'var(--accent)',
                    }}>
                      {lab.n}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{
                        fontFamily: 'var(--display)', fontWeight: 600, fontSize: 16,
                        letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 3,
                      }}>
                        {lab.title}
                      </h3>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {lab.contributor}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {lab.hasVideo && (
                      <span className="pill ok dot">Video · {lab.length}</span>
                    )}
                    {lab.hasManual && (
                      <span className="pill">Manual PDF</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    {lab.hasVideo && (
                      <a
                        href="#"
                        style={{
                          flex: 1,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '9px 14px',
                          background: 'var(--accent)', color: '#0A0A0A',
                          borderRadius: 999, fontSize: 13, fontWeight: 600,
                        }}
                      >
                        <Icon name="play" size={12} /> Watch
                      </a>
                    )}
                    {lab.hasManual && (
                      <a
                        href="#"
                        style={{
                          flex: 1,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '9px 14px',
                          background: 'var(--bg)', border: '1px solid var(--line)',
                          borderRadius: 999, fontSize: 13, color: 'var(--ink-2)',
                        }}
                      >
                        <Icon name="download" size={12} /> Manual
                      </a>
                    )}
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
