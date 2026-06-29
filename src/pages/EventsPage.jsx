import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EVENT_FILTERS, FILTER_TYPE, getNextEvent, getEvents } from '../data/events.js'
import EventTicker from '../components/events/EventTicker.jsx'
import CountdownTimer from '../components/events/CountdownTimer.jsx'
import EventCard from '../components/events/EventCard.jsx'

const ease = [0.22, 1, 0.36, 1]

function GridIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeLinecap="round" />
    </svg>
  )
}

export default function EventsPage() {
  const [filter, setFilter] = useState('All')
  const [view, setView] = useState('grid')

  const EVENTS = getEvents()

  // live countdown to whichever real event happens first
  const nextEvent = useMemo(() => getNextEvent(), [])

  const filtered = useMemo(() => {
    if (filter === 'All') return EVENTS
    if (filter === 'Upcoming') return EVENTS.filter((e) => !e.completed)
    return EVENTS.filter((e) => e.type === FILTER_TYPE[filter])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const headline = "Where Jaipur's Startup Scene Comes Alive".split(' ')

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-[#08070a] pt-36">
        {/* slow drifting orange gradient orb */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-orange/25 blur-[130px]"
          animate={{ x: [-120, 120, -60, -120], y: [-40, 30, -10, -40], scale: [1, 1.2, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-10 text-center lg:px-10">
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            className="flex flex-wrap justify-center gap-x-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {headline.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mx-auto mt-6 max-w-xl text-base text-white/50 sm:text-lg"
          >
            Summits. Conferences. Founder meetups. Don&rsquo;t miss what&rsquo;s next.
          </motion.p>

          {/* countdown to next event */}
          {nextEvent && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-10 inline-flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-5"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange">
                Next event starts in
              </span>
              <CountdownTimer target={new Date(nextEvent.startsAt).getTime()} dark />
              <Link
                to={`/events/${nextEvent.slug}`}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {nextEvent.name} · {nextEvent.dateLabel} →
              </Link>
            </motion.div>
          )}
        </div>

        <EventTicker />
      </section>

      {/* ---- Sticky filter bar ---- */}
      <div className="sticky top-16 z-30 border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex flex-wrap gap-2">
            {EVENT_FILTERS.map((f) => {
              const active = filter === f
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ${
                    active
                      ? 'bg-orange text-white'
                      : 'border border-black/10 text-black/55 hover:border-black/25 hover:text-ink'
                  }`}
                >
                  {f}
                </button>
              )
            })}
          </div>

          {/* view toggle */}
          <div className="flex items-center gap-1 self-start rounded-full border border-black/10 p-1 lg:self-auto">
            {[
              ['grid', <GridIcon key="g" />],
              ['list', <ListIcon key="l" />],
            ].map(([v, icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  view === v ? 'bg-ink text-white' : 'text-black/50 hover:text-ink'
                }`}
              >
                {icon}
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Events ---- */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <motion.div
          layout
          className={
            view === 'grid'
              ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
              : 'flex flex-col gap-4'
          }
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => {
              const row = Math.floor(i / 2)
              const col = i % 2
              const large = view === 'grid' && (row + col) % 2 === 0
              return (
                <EventCard
                  key={event.slug}
                  event={event}
                  index={i}
                  large={large}
                  view={view}
                />
              )
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ---- Bottom CTA ---- */}
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
            Host an event with brevitty?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-4 max-w-md text-base text-white/55"
          >
            We partner with organisations to run workshops, summits and more in Jaipur.
          </motion.p>
          <motion.a
            href="mailto:hello@brevitty.in?subject=Host%20an%20event%20with%20Bravity"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.25 }}
            className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
          >
            Get in Touch →
          </motion.a>
        </div>
      </section>
    </>
  )
}
