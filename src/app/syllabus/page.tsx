import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { inScopeChapters } from '@/lib/curriculum'
import SyllabusClient from './SyllabusClient'

export const metadata = { title: 'Syllabus — learnBEE' }

export default function SyllabusPage() {
  const units = inScopeChapters.map(ch => ({
    id: ch.id,
    code: String(ch.number ?? '').padStart(2, '0'),
    title: ch.title,
    summary:
      ch.id === 'ch1' ? 'Charge, current, voltage, power, energy. The vocabulary of the whole course.' :
      ch.id === 'ch2' ? 'Ohm’s law, KCL, KVL, series–parallel, dividers, wye–delta.' :
      ch.id === 'ch3' ? 'Nodal and mesh analysis, supernodes, supermeshes — systematic problem-solving.' :
      ch.id === 'ch4' ? 'Linearity, superposition, source transformation, Thévenin, Norton, max power.' :
      ch.id === 'ch6' ? 'Capacitor structure, energy, series/parallel — RC charging and discharging.' :
      ch.id === 'ch7' ? 'First-order RC transients: natural response, step response, time constants.' :
      '',
    topicCount: ch.topics.length,
    formulaCount: ch.key_formulas.length,
    topics: ch.topics.map(t => (typeof t === 'string' ? t : t.title)),
  }))

  const totalTopics = units.reduce((s, u) => s + u.topicCount, 0)
  const totalFormulas = units.reduce((s, u) => s + u.formulaCount, 0)

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <SectionHeader
              eyebrow={`Syllabus · ${units.length} chapters`}
              title="What you’ll cover, chapter by chapter"
              sub="Tap any chapter to see its topics. The check mark is just for you — it persists in your browser."
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <span className="pill">{units.length} chapters</span>
              <span className="pill">{totalTopics} topics</span>
              <span className="pill">{totalFormulas} formulas</span>
              <span className="pill primary dot">BGCTUB 2nd-sem syllabus</span>
            </div>

            <SyllabusClient units={units} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
