import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TAG_LABEL } from '../../data/junctionTools.js'
import JunctionMarkdown from './JunctionMarkdown.jsx'

const ease = [0.22, 1, 0.36, 1]

export default function ToolDetailView({ tool, onBack }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const loadExample = () => {
    setInput(tool.example)
    setError('')
  }

  const generate = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id, input: input.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setResult(data.markdown || '')
    } catch (err) {
      setError(
        err.message ||
          'Could not reach the AI. If you’re running locally, the API only works on Vercel (or `vercel dev`).'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease }}
      className="mx-auto max-w-6xl px-6 pb-28 pt-32 lg:px-10"
    >
      {/* back */}
      <button
        onClick={onBack}
        className="group inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-black/55 transition-colors hover:text-orange"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        All tools
      </button>

      {/* header */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-medium text-orange">[{tool.num}]</span>
            <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-black/55">
              {TAG_LABEL[tool.kind]}
            </span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {tool.name}
          </h1>
          <p className="mt-2 text-base text-black/55">{tool.tagline}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[300px_1fr]">
        {/* left — what to include + tips */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
              What to include
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black/65"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
              Tips
            </p>
            <ul className="mt-4 space-y-3">
              {tool.tips.map((t) => (
                <li key={t} className="flex gap-3 text-sm leading-relaxed text-black/60">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* right — input + result */}
        <div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 transition-colors focus-within:border-orange/40">
            <div className="flex items-center justify-between">
              <label
                htmlFor="tool-input"
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45"
              >
                Your details
              </label>
              <button
                onClick={loadExample}
                className="text-xs font-semibold text-orange transition-opacity hover:opacity-70"
              >
                Try an example ↻
              </button>
            </div>
            <textarea
              id="tool-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={7}
              maxLength={4000}
              placeholder={`Describe your idea, audience, and anything specific…`}
              className="mt-3 w-full resize-y bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-black/35"
            />
            <div className="mt-3 flex items-center justify-between border-t border-black/[0.06] pt-3">
              <span className="font-mono text-[11px] text-black/35">
                {input.length}/4000
              </span>
              <motion.button
                onClick={generate}
                disabled={loading || !input.trim()}
                whileHover={{ scale: loading || !input.trim() ? 1 : 1.03 }}
                whileTap={{ scale: loading || !input.trim() ? 1 : 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(249,115,22,0.6)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating…
                  </>
                ) : (
                  <>
                    Generate
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* result */}
          <AnimatePresence mode="wait">
            {loading && !result && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 space-y-3"
              >
                {[90, 70, 80, 55].map((w, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.12 }}
                    className="h-4 rounded bg-black/[0.06]"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="mt-6 rounded-2xl border border-black/10 bg-[#fafaf8] p-6 sm:p-8"
              >
                <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
                  Result
                </p>
                <JunctionMarkdown text={result} />
                <p className="mt-8 border-t border-black/[0.06] pt-4 text-xs text-black/40">
                  AI-generated guidance — a starting point, not financial or legal advice.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
