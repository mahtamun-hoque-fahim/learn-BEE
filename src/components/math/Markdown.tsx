'use client'

import { RichMath } from './Tex'

/**
 * A minimal markdown renderer purpose-built for learn-BEE topic bodies.
 *
 * Supports the exact subset of markdown the topic authoring script produces:
 *   - paragraphs (separated by blank lines)
 *   - **bold** inline emphasis
 *   - bullet lists  (lines starting with `- `)
 *   - numbered lists (lines starting with `1.`, `2.`, …)
 *   - simple tables  (pipe-separated, with a `---` separator row)
 *   - inline math: $...$
 *   - block math:  $$...$$
 *
 * Inline math is handled by <RichMath>. Everything else is plain markdown
 * parsed line-by-line. No headings or code blocks (we don't need them).
 *
 * Why custom: the alternative (react-markdown + remark-math + rehype-katex)
 * is ~3 extra deps and ~25 KB of bundle for features we don't use. This
 * renderer is ~80 lines and styles match the rest of learn-BEE exactly.
 */

interface Block {
  kind: 'paragraph' | 'bullets' | 'numbered' | 'table'
  lines: string[]
}

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = []
  const raw = source.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  while (i < raw.length) {
    const line = raw[i]

    // skip blank lines between blocks
    if (line.trim() === '') { i++; continue }

    // table: starts with `|` and the next line is a `---` separator
    if (line.startsWith('|') && raw[i + 1]?.match(/^\|[\s|:\-]+\|$/)) {
      const tbl: string[] = []
      while (i < raw.length && raw[i].startsWith('|')) { tbl.push(raw[i]); i++ }
      blocks.push({ kind: 'table', lines: tbl })
      continue
    }

    // bullet list
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < raw.length && raw[i].startsWith('- ')) {
        items.push(raw[i].slice(2)); i++
      }
      blocks.push({ kind: 'bullets', lines: items })
      continue
    }

    // numbered list — match "1.", "2.", … at line start
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < raw.length && /^\d+\.\s/.test(raw[i])) {
        items.push(raw[i].replace(/^\d+\.\s+/, '')); i++
      }
      blocks.push({ kind: 'numbered', lines: items })
      continue
    }

    // paragraph: consume lines until a blank line
    const para: string[] = []
    while (i < raw.length && raw[i].trim() !== '') { para.push(raw[i]); i++ }
    blocks.push({ kind: 'paragraph', lines: para })
  }
  return blocks
}

/** Render inline `**bold**` segments mixed with RichMath. */
function InlineRich({ text }: { text: string }) {
  // Split by **bold** first
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={i} className="font-semibold text-white"><RichMath>{p.slice(2, -2)}</RichMath></strong>
        }
        return <RichMath key={i}>{p}</RichMath>
      })}
    </>
  )
}

function Table({ lines }: { lines: string[] }) {
  // Strip leading/trailing pipes and split each row into cells
  const rows = lines.map(l => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()))
  if (rows.length < 2) return null
  const [header, _sep, ...body] = rows
  return (
    <div className="overflow-x-auto my-3 border border-[#222] rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-[#0a0a0a]">
          <tr>
            {header.map((cell, i) => (
              <th key={i} className="text-left px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[#888] border-b border-[#222]">
                <InlineRich text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-[#0d0d0d]' : 'bg-[#0a0a0a]'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-[#ccc] border-b border-[#1a1a1a] last:border-b-0">
                  <InlineRich text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Top-level renderer. Pass a markdown-with-LaTeX string and get a styled React tree. */
export function Markdown({ source, className = '' }: { source: string; className?: string }) {
  const blocks = parseBlocks(source)
  return (
    <div className={`leading-relaxed text-[#ccc] ${className}`}>
      {blocks.map((b, i) => {
        if (b.kind === 'paragraph') {
          return (
            <p key={i} className="mb-3">
              <InlineRich text={b.lines.join(' ')} />
            </p>
          )
        }
        if (b.kind === 'bullets') {
          return (
            <ul key={i} className="list-disc list-outside pl-5 mb-3 space-y-1.5">
              {b.lines.map((item, j) => (
                <li key={j} className="text-[#ccc]"><InlineRich text={item} /></li>
              ))}
            </ul>
          )
        }
        if (b.kind === 'numbered') {
          return (
            <ol key={i} className="list-decimal list-outside pl-5 mb-3 space-y-1.5 marker:text-[#00e676] marker:font-mono">
              {b.lines.map((item, j) => (
                <li key={j} className="text-[#ccc] pl-1"><InlineRich text={item} /></li>
              ))}
            </ol>
          )
        }
        if (b.kind === 'table') {
          return <Table key={i} lines={b.lines} />
        }
        return null
      })}
    </div>
  )
}
