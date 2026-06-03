import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { LECTURES } from '@/lib/landing-data'
import { inScopeChapters } from '@/lib/curriculum'
import LecturesClient from './LecturesClient'

export const metadata = { title: 'Lectures — learnBEE' }

export default function LecturesPage() {
  const totalDur = LECTURES.reduce((s, l) => {
    const m = parseInt(l.duration)
    return s + (isFinite(m) ? m : 0)
  }, 0)
  const chapterTitleById = Object.fromEntries(
    inScopeChapters.map(c => [c.id, c.title])
  ) as Record<string, string>

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <SectionHeader
              eyebrow={`Lectures · ${LECTURES.length} entries`}
              title="Class recordings and lecture notes"
              sub="Recorded lectures, tutorial sessions and review-class slides — paired with the chapter they belong to."
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <span className="pill">{LECTURES.length} lectures</span>
              <span className="pill">~{Math.round(totalDur / 60)} hrs of video</span>
              <span className="pill warn">Sample data — replace with real links</span>
            </div>

            <LecturesClient lectures={LECTURES} chapterTitleById={chapterTitleById} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
