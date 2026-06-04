'use client'
/**
 * Chapter 6: Capacitors and Inductors — Energy + Series/Parallel combinations.
 *
 *  - Two capacitors C1, C2 connected either in series or parallel across a
 *    source Vs (set by a toggle).
 *  - Live: C_eq, charge Q on each, energy ½CV², and which capacitor holds
 *    more energy.
 *  - For series: same charge on both, voltages divide inversely with capacitance.
 *  - For parallel: same voltage, charges add.
 */
import { useState } from 'react'
import { AnimatedWire, Battery, Capacitor, NodeDot, Slider, Readout, CircuitAnimStyles } from './primitives'

export default function Ch6CapacitorSim() {
  const [Vs, setVs] = useState(12)
  const [C1, setC1] = useState(100)   // µF
  const [C2, setC2] = useState(220)   // µF
  const [mode, setMode] = useState<'series' | 'parallel'>('parallel')

  const c1F = C1 * 1e-6
  const c2F = C2 * 1e-6
  const Ceq = mode === 'parallel' ? c1F + c2F : (c1F * c2F) / (c1F + c2F)
  const CeqMicro = Ceq * 1e6

  let V1: number, V2: number, Q1: number, Q2: number
  if (mode === 'parallel') {
    V1 = V2 = Vs
    Q1 = c1F * V1
    Q2 = c2F * V2
  } else {
    // series: same Q on both, V splits ∝ 1/C
    const Q = Ceq * Vs
    Q1 = Q2 = Q
    V1 = Q / c1F
    V2 = Q / c2F
  }
  const W1 = 0.5 * c1F * V1 * V1
  const W2 = 0.5 * c2F * V2 * V2
  const Wtotal = 0.5 * Ceq * Vs * Vs

  const ch1 = V1 / Vs
  const ch2 = V2 / Vs

  return (
    <div className="space-y-4">
      <CircuitAnimStyles />

      <div className="flex gap-2">
        <button onClick={() => setMode('parallel')} className={`text-xs font-mono px-3 py-1.5 rounded border ${mode === 'parallel' ? 'bg-[#3DF49A] text-black border-[#3DF49A]' : 'border-[#333] text-[#888]'}`}>Parallel</button>
        <button onClick={() => setMode('series')}    className={`text-xs font-mono px-3 py-1.5 rounded border ${mode === 'series' ? 'bg-[#3DF49A] text-black border-[#3DF49A]' : 'border-[#333] text-[#888]'}`}>Series</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
          <svg viewBox="0 0 360 220" className="w-full" style={{ aspectRatio: '360 / 220' }}>
            <Battery x={50} y={110} orient="v" label={`Vs ${Vs}V`} />
            {mode === 'parallel' ? (
              <>
                <AnimatedWire d="M 50 80 L 50 30 L 290 30 L 290 80" current={0.3} />
                <AnimatedWire d="M 50 140 L 50 190 L 290 190 L 290 140" current={0.3} />
                <Capacitor x={210} y={110} orient="v" label={`C₁ ${C1}µF`} charge={ch1} />
                <Capacitor x={290} y={110} orient="v" label={`C₂ ${C2}µF`} charge={ch2} />
                <AnimatedWire d="M 210 96 L 210 30" current={0} color="#444" />
                <AnimatedWire d="M 210 124 L 210 190" current={0} color="#444" />
              </>
            ) : (
              <>
                <AnimatedWire d="M 50 80 L 50 30 L 290 30 L 290 70" current={0.3} />
                <AnimatedWire d="M 290 130 L 290 145" current={0} color="#444" />
                <AnimatedWire d="M 290 170 L 290 190 L 50 190 L 50 140" current={0.3} />
                <Capacitor x={290} y={90} orient="v" label={`C₁ ${C1}µF`} charge={ch1} />
                <Capacitor x={290} y={155} orient="v" label={`C₂ ${C2}µF`} charge={ch2} />
              </>
            )}
            <NodeDot x={50} y={30} /><NodeDot x={50} y={190} />
          </svg>
        </div>

        <div className="space-y-3">
          <Slider label="Source Vs" value={Vs} min={1} max={24} onChange={setVs} unit="V" />
          <Slider label="C₁" value={C1} min={10} max={1000} step={10} onChange={setC1} unit="µF" accent="#ffaa00" />
          <Slider label="C₂" value={C2} min={10} max={1000} step={10} onChange={setC2} unit="µF" accent="#7aa2ff" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Readout label="C_eq" value={CeqMicro.toFixed(1)} unit="µF" />
            <Readout label="Total energy ½C_eq·V²" value={(Wtotal * 1000).toFixed(2)} unit="mJ" />
            <Readout label="V across C₁" value={V1.toFixed(2)} unit="V" color="#ffaa00" />
            <Readout label="V across C₂" value={V2.toFixed(2)} unit="V" color="#7aa2ff" />
            <Readout label="Q on C₁" value={(Q1 * 1000).toFixed(2)} unit="mC" color="#ffaa00" />
            <Readout label="Q on C₂" value={(Q2 * 1000).toFixed(2)} unit="mC" color="#7aa2ff" />
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 text-xs text-[#888] leading-relaxed font-mono">
        Energy split: C₁ holds <span style={{ color: '#ffaa00' }}>{(W1 * 1000).toFixed(2)} mJ</span>{' '}
        ({(W1 / (W1 + W2) * 100).toFixed(0)}%), C₂ holds <span style={{ color: '#7aa2ff' }}>{(W2 * 1000).toFixed(2)} mJ</span>{' '}
        ({(W2 / (W1 + W2) * 100).toFixed(0)}%).
        {mode === 'series' ? (
          <span className="block mt-1">In series: same Q on both; the <i>smaller</i> capacitor sees the larger voltage and stores more energy.</span>
        ) : (
          <span className="block mt-1">In parallel: same V on both; the <i>larger</i> capacitor stores more charge and more energy.</span>
        )}
      </div>
    </div>
  )
}
