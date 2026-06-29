import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getStartups } from '../data/startups.js'
import LogoMarquee from './LogoMarquee.jsx'
import StarBorder from './StarBorder.jsx'

const ease = [0.22, 1, 0.36, 1]

const entrance = {
  left: { hidden: { opacity: 0, x: -90 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 90 }, show: { opacity: 1, x: 0 } },
  center: {
    hidden: { opacity: 0, y: 70, scale: 0.85 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
}

// Editorial, intentionally uneven grid. Each card carries its own entrance
// direction and a parallax `depth` (px of scroll-driven Y travel).
const CARDS = [
  { i: 0, span: 'md:col-span-7', dir: 'left', depth: 40, offset: '', featured: true },
  { i: 1, span: 'md:col-span-5', dir: 'right', depth: 75, offset: 'md:mt-20' },
  { i: 2, span: 'md:col-span-4', dir: 'left', depth: 30, offset: '' },
  { i: 3, span: 'md:col-span-4', dir: 'center', depth: 95, offset: 'md:-mt-10' },
  { i: 4, span: 'md:col-span-4', dir: 'right', depth: 55, offset: 'md:mt-12' },
]

const stageStyles = {
  'Pre-seed': 'bg-black/5 text-black/60',
  Seed: 'bg-orange/10 text-orange',
  'Series A': 'bg-ink text-white',
  Featured: 'bg-orange text-white',
}

function StartupCard({ card, scrollYProgress }) {
  const s = getStartups()[card.i]
  const y = useTransform(scrollYProgress, [0, 1], [card.depth, -card.depth])

  if (!s) return null

  return (
    <motion.div
      variants={entrance[card.dir]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, ease }}
      className={`group relative ${card.span} ${card.offset}`}
    >
      <motion.div
        style={{ y }}
        className={`relative h-full overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur transition-all duration-500 group-hover:-translate-y-2 group-hover:border-black/20 group-hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)] ${
          card.featured ? 'p-8 md:p-10' : 'p-7'
        }`}
      >
        {/* background photo — grayscale by default, colored on hover */}
        {s.bg && (
          <>
            <img
              src={s.bg}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-fit grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            {/* readability scrim — nearly clears on hover so the full-color photo shows through */}
            <div className="pointer-events-none absolute inset-0 bg-white/80 transition-colors duration-700 group-hover:bg-white/10" />
          </>
        )}

        {/* chrome glass sheen */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6),transparent_40%)]" />

        {/* rainbow shimmer border — appears + sweeps on hover (skipped for photo cards) */}
        {!s.bg && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:linear-gradient(115deg,#ff5f6d,#ffc371,#7afcff,#c79bff,#ff5f6d)] [background-size:200%_100%] [-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude] animate-[chrome-shimmer_3s_linear_infinite]"
          />
        )}

        <div className="relative flex h-full flex-col">
          {/* logo */}
          <span
            className={`flex items-center justify-center overflow-hidden rounded-xl font-display font-bold text-white shadow-sm ${
              card.featured ? 'h-14 w-14 text-2xl' : 'h-11 w-11 text-xl'
            }`}
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

          {/* name + description */}
          <h3
            className={`mt-6 font-display font-bold tracking-tight text-ink ${
              card.featured ? 'text-3xl' : 'text-xl'
            }`}
          >
            {s.name}
          </h3>
          <p
            className={`mt-2 max-w-sm leading-relaxed text-black/55 ${
              card.featured ? 'text-base' : 'text-sm'
            }`}
          >
            {s.description}
          </p>

          {/* footer — stage + funding capsules */}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${stageStyles[s.stage]}`}
            >
              {s.stage}
            </span>
            <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-black/60">
              {s.funding}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function StartupsSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Headline scrubs horizontally as the section passes through the viewport.
  const headlineX = useTransform(scrollYProgress, [0, 1], ['6%', '-5%'])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fafaf8] py-28 lg:py-36"
    >
      {/* faint chrome grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_40%,transparent_80%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center text-[11px] font-semibold tracking-[0.24em] text-orange"
        >
          {/* OUR PORTFOLIO */}
        </motion.p>

        {/* scroll-scrubbing headline ticker */}
        <div className="mt-4 overflow-hidden">
          <motion.h2
            style={{ x: headlineX }}
            className="whitespace-nowrap text-center font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Bold Ideas. Mentored by CA Paresh Gupta.
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-5 max-w-xl text-center text-base text-black/50"
        >
          From Ideation to a funded company - the Startups we&rsquo;ve
          helped.
        </motion.p>

        {/* editorial card grid */}
        <div className="mt-20 grid grid-cols-1 items-start gap-6 md:grid-cols-12">
          {CARDS.map((card) => (
            <StartupCard
              key={card.i}
              card={card}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* CTA — the single StarBorder usage */}
        <div className="mt-20 flex justify-center">
          <StarBorder as={Link} to="/community" speed="4.5s">
            View All Startups
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </StarBorder>
        </div>

        {/* infinite logo marquee */}
        <LogoMarquee />
      </div>
    </section>
  )
}
