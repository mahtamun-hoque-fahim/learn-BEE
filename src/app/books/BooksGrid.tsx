'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/design/icons'
import type { Book } from '@/lib/landing-data'

const TAG_PILL: Record<Book['tag'], string> = {
  Primary: 'pill primary',
  Reference: 'pill',
  Optional: 'pill warn',
}

/** A "real book" cover — uses the uploaded cover image when present, else a
 *  generated spine/cover from the book's swatch colour (image-2 look). */
function BookCover({ book, w = 150 }: { book: Book; w?: number }) {
  const h = Math.round(w * 1.4)
  if (book.coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.coverUrl}
        alt={`${book.title} cover`}
        width={w}
        height={h}
        style={{ width: w, height: h, objectFit: 'cover', borderRadius: 8, display: 'block', boxShadow: 'var(--shadow-md)' }}
      />
    )
  }
  return (
    <div
      style={{
        width: w, height: h, flexShrink: 0, borderRadius: 8, position: 'relative', overflow: 'hidden',
        background: book.swatch,
        boxShadow: 'var(--shadow-md), inset 0 0 0 1px rgba(255,255,255,.06)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 14, color: 'rgba(255,255,255,.92)',
      }}
    >
      {/* spine seam */}
      <span style={{ position: 'absolute', top: 0, bottom: 0, left: 9, width: 1, background: 'rgba(255,255,255,.14)' }} />
      <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: w > 130 ? 14 : 11, lineHeight: 1.2, letterSpacing: '-0.01em', paddingLeft: 6 }}>
        {book.title}
      </span>
      <span
        className="mono"
        style={{
          alignSelf: 'flex-start', marginLeft: 6, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '3px 6px', borderRadius: 5, background: 'rgba(0,0,0,.28)', border: '1px solid rgba(255,255,255,.18)',
        }}
      >
        {book.edition || '—'}
      </span>
    </div>
  )
}

function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const downloadHref = book.fileUrl || book.externalUrl || null
  const available = Boolean(downloadHref)
  const isPdf = Boolean(book.fileUrl)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={book.title}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, display: 'grid', placeItems: 'center', padding: 20,
        background: 'rgba(0,0,0,.62)', backdropFilter: 'blur(6px)',
        animation: 'fade .2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="card"
        style={{
          width: '100%', maxWidth: 540, background: 'var(--surface)', borderColor: 'var(--line-2)',
          borderRadius: 18, boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden',
          animation: 'fadeUp .25s ease both',
        }}
      >
        {/* bottom-left accent glow, dy/dx flavour */}
        <span aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(380px 260px at 0% 100%, var(--mint-soft), transparent 70%)',
        }} />

        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2, width: 34, height: 34, borderRadius: 999,
            display: 'grid', placeItems: 'center', background: 'var(--bg-2)', border: '1px solid var(--line-2)', color: 'var(--muted)',
          }}
        >
          <Icon name="close" size={16} />
        </button>

        <div style={{ position: 'relative', padding: 'clamp(22px,3vw,30px)', display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <BookCover book={book} w={150} />

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className={TAG_PILL[book.tag]}>{book.tag}</span>
              <span className={`pill ${available ? 'ok' : 'warn'} dot`}>
                {available ? 'Available' : 'Not uploaded yet'}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>
              {book.title}
            </h2>
            <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 4 }}>{book.author}</div>
            {book.edition && <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{book.edition}</div>}

            {book.note && (
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginTop: 14 }}>{book.note}</p>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              {downloadHref ? (
                <a
                  href={downloadHref}
                  {...(isPdf ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="btn-primary btn-sm"
                >
                  <Icon name="download" size={14} /> {isPdf ? 'Download PDF' : 'Download'}
                </a>
              ) : (
                <span className="pill warn" style={{ alignSelf: 'center' }}>Not uploaded yet</span>
              )}
              <button onClick={onClose} className="btn-line btn-sm">Close</button>
            </div>
          </div>
        </div>

        {/* provenance line */}
        <div style={{ position: 'relative', borderTop: '1px solid var(--line)', padding: '14px clamp(22px,3vw,30px)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent)', display: 'inline-flex' }}><Icon name="check" size={14} /></span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.02em' }}>
            Provided by BEE course instructor · Jan–Jun 2026 session
          </span>
        </div>
      </div>
    </div>
  )
}

export default function BooksGrid({ books }: { books: Book[] }) {
  const [selected, setSelected] = useState<Book | null>(null)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {books.map(book => {
          const available = Boolean(book.fileUrl || book.externalUrl)
          return (
            <button
              key={book.id}
              onClick={() => setSelected(book)}
              style={{
                textAlign: 'left', background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 14, boxShadow: 'var(--shadow-sm)', overflow: 'hidden', display: 'flex',
                cursor: 'pointer', transition: 'border-color .15s, transform .12s',
              }}
              className="book-card"
            >
              <div style={{
                width: 76, flexShrink: 0, background: book.swatch, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.85)',
              }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', writingMode: 'vertical-rl', textTransform: 'uppercase', transform: 'rotate(180deg)' }}>
                  {book.edition}
                </span>
              </div>
              <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className={TAG_PILL[book.tag]}>{book.tag}</span>
                  <span className={`pill ${available ? 'ok' : 'warn'} dot`}>{available ? 'Available' : 'Not uploaded'}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 4 }}>
                  {book.title}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 10 }}>{book.author}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, flex: 1 }}>{book.note}</p>
                <span style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--accent)' }}>
                  View details <Icon name="arrow" size={12} />
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}

      <style>{`.book-card:hover { border-color: var(--line-2) !important; transform: translateY(-2px); }`}</style>
    </>
  )
}
