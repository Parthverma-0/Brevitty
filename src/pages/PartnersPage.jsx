import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PARTNER_TABS, TAB_CATEGORIES, FEATURED, PARTNER_STATS, getPartners,
} from '../data/partners.js'
import PartnerMarquee from '../components/partners/PartnerMarquee.jsx'
import PartnerLogo from '../components/partners/PartnerLogo.jsx'
import Counter from '../components/Counter.jsx'

const ease = [0.22, 1, 0.36, 1]

function PartnerCard({ p, index }) {
  const side = index % 2 === 0 ? -1 : 1
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: side * 30, y: 20 },
        show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease } },
      }}
    >
      <a
        href={p.website}
        className="group flex h-full flex-col items-center rounded-2xl border border-black/10 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-orange/40 hover:shadow-[0_24px_50px_-26px_rgba(0,0,0,0.25)]"
      >
        <PartnerLogo
          p={p}
          className="h-16 w-16 rounded-2xl text-lg"
        />
        <h3 className="mt-4 font-display text-base font-bold tracking-tight text-ink">
          {p.name}
        </h3>
        <span className="mt-2 rounded-full bg-orange/10 px-2.5 py-0.5 text-[10px] font-semibold text-orange">
          {p.category}
        </span>
        <p className="mt-3 text-sm leading-relaxed text-black/55">{p.description}</p>
        <span className="mt-auto pt-5 text-xs font-semibold text-black/50 transition-colors duration-300 group-hover:text-orange">
          Visit Website →
        </span>
      </a>
    </motion.div>
  )
}

function FeaturedSpotlight() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % FEATURED.length), 5000)
    return () => clearInterval(id)
  }, [])
  const f = FEATURED[i]

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#08070a] p-8 sm:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_30%,rgba(249,115,22,0.18),transparent_70%)]" />
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease }}
          className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center"
        >
          <div className="flex items-center gap-5">
            <PartnerLogo p={f} className="h-20 w-20 shrink-0 rounded-2xl text-2xl" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange">
                Our deepest collaboration
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold text-white">{f.name}</h3>
            </div>
          </div>
          <blockquote className="text-lg font-medium italic leading-relaxed text-white/80 lg:max-w-2xl lg:border-l lg:border-white/15 lg:pl-8">
            “{f.quote}”
          </blockquote>
        </motion.div>
      </AnimatePresence>

      {/* progress dots */}
      <div className="relative z-10 mt-8 flex gap-2">
        {FEATURED.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === i ? 'w-8 bg-orange' : 'w-2 bg-white/25'
            }`}
            aria-label={`Featured ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function PartnersPage() {
  const [tab, setTab] = useState('All')
  const PARTNERS = getPartners()

  const filtered = useMemo(() => {
    if (tab === 'All') return PARTNERS
    const cats = TAB_CATEGORIES[tab] || []
    return PARTNERS.filter((p) => cats.includes(p.category))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const headline = 'The Institutions That Believe in brevitty'.split(' ')

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="bg-white pt-36">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold tracking-[0.24em] text-orange"
          >
            OUR PARTNERS
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-3 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            {headline.map((word, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mx-auto mt-5 max-w-xl text-base text-black/50 sm:text-lg"
          >
            From universities to venture funds — our partners make the ecosystem stronger.
          </motion.p>
        </div>

        <div className="mt-12">
          <PartnerMarquee rows={1} speed={32} />
        </div>
      </section>

      {/* ---- Featured spotlight ---- */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <FeaturedSpotlight />
      </section>

      {/* ---- Tabs + grid ---- */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap gap-6 border-b border-black/10">
          {PARTNER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                tab === t ? 'text-ink' : 'text-black/45 hover:text-ink'
              }`}
            >
              {t}
              {tab === t && (
                <motion.span
                  layoutId="partner-tab-underline"
                  className="absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-orange"
                />
              )}
            </button>
          ))}
        </div>

        <div className="py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-2 gap-5 lg:grid-cols-4"
            >
              {filtered.map((p, i) => (
                <PartnerCard key={p.name} p={p} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---- Stats strip ---- */}
      <section className="border-y border-black/10 bg-[#fafaf8]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4 lg:px-10">
          {PARTNER_STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="font-display text-4xl font-bold text-ink lg:text-5xl">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </span>
              <span className="mt-2 text-sm text-black/50">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Become a partner ---- */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease }}
        className="bg-[#fdf3e7]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 text-center lg:px-10">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Want to back Jaipur&rsquo;s boldest founders?
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              ['🎯', 'Access to vetted early-stage startups'],
              ['🤝', 'Co-branding at all brevitty events'],
              ['📊', 'First look at Demo Day companies'],
            ].map(([icon, text]) => (
              <div key={text} className="flex flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  {icon}
                </span>
                <p className="mt-4 max-w-[14rem] text-sm font-medium text-black/65">{text}</p>
              </div>
            ))}
          </div>

          <a
            href="mailto:hello@brevitty.in?subject=Partner%20with%20Bravity"
            className="mt-12 inline-flex items-center gap-2 rounded-full bg-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-15px_rgba(249,115,22,0.7)] transition-transform hover:scale-[1.03]"
          >
            Become a Partner →
          </a>
        </div>
      </motion.section>

      {/* ---- Bottom loop marquee (two rows, faster) ---- */}
      <section className="py-16">
        <PartnerMarquee rows={2} speed={22} />
      </section>

      {/* ---- Bottom CTA ---- */}
      <section className="relative overflow-hidden bg-[#08070a] py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="font-display text-2xl font-bold tracking-tight text-white"
          >
            brevitty<span className="text-orange">.</span>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
          >
            Together we&rsquo;re building Rajasthan&rsquo;s strongest startup ecosystem.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-5 max-w-md text-base text-white/45"
          >
            Every partner brings something brevitty founders can&rsquo;t find alone.
          </motion.p>
        </div>
      </section>
    </>
  )
}
