import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MENTOR_FILTERS, getMentors } from '../data/mentorsFull.js'
import StarBorder from '../components/StarBorder.jsx'

const ease = [0.22, 1, 0.36, 1]

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('')
}

// Ghosted, slowly rotating ring of mentor silhouettes behind the hero text.
function AvatarRing() {
  const MENTORS = getMentors()
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        className="relative h-0 w-0 opacity-20 blur-[2px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      >
        {MENTORS.map((m, i) => {
          const angle = (i / MENTORS.length) * 360
          const grad = m.gradient || ['#f97316', '#db2777']
          return (
            <span
              key={m.slug}
              className="absolute -ml-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-full font-display text-lg font-bold text-white/70"
              style={{
                transform: `rotate(${angle}deg) translateY(-260px)`,
                backgroundImage: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
              }}
            >
              {initials(m.name)}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

function MentorCard({ mentor, index }) {
  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: (index % 3) * 0.08 } },
      }}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.94 }}
    >
      <Link
        to={`/mentors/${mentor.slug}`}
        className="group relative flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:border-orange/40 hover:bg-ink hover:shadow-[0_0_50px_-8px_rgba(249,115,22,0.45)]"
      >
        {/* photo */}
        <div className="overflow-hidden rounded-xl">
          {mentor.photo ? (
            <img
              src={mentor.photo}
              alt={mentor.name}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-top grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
          ) : (
            <div
              className="flex aspect-[4/3] w-full items-center justify-center font-display text-4xl font-bold text-white/90 grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${(mentor.gradient || ['#f97316', '#db2777'])[0]}, ${(mentor.gradient || ['#f97316', '#db2777'])[1]})` }}
            >
              {initials(mentor.name)}
            </div>
          )}
        </div>

        <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-white">
          {mentor.name}
        </h3>
        <p className="mt-1 text-sm text-black/55 transition-colors duration-300 group-hover:text-white/60">
          {mentor.title}
        </p>

        {/* company chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(mentor.companies || []).map((c) => (
            <span
              key={c}
              className="rounded-md border border-black/10 px-2 py-0.5 text-[10px] font-medium text-black/45 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white/55"
            >
              {c}
            </span>
          ))}
        </div>

        {/* expertise tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(mentor.tags || []).map((t) => (
            <span
              key={t}
              className="rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold text-orange transition-colors duration-300 group-hover:bg-orange/20"
            >
              {t}
            </span>
          ))}
        </div>

        {/* quote */}
        <p className="mt-5 text-sm italic leading-relaxed text-black/50 transition-colors duration-300 group-hover:text-white/70">
          “{mentor.quote}”
        </p>

        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-black/60 transition-colors duration-300 group-hover:text-orange">
          View Profile
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </motion.div>
  )
}

export default function MentorsPage() {
  const [filter, setFilter] = useState('All')
  const MENTORS = getMentors()

  const filtered = useMemo(() => {
    if (filter === 'All') return MENTORS
    return MENTORS.filter(
      (m) => m.category === filter || (m.tags || []).includes(filter),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const headline = 'The People Behind the Founders'

  return (
    <>
      {/* ---- Dark hero ---- */}
      <section className="relative overflow-hidden bg-[#08070a] pb-20 pt-40">
        <motion.div
          animate={{ x: [-100, 100, -40, -100], y: [-30, 20, -10, -30], scale: [1, 1.18, 0.95, 1] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/4 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-orange/20 blur-[130px]"
        />
        <AvatarRing />
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-10">
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } } }}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl"
          >
            {headline.split('').map((ch, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.05 } } }}
                className="inline-block whitespace-pre"
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              className=" inline-block text-orange"
            >
              ▍
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mx-auto mt-6 max-w-xl text-base text-white/50 sm:text-lg"
          >
            Every mentor at brevitty has built, scaled, or exited. No theorists. No tourists.
          </motion.p>
        </div>
      </section>

      {/* ---- Sticky filter bar ---- */}
      <div className="sticky top-16 z-30 border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex flex-wrap gap-2">
            {MENTOR_FILTERS.map((f) => {
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
          <span className="shrink-0 text-sm font-medium text-black/45">
            {MENTORS.length} Mentors
          </span>
        </div>
      </div>

      {/* ---- Grid ---- */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-display text-2xl font-bold text-ink">No mentors here. Yet.</h3>
            <p className="mt-2 text-sm text-black/50">We&rsquo;re adding more every cohort.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((mentor, i) => (
                <MentorCard key={mentor.slug} mentor={mentor} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
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
            Want to mentor the next generation of founders?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-4 max-w-md text-base text-white/55"
          >
            We&rsquo;re always looking for operators, investors, and builders who want to give back.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.25 }}
            className="mt-9 flex justify-center"
          >
            <StarBorder
              as="a"
              href="mailto:hello@brevitty.in?subject=Apply%20to%20mentor%20at%20Bravity"
              speed="4s"
              innerClassName="bg-white text-ink"
            >
              Apply to Mentor
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </StarBorder>
          </motion.div>
        </div>
      </section>
    </>
  )
}
