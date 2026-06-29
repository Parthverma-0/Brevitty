import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Counter from '../components/Counter.jsx'
import StarBorder from '../components/StarBorder.jsx'

const ease = [0.22, 1, 0.36, 1]

/* ------------------------------------------------------------------ */
/* Section 1 — Manifesto hero                                          */
/* Signature: headline reveals word-by-word; an orange underline       */
/* draws itself under "future" on entrance.                            */
/* ------------------------------------------------------------------ */
function Hero() {
  const words = 'A launchpad for founders shaping the future.'.split(' ')

  return (
    <section className="relative overflow-hidden bg-white pt-40 pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-[11px] font-semibold tracking-[0.32em] text-orange"
        >
          ABOUT BREVITTY
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
        >
          {words.map((word, i) => {
            const isKey = word.startsWith('future')
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
                }}
                className="mr-[0.28em] inline-block"
              >
                {isKey ? (
                  <span className="relative inline-block">
                    {word}
                    <svg
                      className="absolute -bottom-2 left-0 h-[12px] w-full"
                      viewBox="0 0 100 12"
                      preserveAspectRatio="none"
                      fill="none"
                    >
                      <motion.path
                        d="M2 7 Q 26 2 50 6 T 98 5"
                        stroke="#f97316"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.05, duration: 0.85, ease }}
                      />
                    </svg>
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            )
          })}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-black/55 sm:text-lg"
        >
          brevitty Incubation Hub empowers early-stage startups with the mentorship, funding,
          network, and opportunities they need to scale — fast.
        </motion.p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — Who we are                                              */
/* Signature: copy reveals line-by-line on scroll, each line fading up. */
/* ------------------------------------------------------------------ */
function Story() {
  const lines = [
    'brevitty is built for founders and innovators shaping the future.',
    'We work alongside multiple incubation centers to give early-stage startups the right mentorship, funding, network, and opportunities to accelerate growth.',
    'We believe in speed, clarity, and collaboration — pushing startups not just to survive, but to scale exponentially fast.',
    'Whether you’re validating your first idea, building your MVP, or preparing to raise your next round, brevitty is your launchpad.',
  ]

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-3">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="font-display text-[11px] font-semibold tracking-[0.28em] text-orange"
          >
            WHO WE ARE
          </motion.span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ show: { transition: { staggerChildren: 0.18 } } }}
          className="space-y-5 lg:col-span-9"
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
              }}
              className="font-display text-xl font-medium leading-snug tracking-tight text-ink sm:text-2xl"
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — What we offer                                           */
/* Signature: cards deal in left-to-right, each snapping up w/ spring.  */
/* ------------------------------------------------------------------ */
const ICONS = {
  workshop: 'M4 5h16v11H4zM4 16l3 3h10l3-3M9 9h6M9 12h6',
  meetup: 'M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a4 4 0 0 1 8 0M17 11a3 3 0 1 0 0-6M14.5 20a4 4 0 0 1 6.5-3.1',
  mentor: 'M12 3l9 4-9 4-9-4 9-4ZM6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
  funding: 'M12 2v20M17 6.5C17 4.6 14.8 3 12 3S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5',
  resource: 'M4 7l8-4 8 4-8 4-8-4ZM4 12l8 4 8-4M4 17l8 4 8-4',
  network: 'M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM19 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10.5 6.5 6.5 15M13.5 6.5 17.5 15M7 18h10',
}

function OfferIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d={d} />
    </svg>
  )
}

function Offer() {
  const items = [
    { icon: 'workshop', title: 'Curated Workshops', desc: 'Hands-on sessions to sharpen your craft.' },
    { icon: 'meetup', title: 'Investor Meetups', desc: 'Face time with the people who fund growth.' },
    { icon: 'mentor', title: 'Mentorship', desc: 'Guidance from operators who’ve built before.' },
    { icon: 'funding', title: 'Funding Access', desc: 'Pathways to the capital you need to scale.' },
    { icon: 'resource', title: 'Resource Sharing', desc: 'Tools, space, and know-how, pooled together.' },
    { icon: 'network', title: 'Network & Connections', desc: 'Plug into a community that opens doors.' },
  ]

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          What we offer.
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={{
                hidden: { opacity: 0, x: -40, y: 24, rotate: -3 },
                show: {
                  opacity: 1, x: 0, y: 0, rotate: 0,
                  transition: { type: 'spring', stiffness: 260, damping: 20 },
                },
              }}
              className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-5 transition-colors duration-300 hover:border-orange/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange transition-colors duration-300 group-hover:bg-orange group-hover:text-white">
                <OfferIcon d={ICONS[it.icon]} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold tracking-tight text-ink">{it.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-black/55">{it.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — By the numbers                                          */
/* Signature: numbers count up; thin orange dividers draw between them. */
/* ------------------------------------------------------------------ */
function Stats() {
  const stats = [
    { node: <Counter value={140} suffix="+" />, label: 'Startups Incubated' },
    { node: '4', label: 'Incubation Centers' },
    { node: <>Est. <Counter value={2025} /></>, label: 'Founded' },
    { node: 'Jaipur', label: 'India' },
  ]

  return (
    <section className="border-y border-black/10 bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-6 lg:grid-cols-4 lg:px-10">
        {stats.map((s, i) => (
          <div key={i} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <motion.span
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.12 }}
                className="absolute left-0 top-1/2 hidden h-14 w-px -translate-y-1/2 origin-top bg-orange/60 lg:block"
              />
            )}
            <span className="font-display text-4xl font-bold tracking-tight text-ink lg:text-5xl">
              {s.node}
            </span>
            <span className="mt-3 text-sm text-black/50">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 5 — Our culture                                             */
/* Signature: background washes white → cream on scroll-in; text       */
/* slides up gently.                                                   */
/* ------------------------------------------------------------------ */
function Culture() {
  const details = [
    ['Industry', 'Business Consulting & Services'],
    ['Team', '11–50'],
    ['Workplace', 'Onsite, Jaipur'],
  ]

  return (
    <motion.section
      initial={{ backgroundColor: '#ffffff' }}
      whileInView={{ backgroundColor: '#faf6ee' }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 1.1, ease }}
      className="py-24 lg:py-32"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        className="mx-auto max-w-3xl px-6 text-center lg:px-10"
      >
        <motion.h2
          variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
          className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
        >
          How we work.
        </motion.h2>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/60 sm:text-lg"
        >
          At brevitty, we promote a collaborative, inclusive, and innovation-driven culture.
          Flexibility, mutual respect, and continuous learning sit at the heart of how we operate —
          empowering entrepreneurs to thrive and build startups that matter.
        </motion.p>

        {/* <motion.div
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
          className="mt-10 flex flex-col items-center justify-center gap-x-8 gap-y-3 text-sm text-black/55 sm:flex-row sm:flex-wrap"
        >
          {details.map(([k, v], i) => (
            <span key={k} className="flex items-center gap-2">
              {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-orange sm:inline-block" />}
              <span className="font-semibold text-ink">{k}:</span> {v}
            </span>
          ))}
        </motion.div> */}
      </motion.div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 6 — Location                                                */
/* Signature: card slides in from the side; orange pin drops in with   */
/* a spring bounce.                                                    */
/* ------------------------------------------------------------------ */
function Location() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          className="relative grid grid-cols-1 gap-10 overflow-hidden rounded-3xl border border-black/10 bg-[#fafaf8] p-8 sm:p-12 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <span className="font-display text-[11px] font-semibold tracking-[0.28em] text-orange">
              FIND US
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Find us in Jaipur.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/55">
              Headquarters: Jaipur, Rajasthan 302033, India
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Jaipur+Rajasthan+302033+India"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-orange"
            >
              Get Directions
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Stylized location card with the dropping pin */}
          <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-ink sm:h-64">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_30%,rgba(249,115,22,0.18),transparent_70%)]" />
            {/* faint grid lines to suggest a map */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '34px 34px',
              }}
            />
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 420, damping: 12, delay: 0.35 }}
              className="relative z-10 flex flex-col items-center"
            >
              <svg viewBox="0 0 24 24" className="h-12 w-12 text-orange" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <span className="mt-1 font-display text-sm font-semibold text-white">Jaipur, India</span>
            </motion.div>
            {/* pin shadow that fades in with the drop */}
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 0.5 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease, delay: 0.6 }}
              className="absolute bottom-12 z-0 h-1.5 w-10 rounded-full bg-orange/40 blur-[3px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 7 — Closing CTA                                             */
/* Signature: a white curtain wipes up to reveal deep black on         */
/* scroll-in; buttons spring in last.                                  */
/* ------------------------------------------------------------------ */
function ClosingCTA() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 35%'] })
  // White curtain covering the dark section, wiped away as you scroll in.
  const curtainScale = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#08070a] py-28 lg:py-36">
      {/* dark-section ambiance */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(249,115,22,0.12),transparent_70%)]" />
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />

      {/* white curtain that scrubs away top→bottom as the section enters */}
      <motion.div
        style={{ scaleY: curtainScale }}
        className="pointer-events-none absolute inset-0 z-20 origin-top bg-white"
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-120px' }}
        variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 0.45 } } }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <motion.h2
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
          className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
        >
          Ready to build something Jaipur has never seen?
        </motion.h2>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.92 },
            show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 18 } },
          }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <StarBorder
            as="a"
            href="https://forms.gle/JhuGFUnYRthAJFyc9"
            target="_blank"
            rel="noopener noreferrer"
            speed="4s"
            innerClassName="bg-orange text-white"
          >
            Apply Now
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </StarBorder>
          <a
            href="/community"
            className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-ink"
          >
            Explore Community
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Story />
      <Offer />
      <Stats />
      <Culture />
      <Location />
      <ClosingCTA />
    </>
  )
}
