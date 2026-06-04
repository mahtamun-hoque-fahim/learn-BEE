'use client'
/**
 * Chapter 2: Basic Laws — Voltage divider with KVL verification.
 * Two resistors in series across a source. Sliders control R1 & R2; the
 * schematic animates current, and bar gauges show how Vs splits across R1, R2.
 */
import { useState } from 'react'
import { AnimatedWire, Battery, NodeDot, Resistor, Slider, Readout, CircuitAnimStyles, CurrentArrow } from './primitives'

export default function Ch2DividerSim() {
  const [V, setV] = useState(12)
  const [R1, setR1] = useState(4)
  const [R2, setR2] = useState(8)

  const I = V / (R1 + R2)
  const V1 = I * R1
  const V2 = I * R2
  const kvl = V - V1 - V2 // should be ~0

  // Bar widths (px) — total bar is 220
  const w1 = (V1 / V) * 220
  const w2 = (V2 / V) * 220

  return (
    <div className="space-y-4">
      <CircuitAnimStyles />
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        {/* Schematic */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
          <svg viewBox="0 0 360 220" className="w-full" style={{ aspectRatio: '360 / 220' }}>
            {/* Loop wires */}
            <AnimatedWire d="M 60 60 L 60 30 L 300 30 L 300 80" current={I} direction={1} />
            <AnimatedWire d="M 300 140 L 300 190 L 60 190 L 60 140" current={I} direction={1} />
            {/* Source */}
            <Battery x={60} y={100} orient="v" label={`Vs ${V} V`} />
            {/* R1, R2 stacked on the right */}
            <Resistor x={300} y={70}  orient="v" label={`R₁ ${R1} Ω`} active={I > 0.001} />
            <Resistor x={300} y={130} orient="v" label={`R₂ ${R2} Ω`} active={I > 0.001} />
            <AnimatedWire d="M 300 90 L 300 110" current={I} direction={1} />
            {/* Output tap (Vout across R2) */}
            <NodeDot x={300} y={110} label="V_out" labelDx={20} labelDy={4} />
            {/* Direction arrow */}
            {I > 0.001 && <CurrentArrow x={180} y={30} />}
            {/* Nodes */}
            <NodeDot x={60} y={30} /><NodeDot x={60} y={190} /><NodeDot x={300} y={30} /><NodeDot x={300} y={190} />
          </svg>
        </div>

        {/* Controls + readouts */}
        <div className="space-y-3">
          <Slider label="Source V" value={V} min={1} max={24} onChange={setV} unit="V" />
          <Slider label="R₁" value={R1} min={1} max={20} onChange={setR1} unit="Ω" accent="#ffaa00" />
          <Slider label="R₂" value={R2} min={1} max={20} onChange={setR2} unit="Ω" accent="#7aa2ff" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Readout label="i = V / (R₁+R₂)" value={(I * 1000).toFixed(1)} unit="mA" />
            <Readout label="V₁ = i·R₁" value={V1.toFixed(2)} unit="V" color="#ffaa00" />
            <Readout label="V₂ = i·R₂" value={V2.toFixed(2)} unit="V" color="#7aa2ff" />
            <Readout label="KVL check" value={kvl.toFixed(3)} unit="V ≈ 0" color={Math.abs(kvl) < 0.01 ? '#3DF49A' : '#ff4444'} />
          </div>
        </div>
      </div>

      {/* Bar gauge showing voltage split */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
        <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono mb-2">Voltage split across R₁ and R₂</div>
        <div className="flex h-8 rounded overflow-hidden border border-[#1a1a1a]">
          <div style={{ width: w1, transition: 'width .25s ease', background: '#ffaa00' }} className="flex items-center justify-center text-[11px] font-mono text-black font-semibold">
            V₁ {V1.toFixed(1)}V
          </div>
          <div style={{ width: w2, transition: 'width .25s ease', background: '#7aa2ff' }} className="flex items-center justify-center text-[11px] font-mono text-black font-semibold">
            V₂ {V2.toFixed(1)}V
          </div>
        </div>
        <p className="text-xs text-[#666] mt-2 font-mono">V₁ + V₂ = {(V1 + V2).toFixed(2)} V ≈ {V} V  (KVL ✓)</p>
      </div>
    </div>
  )
}
