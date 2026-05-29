'use client'

/**
 * Animated SVG circuit primitives.
 *
 * The signature look is a wire whose dashed stroke moves along its length —
 * giving the visual impression of current flowing. Speed is bound to current
 * magnitude, direction is bound to current sign.
 *
 * All components are pure SVG so they compose freely. They expect a parent
 * <svg viewBox="..."> to be set up by the caller.
 */

import type { ReactNode } from 'react'

// ─── Tokens (kept in JS so animation logic can use them) ──────────────────
export const C = {
  wire: '#888',
  wireOn: '#00e676',
  current: '#00e676',
  text: '#d4d4d4',
  muted: '#888',
  dim: '#555',
  bg: '#0a0a0a',
  surface: '#111',
  warn: '#ffaa00',
  danger: '#ff4444',
}

// ─── Animated wire ────────────────────────────────────────────────────────
interface WireProps {
  /** Path d= string, e.g. "M10 10 L100 10 L100 50" */
  d: string
  /** Current magnitude in amps (or any unit — only relative size matters). */
  current?: number
  /** Visual sign: +1 forward, -1 reverse, 0 none. */
  direction?: number
  /** Optional fixed color; defaults to dimmed when current is 0. */
  color?: string
  /** Stroke width. */
  width?: number
  /** Add label text near the wire. */
  label?: string
  labelX?: number
  labelY?: number
}

/**
 * A wire with dashed-stroke flow animation. Implementation: two overlapping
 * <path>s — a dim base line + an animated bright dashed overlay whose
 * stroke-dashoffset is animated through CSS @keyframes.
 *
 * Animation duration is inversely proportional to |current|: bigger current →
 * faster flow. When current ≈ 0 the animated overlay fades out, leaving the
 * dim base line.
 */
export function AnimatedWire({
  d,
  current = 0,
  direction = 1,
  color,
  width = 2,
  label,
  labelX,
  labelY,
}: WireProps) {
  const I = Math.abs(current)
  // Map |I| (0 … ~5 typical) to animation duration in seconds. Higher I = faster.
  const speed = I < 0.001 ? 0 : Math.max(0.25, Math.min(3, 1.5 / Math.max(I, 0.1)))
  const dir = direction >= 0 ? 1 : -1
  const stroke = color || (I > 0.001 ? C.wireOn : C.wire)
  const opacity = I > 0.001 ? 1 : 0
  const dashArray = '6 8'
  // Animate stroke-dashoffset via inline style + CSS keyframes (declared once in
  // <CircuitAnimStyles/>). dir flips the keyframe direction.
  const style: React.CSSProperties = speed === 0
    ? { opacity: 0 }
    : {
        animation: `bee-flow ${speed}s linear infinite`,
        animationDirection: dir > 0 ? 'normal' : 'reverse',
        opacity,
      }

  return (
    <g>
      {/* dim base */}
      <path d={d} stroke={C.wire} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* animated bright overlay */}
      <path
        d={d}
        stroke={stroke}
        strokeWidth={width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashArray}
        style={style}
      />
      {label && (
        <text x={labelX} y={labelY} fill={C.muted} fontSize="10" fontFamily="var(--font-onest, sans-serif)" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

// ─── One-off keyframes injection ──────────────────────────────────────────
export function CircuitAnimStyles() {
  return (
    <style>{`
      @keyframes bee-flow {
        from { stroke-dashoffset: 0; }
        to   { stroke-dashoffset: -14; }
      }
      @keyframes bee-glow {
        0%, 100% { opacity: 0.55; }
        50%      { opacity: 1; }
      }
      @keyframes bee-pulse {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.18); }
      }
    `}</style>
  )
}

// ─── Schematic components ─────────────────────────────────────────────────
// Each component is a small SVG <g> centred at (x, y).

interface ResistorProps {
  x: number; y: number
  /** "h" = horizontal terminals, "v" = vertical terminals */
  orient?: 'h' | 'v'
  /** Resistance label, e.g. "10 kΩ" */
  label?: string
  /** Whether the resistor is dissipating (used to slightly glow). */
  active?: boolean
}
export function Resistor({ x, y, orient = 'h', label, active }: ResistorProps) {
  // Zigzag body 40 long, terminals extend 10 each side. Total: 60 along axis.
  const zig = 'M -20 0 L -16 -7 L -12 7 L -8 -7 L -4 7 L 0 -7 L 4 7 L 8 -7 L 12 7 L 16 -7 L 20 0'
  const transform = `translate(${x} ${y}) ${orient === 'v' ? 'rotate(90)' : ''}`
  return (
    <g transform={transform}>
      <path d={zig} stroke={active ? C.wireOn : C.text} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {label && (
        <text x={0} y={orient === 'h' ? -14 : 0} dy={orient === 'h' ? 0 : 4} dx={orient === 'h' ? 0 : 18}
          fill={C.muted} fontSize="10.5" fontFamily="var(--font-mono, monospace)" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

interface CapacitorProps {
  x: number; y: number
  orient?: 'h' | 'v'
  label?: string
  /** Voltage 0..1 fraction of supply; controls plate "fill" intensity. */
  charge?: number
}
export function Capacitor({ x, y, orient = 'h', label, charge = 0 }: CapacitorProps) {
  // Two parallel plates 14 apart, plate length 16. Terminals reach 14 each side.
  const transform = `translate(${x} ${y}) ${orient === 'v' ? 'rotate(90)' : ''}`
  const fill = `rgba(0, 230, 118, ${Math.max(0, Math.min(1, charge)) * 0.45})`
  return (
    <g transform={transform}>
      {/* terminals */}
      <line x1={-14} y1={0} x2={-4} y2={0} stroke={C.text} strokeWidth={1.8} strokeLinecap="round" />
      <line x1={4} y1={0} x2={14} y2={0} stroke={C.text} strokeWidth={1.8} strokeLinecap="round" />
      {/* plates */}
      <line x1={-4} y1={-9} x2={-4} y2={9} stroke={C.text} strokeWidth={2.2} strokeLinecap="round" />
      <line x1={4}  y1={-9} x2={4}  y2={9} stroke={C.text} strokeWidth={2.2} strokeLinecap="round" />
      {/* charge glow */}
      <rect x={-3.5} y={-9} width={7} height={18} fill={fill} />
      {label && (
        <text x={0} y={orient === 'h' ? -14 : 0} dy={orient === 'h' ? 0 : 4} dx={orient === 'h' ? 0 : 22}
          fill={C.muted} fontSize="10.5" fontFamily="var(--font-mono, monospace)" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

interface BatteryProps {
  x: number; y: number
  orient?: 'h' | 'v'
  /** Voltage label, e.g. "12 V" */
  label?: string
}
export function Battery({ x, y, orient = 'h', label }: BatteryProps) {
  const transform = `translate(${x} ${y}) ${orient === 'v' ? 'rotate(90)' : ''}`
  return (
    <g transform={transform}>
      <line x1={-14} y1={0} x2={-3} y2={0} stroke={C.text} strokeWidth={1.8} strokeLinecap="round" />
      <line x1={3} y1={0} x2={14} y2={0} stroke={C.text} strokeWidth={1.8} strokeLinecap="round" />
      {/* long line (+) */}
      <line x1={-3} y1={-11} x2={-3} y2={11} stroke={C.text} strokeWidth={2.2} strokeLinecap="round" />
      {/* short line (-) */}
      <line x1={3} y1={-7} x2={3} y2={7} stroke={C.text} strokeWidth={2.4} strokeLinecap="round" />
      <text x={-3} y={-15} fill={C.warn} fontSize="9" textAnchor="middle">+</text>
      <text x={3} y={-15} fill={C.dim} fontSize="9" textAnchor="middle">−</text>
      {label && (
        <text x={0} y={orient === 'h' ? 22 : 0} dy={orient === 'h' ? 0 : 4} dx={orient === 'h' ? 0 : 22}
          fill={C.muted} fontSize="10.5" fontFamily="var(--font-mono, monospace)" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

/**
 * Filament lamp — schematic circle with a wavy filament. Brightness scales
 * with `power` (0..1+), driving the inner glow opacity.
 */
interface LampProps { x: number; y: number; power?: number; label?: string }
export function Lamp({ x, y, power = 0, label }: LampProps) {
  const p = Math.max(0, Math.min(1, power))
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={13} fill={`rgba(255,200,60,${p * 0.7})`} stroke={C.text} strokeWidth={1.8} />
      {/* X inside */}
      <line x1={-9} y1={-9} x2={9} y2={9} stroke={p > 0.05 ? '#ffd24d' : C.muted} strokeWidth={1.5} />
      <line x1={9} y1={-9} x2={-9} y2={9} stroke={p > 0.05 ? '#ffd24d' : C.muted} strokeWidth={1.5} />
      {/* halo */}
      {p > 0.1 && <circle r={20} fill="none" stroke="#ffd24d" strokeOpacity={p * 0.4} strokeWidth={3} style={{ animation: 'bee-glow 1.6s ease-in-out infinite' }} />}
      {label && <text y={28} fill={C.muted} fontSize="10.5" textAnchor="middle" fontFamily="var(--font-mono, monospace)">{label}</text>}
    </g>
  )
}

interface NodeDotProps { x: number; y: number; r?: number; color?: string; label?: string; labelDx?: number; labelDy?: number }
export function NodeDot({ x, y, r = 2.5, color, label, labelDx = 0, labelDy = -8 }: NodeDotProps) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color || C.text} />
      {label && (
        <text x={x + labelDx} y={y + labelDy} fill={C.muted} fontSize="10" textAnchor="middle" fontFamily="var(--font-mono, monospace)">
          {label}
        </text>
      )}
    </g>
  )
}

/** Arrow head used to mark current direction on a wire. */
export function CurrentArrow({ x, y, angle = 0, color }: { x: number; y: number; angle?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d="M -6 -4 L 0 0 L -6 4" fill="none" stroke={color || C.wireOn} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/** Slider-style numeric readout used in control panels. */
export function Readout({ label, value, unit, color = C.wireOn }: { label: string; value: ReactNode; unit?: string; color?: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md px-3 py-2 min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-[#666] font-mono">{label}</div>
      <div className="text-base font-semibold font-mono mt-0.5" style={{ color }}>
        {value}
        {unit && <span className="ml-1 text-[#888] text-xs font-normal">{unit}</span>}
      </div>
    </div>
  )
}

/** Range slider with label + accent value pill. */
export function Slider({
  label, value, onChange, min, max, step = 1, unit, accent = C.wireOn,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  accent?: string
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between text-xs mb-1.5">
        <span className="text-[#888] uppercase tracking-wider font-mono">{label}</span>
        <span className="font-mono font-semibold" style={{ color: accent }}>{value}{unit && <span className="text-[#888] font-normal ml-0.5">{unit}</span>}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: accent }}
      />
    </label>
  )
}
