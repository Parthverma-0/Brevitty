import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'
import { TOOLS, TAG_LABEL } from '../data/junctionTools.js'
import JunctionAuthGate from '../components/junction/JunctionAuthGate.jsx'
import ToolDetailView from '../components/junction/ToolDetailView.jsx'

const ease = [0.22, 1, 0.36, 1]

const STAGES = [
  'Find a problem',
  'Test demand',
  'Map rivals',
  'Reach the first 10',
  'Build the MVP',
  'Sharpen the deck',
  'Model the numbers',
  'Get investor-ready',
]

const PROBLEMS = [
  { n: 1, title: 'Ideas stay in notebooks', body: 'Most never get tested. Conviction fades before a single user is asked.' },
  { n: 2, title: 'No honest feedback', body: 'Friends are kind, the internet is noisy. Nobody tells you the hard truth early.' },
  { n: 3, title: 'Advice is generic', body: 'Blog posts weren’t written for your idea, your stage, or your market.' },
  { n: 4, title: '“Investor-ready” feels far', body: 'Decks, models, GTM — the gap from spark to fundable looks impossibly wide.' },
]

const STEPS = [
  { n: 1, title: 'Pick a tool', body: 'Choose from advisors built for each stage of the journey.' },
  { n: 2, title: 'Add your details', body: 'Paste your idea, audience, or rough notes. The more specific, the sharper the answer.' },
  { n: 3, title: 'Get an investor-grade result', body: 'Clear, structured guidance you can act on — or a file you can build from.' },
]

/* ---------------- Hero ---------------- */
function Hero() {
  const words = 'Startup Junction 2026'.split(' ')
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(48%_42%_at_50%_36%,rgba(249,115,22,0.12),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-orange"
        >
          Poornima GCEC Venture Foundation
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }}
          className="mt-6 flex flex-wrap justify-center gap-x-4 font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
        >
          {words.map((word, i) => {
            const isKey = word === 'Junction'
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                }}
                className={isKey ? 'relative inline-block' : ''}
              >
                {word}
                {isKey && (
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <motion.path
                      d="M3 8 C 55 2, 150 2, 197 7"
                      stroke="#F97316"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease, delay: 0.9 }}
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-black/55 sm:text-lg"
        >
          AI tools that take a student founder from a blank page to a
          fundable startup.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href="#toolkit"
            className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(249,115,22,0.6)] transition-shadow hover:shadow-[0_14px_40px_-8px_rgba(249,115,22,0.7)]"
          >
            Explore the tools
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-7 py-3.5 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:border-black/30 hover:bg-white"
          >
            How it works
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------- Stage marquee ---------------- */
function StageMarquee() {
  const Item = ({ label }) => (
    <span className="flex items-center">
      <span className="whitespace-nowrap font-display text-lg font-medium text-black/45 sm:text-xl">
        {label}
      </span>
      <span className="mx-6 font-display text-xl text-orange sm:mx-8">+</span>
    </span>
  )
  return (
    <section className="border-y border-black/10 bg-[#fafaf8] py-6">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee-left">
          {[...STAGES, ...STAGES].map((s, i) => (
            <Item key={i} label={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Problem section ---------------- */
function ProblemCard({ p, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, p.n, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, p.n])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, delay: index * 0.1 }}
      className="rounded-2xl border border-black/10 bg-white p-7 transition-colors hover:border-black/20"
    >
      <span className="font-mono text-sm font-semibold text-orange">
        {String(count).padStart(3, '0')}
      </span>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
        {p.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-black/55">{p.body}</p>
    </motion.div>
  )
}

function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
          The problem
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Good ideas die before they’re tested.
        </h2>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEMS.map((p, i) => (
          <ProblemCard key={p.n} p={p} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ---------------- Toolkit ---------------- */
function ToolCard({ tool, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(tool)}
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-2xl border border-black/10 bg-white p-6 text-left transition-colors duration-300 hover:border-orange/60 hover:shadow-[0_28px_56px_-26px_rgba(249,115,22,0.35)]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-black/30 transition-colors group-hover:text-orange">
          [{tool.num}]
        </span>
        <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-black/50">
          {TAG_LABEL[tool.kind]}
        </span>
      </div>

      <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">
        {tool.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-black/55">{tool.tagline}</p>

      <span className="mt-6 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-orange opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        Open tool
        <span>→</span>
      </span>
    </motion.button>
  )
}

function Toolkit({ onSelect }) {
  return (
    <section id="toolkit" className="scroll-mt-20 bg-[#fafaf8] py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
            The toolkit
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Nine advisors. One founder’s journey.
          </h2>
          <p className="mt-4 text-base text-black/55">
            Each tool is a focused AI advisor. Some give you an instant answer,
            others generate a file you can build from.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelect} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'center center'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="how" ref={ref} className="scroll-mt-20 mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
          How it works
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          From blank page to result in three steps.
        </h2>
      </div>

      <div className="relative mt-16">
        {/* desktop horizontal connector */}
        <motion.div
          style={{ scaleX: lineScale }}
          className="absolute left-0 right-0 top-7 hidden h-px origin-left bg-orange lg:block"
        />
        {/* mobile vertical connector */}
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-7 top-0 bottom-0 w-px origin-top bg-orange lg:hidden"
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease, delay: i * 0.15 }}
              className="relative pl-20 lg:pl-0"
            >
              <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border border-orange/30 bg-white font-display text-xl font-bold text-orange lg:relative">
                {s.n}
              </div>
              <h3 className="mt-0 font-display text-xl font-bold tracking-tight text-ink lg:mt-6">
                {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-black/55">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- CTA band ---------------- */
function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-[#08070a] py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(249,115,22,0.16),transparent_70%)]" />
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Build your startup at The Startup Junction.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.25 }}
          className="mt-10"
        >
          <a
            href="#toolkit"
            className="group inline-flex items-center gap-2 rounded-full bg-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-15px_rgba(249,115,22,0.7)]"
          >
            Open the toolkit
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------- Page ---------------- */
export default function StartupJunctionPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('sj_authed') === '1')
  const [tool, setTool] = useState(null)

  const selectTool = (t) => {
    setTool(t)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  const back = () => {
    setTool(null)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (!authed) return <JunctionAuthGate onAuthed={() => setAuthed(true)} />

  return (
    <AnimatePresence mode="wait">
      {tool ? (
        <ToolDetailView key={tool.id} tool={tool} onBack={back} />
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Hero />
          <StageMarquee />
          <ProblemSection />
          <Toolkit onSelect={selectTool} />
          <HowItWorks />
          <CtaBand />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
