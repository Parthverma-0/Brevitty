import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
}

// Board items — mixed types, scattered positions (left/top in %), random tilt.
const ITEMS = [
  {
    id: 'aarav',
    type: 'sticky',
    color: '#fde68a',
    quote: ' The mentors at Brevitty didnt just give advice - they sat with us, challenged our assumptions, and helped us rebuild our Startup from the ground up.',
    name: 'Aarav Mehta',
    left: 3, top: 13, rotate: -6, z: 12, delay: 0.1,
  },
  {
    id: 'priya',
    type: 'polaroid',
    quote: 'I came in with a rough idea and left with a real business.',
    name: 'Parth Verma',
    startup: 'OpenDrill',
    img: 'parth.png',
    grad: ['#f97316', '#db2777'],
    left: 27, top: 3, rotate: 4, z: 20, delay: 0.35,
  },
  {
    id: 'seed',
    type: 'badge',
    label: 'Seed Funded ✓',
    left: 19, top: 49, rotate: -9, z: 30, delay: 0.85,
  },
  {
    id: 'rohan',
    type: 'torn',
    quote: 'Within my first month, Brevitty introduced me to two investors and a co-founder Im still working with today.',
    name: 'Rohan Sinha',
    left: 52, top: 7, rotate: 3, z: 15, delay: 0.5,
  },
  {
    id: 'vikram',
    type: 'sticky',
    color: '#fed7aa',
    quote: 'Every early stage founder in Jaipur should know brevitty exists.',
    name: 'Vikram Das',
    left: 70, top: 12, rotate: -5, z: 12, delay: 0.65,
  },
  {
    id: 'sneha',
    type: 'polaroid',
    quote: 'Demo Day was the most terrifying and best day of my startup life.',
    name: 'Adish Jain',
    img:'adish.jpeg',
    grad: ['#6366f1', '#0ea5e9'],
    left: 56, top: 43, rotate: -6, z: 20, delay: 0.7,
  },
  {
    id: 'demoday',
    type: 'badge',
    label: 'Demo Day 2025 ✓',
    left: 6, top: 55, rotate: 7, z: 30, delay: 0.95,
  },
  {
    id: 'cohort',
    type: 'sticky',
    color: '#fbcfe8',
    quote: '0 → 1, together.',
    name: 'The Brevitty Cohort',
    startup: '',
    small: true,
    left: 33, top: 56, rotate: 5, z: 12, delay: 1.05,
  },
]

// ---- Visual for each board element ----
function ItemCard({ item }) {
  if (item.type === 'sticky') {
    return (
      <div
        className={`relative ${item.small ? 'w-44' : 'w-56'} rounded-sm p-5 shadow-[0_14px_28px_-12px_rgba(0,0,0,0.4)]`}
        style={{ backgroundColor: item.color }}
      >
        {/* tape */}
        <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-2 rounded-[2px] bg-white/40 backdrop-blur-[1px]" />
        <p
          className={`font-medium leading-snug text-black/80 ${item.small ? 'font-display text-2xl font-bold' : 'text-[15px]'}`}
        >
          {item.small ? item.quote : `“${item.quote}”`}
        </p>
        <p className="mt-3 text-xs font-semibold text-black/45">
          — {item.name}
          {item.startup && <span className="font-normal"> · {item.startup}</span>}
        </p>
      </div>
    )
  }

  if (item.type === 'polaroid') {
    return (
      <div className="relative w-52 bg-white p-3 pb-4 shadow-[0_18px_34px_-14px_rgba(0,0,0,0.5)]">
        {/* pin */}
        <span className="absolute -top-2.5 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_3px_5px_rgba(0,0,0,0.4)] ring-2 ring-red-300/60" />
        <div className="aspect-square w-full overflow-hidden">
          {item.img ? (
            <img
              src={item.img}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center font-display text-5xl font-bold text-white/90"
              style={{
                backgroundImage: `linear-gradient(135deg, ${item.grad[0]}, ${item.grad[1]})`,
              }}
            >
              {initials(item.name)}
            </div>
          )}
        </div>
        <p className="mt-2 px-1 text-[13px] italic leading-snug text-black/55">
          “{item.quote}”
        </p>
        <p className="mt-1 text-center font-hand text-2xl leading-none text-ink">
          {item.name}
        </p>
        <p className="text-center font-hand text-lg leading-tight text-black/45">
          {item.startup}
        </p>
      </div>
    )
  }

  if (item.type === 'torn') {
    return (
      <div className="torn-edge relative w-64 bg-[#fdfaf0] px-7 py-7 shadow-[0_14px_28px_-12px_rgba(0,0,0,0.35)]">
        <p className="font-hand text-[26px] leading-tight text-ink">
          “{item.quote}”
        </p>
        <p className="mt-3 text-xs font-semibold text-black/45">
          — {item.name} · {item.startup}
        </p>
      </div>
    )
  }

  // badge
  return (
    <div className="relative flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-[0_8px_18px_-8px_rgba(0,0,0,0.6)]">
      <span className="h-1.5 w-1.5 rounded-full bg-orange" />
      {item.label}
    </div>
  )
}

// ---- One pinned element: push-away → entrance drop → tilt + hover lift ----
function PinnedItem({ item, inView, hovered, setHovered, hoveredPos }) {
  const isHovered = hovered === item.id
  let pushX = 0
  let pushY = 0
  if (hoveredPos && !isHovered) {
    const dx = item.left - hoveredPos.left
    const dy = item.top - hoveredPos.top
    const dist = Math.hypot(dx, dy) || 1
    pushX = (dx / dist) * 9
    pushY = (dy / dist) * 9
  }

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        zIndex: isHovered ? 60 : item.z,
      }}
      animate={{ x: pushX, y: pushY }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
    >
      {/* entrance drop with spring bounce */}
      <motion.div
        initial={{ y: -360, opacity: 0, scale: 0.85 }}
        animate={inView ? { y: 0, opacity: 1, scale: 1 } : {}}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 11,
          delay: item.delay,
        }}
      >
        {/* base tilt + hover lift (straightens to 0deg) */}
        <motion.div
          onHoverStart={() => setHovered(item.id)}
          onHoverEnd={() => setHovered(null)}
          animate={{ rotate: item.rotate }}
          whileHover={{
            rotate: 0,
            scale: 1.07,
            y: -10,
            boxShadow: '0 40px 60px -20px rgba(0,0,0,0.5)',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="cursor-pointer"
        >
          <ItemCard item={item} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ---- Mobile: tap to straighten ----
function MobileItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.button
      onClick={() => setOpen((o) => !o)}
      animate={{ rotate: open ? 0 : item.rotate, scale: open ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="w-full max-w-xs text-left"
    >
      <ItemCard item={item} />
    </motion.button>
  )
}

export default function Testimonials() {
  const boardRef = useRef(null)
  const inView = useInView(boardRef, { once: true, amount: 0.2 })
  const [hovered, setHovered] = useState(null)
  const hoveredPos = hovered ? ITEMS.find((it) => it.id === hovered) : null

  const mobileItems = ITEMS.filter((it) => it.type !== 'badge')

  return (
    <section
      id="stories"
      className="corkboard relative overflow-hidden py-24 lg:py-32"
    >
      {/* faint linen noise + soft shadow under the board */}
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-x-10 bottom-10 top-40 rounded-[40px] shadow-[inset_0_0_120px_rgba(90,60,20,0.12)]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        {/* pinned label */}
        <motion.div
          initial={{ opacity: 0, y: -12, rotate: -6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative inline-flex items-center gap-2 rounded-sm bg-white px-3 py-1.5 shadow-[0_8px_16px_-8px_rgba(0,0,0,0.4)]"
        >
          <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-orange" />
          <span className="text-[11px] font-bold tracking-[0.22em] text-orange">
            FOUNDER STORIES
          </span>
        </motion.div>

        {/* stamped headline */}
        <motion.h2
          initial={{ opacity: 0, scale: 1.08, rotate: -3 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mt-6 origin-left font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          Don&rsquo;t take our word for it.
        </motion.h2>

        {/* ---- Desktop pinboard ---- */}
        <div
          ref={boardRef}
          className="relative mt-12 hidden h-[720px] md:block"
        >
          {ITEMS.map((item) => (
            <PinnedItem
              key={item.id}
              item={item}
              inView={inView}
              hovered={hovered}
              setHovered={setHovered}
              hoveredPos={hoveredPos}
            />
          ))}
        </div>

        {/* ---- Mobile stack ---- */}
        <div className="mt-12 flex flex-col items-center gap-8 md:hidden">
          {mobileItems.map((item) => (
            <MobileItem key={item.id} item={item} />
          ))}
          <p className="text-[11px] tracking-[0.18em] text-black/35">
            TAP A NOTE TO STRAIGHTEN IT
          </p>
        </div>
      </div>
    </section>
  )
}
