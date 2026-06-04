'use client'
/**
 * Dispatch by chapter ID to the right animated simulator. In-scope chapters
 * (per instruction.txt) get a topic-tailored sim with animated current flow.
 * Out-of-scope chapters render a placeholder that explains they're outside
 * the BGCTUB 2nd-semester syllabus.
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
  ch2: { title: 'Voltage divider — KVL verifier',  Comp: Ch2 },
  ch3: { title: 'Nodal analysis demonstrator',     Comp: Ch3 },
  ch4: { title: 'Thévenin equivalent + max power', Comp: Ch4 },
  ch6: { title: 'Capacitors: series / parallel + energy', Comp: Ch6 },
  ch7: { title: 'RC transient — charging & discharging', Comp: Ch7 },
}

export default function AnimatedSim({ chapterId }: { chapterId: string }) {
  const entry = REGISTRY[chapterId]
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#222] bg-[#0d0d0d] flex items-center gap-3">
        <span className="text-xs font-mono text-[#3DF49A] uppercase tracking-wider">Interactive demo</span>
        <span className="text-sm text-[#d4d4d4] font-syne font-semibold">{entry?.title ?? 'Out of scope'}</span>
      </div>
      <div className="p-5">
        {entry ? (
          <Suspense fallback={<div className="text-sm text-[#888] py-8 text-center">Loading simulator…</div>}>
            <entry.Comp />
          </Suspense>
        ) : (
          <div className="text-sm text-[#888] py-8 text-center font-mono">
            This chapter is outside the BGCTUB 2nd-semester BEE syllabus and currently has no interactive demo.
          </div>
        )}
      </div>
    </div>
  )
}
