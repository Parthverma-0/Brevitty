import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  getGrants,
  getFeaturedGrants,
  getTypeFilters,
  STAGE_FILTERS,
  matchesStage,
  daysUntil,
} from '../data/grants.js'

const ease = [0.22, 1, 0.36, 1]

/* ---------- small icons ---------- */
const CalIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
    <rect x="3" y="4.5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 2.5v4M16 2.5v4" strokeLinecap="round" />
  </svg>
)
const PinIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
    <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

/* ---------- deadline pill ---------- */
function Deadline({ grant }) {
  const d = daysUntil(grant.deadline)
  const soon = d != null && d >= 0 && d <= 14
  const rolling = grant.deadline == null

  if (soon) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
        </span>
        Closing soon · {d}d left
      </span>
    )
  }
  if (rolling) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-black/45">
        <CalIcon /> Rolling
        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-black/45">
          Always open
        </span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-black/55">
      <CalIcon />{' '}
      {new Date(grant.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
  )
}

/* ---------- grant card (grid) ---------- */
function GrantCard({ grant, index }) {
  const side = index % 2 === 0 ? -1 : 1
  return (
    <motion.a
      layout
      href={grant.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: side * 36, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: (index % 9) * 0.04 }}
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-orange/50 hover:shadow-[0_28px_56px_-26px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold text-orange">
          {grant.type}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-black/40">
          <PinIcon className="h-3 w-3" /> {grant.location}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-ink">
        {grant.name}
      </h3>
      <p className="mt-1 text-sm text-black/50">{grant.provider}</p>

      <p className="mt-10 font-display text-sm font-semibold text-ink">{grant.amount}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {grant.stages.slice(0, 2).map((s) => (
          <span key={s} className="rounded-md bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-black/55">
            {s}
          </span>
        ))}
        <span className="rounded-md border border-black/10 px-2 py-0.5 text-[10px] font-medium text-black/55">
          {grant.sector}
        </span>
      </div>

      <p className="mt-4 line-clamp-1 text-xs leading-relaxed text-black/45">{grant.eligibility}</p>

      <div className="mt-auto flex items-center justify-between pt-5">
        <Deadline grant={grant} />
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange">
          Apply
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </motion.a>
  )
}

/* ---------- featured card ---------- */
function FeaturedCard({ grant }) {
  return (
    <motion.a
      variants={{
        hidden: { opacity: 0, x: -60, y: 24, rotate: -2 },
        show: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 180, damping: 18 } },
      }}
      href={grant.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-w-[280px] flex-1 flex-col overflow-hidden rounded-2xl border border-orange/30 bg-orange/[0.04] p-6 transition-shadow duration-300 hover:shadow-[0_30px_60px_-28px_rgba(249,115,22,0.5)] sm:min-w-0"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange/15 blur-2xl" />
      <span className="relative w-fit text-[11px] font-semibold uppercase tracking-[0.2em] text-orange">
        ★ Featured
      </span>
      <h3 className="relative mt-3 font-display text-xl font-bold leading-snug tracking-tight text-ink">
        {grant.name}
      </h3>
      <p className="relative mt-1 text-sm text-black/55">{grant.provider}</p>
      <p className="relative mt-4 font-display text-2xl font-bold text-ink">{grant.amount}</p>
      <div className="relative mt-auto flex items-center justify-between pt-6">
        <Deadline grant={grant} />
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange">
          Apply
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </motion.a>
  )
}

/* ---------- empty state ---------- */
function Empty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="col-span-full flex flex-col items-center py-24 text-center"
    >
      <motion.span
        initial={{ rotate: -8 }}
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/10 text-orange"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" strokeLinecap="round" />
        </svg>
      </motion.span>
      <h3 className="mt-5 font-display text-xl font-bold text-ink">No grants match that.</h3>
      <p className="mt-1 text-sm text-black/50">Try another filter.</p>
    </motion.div>
  )
}

/* ---------- closing CTA (scroll wash white → black) ---------- */
function ClosingCTA() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const bg = useTransform(scrollYProgress, [0, 1], ['#ffffff', '#08070a'])
  const textCol = useTransform(scrollYProgress, [0, 0.6, 1], ['#0a0a0a', '#0a0a0a', '#ffffff'])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div style={{ backgroundColor: bg }} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_55%,rgba(249,115,22,0.12),transparent_70%)]" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center">
        <motion.h2
          style={{ color: textCol }}
          className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          The right funding is closer than you think.
        </motion.h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href="https://forms.gle/JhuGFUnYRthAJFyc9"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.45 }}
            className="rounded-full bg-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-15px_rgba(249,115,22,0.7)] transition-transform hover:scale-[1.03]"
          >
            Apply to Bravity →
          </motion.a>
          <motion.a
            href="/community"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.6 }}
            className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
          >
            Explore Community
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default function GrantsPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const [stage, setStage] = useState('All Stages')

  const grants = getGrants()
  const featured = getFeaturedGrants()
  const typeFilters = useMemo(() => getTypeFilters(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return grants.filter((g) => {
      if (type !== 'All' && g.type !== type) return false
      if (!matchesStage(g, stage)) return false
      if (!q) return true
      return (
        g.name.toLowerCase().includes(q) ||
        g.provider.toLowerCase().includes(q) ||
        g.sector.toLowerCase().includes(q) ||
        g.eligibility.toLowerCase().includes(q)
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, stage])

  const headline = 'Grants that move founders forward.'.split(' ')

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-white pt-36">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold tracking-[0.26em] text-orange"
          >
            FUNDING ACCESS
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
            className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-x-3 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl"
          >
            {headline.map((word, i) => {
              const last = i === headline.length - 1
              return (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                  }}
                  className={last ? 'relative inline-block' : ''}
                >
                  {word}
                  {last && (
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      height="10"
                      viewBox="0 0 200 10"
                      preserveAspectRatio="none"
                      fill="none"
                    >
                      <motion.path
                        d="M2 7 C 50 2, 150 2, 198 6"
                        stroke="#F97316"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease, delay: 0.9 }}
                      />
                    </svg>
                  )}
                </motion.span>
              )
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-base text-black/55 sm:text-lg"
          >
            Curated funding opportunities for early-stage startups — from government schemes to
            accelerator programs. Find what fits your stage and apply.
          </motion.p>
        </div>

        {/* ---------- Featured strip ---------- */}
        {featured.length > 0 && (
          <div className="mx-auto mt-14 max-w-7xl px-6 lg:px-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
              Standout opportunities
            </p>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ show: { transition: { staggerChildren: 0.14 } } }}
              className="mt-4 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible"
            >
              {featured.map((g) => (
                <FeaturedCard key={g.slug} grant={g} />
              ))}
            </motion.div>
          </div>
        )}
      </section>

      {/* ---------- Sticky filter + search ---------- */}
      <div className="sticky top-16 z-30 mt-12 border-y border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-3 px-6 py-4 lg:px-10">
          {/* search */}
          <div className="group relative max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search grants, providers, sectors..."
              className="peer w-full border-b border-black/15 bg-transparent pb-2 pl-6 text-sm text-ink outline-none placeholder:text-black/35"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-0 top-0.5 h-4 w-4 text-black/35">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" strokeLinecap="round" />
            </svg>
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange transition-transform duration-300 peer-focus:scale-x-100" />
          </div>

          {/* type + stage pills */}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ${
                    type === t ? 'bg-orange text-white' : 'border border-black/10 text-black/55 hover:border-black/25 hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {STAGE_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-300 ${
                    stage === s ? 'bg-ink text-white' : 'border border-black/10 text-black/45 hover:text-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Grid ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <p className="mb-6 text-sm text-black/45">
          {filtered.length} grant{filtered.length === 1 ? '' : 's'}
        </p>
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <Empty key="empty" />
            ) : (
              filtered.map((g, i) => <GrantCard key={g.slug} grant={g} index={i} />)
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ---------- Contact strip ---------- */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
        className="border-t border-black/10 bg-[#fdf3e7]"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center lg:flex-row lg:justify-between lg:text-left lg:px-10">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Not sure which grant fits? Talk to us.
            </h2>
            <p className="mt-2 flex flex-col gap-1 text-sm text-black/55 sm:flex-row sm:gap-4">
              <a href="mailto:hello@brevitty.in" className="font-medium text-ink transition-colors hover:text-orange">
                hello@brevitty.in
              </a>
              <span className="inline-flex items-center justify-center gap-1.5">
                <PinIcon className="h-3.5 w-3.5" /> C-Scheme, Jaipur · Rajasthan
              </span>
            </p>
          </div>
          <motion.a
            href="mailto:hello@brevitty.in"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.35 }}
            className="shrink-0 rounded-full bg-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-15px_rgba(249,115,22,0.7)] transition-transform hover:scale-[1.03]"
          >
            Get in Touch →
          </motion.a>
        </div>
      </motion.section>

      {/* ---------- Closing CTA ---------- */}
      <ClosingCTA />
    </>
  )
}
