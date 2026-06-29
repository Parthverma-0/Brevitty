import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStartups } from '../data/startups.js'

const ease = [0.22, 1, 0.36, 1]
const PAGE_SIZE = 9

const stageStyles = {
  'Pre-seed': 'bg-black/5 text-black/60',
  Seed: 'bg-orange/10 text-orange',
  'Series A': 'bg-ink text-white',
  Featured: 'bg-orange text-white',
  Funded: 'bg-ink text-white',
  Revenue: 'bg-green-50 text-green-700',
}

function StartupCard({ s, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45, ease, delay: (index % PAGE_SIZE) * 0.04 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:border-orange/40 hover:shadow-[0_24px_50px_-22px_rgba(0,0,0,0.25)]"
    >
      <div className="flex items-start justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl font-display text-lg font-bold text-white"
          style={{ backgroundColor: s.logo ? '#fff' : s.color }}
        >
          {s.logo ? (
            <img
              src={s.logo}
              alt={`${s.name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            s.mark
          )}
        </span>
        {s.sector && (
          <span className="rounded-full bg-orange/10 px-3 py-1 text-[11px] font-semibold text-orange">
            {s.sector}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
        {s.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-black/55">
        {s.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {s.stage && (
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              stageStyles[s.stage] || 'bg-black/5 text-black/60'
            }`}
          >
            {s.stage}
          </span>
        )}
        {s.funding && (
          <span className="rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/60">
            {s.funding}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function CommunityPage() {
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('All')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const startups = useMemo(() => getStartups(), [])

  // Filter pills derived from the live startup data, so admin edits flow through.
  const SECTORS = useMemo(() => {
    const unique = [...new Set(startups.map((s) => s.sector).filter(Boolean))]
    return ['All', ...unique]
  }, [startups])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return startups.filter((s) => {
      const matchesSector = sector === 'All' || s.sector === sector
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.sector || '').toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      return matchesSector && matchesQuery
    })
  }, [query, sector, startups])

  const shown = filtered.slice(0, visible)
  const hasMore = filtered.length > visible

  const headline = 'The brevitty Community'.split(' ')

  const resetPaging = () => setVisible(PAGE_SIZE)

  return (
    <>
      {/* ---- Hero banner ---- */}
      <section className="relative overflow-hidden bg-[#08070a] pb-20 pt-36 lg:pb-24">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -24, 16, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-orange/20 blur-[120px]"
        />
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-10">
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
            className="flex flex-wrap justify-center gap-x-4 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {headline.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto mt-5 max-w-lg text-base text-white/50 sm:text-lg"
          >
            {startups.length} startups. One city. Infinite ambition.
          </motion.p>
        </div>
      </section>

      {/* ---- Sticky search + filter bar ---- */}
      <div className="sticky top-16 z-30 border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          {/* search */}
          <div className="group relative flex items-center lg:w-80">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3 h-4 w-4 text-black/35"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                resetPaging()
              }}
              placeholder="Search startups, founders, sectors..."
              className="w-full rounded-full border border-black/15 bg-white py-2.5 pl-9 pr-4 text-sm text-ink outline-none transition-all duration-300 placeholder:text-black/35 focus:border-orange/60 focus:ring-2 focus:ring-orange/20"
            />
          </div>

          {/* filter pills */}
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((sec) => {
              const active = sector === sec
              return (
                <button
                  key={sec}
                  onClick={() => {
                    setSector(sec)
                    resetPaging()
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ${
                    active
                      ? 'bg-orange text-white'
                      : 'border border-black/10 text-black/55 hover:border-black/25 hover:text-ink'
                  }`}
                >
                  {sec}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ---- Cards grid ---- */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange/10 text-orange">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-7 w-7"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" strokeLinecap="round" />
                <path d="M8 11h6" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold text-ink">
              No startups found. Yet.
            </h3>
            <p className="mt-2 text-sm text-black/50">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {shown.map((s, i) => (
                <StartupCard key={s.name} s={s} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full border border-orange/50 px-8 py-3 text-sm font-semibold text-orange transition-colors duration-300 hover:bg-orange hover:text-white"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* ---- Join the community CTA ---- */}
      <section className="relative overflow-hidden bg-[#08070a] py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(249,115,22,0.12),transparent_70%)]" />
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Building something bold?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-4 max-w-md text-base text-white/55"
          >
            Apply to join the brevitty community and get your startup listed here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.25 }}
            className="mt-9"
          >
            <a
              href="https://forms.gle/JhuGFUnYRthAJFyc9"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-15px_rgba(249,115,22,0.7)]"
            >
              Apply Now
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </motion.div>

          <p className="mt-6 text-xs text-white/35">
            Already a founder?{' '}
            <a href="mailto:hello@brevitty.in?subject=Manage%20my%20Bravity%20profile" className="text-white/60 underline-offset-2 hover:underline">
              Log in to manage your profile.
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
