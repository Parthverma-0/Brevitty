import { useMemo, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import { MENTORS, MENTOR_LAYOUT } from '../data/mentors.js'
import StarBorder from './StarBorder.jsx'

const ease = [0.22, 1, 0.36, 1]

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
}

// Photo with an initials-on-gradient fallback (drop a real `photo` in later).
function Photo({ mentor, className = '' }) {
  if (mentor.photo) {
    return (
      <img
        src={mentor.photo}
        alt={mentor.name}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center font-display text-4xl font-bold text-white/90 ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${mentor.gradient[0]}, ${mentor.gradient[1]})`,
      }}
    >
      {initials(mentor.name)}
    </div>
  )
}

// ---- Desktop floating card: entrance → parallax → hover layers ----
function FloatingMentor({ mentor, pos, index, springX, springY, hovered, setHovered }) {
  const isHovered = hovered === index
  const dimmed = hovered !== null && !isHovered

  const tx = useTransform(springX, (v) => v * pos.parallax * 26)
  const ty = useTransform(springY, (v) => v * pos.parallax * 26)
  const cursorRot = useTransform(springX, (v) => v * pos.parallax * 4)

  return (
    // Layer 0 — entrance (drops in from above, staggered by parent)
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -90, rotate: pos.rotate * 1.5 },
        show: { opacity: 1, y: 0, rotate: 0 },
      }}
      transition={{ duration: 0.8, ease }}
      className="absolute w-[clamp(150px,15vw,210px)]"
      style={{ top: pos.top, left: pos.left, zIndex: isHovered ? 50 : pos.z }}
    >
      {/* Layer A — cursor parallax */}
      <motion.div style={{ x: tx, y: ty, rotate: cursorRot }}>
        {/* Layer B — base tilt + hover expansion */}
        <motion.div
          onHoverStart={() => setHovered(index)}
          onHoverEnd={() => setHovered(null)}
          animate={{
            rotate: isHovered ? 0 : pos.rotate,
            scale: isHovered ? 1.16 : 1,
            opacity: dimmed ? 0.35 : 1,
            filter: dimmed ? 'blur(1px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.5, ease }}
          className="group relative cursor-pointer rounded-[20px] border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-sm"
        >
          {/* pin */}
          <span className="absolute left-1/2 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-orange shadow-[0_0_10px_2px_rgba(249,115,22,0.6)]" />

          <div className="overflow-hidden rounded-[14px]">
            <div className="aspect-[4/5] w-full">
              <Photo mentor={mentor} />
            </div>
          </div>

          {/* caption — morphs taller to reveal bio on hover */}
          <motion.div layout className="px-1.5 pb-1 pt-3">
            <h3 className="font-display text-sm font-bold leading-tight text-white">
              {mentor.name}
            </h3>
            <p className="mt-0.5 text-[11px] leading-snug text-orange">
              {isHovered ? `${mentor.role} · ${mentor.company}` : mentor.title}
            </p>

            <AnimatePresence>
              {isHovered && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="mt-2 overflow-hidden text-[11px] leading-relaxed text-white/55"
                >
                  {mentor.bio}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ---- Drifting dust particles ----
function Particles() {
  const dust = useMemo(
    () =>
      Array.from({ length: 16 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        dur: Math.random() * 8 + 8,
        delay: Math.random() * 6,
        drift: Math.random() * 40 - 20,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dust.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/40"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
          animate={{ y: [0, -40, 0], x: [0, d.drift, 0], opacity: [0, 0.7, 0] }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ---- Mobile card (tap to expand, no cursor effect) ----
function MobileMentor({ mentor, active, onTap }) {
  return (
    <motion.button
      onClick={onTap}
      layout
      className="relative w-64 shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-left"
    >
      <span className="absolute left-1/2 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-orange" />
      <div className="overflow-hidden rounded-xl">
        <div className="aspect-[4/5] w-full">
          <Photo mentor={mentor} />
        </div>
      </div>
      <div className="px-1.5 pb-1 pt-3">
        <h3 className="font-display text-sm font-bold text-white">{mentor.name}</h3>
        <p className="mt-0.5 text-[11px] text-orange">
          {active ? `${mentor.role} · ${mentor.company}` : mentor.title}
        </p>
        <AnimatePresence>
          {active && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 overflow-hidden text-[11px] leading-relaxed text-white/55"
            >
              {mentor.bio}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

export default function MentorsSection() {
  const [hovered, setHovered] = useState(null)
  const [activeMobile, setActiveMobile] = useState(null)
  const boardRef = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 70, damping: 18, mass: 0.6 })
  const springY = useSpring(mouseY, { stiffness: 70, damping: 18, mass: 0.6 })

  const handleMove = (e) => {
    const rect = boardRef.current.getBoundingClientRect()
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }
  const resetMove = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const headline = "Guided by People Who've Done It.".split(' ')

  return (
    <section
      id="mentors"
      className="relative overflow-hidden bg-[#08070a] py-28 lg:py-36"
    >
      {/* theatre fade — white veil lifts as the section enters view */}
      <motion.div
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease }}
        className="pointer-events-none absolute inset-0 z-30 bg-white"
      />

      {/* spotlight glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_38%,rgba(249,115,22,0.16),transparent_70%)]" />
      {/* grain */}
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.06]" />
      <Particles />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* header */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[11px] font-semibold tracking-[0.24em] text-orange"
        >
          THE MENTORS
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
          className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-3 text-center font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {headline.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, x: -28 },
                show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-white/45"
        >
          Every founder in brevitty gets direct access to mentors who&rsquo;ve
          built, scaled, and exited.
        </motion.p>

        {/* ---- Desktop: floating board ---- */}
        <motion.div
          ref={boardRef}
          onMouseMove={handleMove}
          onMouseLeave={resetMove}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.5 } } }}
          className="relative mx-auto mt-16 hidden h-[640px] max-w-5xl md:block"
        >
          {MENTORS.map((mentor, i) => (
            <FloatingMentor
              key={mentor.name}
              mentor={mentor}
              pos={MENTOR_LAYOUT[i]}
              index={i}
              springX={springX}
              springY={springY}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </motion.div>

        {/* ---- Mobile: horizontal scroll ---- */}
        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MENTORS.map((mentor, i) => (
            <MobileMentor
              key={mentor.name}
              mentor={mentor}
              active={activeMobile === i}
              onTap={() => setActiveMobile(activeMobile === i ? null : i)}
            />
          ))}
        </div>

        {/* CTA — StarBorder, light/orange variant for the dark stage */}
        <div className="mt-16 flex justify-center md:mt-8">
          <StarBorder
            as={Link}
            to="/mentors"
            speed="4s"
            innerClassName="bg-orange text-white"
          >
            Meet All Mentors
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </StarBorder>
        </div>
      </div>
    </section>
  )
}
