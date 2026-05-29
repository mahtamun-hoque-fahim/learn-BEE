# DESIGN_GUIDE.md — learn-BEE

> Living design system reference. Updated when new components or tokens are added.
> Last updated: 2026-05-29

---

## Color Tokens

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Background | `--bg` | `#0a0a0a` | Page background |
| Surface | `--surface` | `#111111` | Cards, panels, formula cards |
| Surface 2 | `--surface2` | `#1a1a1a` | Hover / elevated surfaces, code blocks |
| Border | `--border` | `#222222` | Dividers, card outlines |
| Border subtle | `#1a1a1a` | — | Inner borders within elevated cards |
| Accent | `--accent` | `#00e676` | CTAs, highlights, active tab underline, formula labels |
| Accent Dim | `--accent-dim` | `#00b85d` | Hover state for accent |
| Text Primary | `--text` | `#ffffff` | Body text, headings |
| Text 2nd | `#cccccc` | — | Secondary body text inside cards |
| Text Muted | `--text-muted` | `#888888` | Labels, captions, descriptions |
| Text Disabled | `#555555` | — | Disabled state, completed-checked text |
| Border-fail | `#7f1d1d` (bg-red-900) | — | Wrong-answer outlines |
| Border-pass | `#14532d` (bg-green-900) | — | Correct-answer outlines |

---

## Typography

**Font Stack:**
- Headings: **Syne** — weights 400, 600, 700, 800 (via `next/font/google`)
- Body: **Onest** — weights 400, 500, 600
- Code / Mono / formulas-original-ASCII: **JetBrains Mono** (referenced through Tailwind `font-mono`)
- LaTeX math (KaTeX): KaTeX's bundled fonts (auto-loaded by `katex/dist/katex.min.css`)

**Scale (Tailwind defaults, used directly):**

| Name | Tailwind | Usage |
|---|---|---|
| Display | `text-3xl` / `text-4xl` | Hero, chapter titles |
| H2 | `text-2xl` | Section headings |
| H3 | `text-lg` / `text-xl` | Card headings (`font-syne font-semibold`) |
| Body | `text-base` | Default text |
| Small | `text-sm` | Quiz option text, formula values |
| Caption / mono labels | `text-xs font-mono` | Source attributions, units, eyebrow labels |

---

## Spacing Scale

Tailwind defaults. Common values seen across the codebase:

| Token | Pixels | Usage |
|---|---|---|
| `gap-2` / `p-2` | 8 | Tight icon+label, small inner padding |
| `gap-3` / `p-3` | 12 | Default inner padding (formula cards, quiz options) |
| `p-5` | 20 | Mid-density panels |
| `p-6` | 24 | Section card padding |
| `mb-4` / `mt-4` | 16 | Default block spacing |
| `mb-8` | 32 | Between chapter sections |
| `space-y-6` | 24 | Vertical stack within tab content |

---

## Border Radius

| Token | Usage |
|---|---|
| `rounded` | Buttons, inputs |
| `rounded-lg` | Quiz options, inner mini-cards (8px) |
| `rounded-xl` | Section cards (12px) |
| `rounded-full` | Pills, status badges |

---

## Components

### Formula Card (`.formula-card`)
```tsx
<div className="formula-card">
  <div className="text-[#00e676] text-xs mb-2 uppercase tracking-wider">{f.name}</div>
  <div className="text-white text-base overflow-x-auto">
    <Tex block>{f.formula}</Tex>
  </div>
  {f.note && <div className="text-[#888] text-xs mt-1 italic">{f.note}</div>}
  <div className="text-[#555] text-xs mt-1">[{f.unit}]</div>
</div>
```
- Background: `#0a0a0a` inside the elevated section (set by `.formula-card` in `globals.css`).
- Title in accent green, formula KaTeX-rendered, unit in muted text.
- `overflow-x-auto` keeps long matrix formulas from breaking layout.

### Tab Strip (chapter page)
- Three buttons: Theory / Simulator / Quiz, each `font-syne font-semibold`.
- Active: white text, accent underline (`border-b-2 border-[#00e676]`).
- Inactive: `text-[#888]`.

### Quiz Option (`.quiz-option`)
- Default: `bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-left`.
- Hover: `border-[#333]`.
- `.selected`: `border-[#00e676]`.
- `.correct`: `border-green-700 bg-green-900/15`.
- `.wrong`: `border-red-700 bg-red-900/15`.
- Option text rendered through `<RichMath>` so options like `7.36 × 10⁻¹⁶ C` typeset properly.

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

// Mixed prose with auto-detection — picks up $...$ and $$...$$, plus
// auto-converts strings containing unicode math glyphs (ρ, ω, ×, ²…)
<RichMath>{`By KVL, $\\sum v = 0$ around any loop.`}</RichMath>
<RichMath>{`Q = 4600 × 1.6 × 10⁻¹⁹ = 7.36 × 10⁻¹⁶ C`}</RichMath>
```

**CSS:** `katex/dist/katex.min.css` is imported once in `src/app/layout.tsx`. No client-side bundle cost for math — `katex.renderToString` runs at render time and emits static HTML.

---

## Animations / Transitions

- Default hover/state: `transition-colors`
- Tab indicator: `transition-all`
- No heavy animations. Keep purposeful and minimal.

---

## Dark Mode

This project is **dark-only**. No light mode. Surface ladder:
- `#0a0a0a` (page bg) → `#111111` (cards / panels) → `#1a1a1a` (inner/elevated) → `#222222` (border).
- Accent `#00e676` works on every dark surface — verified high-contrast.
- Avoid pure white text on bright accent backgrounds; use `text-black` for buttons whose background is the accent.
