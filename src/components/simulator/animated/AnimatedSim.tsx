'use client'
/**
 * Dispatch by chapter ID to the right animated simulator. Modern themed
 * panel wrapper; the simulator canvas itself stays a dark "scope" surface.
 */
import { lazy, Suspense } from 'react'

const Ch1 = lazy(() => import('./Ch1BasicCircuitSim'))
const Ch2 = lazy(() => import('./Ch2DividerSim'))
const Ch3 = lazy(() => import('./Ch3NodalSim'))
const Ch4 = lazy(() => import('./Ch4TheveninSim'))
const Ch6 = lazy(() => import('./Ch6CapacitorSim'))
const Ch7 = lazy(() => import('./Ch7RCTransientSim'))

const REGISTRY: Record<string, { title: string; Comp: React.LazyExoticComponent<React.FC> }> = {
  ch1: { title: 'Power flow in a basic circuit', Comp: Ch1 },
  ch2: { title: 'Voltage divider — KVL verifier', Comp: Ch2 },
  ch3: { title: 'Nodal analysis demonstrator', Comp: Ch3 },
  ch4: { title: 'Thévenin equivalent + max power', Comp: Ch4 },
  ch6: { title: 'Capacitors: series / parallel + energy', Comp: Ch6 },
  ch7: { title: 'RC transient — charging & discharging', Comp: Ch7 },
}

export default function AnimatedSim({ chapterId }: { chapterId: string }) {
  const entry = REGISTRY[chapterId]
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 18,
      overflow: 'hidden', boxShadow: 'var(--shadow-md)', position: 'relative',
    }}>
      {/* bottom-left accent glow */}
      <span aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(420px 280px at 0% 100%, var(--mint-soft), transparent 70%)' }} />

      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 22px', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,.015)',
      }}>
        <span className="badge-pill"><span className="pip" /> Live</span>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.01em' }}>
          {entry?.title ?? 'Out of scope'}
        </span>
        <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Interactive
        </span>
      </div>

      <div style={{ position: 'relative', padding: 'clamp(16px,2.5vw,28px)' }}>
        {entry ? (
          <Suspense fallback={<div style={{ fontSize: 14, color: 'var(--muted)', padding: '48px 0', textAlign: 'center' }}>Loading simulator…</div>}>
            <entry.Comp />
          </Suspense>
        ) : (
          <div className="mono" style={{ fontSize: 14, color: 'var(--muted)', padding: '48px 0', textAlign: 'center' }}>
            This chapter is outside the BGCTUB 2nd-semester BEE syllabus and currently has no interactive demo.
          </div>
        )}
      </div>
    </div>
  )
}
