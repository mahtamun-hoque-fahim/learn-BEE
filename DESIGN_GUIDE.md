# DESIGN_GUIDE.md — learn-BEE

> Living design system reference. Refreshed on every `update repo`.
> Last updated: 2026-06-04 (redesign v2 — "dy/dx" dark-default theme)

---

## Color Tokens

**Dark is the default theme** (`:root`). Light is derived under `[data-theme="light"]`; the toggle persists to `localStorage('learnbee.theme')` and defaults to dark when unset.

### Dark (default)
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#070807` | Page background |
| `--bg-2` / `--surface` | `#0E1110` | Cards, panels, equation blocks |
| `--surface-2` | `#131715` | Elevated / hover surfaces |
| `--line` | `#1F2421` | Hairline dividers, card outlines |
| `--line-2` | `#2A312D` | Stronger borders, inputs, pills |
| **`--primary` / `--accent`** | `#3DF49A` (mint) | CTAs, accent words, current flow, active states |
| `--primary-2` / `--accent-2` | `#27D685` | Accent hover / gradient stop |
| `--mint-soft` | `rgba(61,244,154,.12)` | Accent chip/callout fills |
| `--on-mint` | `#06160E` | Text/icon colour on a mint fill |
| `--ink` | `#F3F6F4` | Body text, headings |
| `--ink-2` | `#CDD3D0` | Article body copy |
| `--muted` | `#8A938E` | Labels, captions, eyebrows |
| `--dim` | `#5D6661` | Counters, disabled text |
| `--warn` / `--amber` | `#F5A85C` | Warnings, V₁ in divider |
| `--blue` | `#60A8FA` | V₂ / R_L accent, capacitor tone, plot curves |
| `--danger` / `--rose` | `#F26B6B` | Wrong-answer outlines, KCL error |
| `--ok` | `#3DF49A` | Correct-answer outlines (= mint) |

### Light (derived)
`--bg #FAFAF9` · `--surface #FFFFFF` · `--surface-2 #F1F1EF` · `--ink #0A0A0A` · `--ink-2 #33403A` · `--muted #5E6B65` · `--line #E4E4E1` / `--line-2 #D6D6D2` · **`--primary/--accent #0E9E5C`** (mint darkened for AA contrast on paper) · `--on-mint #052B19` · `--warn #B5811E` · `--blue #2563EB` · `--danger #C5443B`.

All tokens live in `globals.css`. Legacy aliases `--accent-dim`, `--border`, `--text`, `--text-muted`, `--surface2` are kept pointing at the new tokens so un-migrated pages keep rendering. The JS-side mirror in `simulator/animated/primitives.tsx` (`C` constant) must be re-synced to the mint `#3DF49A` during the simulator re-skin.

**Signature treatment:** `body::before` paints a faint 48px grid (`--grid-line`); `body::after` paints a dual radial mint glow (`--glow-1/2`). Accent words use `.accent-text` (mint, never italic). Mono uppercase eyebrows use `.eyebrow` / `.tiny` at `.14–.16em` tracking.

---

## Typography

**Font Stack** (via `next/font/google`):
- Display + Body: **Plus Jakarta Sans** — weights 400, 500, 600, 700, 800 (headings use 700/800, exposed as both `--font-sans` and `--font-display`)
- Mono / formula-ASCII / code / eyebrow labels: **JetBrains Mono** — weights 400, 500 (`var(--mono)`)
- LaTeX math: KaTeX's bundled fonts (auto-loaded by `katex/dist/katex.min.css`)

**Scale (Tailwind):**

| Name | Class | Usage |
|---|---|---|
| Display | `text-3xl` / `text-4xl` | Hero, chapter titles |
| H2 | `text-2xl` | Section headings, chapter card titles on cheat-sheet |
| H3 | `text-lg` / `text-xl` | Card headings (`font-syne font-semibold`) |
| Body | `text-base` | Default text |
| Small | `text-sm` | Quiz option text, formula values |
| Caption / mono labels | `text-xs font-mono` | Source attributions, units, eyebrow labels, readout labels |
| Micro | `text-[10px]` / `text-[11px]` | Plot ticks, formula-card name labels |

Most all-caps labels in readouts and plot titles use `tracking-wider uppercase` plus `font-mono`.

---

## Spacing & Radius

Tailwind defaults. Common values:

| Token | Pixels | Usage |
|---|---|---|
| `p-3` | 12 | Default inner padding (formula cards, quiz options, sim panels) |
| `p-4` | 16 | Cheat-sheet formula cards |
| `p-5` / `p-6` | 20 / 24 | Section cards, exam preset cards |
| `gap-2` / `gap-3` | 8 / 12 | Slider rows, readout grids |
| `space-y-3` / `space-y-4` | 12 / 16 | Vertical stacks in sim controls |

Radius:
- `rounded-md` (6) — buttons, readouts, small chips
- `rounded-lg` (8) — quiz options, plot panels, sim inner cards
- `rounded-xl` (12) — main section cards, exam preset cards
- `rounded-full` — pills, status badges

---

## Components

### Formula Card
```tsx
<div className="bg-[#111] border border-[#222] rounded-xl p-4">
  <div className="text-[#00e676] text-[11px] mb-2 uppercase tracking-wider font-mono">{name}</div>
  <div className="text-white text-base overflow-x-auto py-1" title={formula_ascii}>
    <Tex block>{formula}</Tex>
  </div>
  {note && <div className="text-[#888] text-xs mt-1 italic">{note}</div>}
  <div className="text-[#555] text-[11px] mt-2 font-mono">[{unit}]</div>
</div>
```
- Used in `/cheat-sheet` and `ChapterClient` theory tab.
- `overflow-x-auto` keeps long matrix formulas from breaking layout.

### Tab Strip (chapter page)
- Three buttons: Theory / Simulator / Quiz, each `font-syne font-semibold`.
- Active: white text, accent underline (`border-b-2 border-[#00e676]`).
- Inactive: `text-[#888]`.

### Quiz Option
- Default: `bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-left`.
- Hover: `border-[#333]`.
- `.selected`: `border-[#00e676]`.
- `.correct`: `border-green-700 bg-green-900/15`.
- `.wrong`: `border-red-700 bg-red-900/15`.
- Option text rendered through `<RichMath>` so options like `7.36 × 10⁻¹⁶ C` typeset properly.

### Exam Preset Card (`/bonus`)
```tsx
<div className="bg-[#111] border border-[#222] rounded-xl p-5 hover:border-[#00e676]/40">
  <div className="flex items-baseline justify-between mb-2">
    <h3 className="font-syne font-bold text-lg">{label}</h3>
    <span className="text-[#00e676] text-xs font-mono">{marks}</span>
  </div>
  ...
  <button className="text-xs px-3 py-1.5 bg-[#00e676] text-black font-semibold rounded-md">⏱ Timed</button>
</div>
```

### Sticky Search Input (cheat-sheet / search)
- `bg-[#111] border border-[#222] rounded-lg px-4 py-3`
- `focus:border-[#00e676] focus:outline-none`
- `autoFocus`, with backdrop-blur sticky container at top: `sticky top-14 bg-[#0a0a0a]/95 backdrop-blur`.

### Pill / Badge
- `text-xs px-2 py-0.5 rounded-full` with either:
  - `text-green-400 bg-green-900/20 border border-green-900` (beginner / pass)
  - `text-yellow-400 bg-yellow-900/20 border border-yellow-900` (intermediate)
  - `text-red-400 bg-red-900/20 border border-red-900` (advanced / fail)

---

## Math Rendering (KaTeX)

**Component:** `src/components/math/Tex.tsx` — exports `Tex` and `RichMath`.

**Usage:**
```tsx
import { Tex, RichMath } from '@/components/math/Tex'

// Display math (block)
<Tex block>{`\\dfrac{V_{Th}^2}{4R_{Th}}`}</Tex>

// Inline math
<Tex>{`\\tau = RC`}</Tex>

// Mixed prose — picks up $...$ and $$...$$ delimiters AND falls back to
// auto-converting any string with unicode math glyphs (ρ, ω, ×, ²…).
<RichMath>{`By KVL, $\\sum v = 0$ around any loop.`}</RichMath>
<RichMath>{`Q = 4600 × 1.6 × 10⁻¹⁹ = 7.36 × 10⁻¹⁶ C`}</RichMath>
```

**CSS:** `katex/dist/katex.min.css` is imported once in `src/app/layout.tsx`. `katex.renderToString` runs at render time and emits static HTML — no client-side bundle cost for math.

---

## Animated Simulator Primitives

`src/components/simulator/animated/primitives.tsx` exports the SVG component vocabulary. All are pure SVG and intended to compose inside a single parent `<svg viewBox="...">`.

| Primitive | What it does |
|---|---|
| `<AnimatedWire d=… current=… direction=…>` | Two stacked paths. Bottom one is a dim base. Top one has `strokeDasharray="6 8"` and a CSS `bee-flow` keyframe animating `stroke-dashoffset` from 0 to -14, period `max(0.25, min(3, 1.5/|I|))` seconds. `direction` flips `animationDirection`. Fades to opacity 0 when current ≈ 0. |
| `<Capacitor x=… y=… charge=…>` | Two parallel plates with terminals. A `<rect>` between the plates fills with `rgba(0,230,118, charge·0.45)` — visualises stored energy. |
| `<Resistor x=… y=… active=…>` | Zigzag body; turns green when current flows. |
| `<Battery x=… y=… label=…>` | Standard battery symbol (long line +, short line −). |
| `<Lamp x=… y=… power=…>` | Circle with X cross, inner yellow fill ∝ power, plus a `bee-glow` halo pulse when `power > 0.1`. |
| `<CurrentArrow x=… y=… angle=…>` | Small chevron showing current direction. |
| `<Slider>` / `<Readout>` | Range slider with accent-coloured value pill; dark readout pill with mono number + unit. |
| `<CircuitAnimStyles/>` | Injects `@keyframes bee-flow`, `bee-glow`, `bee-pulse` once. |

**Design rule for new simulators:** include `<CircuitAnimStyles/>` exactly once at the top of each sim. Keep `viewBox` aspect ratios tight; pair the schematic SVG with control panel + readouts in a `grid sm:grid-cols-2` so the layout works on mobile.

---

## Dark Mode

This project is **dark-only**. No light mode. Surface ladder:
- `#0a0a0a` (page) → `#111` (cards) → `#1a1a1a` (inner / elevated / plots) → `#222` (border).
- Accent `#00e676` works on every dark surface (verified high-contrast).
- Avoid pure white text on bright accent backgrounds; use `text-black` for accent-background buttons.

---

## Animation Tokens

Keyframes are defined in `primitives.tsx` and injected via `<CircuitAnimStyles/>`:

```css
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
```

Standard transitions outside the schematic:
- Default UI hover: `transition-colors` (200ms default).
- Bar gauge width changes: `transition: width 0.25s ease` (used in divider gauge).
- No heavy motion. Animation must serve comprehension, not decoration.
