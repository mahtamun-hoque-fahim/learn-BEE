'use client'
/**
 * Chapter 1: Basic Concepts — Power & Energy.
 * A battery, a lamp, and a switch. Watch current flow, bulb brightness, and
 * power dissipation update live with V and R.
 */
import { useState } from 'react'
import { AnimatedWire, Battery, Lamp, NodeDot, Resistor, CurrentArrow, Slider, Readout, CircuitAnimStyles } from './primitives'

export default function Ch1BasicCircuitSim() {
  const [V, setV] = useState(12)
  const [R, setR] = useState(8)   // ohms — small so bulb is meaningful
  const [closed, setClosed] = useState(true)

  const I = closed ? V / R : 0          // A
  const P = V * I                       // W
  const brightness = Math.min(1, P / 30) // normalise: 30 W ~ full

  return (
    <div className="space-y-4">
      <CircuitAnimStyles />
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        {/* Schematic */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
          <svg viewBox="0 0 360 220" className="w-full" style={{ aspectRatio: '360 / 220' }}>
            {/* Outer loop wires */}
            <AnimatedWire d="M 60 70 L 60 30 L 300 30" current={I} direction={1} />
            <AnimatedWire d="M 300 30 L 300 190 L 60 190 L 60 130" current={I} direction={1} />
            {/* Battery on the left */}
            <Battery x={60} y={100} orient="v" label={`${V} V`} />
            {/* Switch in top wire */}
            <g transform="translate(180 30)">
              {closed
                ? <line x1={-10} y1={0} x2={10} y2={0} stroke="#00e676" strokeWidth={1.8} />
                : <line x1={-10} y1={0} x2={8} y2={-10} stroke="#888" strokeWidth={1.8} />}
              <circle cx={-10} cy={0} r={2} fill="#d4d4d4" />
              <circle cx={10} cy={0} r={2} fill="#d4d4d4" />
              <text x={0} y={-12} fill="#888" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono, monospace)">
                {closed ? 'closed' : 'open'}
              </text>
            </g>
            {/* Lamp = lumped R (one resistor in series + a filament lamp) */}
            <Resistor x={240} y={110} orient="v" label={`R ${R} Ω`} active={I > 0.01} />
            <Lamp x={300} y={110} power={brightness} label={`${P.toFixed(1)} W`} />
            <AnimatedWire d="M 300 73 L 300 97" current={I} />
            <AnimatedWire d="M 300 123 L 300 147" current={I} />
            {/* Current direction arrow */}
            {I > 0.01 && <CurrentArrow x={170} y={30} angle={0} />}
            {/* Nodes */}
            <NodeDot x={60} y={30} />
            <NodeDot x={60} y={190} />
            <NodeDot x={300} y={30} />
            <NodeDot x={300} y={190} />
          </svg>
        </div>

        {/* Controls + Readouts */}
        <div className="space-y-3">
          <button
            onClick={() => setClosed(c => !c)}
            className={`w-full text-sm font-semibold px-3 py-2 rounded-md border transition-colors
              ${closed ? 'bg-[#00e676] text-black border-[#00e676]' : 'bg-[#1a1a1a] text-[#888] border-[#333]'}`}
          >
            {closed ? '⏼ Open switch' : '⏼ Close switch'}
          </button>
          <Slider label="Voltage V" value={V} min={1} max={24} onChange={setV} unit="V" />
          <Slider label="Resistance R" value={R} min={1} max={48} onChange={setR} unit="Ω" accent="#ffaa00" />

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Readout label="Current i = V/R" value={I.toFixed(3)} unit="A" />
            <Readout label="Power P = V·i" value={P.toFixed(2)} unit="W" />
            <Readout label="Energy in 1 hr" value={(P * 1).toFixed(1)} unit="Wh" color="#ffaa00" />
            <Readout label="Heat in R" value={(I * I * R).toFixed(2)} unit="W" color="#ffaa00" />
          </div>
        </div>
      </div>

      <p className="text-xs text-[#666] leading-relaxed">
        The schematic is live. Open the switch and current stops flowing. Raise V or lower R to push more current and watch the bulb brighten — power scales as V·i.
      </p>
    </div>
  )
}
