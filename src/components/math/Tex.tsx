import katex from 'katex'

interface TexProps {
  children: string
  block?: boolean
  className?: string
}

/**
 * Server-rendered KaTeX inline math. Use as <Tex>{`\\dfrac{V}{R}`}</Tex>.
 * Pass `block` for display math.
 */
export function Tex({ children, block = false, className = '' }: TexProps) {
  let html: string
  try {
    html = katex.renderToString(children, {
      throwOnError: false,
      displayMode: block,
      strict: 'ignore',
      output: 'html',
      trust: false,
    })
  } catch {
    const escaped = children.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))
    html = `<code class="text-red-400">${escaped}</code>`
  }
  return (
    <span
      className={(block ? 'block my-2 ' : '') + className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// ─── ASCII → LaTeX auto-conversion ────────────────────────────────────────
// Used so legacy question/answer/explanation strings render properly without
// the author having to hand-write LaTeX. Conservative — only converts tokens
// that are clearly mathematical.

const GREEK: Record<string, string> = {
  'ρ': '\\rho', 'ω': '\\omega', 'θ': '\\theta', 'τ': '\\tau',
  'Σ': '\\sum', 'Δ': '\\Delta', 'π': '\\pi', 'φ': '\\phi', 'ϕ': '\\phi',
  'α': '\\alpha', 'β': '\\beta', 'μ': '\\mu', 'λ': '\\lambda',
  'Ω': '\\Omega', '∞': '\\infty', '∂': '\\partial',
}
const OPS: Record<string, string> = {
  '×': '\\times', '·': '\\cdot', '≈': '\\approx',
  '≤': '\\le', '≥': '\\ge', '≠': '\\ne', '±': '\\pm',
  '⇒': '\\Rightarrow', '∝': '\\propto', '→': '\\to', '∠': '\\angle ',
  '°': '^{\\circ}', '½': '\\tfrac{1}{2}', 'µ': '\\mu ',
}
const SUP: Record<string, string> = {
  '²': '2', '³': '3', '¹': '1', '⁰': '0',
  '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n',
}
const FUNCS = ['sin', 'cos', 'tan', 'log', 'ln', 'exp', 'sinh', 'cosh', 'tanh']

/** Convert an ASCII-ish math fragment to LaTeX. Idempotent for already-LaTeX input. */
export function asciiToLatex(s: string): string {
  if (/\\[a-zA-Z]+/.test(s)) return s // already LaTeX, leave alone

  // sqrt
  s = s.replace(/√\s*\(([^()]+)\)/g, '\\sqrt{$1}')
       .replace(/√\s*([A-Za-z]+|\d+)/g, '\\sqrt{$1}')
  // unicode superscript runs (including leading ⁻ minus). Translate the whole
  // contiguous block so e.g. ⁻¹⁶ becomes ^{-16}, not two superscripts.
  s = s.replace(/[⁻²³¹⁰⁴⁵⁶⁷⁸⁹ⁿ]+/g, m => {
    const inner = Array.from(m).map(c => c === '⁻' ? '-' : (SUP[c] ?? c)).join('')
    return '^{' + inner + '}'
  })
  // ^( … ) and ^-digits → ^{…}
  s = s.replace(/\^\(([^()]+)\)/g, '^{$1}').replace(/\^(-?\d+)(?!\})/g, '^{$1}')
  // greek/ops
  for (const [k, v] of Object.entries(GREEK)) s = s.split(k).join(v + ' ')
  for (const [k, v] of Object.entries(OPS))   s = s.split(k).join(v + ' ')
  s = s.replace(/∫/g, '\\int ').replace(/\.\.\./g, '\\cdots').replace(/…/g, '\\cdots')
  // function names
  for (const fn of FUNCS) s = s.replace(new RegExp(`\\b${fn}\\b(?!\\\\)`, 'g'), `\\${fn}`)
  // dY/dX
  s = s.replace(/\bd([A-Za-z])\s*\/\s*d([A-Za-z])\b/g, '\\dfrac{d$1}{d$2}')
  // subscripts: X_word and bare X<digits>  (skip if preceded by a TeX macro like \times or \cdot)
  s = s.replace(/([A-Za-z])_([A-Za-z]+|\d+)/g, '$1_{$2}')
  s = s.replace(/(?<!\\[a-zA-Z]{2,10})([A-Za-z])(\d+)/g, '$1_{$2}')
  // 1/X numeric  &  (A)/(B)
  s = s.replace(/\b1\s*\/\s*([A-Za-z](?:_\{[^}]+\})?)\b/g, '\\dfrac{1}{$1}')
  s = s.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, '\\dfrac{$1}{$2}')
  // tidy
  s = s.replace(/\\sqrt\s+(\d+|[A-Za-z](?:_\{[^}]+\})?)/g, '\\sqrt{$1}')
  return s.replace(/\s+/g, ' ').trim()
}

// Detect strings that need any math handling at all.
// Treat 3+ consecutive underscores as a fill-blank placeholder, NOT math.
const MATH_DETECT = /[ρωθτΣΔπφαβμλΩ∞∂∫√∠°×·²³¹⁰⁴⁵⁶ⁿ±≈≤≥≠]|\$|\^\{|\\dfrac|\\sqrt|\\sum|\\int/

/**
 * Render mixed prose. Detects $...$ and $$...$$ explicitly; if neither is present
 * but the string contains math glyphs, treats the whole string as a single inline
 * tex expression (ASCII-converted).
 */
export function RichMath({ children, className = '' }: { children: string; className?: string }) {
  if (!children) return null
  if (!MATH_DETECT.test(children)) return <span className={className}>{children}</span>

  // If string has $ delimiters, split on them
  if (children.includes('$')) {
    const parts: Array<{ t: 'text' | 'inline' | 'block'; v: string }> = []
    let rest = children
    while (rest.length) {
      const b = rest.match(/\$\$([^$]+)\$\$/)
      const i = rest.match(/\$([^$\n]+)\$/)
      const next = b && i ? (b.index! < i.index! ? b : i) : (b || i)
      if (!next || next.index === undefined) { parts.push({ t: 'text', v: rest }); break }
      if (next.index > 0) parts.push({ t: 'text', v: rest.slice(0, next.index) })
      parts.push({ t: next === b ? 'block' : 'inline', v: next[1].trim() })
      rest = rest.slice(next.index + next[0].length)
    }
    return (
      <span className={className}>
        {parts.map((p, i) => p.t === 'text'
          ? <span key={i}>{p.v}</span>
          : <Tex key={i} block={p.t === 'block'}>{asciiToLatex(p.v)}</Tex>)}
      </span>
    )
  }

  // No $ delimiters but math glyphs present — render whole string as inline TeX
  return <Tex className={className}>{asciiToLatex(children)}</Tex>
}
