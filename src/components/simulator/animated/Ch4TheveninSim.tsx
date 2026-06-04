'use client'
/**
 * Chapter 4: Circuit Theorems — Thévenin equivalent + Max Power Transfer.
 * Internal: Vs in series with Rs (Thévenin source) drives a load R_L.
 *   V_L = Vs · R_L / (Rs + R_L)
 *   P_L = V_L² / R_L
 * Maximum P_L occurs at R_L = Rs, giving P_max = Vs² / (4·Rs).
 *
 * Live readouts + a sparkline showing P_L vs R_L over the slider's range,
 * with the current operating point marked.
 */
import { useState } from 'react'
import { AnimatedWire, Battery, NodeDot, Resistor, Slider, Readout, CircuitAnimStyles, CurrentArrow } from './primitives'

export default function Ch4TheveninSim() {
  const [Vs, setVs] = useState(12)
  const [Rs, setRs] = useState(4)
  const [RL, setRL] = useState(4)

  const I  = Vs / (Rs + RL)
  const VL = I * RL
  const PL = (VL * VL) / RL
  const Pmax = (Vs * Vs) / (4 * Rs)
  const efficiency = (PL / (Vs * I)) * 100

  // Build P_L vs R_L curve over 1..40 Ω
  const RLmax = 40, N = 80
  const pts: Array<[number, number]> = []
  for (let i = 1; i <= N; i++) {
    const rl = (i / N) * RLmax
    const v = Vs * rl / (Rs + rl)
    const p = (v * v) / rl
    pts.push([rl, p])
  }
  const maxP = Math.max(...pts.map(p => p[1]))
  const plotW = 320, plotH = 90
  const pathD = pts.map(([rl, p], i) => `${i ? 'L' : 'M'} ${(rl / RLmax) * plotW} ${plotH - (p / maxP) * (plotH - 6) - 3}`).join(' ')
  const xCur = (RL / RLmax) * plotW
  const yCur = plotH - (PL / maxP) * (plotH - 6) - 3

  return (
    <div className="space-y-4">
      <CircuitAnimStyles />
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
          <svg viewBox="0 0 360 220" className="w-full" style={{ aspectRatio: '360 / 220' }}>
            {/* Boxed Thevenin source on left */}
            <rect x="20" y="40" width="170" height="140" rx="8" fill="none" stroke="#333" strokeDasharray="4 4" />
            <text x="35" y="34" fill="#888" fontSize="10" fontFamily="var(--font-mono, monospace)">Thévenin equivalent</text>

            <Battery x={50} y={140} orient="v" label={`V_Th ${Vs}V`} />
            <AnimatedWire d="M 50 110 L 50 60 L 90 60" current={I} direction={1} />
            <Resistor x={130} y={60} orient="h" label={`R_Th ${Rs}Ω`} active={I > 0.001} />

            {/* Output terminals */}
            <AnimatedWire d="M 170 60 L 190 60 L 220 60" current={I} direction={1} />
            <NodeDot x={190} y={60} label="a" labelDy={-10} />
            <AnimatedWire d="M 50 170 L 50 200 L 190 200" current={I} direction={1} />
            <NodeDot x={190} y={200} label="b" labelDy={14} />

            {/* External load on right */}
            <AnimatedWire d="M 220 60 L 290 60" current={I} direction={1} />
            <Resistor x={290} y={130} orient="v" label={`R_L ${RL}Ω`} active={I > 0.001} />
            <AnimatedWire d="M 290 110 L 290 80" current={I} direction={1} />
            <AnimatedWire d="M 290 150 L 290 200 L 220 200" current={I} direction={1} />

            {I > 0.001 && <CurrentArrow x={245} y={60} />}
          </svg>
        </div>

        <div className="space-y-3">
          <Slider label="V_Th" value={Vs} min={1} max={24} onChange={setVs} unit="V" />
          <Slider label="R_Th" value={Rs} min={1} max={20} onChange={setRs} unit="Ω" accent="#ffaa00" />
          <Slider label="R_L (load)" value={RL} min={1} max={40} onChange={setRL} unit="Ω" accent="#7aa2ff" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Readout label="i" value={I.toFixed(3)} unit="A" />
            <Readout label="V_L" value={VL.toFixed(2)} unit="V" />
            <Readout label="P_L (load)" value={PL.toFixed(3)} unit="W" color="#7aa2ff" />
            <Readout label="P_max @ R_L=R_Th" value={Pmax.toFixed(3)} unit="W" color="#3DF49A" />
          </div>
          <div className="text-xs font-mono text-[#888] bg-[#0a0a0a] border border-[#1a1a1a] rounded-md px-3 py-2">
            Efficiency η = P_L / P_source = {efficiency.toFixed(1)}%
            {Math.abs(RL - Rs) < 0.5 && <span className="text-[#3DF49A] ml-2">✓ at max power</span>}
          </div>
        </div>
      </div>

      {/* Power curve */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
        <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono mb-2">P_L vs R_L  ·  peaks at R_L = R_Th</div>
        <svg viewBox={`0 0 ${plotW} ${plotH}`} className="w-full" style={{ aspectRatio: `${plotW} / ${plotH}` }}>
          <path d={pathD} fill="none" stroke="#7aa2ff" strokeWidth="1.8" />
          {/* Peak marker: R_L = Rs */}
          <line x1={(Rs / RLmax) * plotW} x2={(Rs / RLmax) * plotW} y1={3} y2={plotH - 3}
                stroke="#3DF49A" strokeDasharray="3 3" strokeWidth="1" />
          <text x={(Rs / RLmax) * plotW + 4} y={12} fill="#3DF49A" fontSize="9" fontFamily="var(--font-mono, monospace)">R_Th</text>
          {/* Current operating point */}
          <circle cx={xCur} cy={yCur} r={4} fill="#7aa2ff" stroke="#0a0a0a" strokeWidth="1.5" />
          <text x={4} y={12} fill="#666" fontSize="9" fontFamily="var(--font-mono, monospace)">P</text>
          <text x={plotW - 4} y={plotH - 4} fill="#666" fontSize="9" fontFamily="var(--font-mono, monospace)" textAnchor="end">R_L → {RLmax}Ω</text>
        </svg>
      </div>
    </div>
  )
}
