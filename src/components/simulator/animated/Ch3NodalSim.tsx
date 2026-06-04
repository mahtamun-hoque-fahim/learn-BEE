'use client'
/**
 * Chapter 3: Methods of Analysis — Nodal analysis demonstrator.
 * Two voltage sources V1, V2 feed a common node through R1 and R2; the node
 * sinks through R3 to ground. Compute V_node by KCL: (V1−Vn)/R1 + (V2−Vn)/R2 = Vn/R3
 * → Vn = (V1·G1 + V2·G2) / (G1+G2+G3).
 * Branch currents animate accordingly.
 */
import { useState } from 'react'
import { AnimatedWire, Battery, NodeDot, Resistor, Slider, Readout, CircuitAnimStyles, CurrentArrow } from './primitives'

export default function Ch3NodalSim() {
  const [V1, setV1] = useState(12)
  const [V2, setV2] = useState(6)
  const [R1, setR1] = useState(4)
  const [R2, setR2] = useState(6)
  const [R3, setR3] = useState(8)

  const G1 = 1 / R1, G2 = 1 / R2, G3 = 1 / R3
  const Vn = (V1 * G1 + V2 * G2) / (G1 + G2 + G3)
  const I1 = (V1 - Vn) / R1   // into node
  const I2 = (V2 - Vn) / R2   // into node
  const I3 = Vn / R3          // out of node
  const kclResidual = I1 + I2 - I3

  return (
    <div className="space-y-4">
      <CircuitAnimStyles />
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
          <svg viewBox="0 0 360 220" className="w-full" style={{ aspectRatio: '360 / 220' }}>
            {/* Sources on left and right, ground rail across bottom, node A at top centre */}
            <Battery x={40} y={140} orient="v" label={`V₁ ${V1}V`} />
            <Battery x={320} y={140} orient="v" label={`V₂ ${V2}V`} />

            {/* Top wires to node A */}
            <AnimatedWire d="M 40 110 L 40 50 L 180 50" current={I1} direction={I1 >= 0 ? 1 : -1} />
            <AnimatedWire d="M 320 110 L 320 50 L 180 50" current={I2} direction={I2 >= 0 ? 1 : -1} />

            {/* R1 horizontal between V1 top and node A */}
            <Resistor x={100} y={50} orient="h" label={`R₁ ${R1}Ω`} active={Math.abs(I1) > 0.001} />
            <Resistor x={260} y={50} orient="h" label={`R₂ ${R2}Ω`} active={Math.abs(I2) > 0.001} />

            {/* Node A and label */}
            <NodeDot x={180} y={50} label={`V_A = ${Vn.toFixed(2)} V`} labelDy={-12} />

            {/* R3 vertical from node to ground rail */}
            <AnimatedWire d="M 180 50 L 180 90" current={I3} direction={1} />
            <Resistor x={180} y={110} orient="v" label={`R₃ ${R3}Ω`} active={Math.abs(I3) > 0.001} />
            <AnimatedWire d="M 180 130 L 180 190" current={I3} direction={1} />

            {/* Ground rail */}
            <AnimatedWire d="M 40 190 L 320 190" current={I3} direction={0} color="#666" />
            <AnimatedWire d="M 40 170 L 40 190" current={I1} direction={I1 >= 0 ? 1 : -1} />
            <AnimatedWire d="M 320 170 L 320 190" current={I2} direction={I2 >= 0 ? 1 : -1} />

            {/* Direction arrows on each branch */}
            {Math.abs(I1) > 0.001 && <CurrentArrow x={155} y={50} angle={I1 >= 0 ? 0 : 180} />}
            {Math.abs(I2) > 0.001 && <CurrentArrow x={210} y={50} angle={I2 >= 0 ? 180 : 0} />}
            {Math.abs(I3) > 0.001 && <CurrentArrow x={180} y={80} angle={90} />}

            {/* Ground triangle */}
            <g transform="translate(180 200)">
              <path d="M -6 0 L 6 0 L 0 7 Z" fill="#666" />
            </g>
          </svg>
        </div>

        <div className="space-y-3">
          <Slider label="V₁" value={V1} min={0} max={24} onChange={setV1} unit="V" />
          <Slider label="V₂" value={V2} min={0} max={24} onChange={setV2} unit="V" accent="#7aa2ff" />
          <div className="grid grid-cols-3 gap-2">
            <Slider label="R₁" value={R1} min={1} max={20} onChange={setR1} unit="Ω" accent="#ffaa00" />
            <Slider label="R₂" value={R2} min={1} max={20} onChange={setR2} unit="Ω" accent="#ffaa00" />
            <Slider label="R₃" value={R3} min={1} max={20} onChange={setR3} unit="Ω" accent="#ffaa00" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Readout label="Node V_A" value={Vn.toFixed(3)} unit="V" />
            <Readout label="i₁ (into A)" value={I1.toFixed(3)} unit="A" color="#ffaa00" />
            <Readout label="i₂ (into A)" value={I2.toFixed(3)} unit="A" color="#7aa2ff" />
            <Readout label="i₃ (out of A)" value={I3.toFixed(3)} unit="A" color="#ff66aa" />
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono">KCL at node A</div>
            <div className="text-sm font-mono mt-1" style={{ color: Math.abs(kclResidual) < 1e-9 ? '#3DF49A' : '#ff4444' }}>
              i₁ + i₂ − i₃ = {kclResidual.toFixed(6)} A ≈ 0 ✓
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#666] leading-relaxed">
        Solving by inspection: V<sub>A</sub> = (V₁·G₁ + V₂·G₂) / (G₁+G₂+G₃) where G = 1/R. Push V₂ above V₁ and watch i₂ become the dominant branch — its current arrow flips direction if V₂ &lt; V_A.
      </p>
    </div>
  )
}
