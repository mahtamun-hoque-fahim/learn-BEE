import type { ReactNode } from 'react'

export function SectionHeader({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow?: string
  title: string
  sub?: string
  action?: ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 24,
        marginBottom: 28,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ maxWidth: 640 }}>
        {eyebrow && (
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.05, marginBottom: 10 }}>
          {title}
        </h2>
        {sub && (
          <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 580 }}>{sub}</p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}
