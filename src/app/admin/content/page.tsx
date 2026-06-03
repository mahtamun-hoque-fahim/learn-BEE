import Link from 'next/link'
import { Nav } from '@/components/design/Nav'
import { Footer } from '@/components/design/Footer'
import { SectionHeader } from '@/components/design/SectionHeader'
import { Icon } from '@/components/design/icons'
import { requireMod } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Content management — learnBEE admin' }

const TILES = [
  { href: '/admin/content/lectures', icon: 'play',  label: 'Lectures',
    body: 'Recorded class videos, lecture notes, tutorial slides.' },
  { href: '/admin/content/labs',     icon: 'flask', label: 'Labs',
    body: 'Lab manuals, video walkthroughs, contributor credit.' },
  { href: '/admin/content/papers',   icon: 'paper', label: 'Past papers',
    body: 'Midterm, final, CT and quiz banks from previous semesters.' },
  { href: '/admin/content/books',    icon: 'book',  label: 'Books',
    body: 'Textbook references — Sadiku, Boylestad, anything else relevant.' },
] as const

export default async function AdminContentPage() {
  try {
    await requireMod()
  } catch {
    redirect('/')
  }

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 48, paddingBottom: 72 }}>
          <div className="container">
            <SectionHeader
              eyebrow="Admin · content"
              title="Manage Lectures / Labs / Papers / Books"
              sub="Add, edit, delete the items that appear on the public catalogue pages. Syllabus and the cheat-sheet are curated in code; everything else lives here."
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}>
              {TILES.map(t => (
                <Link key={t.href} href={t.href} style={{
                  display: 'block', padding: 22,
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 18, boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'color-mix(in oklab, var(--accent) 14%, transparent)',
                    color: 'var(--accent)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                    <Icon name={t.icon} size={18} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 20, marginBottom: 8 }}>{t.label}</h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{t.body}</p>
                  <div style={{
                    marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 13, fontWeight: 500, color: 'var(--accent)',
                  }}>
                    Manage <Icon name="arrow" size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
