'use client'
/**
 * Chapter 7: First-Order Circuits — RC charging/discharging.
 *
 * Centrepiece. A live animated RC circuit:
 *   - The schematic shows a battery → switch → R → C loop, with current
 *     animation speed bound to |i(t)|, and the capacitor plate fill bound
 *     to v_C(t)/V_s.
 *   - A real-time clock runs t from 0 → 5τ over ~5 seconds (or user can scrub).
 *   - Side plot tracks v_C(t) and i_C(t) with a moving dot.
 *
 * Equations:
 *   charging:    v_C(t) = Vs·(1 − e^(−t/τ)),   i(t) = (Vs/R)·e^(−t/τ)
 *   discharging: v_C(t) = V₀·e^(−t/τ),         i(t) = −(V₀/R)·e^(−t/τ)
 *   τ = RC
 */
import { useEffect, useRef, useState } from 'react'
import { AnimatedWire, Battery, Capacitor, NodeDot, Resistor, Slider, Readout, CircuitAnimStyles, CurrentArrow } from './primitives'

export default function Ch7RCTransientSim() {
  const [Vs, setVs] = useState(12)
  const [R, setR] = useState(10)       // kΩ
  const [C, setC] = useState(100)      // µF
  const [mode, setMode] = useState<'charge' | 'discharge'>('charge')
  const [running, setRunning] = useState(false)
  const [t, setT] = useState(0)         // in seconds of simulated time

  const tau = (R * 1000) * (C * 1e-6)   // s
  const tEnd = 5 * tau

  // animation loop — advance t while running
  const raf = useRef<number | null>(null)
  const lastTs = useRef<number | null>(null)
  const speed = useRef(1)               // sim-seconds per real-second
  useEffect(() => { speed.current = tEnd / 5 }, [tEnd])  // always finish in ~5s

  useEffect(() => {
    if (!running) {
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      lastTs.current = null
      return
    }
    function step(ts: number) {
      if (lastTs.current !== null) {
        const dt = (ts - lastTs.current) / 1000
        setT(prev => {
          const next = prev + dt * speed.current
          if (next >= tEnd) { setRunning(false); return tEnd }
          return next
        })
      }
      lastTs.current = ts
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current !== null) cancelAnimationFrame(raf.current) }
  }, [running, tEnd])

  // values at current t
  const vC = mode === 'charge'
    ? Vs * (1 - Math.exp(-t / tau))
    : Vs * Math.exp(-t / tau)
  const iA = mode === 'charge'
    ? (Vs / (R * 1000)) * Math.exp(-t / tau)
    : -(Vs / (R * 1000)) * Math.exp(-t / tau)
  const energy = 0.5 * (C * 1e-6) * vC * vC

  // build v(t) and i(t) curves (full range 0..5τ)
  const N = 80
  const vPts: Array<[number, number]> = []
  const iPts: Array<[number, number]> = []
  for (let k = 0; k <= N; k++) {
    const ti = (k / N) * tEnd
    const v = mode === 'charge' ? Vs * (1 - Math.exp(-ti / tau)) : Vs * Math.exp(-ti / tau)
    const i = mode === 'charge'
      ? (Vs / (R * 1000)) * Math.exp(-ti / tau)
      : -(Vs / (R * 1000)) * Math.exp(-ti / tau)
    vPts.push([ti, v]); iPts.push([ti, i])
  }

  // plot helpers
  const plotW = 320, plotH = 90, pad = 4
  const xT = (ti: number) => pad + (ti / tEnd) * (plotW - 2 * pad)
  const yV = (v: number)  => pad + (1 - v / Vs) * (plotH - 2 * pad)
  const Imax = Vs / (R * 1000)
  const yI = (i: number)  => mode === 'charge'
    ? pad + (1 - i / Imax) * (plotH - 2 * pad)
    : pad + (1 - (i + Imax) / Imax) * (plotH - 2 * pad)
  const vPath = vPts.map(([ti, v], k) => `${k ? 'L' : 'M'} ${xT(ti).toFixed(1)} ${yV(v).toFixed(1)}`).join(' ')
  const iPath = iPts.map(([ti, i], k) => `${k ? 'L' : 'M'} ${xT(ti).toFixed(1)} ${yI(i).toFixed(1)}`).join(' ')

  return (
    <div className="space-y-4">
      <CircuitAnimStyles />

      <div className="flex gap-2">
        <button onClick={() => { setMode('charge'); setT(0) }}    className={`text-xs font-mono px-3 py-1.5 rounded border ${mode === 'charge'    ? 'bg-[#00e676] text-black border-[#00e676]' : 'border-[#333] text-[#888]'}`}>Charging</button>
        <button onClick={() => { setMode('discharge'); setT(0) }} className={`text-xs font-mono px-3 py-1.5 rounded border ${mode === 'discharge' ? 'bg-[#00e676] text-black border-[#00e676]' : 'border-[#333] text-[#888]'}`}>Discharging</button>
        <div className="flex-1" />
        <button onClick={() => setRunning(r => !r)} className="text-xs font-mono px-3 py-1.5 rounded bg-[#1a1a1a] border border-[#333] text-[#d4d4d4] hover:border-[#00e676]">
          {running ? '⏸ Pause' : '▶ Run'}
        </button>
        <button onClick={() => { setT(0); setRunning(false) }} className="text-xs font-mono px-3 py-1.5 rounded bg-[#1a1a1a] border border-[#333] text-[#888]">↺ Reset</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
          <svg viewBox="0 0 360 220" className="w-full" style={{ aspectRatio: '360 / 220' }}>
            <Battery x={50} y={110} orient="v" label={`Vs ${Vs}V`} />
            <AnimatedWire d="M 50 80 L 50 30 L 130 30" current={Math.abs(iA)} direction={iA >= 0 ? 1 : -1} />
            <Resistor x={170} y={30} orient="h" label={`R ${R}kΩ`} active={Math.abs(iA) > 1e-6} />
            <AnimatedWire d="M 210 30 L 290 30 L 290 80" current={Math.abs(iA)} direction={iA >= 0 ? 1 : -1} />
            <Capacitor x={290} y={110} orient="v" label={`C ${C}µF`} charge={vC / Vs} />
            <AnimatedWire d="M 290 140 L 290 190 L 50 190 L 50 140" current={Math.abs(iA)} direction={iA >= 0 ? 1 : -1} />
            {Math.abs(iA) > 1e-7 && <CurrentArrow x={140} y={30} angle={iA >= 0 ? 0 : 180} />}
            <NodeDot x={50} y={30} /><NodeDot x={50} y={190} /><NodeDot x={290} y={30} /><NodeDot x={290} y={190} />
          </svg>
          <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono mt-2">
            Time: <span className="text-[#00e676]">{t < 1 ? (t * 1000).toFixed(0) + ' ms' : t.toFixed(2) + ' s'}</span>
            <span className="mx-2 text-[#444]">·</span>
            τ markers:&nbsp;
            {[1, 2, 3, 4, 5].map(k => (
              <span key={k} className={k * tau <= t ? 'text-[#00e676]' : 'text-[#555]'}>
                {k}τ{k < 5 ? ' ' : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Slider label="Vs" value={Vs} min={1} max={24} onChange={(v) => { setVs(v); setT(0) }} unit="V" />
          <Slider label="R" value={R} min={1} max={100} onChange={(v) => { setR(v); setT(0) }} unit="kΩ" accent="#ffaa00" />
          <Slider label="C" value={C} min={10} max={1000} step={10} onChange={(v) => { setC(v); setT(0) }} unit="µF" accent="#7aa2ff" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Readout label="τ = RC" value={tau >= 1 ? tau.toFixed(2) : (tau * 1000).toFixed(0)} unit={tau >= 1 ? 's' : 'ms'} />
            <Readout label="Full = 5τ" value={tEnd >= 1 ? tEnd.toFixed(2) : (tEnd * 1000).toFixed(0)} unit={tEnd >= 1 ? 's' : 'ms'} />
            <Readout label="v_C(t)" value={vC.toFixed(3)} unit="V" color="#ffaa00" />
            <Readout label="i(t)" value={(iA * 1000).toFixed(3)} unit="mA" color="#7aa2ff" />
            <Readout label="Energy ½Cv²" value={(energy * 1000).toFixed(3)} unit="mJ" />
            <Readout label="Peak i = Vs/R" value={(Imax * 1000).toFixed(2)} unit="mA" color="#aaa" />
          </div>
        </div>
      </div>

      {/* v(t) plot */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
        <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono mb-2">v_C(t) — capacitor voltage</div>
        <svg viewBox={`0 0 ${plotW} ${plotH}`} className="w-full" style={{ aspectRatio: `${plotW} / ${plotH}` }}>
          {[1, 2, 3, 4].map(k => <line key={k} x1={xT(k * tau)} x2={xT(k * tau)} y1={0} y2={plotH} stroke="#1a1a1a" strokeWidth="1" />)}
          <path d={vPath} fill="none" stroke="#ffaa00" strokeWidth="1.8" />
          <circle cx={xT(Math.min(t, tEnd))} cy={yV(vC)} r={4} fill="#ffaa00" stroke="#0a0a0a" strokeWidth="1.5" />
        </svg>
      </div>

      {/* i(t) plot */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
        <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono mb-2">i(t) — current</div>
        <svg viewBox={`0 0 ${plotW} ${plotH}`} className="w-full" style={{ aspectRatio: `${plotW} / ${plotH}` }}>
          {[1, 2, 3, 4].map(k => <line key={k} x1={xT(k * tau)} x2={xT(k * tau)} y1={0} y2={plotH} stroke="#1a1a1a" strokeWidth="1" />)}
          <line x1={0} x2={plotW} y1={mode === 'discharge' ? plotH - pad : pad} y2={mode === 'discharge' ? plotH - pad : pad} stroke="#333" strokeDasharray="3 3" />
          <path d={iPath} fill="none" stroke="#7aa2ff" strokeWidth="1.8" />
          <circle cx={xT(Math.min(t, tEnd))} cy={yI(iA)} r={4} fill="#7aa2ff" stroke="#0a0a0a" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}
