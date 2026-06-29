// Minimal, dependency-free Markdown → React renderer, styled to Brevitty.
// Supports: #/##/### headings, - / * and numbered lists, **bold**, `code`,
// pipe tables, and paragraphs. Built for the constrained Markdown our server
// prompts produce — not a full CommonMark implementation.

// ---- inline: **bold** and `code` ----
function renderInline(text, keyBase) {
  const nodes = []
  // split on bold or inline-code, keeping delimiters
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  parts.forEach((part, i) => {
    if (!part) return
    const key = `${keyBase}-${i}`
    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      )
    } else if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
        >
          {part.slice(1, -1)}
        </code>
      )
    } else {
      nodes.push(part)
    }
  })
  return nodes
}

const splitRow = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())

const isTableSep = (line) => /^\|?[\s:|-]+\|[\s:|-]+$/.test(line.trim()) && line.includes('-')

export default function JunctionMarkdown({ text }) {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // blank
    if (!trimmed) {
      i++
      continue
    }

    // table: a header row followed by a |---| separator
    if (trimmed.startsWith('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const header = splitRow(trimmed)
      const rows = []
      i += 2
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push({ type: 'table', header, rows })
      continue
    }

    // headings
    const h = trimmed.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      blocks.push({ type: 'h', level: h[1].length, text: h[2] })
      i++
      continue
    }

    // unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    // paragraph (gather consecutive plain lines)
    const para = [trimmed]
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('|')
    ) {
      para.push(lines[i].trim())
      i++
    }
    blocks.push({ type: 'p', text: para.join(' ') })
  }

  return (
    <div className="space-y-4">
      {blocks.map((b, bi) => {
        if (b.type === 'h') {
          const sizes = {
            1: 'text-2xl',
            2: 'text-xl',
            3: 'text-base',
          }
          return (
            <h3
              key={bi}
              className={`font-display font-bold tracking-tight text-ink ${
                sizes[b.level]
              } ${bi === 0 ? '' : 'pt-2'}`}
            >
              {renderInline(b.text, `h-${bi}`)}
            </h3>
          )
        }
        if (b.type === 'p') {
          return (
            <p key={bi} className="text-[15px] leading-relaxed text-black/70">
              {renderInline(b.text, `p-${bi}`)}
            </p>
          )
        }
        if (b.type === 'ul') {
          return (
            <ul key={bi} className="space-y-2">
              {b.items.map((it, ii) => (
                <li key={ii} className="flex gap-3 text-[15px] leading-relaxed text-black/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>{renderInline(it, `ul-${bi}-${ii}`)}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (b.type === 'ol') {
          return (
            <ol key={bi} className="space-y-2">
              {b.items.map((it, ii) => (
                <li key={ii} className="flex gap-3 text-[15px] leading-relaxed text-black/70">
                  <span className="mt-0.5 font-mono text-xs font-semibold text-orange">
                    {String(ii + 1).padStart(2, '0')}
                  </span>
                  <span>{renderInline(it, `ol-${bi}-${ii}`)}</span>
                </li>
              ))}
            </ol>
          )
        }
        if (b.type === 'table') {
          return (
            <div
              key={bi}
              className="overflow-x-auto rounded-xl border border-black/10"
            >
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-black/[0.03]">
                    {b.header.map((c, ci) => (
                      <th
                        key={ci}
                        className="border-b border-black/10 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-black/55"
                      >
                        {renderInline(c, `th-${bi}-${ci}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, ri) => (
                    <tr key={ri} className="even:bg-black/[0.015]">
                      {row.map((c, ci) => (
                        <td
                          key={ci}
                          className="border-b border-black/[0.06] px-4 py-2.5 align-top text-black/70"
                        >
                          {renderInline(c, `td-${bi}-${ri}-${ci}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
