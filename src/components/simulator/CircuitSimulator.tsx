'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  chapterId: string
}

// Chapter-specific simulator configs
const simulatorConfigs: Record<string, {
  title: string
  type: 'ohms' | 'kvl' | 'kcl' | 'rc' | 'rl' | 'rlc' | 'phasor' | 'bode' | 'generic'
}> = {
  ch1: { title: "Basic Circuit: Power & Energy", type: 'ohms' },
  ch2: { title: "Ohm's Law + KCL/KVL Explorer", type: 'kvl' },
  ch3: { title: "Nodal & Mesh Analysis Demonstrator", type: 'kvl' },
  ch4: { title: "Thévenin / Norton Equivalent + Max Power", type: 'rlc' },
  ch5: { title: "Op Amp Configurations", type: 'generic' },
  ch6: { title: "Capacitor & Inductor Response", type: 'rc' },
  ch7: { title: "RC / RL Step Response (Time Constants)", type: 'rc' },
  ch8: { title: "RLC Damping Explorer", type: 'rlc' },
  ch9: { title: "Phasor & Impedance Visualizer", type: 'phasor' },
  ch10: { title: "AC Power Triangle & PF Correction", type: 'phasor' },
  ch11: { title: "3-Phase Phasor Diagram", type: 'phasor' },
  ch12: { title: "Transformer Turns Ratio", type: 'generic' },
  ch13: { title: "Frequency Response & Bode Plot", type: 'bode' },
  ch14: { title: "s-Domain Circuit Analysis", type: 'generic' },
  ch15: { title: "Two-Port Network Parameters", type: 'generic' },
  ch16: { title: "Fourier Series Reconstruction", type: 'bode' },
  ch17: { title: "Fourier Transform Spectrum", type: 'bode' },
  ch18: { title: "SPICE-style Analysis", type: 'generic' },
  ch19: { title: "Complex Number Phasor", type: 'phasor' },
}

export default function CircuitSimulator({ chapterId }: Props) {
  const config = simulatorConfigs[chapterId] || { title: 'Circuit Simulator', type: 'generic' }

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#222] bg-[#0d0d0d]">
        <div className="flex items-center gap-3">
          <span className="text-[#00e676]">⚡</span>
          <span className="font-syne font-semibold text-sm">{config.title}</span>
        </div>
        <span className="text-xs text-[#555]">Interactive</span>
      </div>
      
      <div className="p-4">
        {config.type === 'ohms' && <OhmsLawSim />}
        {config.type === 'kvl' && <KVLSim />}
        {config.type === 'rc' && <RCCircuitSim />}
        {config.type === 'rlc' && <RLCSim />}
        {config.type === 'phasor' && <PhasorSim />}
        {config.type === 'bode' && <BodeSim />}
        {config.type === 'generic' && <FalstadEmbed chapterId={chapterId} />}
      </div>
    </div>
  )
}

// ===== OHM'S LAW SIMULATOR =====
function OhmsLawSim() {
  const [voltage, setVoltage] = useState(12)
  const [resistance, setResistance] = useState(10)

  const current = voltage / resistance
  const power = voltage * current

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#888] mb-2">Voltage (V): <span className="text-[#00e676]">{voltage} V</span></label>
          <input type="range" min={0} max={48} step={0.5} value={voltage}
            onChange={e => setVoltage(Number(e.target.value))}
            className="w-full accent-[#00e676]" />
        </div>
        <div>
          <label className="block text-xs text-[#888] mb-2">Resistance (Ω): <span className="text-[#00e676]">{resistance} Ω</span></label>
          <input type="range" min={1} max={200} step={1} value={resistance}
            onChange={e => setResistance(Number(e.target.value))}
            className="w-full accent-[#00e676]" />
        </div>
      </div>

      {/* Circuit diagram (SVG) */}
      <svg viewBox="0 0 400 180" className="w-full bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
        {/* Wire */}
        <line x1="50" y1="90" x2="150" y2="90" stroke="#00e676" strokeWidth="2"/>
        <line x1="250" y1="90" x2="350" y2="90" stroke="#00e676" strokeWidth="2"/>
        <line x1="350" y1="90" x2="350" y2="140" stroke="#00e676" strokeWidth="2"/>
        <line x1="50" y1="140" x2="350" y2="140" stroke="#00e676" strokeWidth="2"/>
        <line x1="50" y1="90" x2="50" y2="140" stroke="#00e676" strokeWidth="2"/>
        
        {/* Voltage source */}
        <circle cx="50" cy="115" r="18" fill="none" stroke="#00e676" strokeWidth="2"/>
        <text x="50" y="110" textAnchor="middle" fill="#00e676" fontSize="10">+</text>
        <text x="50" y="124" textAnchor="middle" fill="#888" fontSize="9">{voltage}V</text>
        
        {/* Resistor (zigzag) */}
        <path d="M 150 90 l 10 -15 l 20 30 l 20 -30 l 20 30 l 10 -15" fill="none" stroke="#fbbf24" strokeWidth="2.5"/>
        <text x="200" y="75" textAnchor="middle" fill="#fbbf24" fontSize="10">{resistance}Ω</text>
        
        {/* Current arrow */}
        <text x="200" y="160" textAnchor="middle" fill="#888" fontSize="9">I = {current.toFixed(3)} A</text>
        <path d="M 170 148 L 230 148" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#60a5fa"/>
          </marker>
        </defs>
      </svg>

      {/* Outputs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Current (I)", value: `${current.toFixed(3)} A`, formula: "V/R" },
          { label: "Power (P)", value: `${power.toFixed(2)} W`, formula: "V×I" },
          { label: "Energy / hr", value: `${(power / 1000).toFixed(4)} kWh`, formula: "P×t" },
        ].map(out => (
          <div key={out.label} className="bg-[#0a0a0a] rounded-lg p-3 border border-[#1a1a1a] text-center">
            <div className="text-xs text-[#888] mb-1">{out.label}</div>
            <div className="font-mono font-bold text-[#00e676]">{out.value}</div>
            <div className="text-xs text-[#555] mt-1 font-mono">{out.formula}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== KVL SERIES CIRCUIT =====
function KVLSim() {
  const [vs, setVs] = useState(20)
  const [r1, setR1] = useState(4)
  const [r2, setR2] = useState(6)
  const [r3, setR3] = useState(10)

  const rTotal = r1 + r2 + r3
  const current = vs / rTotal
  const v1 = current * r1
  const v2 = current * r2
  const v3 = current * r3
  const kvlCheck = vs - v1 - v2 - v3

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#888]">V_source: <span className="text-[#00e676]">{vs}V</span></label>
          <input type="range" min={1} max={48} value={vs} onChange={e => setVs(Number(e.target.value))} className="w-full accent-[#00e676]"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">R1: <span className="text-yellow-400">{r1}Ω</span></label>
          <input type="range" min={1} max={50} value={r1} onChange={e => setR1(Number(e.target.value))} className="w-full accent-yellow-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">R2: <span className="text-blue-400">{r2}Ω</span></label>
          <input type="range" min={1} max={50} value={r2} onChange={e => setR2(Number(e.target.value))} className="w-full accent-blue-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">R3: <span className="text-purple-400">{r3}Ω</span></label>
          <input type="range" min={1} max={50} value={r3} onChange={e => setR3(Number(e.target.value))} className="w-full accent-purple-400"/>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0a0a0a] rounded-lg p-3 text-center border border-yellow-900/30">
          <div className="text-xs text-[#888]">V_R1</div>
          <div className="font-mono text-yellow-400 font-bold">{v1.toFixed(2)} V</div>
        </div>
        <div className="bg-[#0a0a0a] rounded-lg p-3 text-center border border-blue-900/30">
          <div className="text-xs text-[#888]">V_R2</div>
          <div className="font-mono text-blue-400 font-bold">{v2.toFixed(2)} V</div>
        </div>
        <div className="bg-[#0a0a0a] rounded-lg p-3 text-center border border-purple-900/30">
          <div className="text-xs text-[#888]">V_R3</div>
          <div className="font-mono text-purple-400 font-bold">{v3.toFixed(2)} V</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0a0a0a] rounded-lg p-3 text-center border border-[#1a1a1a]">
          <div className="text-xs text-[#888]">Current I</div>
          <div className="font-mono text-[#00e676] font-bold">{current.toFixed(3)} A</div>
        </div>
        <div className={`rounded-lg p-3 text-center border ${Math.abs(kvlCheck) < 0.001 ? 'border-green-800 bg-green-900/10' : 'border-red-800 bg-red-900/10'}`}>
          <div className="text-xs text-[#888]">KVL Check (Σv = 0)</div>
          <div className={`font-mono font-bold ${Math.abs(kvlCheck) < 0.001 ? 'text-green-400' : 'text-red-400'}`}>
            {kvlCheck.toFixed(6)} V ≈ 0 ✓
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== RC CIRCUIT =====
function RCCircuitSim() {
  const [vs, setVs] = useState(10)
  const [R, setR] = useState(10) // kΩ
  const [C, setC] = useState(100) // μF
  const [mode, setMode] = useState<'charge' | 'discharge'>('charge')

  const tau = (R * 1000) * (C * 1e-6) // seconds
  const points = Array.from({ length: 100 }, (_, i) => {
    const t = (i / 99) * 5 * tau
    const v = mode === 'charge'
      ? vs * (1 - Math.exp(-t / tau))
      : vs * Math.exp(-t / tau)
    return { t, v }
  })

  const maxT = 5 * tau
  const svgW = 360, svgH = 140
  const pad = { left: 40, right: 20, top: 15, bottom: 30 }

  const toX = (t: number) => pad.left + (t / maxT) * (svgW - pad.left - pad.right)
  const toY = (v: number) => pad.top + ((vs - v) / vs) * (svgH - pad.top - pad.bottom)

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t).toFixed(1)} ${toY(p.v).toFixed(1)}`).join(' ')

  // Tau marker
  const vAtTau = mode === 'charge' ? vs * 0.632 : vs * 0.368
  const xTau = toX(tau)
  const yTau = toY(vAtTau)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode('charge')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mode === 'charge' ? 'bg-[#00e676] text-black' : 'border border-[#333] text-[#888]'}`}>Charging</button>
        <button onClick={() => setMode('discharge')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mode === 'discharge' ? 'bg-[#00e676] text-black' : 'border border-[#333] text-[#888]'}`}>Discharging</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-[#888]">V_s: <span className="text-[#00e676]">{vs}V</span></label>
          <input type="range" min={1} max={24} value={vs} onChange={e => setVs(Number(e.target.value))} className="w-full accent-[#00e676]"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">R: <span className="text-yellow-400">{R}kΩ</span></label>
          <input type="range" min={1} max={100} value={R} onChange={e => setR(Number(e.target.value))} className="w-full accent-yellow-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">C: <span className="text-blue-400">{C}μF</span></label>
          <input type="range" min={10} max={1000} step={10} value={C} onChange={e => setC(Number(e.target.value))} className="w-full accent-blue-400"/>
        </div>
      </div>

      {/* Waveform */}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={pad.left} x2={svgW - pad.right}
            y1={pad.top + f * (svgH - pad.top - pad.bottom)}
            y2={pad.top + f * (svgH - pad.top - pad.bottom)}
            stroke="#1a1a1a" strokeWidth="1"/>
        ))}
        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={svgH - pad.bottom} stroke="#333" strokeWidth="1"/>
        <line x1={pad.left} y1={svgH - pad.bottom} x2={svgW - pad.right} y2={svgH - pad.bottom} stroke="#333" strokeWidth="1"/>
        {/* Labels */}
        <text x={pad.left - 5} y={pad.top + 5} textAnchor="end" fill="#888" fontSize="9">{vs}V</text>
        <text x={pad.left - 5} y={svgH - pad.bottom} textAnchor="end" fill="#888" fontSize="9">0</text>
        <text x={svgW/2} y={svgH - 2} textAnchor="middle" fill="#555" fontSize="9">Time (s) — 5τ = {(5*tau).toFixed(2)}s</text>
        {/* Curve */}
        <path d={pathD} fill="none" stroke="#00e676" strokeWidth="2.5"/>
        {/* Tau marker */}
        <line x1={xTau} y1={pad.top} x2={xTau} y2={svgH - pad.bottom} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3"/>
        <circle cx={xTau} cy={yTau} r="4" fill="#fbbf24"/>
        <text x={xTau + 4} y={yTau - 4} fill="#fbbf24" fontSize="9">τ = {tau.toFixed(2)}s</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#0a0a0a] rounded-lg p-2 border border-[#1a1a1a]">
          <div className="text-xs text-[#888]">τ = RC</div>
          <div className="font-mono text-[#00e676] text-sm">{tau.toFixed(3)} s</div>
        </div>
        <div className="bg-[#0a0a0a] rounded-lg p-2 border border-[#1a1a1a]">
          <div className="text-xs text-[#888]">V at τ</div>
          <div className="font-mono text-yellow-400 text-sm">{(mode === 'charge' ? 63.2 : 36.8).toFixed(1)}%</div>
        </div>
        <div className="bg-[#0a0a0a] rounded-lg p-2 border border-[#1a1a1a]">
          <div className="text-xs text-[#888]">@ 5τ (≈done)</div>
          <div className="font-mono text-blue-400 text-sm">{(5*tau).toFixed(2)} s</div>
        </div>
      </div>
    </div>
  )
}

// ===== RLC DAMPING =====
function RLCSim() {
  const [R, setR] = useState(10)
  const [L, setL] = useState(1)
  const [C, setC] = useState(0.1)
  const [vs, setVs] = useState(10)

  const alpha = R / (2 * L)
  const omega0 = 1 / Math.sqrt(L * C)
  const damping = alpha > omega0 ? 'Overdamped' : alpha < omega0 ? 'Underdamped' : 'Critically Damped'
  const color = damping === 'Overdamped' ? '#f87171' : damping === 'Underdamped' ? '#60a5fa' : '#00e676'

  const omegaD = Math.max(0, Math.sqrt(Math.abs(omega0 ** 2 - alpha ** 2)))
  const tEnd = Math.min(5 * (1 / alpha || 1), 20)

  const points = Array.from({ length: 200 }, (_, i) => {
    const t = (i / 199) * tEnd
    let v = 0
    if (damping === 'Underdamped') {
      v = vs * (1 - Math.exp(-alpha * t) * (Math.cos(omegaD * t) + (alpha / omegaD) * Math.sin(omegaD * t)))
    } else if (damping === 'Overdamped') {
      const s1 = -alpha + Math.sqrt(alpha ** 2 - omega0 ** 2)
      const s2 = -alpha - Math.sqrt(alpha ** 2 - omega0 ** 2)
      const A = -vs * s2 / (s1 - s2)
      const B = vs * s1 / (s1 - s2)
      v = vs + A * Math.exp(s1 * t) + B * Math.exp(s2 * t)
    } else {
      v = vs * (1 - (1 + alpha * t) * Math.exp(-alpha * t))
    }
    return { t, v: isNaN(v) ? 0 : Math.max(-vs * 2, Math.min(vs * 2, v)) }
  })

  const svgW = 360, svgH = 140
  const pad = { left: 35, right: 15, top: 15, bottom: 25 }
  const vMin = Math.min(-1, ...points.map(p => p.v))
  const vMax = Math.max(vs + 1, ...points.map(p => p.v))
  const toX = (t: number) => pad.left + (t / tEnd) * (svgW - pad.left - pad.right)
  const toY = (v: number) => pad.top + ((vMax - v) / (vMax - vMin)) * (svgH - pad.top - pad.bottom)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t).toFixed(1)} ${toY(p.v).toFixed(1)}`).join(' ')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#888]">R: <span className="text-red-400">{R}Ω</span></label>
          <input type="range" min={0.5} max={50} step={0.5} value={R} onChange={e => setR(Number(e.target.value))} className="w-full accent-red-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">L: <span className="text-yellow-400">{L}H</span></label>
          <input type="range" min={0.1} max={5} step={0.1} value={L} onChange={e => setL(Number(e.target.value))} className="w-full accent-yellow-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">C: <span className="text-blue-400">{C.toFixed(2)}F</span></label>
          <input type="range" min={0.01} max={1} step={0.01} value={C} onChange={e => setC(Number(e.target.value))} className="w-full accent-blue-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">V_step: <span className="text-[#00e676]">{vs}V</span></label>
          <input type="range" min={1} max={20} value={vs} onChange={e => setVs(Number(e.target.value))} className="w-full accent-[#00e676]"/>
        </div>
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={svgH - pad.bottom} stroke="#333" strokeWidth="1"/>
        <line x1={pad.left} y1={svgH - pad.bottom} x2={svgW - pad.right} y2={svgH - pad.bottom} stroke="#333" strokeWidth="1"/>
        {/* VS reference line */}
        <line x1={pad.left} x2={svgW - pad.right} y1={toY(vs)} y2={toY(vs)} stroke="#333" strokeWidth="1" strokeDasharray="4"/>
        <text x={pad.left - 3} y={toY(vs) + 4} textAnchor="end" fill="#555" fontSize="8">{vs}V</text>
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5"/>
        <text x={svgW/2} y={svgH} textAnchor="middle" fill="#555" fontSize="9">Response</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#0a0a0a] rounded-lg p-2 border border-[#1a1a1a]">
          <div className="text-xs text-[#888]">α (Neper freq)</div>
          <div className="font-mono text-red-400 text-sm">{alpha.toFixed(2)}</div>
        </div>
        <div className="bg-[#0a0a0a] rounded-lg p-2 border border-[#1a1a1a]">
          <div className="text-xs text-[#888]">ω₀ (resonant)</div>
          <div className="font-mono text-yellow-400 text-sm">{omega0.toFixed(2)}</div>
        </div>
        <div className={`rounded-lg p-2 border`} style={{ borderColor: color + '40', background: color + '10' }}>
          <div className="text-xs text-[#888]">Response Type</div>
          <div className="font-mono text-sm" style={{ color }}>{damping}</div>
        </div>
      </div>
    </div>
  )
}

// ===== PHASOR VISUALIZER =====
function PhasorSim() {
  const [Vm, setVm] = useState(10)
  const [phi, setPhi] = useState(30) // degrees
  const [freq, setFreq] = useState(50)
  const [showTime, setShowTime] = useState(true)

  const phiRad = (phi * Math.PI) / 180
  const cx = 100, cy = 90, r = 70

  const px = cx + r * Math.cos(phiRad)
  const py = cy - r * Math.sin(phiRad)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[#888]">V_m: <span className="text-[#00e676]">{Vm}V</span></label>
          <input type="range" min={1} max={20} value={Vm} onChange={e => setVm(Number(e.target.value))} className="w-full accent-[#00e676]"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">φ: <span className="text-yellow-400">{phi}°</span></label>
          <input type="range" min={-180} max={180} value={phi} onChange={e => setPhi(Number(e.target.value))} className="w-full accent-yellow-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">f: <span className="text-blue-400">{freq}Hz</span></label>
          <input type="range" min={1} max={1000} value={freq} onChange={e => setFreq(Number(e.target.value))} className="w-full accent-blue-400"/>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Phasor diagram */}
        <svg viewBox="0 0 200 180" className="flex-shrink-0 w-48 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
          {/* Grid circles */}
          {[0.33, 0.67, 1].map(f => (
            <circle key={f} cx={cx} cy={cy} r={r * f} fill="none" stroke="#1a1a1a" strokeWidth="1"/>
          ))}
          {/* Axes */}
          <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy} stroke="#333" strokeWidth="1"/>
          <line x1={cx} y1={cy - r - 10} x2={cx} y2={cy + r + 10} stroke="#333" strokeWidth="1"/>
          {/* Phasor arrow */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#00e676" strokeWidth="3" markerEnd="url(#parrow)"/>
          <defs>
            <marker id="parrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#00e676"/>
            </marker>
          </defs>
          {/* Labels */}
          <text x={px + 5} y={py - 5} fill="#00e676" fontSize="10">{Vm}∠{phi}°</text>
          <text x={cx + r + 5} y={cy + 4} fill="#555" fontSize="9">Re</text>
          <text x={cx + 2} y={cy - r - 3} fill="#555" fontSize="9">Im</text>
          {/* Angle arc */}
          <path d={`M ${cx + 25} ${cy} A 25 25 0 ${phi > 0 ? 0 : 1} ${phi > 0 ? 1 : 0} ${cx + 25 * Math.cos(phiRad)} ${cy - 25 * Math.sin(phiRad)}`} fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
        </svg>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="formula-card">
            <div className="text-[#888] text-xs mb-1">Phasor (polar)</div>
            <div className="text-[#00e676] font-mono text-sm">V = {Vm}∠{phi}°</div>
          </div>
          <div className="formula-card">
            <div className="text-[#888] text-xs mb-1">Rectangular form</div>
            <div className="text-white font-mono text-xs">
              {(Vm * Math.cos(phiRad)).toFixed(2)} + j{(Vm * Math.sin(phiRad)).toFixed(2)}
            </div>
          </div>
          <div className="formula-card">
            <div className="text-[#888] text-xs mb-1">Time domain</div>
            <div className="text-white font-mono text-xs">
              {Vm}·cos(2π·{freq}t + {phi}°) V
            </div>
          </div>
          <div className="formula-card">
            <div className="text-[#888] text-xs mb-1">ω (angular freq)</div>
            <div className="text-white font-mono text-xs">
              {(2 * Math.PI * freq).toFixed(1)} rad/s
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== BODE PLOT =====
function BodeSim() {
  const [R, setR] = useState(1000)
  const [C, setC] = useState(1) // μF
  const [filterType, setFilterType] = useState<'lp' | 'hp'>('lp')

  const fc = 1 / (2 * Math.PI * R * C * 1e-6)

  const freqs = Array.from({ length: 100 }, (_, i) => {
    return Math.pow(10, -1 + (i / 99) * 6) // 0.1 Hz to 100kHz
  })

  const points = freqs.map(f => {
    const ratio = f / fc
    let magDB: number
    if (filterType === 'lp') {
      magDB = -20 * Math.log10(Math.sqrt(1 + ratio ** 2))
    } else {
      magDB = -20 * Math.log10(Math.sqrt(1 + (1 / ratio) ** 2))
    }
    return { f, magDB }
  })

  const svgW = 360, svgH = 140
  const pad = { left: 45, right: 15, top: 15, bottom: 30 }
  const minDB = -60, maxDB = 5
  const minLogF = Math.log10(0.1), maxLogF = Math.log10(100000)

  const toX = (f: number) => pad.left + ((Math.log10(f) - minLogF) / (maxLogF - minLogF)) * (svgW - pad.left - pad.right)
  const toY = (db: number) => pad.top + ((maxDB - db) / (maxDB - minDB)) * (svgH - pad.top - pad.bottom)

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.f).toFixed(1)} ${toY(p.magDB).toFixed(1)}`).join(' ')

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setFilterType('lp')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filterType === 'lp' ? 'bg-[#00e676] text-black' : 'border border-[#333] text-[#888]'}`}>Low-Pass</button>
        <button onClick={() => setFilterType('hp')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filterType === 'hp' ? 'bg-[#00e676] text-black' : 'border border-[#333] text-[#888]'}`}>High-Pass</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#888]">R: <span className="text-yellow-400">{(R/1000).toFixed(1)}kΩ</span></label>
          <input type="range" min={100} max={100000} step={100} value={R} onChange={e => setR(Number(e.target.value))} className="w-full accent-yellow-400"/>
        </div>
        <div>
          <label className="text-xs text-[#888]">C: <span className="text-blue-400">{C}μF</span></label>
          <input type="range" min={0.1} max={10} step={0.1} value={C} onChange={e => setC(Number(e.target.value))} className="w-full accent-blue-400"/>
        </div>
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
        {[-60,-40,-20,-3,0].map(db => (
          <g key={db}>
            <line x1={pad.left} x2={svgW - pad.right} y1={toY(db)} y2={toY(db)} stroke="#1a1a1a" strokeWidth="1"/>
            <text x={pad.left - 3} y={toY(db) + 4} textAnchor="end" fill="#555" fontSize="8">{db}</text>
          </g>
        ))}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={svgH - pad.bottom} stroke="#333" strokeWidth="1"/>
        <line x1={pad.left} y1={svgH - pad.bottom} x2={svgW - pad.right} y2={svgH - pad.bottom} stroke="#333" strokeWidth="1"/>
        {/* -3dB line */}
        <line x1={pad.left} x2={svgW - pad.right} y1={toY(-3)} y2={toY(-3)} stroke="#fbbf24" strokeWidth="1" strokeDasharray="4"/>
        {/* cutoff freq */}
        <line x1={toX(fc)} y1={pad.top} x2={toX(fc)} y2={svgH - pad.bottom} stroke="#f87171" strokeWidth="1" strokeDasharray="4"/>
        <text x={toX(fc) + 3} y={pad.top + 10} fill="#f87171" fontSize="8">f_c={fc.toFixed(0)}Hz</text>
        <path d={pathD} fill="none" stroke="#00e676" strokeWidth="2.5"/>
        <text x={svgW/2} y={svgH} textAnchor="middle" fill="#555" fontSize="9">Frequency (Hz) — log scale</text>
        <text x={5} y={svgH/2} fill="#555" fontSize="9" transform={`rotate(-90, 5, ${svgH/2})`}>|H| (dB)</text>
      </svg>

      <div className="formula-card">
        <div className="text-[#888] text-xs mb-1">Cutoff Frequency</div>
        <div className="text-[#00e676] font-mono">f_c = 1/(2πRC) = {fc.toFixed(1)} Hz</div>
      </div>
    </div>
  )
}

// ===== FALSTAD IFRAME for generic chapters =====
function FalstadEmbed({ chapterId }: { chapterId: string }) {
  return (
    <div className="space-y-3">
      <p className="text-[#888] text-sm">
        Use the Falstad Circuit Simulator to experiment with {chapterId.toUpperCase()} topics:
      </p>
      <div className="relative rounded-lg overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src="https://falstad.com/circuit/circuitjs.html"
          className="absolute inset-0 w-full h-full"
          title="Falstad Circuit Simulator"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <p className="text-[#555] text-xs">
        Tip: Click <strong>Circuits → Built-in Circuits</strong> to load examples relevant to this chapter.
      </p>
    </div>
  )
}
