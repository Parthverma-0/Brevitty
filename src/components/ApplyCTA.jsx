import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const lineVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

function Stamp() {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-orange/80">
      brevitty — JAIPUR — EST. 2025
    </span>
  )
}

function LiveCard() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
      </span>
      <span className="text-xs font-medium tracking-wide text-white/80">
        Applications Open
      </span>
    </div>
  )
}

export default function ApplyCTA() {
  const sectionRef = useRef(null)
  const [hover, setHover] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  })
  // Background drifts from the warm corkboard tone to deep black as it enters.
  const bg = useTransform(scrollYProgress, [0, 1], ['#f1e9d9', '#08070a'])

  return (
    <section
      ref={sectionRef}
      id="apply"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* scroll-driven background fade */}
      <motion.div style={{ backgroundColor: bg }} className="absolute inset-0" />

      {/* ambient ember orb */}
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/20 blur-[120px]"
      />
      {/* spotlight + grain */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_50%,rgba(249,115,22,0.10),transparent_70%)]" />
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />

      {/* left vertical stamp */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 2.1, ease }}
        className="absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 md:block"
      >
        <Stamp />
      </motion.div>

      {/* right live card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 2.1, ease }}
        className="absolute right-8 top-1/2 hidden -translate-y-1/2 md:block"
      >
        <LiveCard />
      </motion.div>

      {/* main content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ show: { transition: { staggerChildren: 0.55, delayChildren: 0.2 } } }}
          className="font-display tracking-tight text-white"
        >
          <motion.p
            variants={lineVariants}
            className="text-3xl font-medium text-white/85 sm:text-4xl lg:text-5xl"
          >
            You have an idea.
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="mt-3 text-3xl font-medium text-white/85 sm:text-4xl lg:text-5xl"
          >
            We have everything else.
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="mt-5 text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
          >
            Let&rsquo;s build something{' '}
            <span className="text-orange">Jaipur</span> has never seen.
          </motion.p>
        </motion.div>

        {/* button — scales in after the headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.9 }}
          className="mt-12"
        >
          <motion.a
            href="https://forms.gle/JhuGFUnYRthAJFyc9"
            target="_blank"
            rel="noopener noreferrer"
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-orange px-10 py-4 text-base font-semibold shadow-[0_20px_50px_-15px_rgba(249,115,22,0.7)]"
          >
            {/* ripple */}
            <motion.span
              className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                hover
                  ? { scale: [0, 2.4], opacity: [0.5, 0] }
                  : { scale: 0, opacity: 0 }
              }
              transition={{ duration: 1.1, repeat: hover ? Infinity : 0, ease: 'easeOut' }}
            />
            <span className="relative z-10 text-ink transition-colors duration-300 group-hover:text-white">
              Apply to brevitty
            </span>
            <span className="relative z-10 text-ink transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
              →
            </span>
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="mt-6 text-sm text-white/40"
        >
          Next cohort opens soon. Limited seats.
        </motion.p>

        {/* mobile-only details */}
        <div className="mt-12 flex flex-col items-center gap-5 md:hidden">
          <LiveCard />
          <Stamp />
        </div>
      </div>
    </section>
  )
}
