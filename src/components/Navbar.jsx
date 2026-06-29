import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const ease = [0.22, 1, 0.36, 1]

// `route` links navigate between pages; `hash` links scroll to a homepage section.
const NAV_LINKS = [
  { label: 'HOME', to: '/', type: 'route' },
  { label: 'ABOUT', to: '/about', type: 'route' },
  { label: 'OUR STARTUPS', to: '/community', type: 'route' },
  { label: 'EVENTS', to: '/events', type: 'route' },
  { label: 'MENTORS', to: '/mentors', type: 'route' },
  { label: 'PARTNERS', to: '/partners', type: 'route' },
  { label: 'GRANTS', to: '/grants', type: 'route' },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.2 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.99-11.4a1.58 1.58 0 1 0 1.58 1.57 1.58 1.58 0 0 0-1.58-1.57Z" />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5ZM2.9 8.4h4.16V21H2.9ZM9.34 8.4h3.99v1.72h.06c.56-1.05 1.92-2.16 3.95-2.16 4.22 0 5 2.78 5 6.4V21h-4.16v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93V21H9.34Z" />,
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com',
    icon: <path d="M17.2 3h3.3l-7.2 8.23L22 21h-6.6l-5.17-6.76L4.3 21H1l7.7-8.8L1.5 3h6.77l4.67 6.18ZM16.04 19h1.83L7.06 4.9H5.1Z" />,
  },
]

function useIndiaTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date())

    setTime(format())
    const id = setInterval(() => setTime(format()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

// Three lines morphing into an X via path animation.
function MorphIcon({ open }) {
  const stroke = open ? '#f97316' : '#0a0a0a'
  const line = {
    strokeWidth: 2,
    strokeLinecap: 'round',
    stroke,
    initial: false,
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" className="overflow-visible">
      <motion.path
        {...line}
        animate={{ d: open ? 'M 4 4 L 20 20' : 'M 3 6 L 21 6', stroke }}
        transition={{ duration: 0.35, ease }}
      />
      <motion.path
        {...line}
        animate={{ opacity: open ? 0 : 1, d: 'M 3 12 L 21 12', stroke }}
        transition={{ duration: 0.2, ease }}
      />
      <motion.path
        {...line}
        animate={{ d: open ? 'M 4 20 L 20 4' : 'M 3 18 L 21 18', stroke }}
        transition={{ duration: 0.35, ease }}
      />
    </svg>
  )
}

function Ticker({ time, small = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
      </span>
      <span className={`font-medium tracking-[0.18em] text-black/50 ${small ? 'text-[10px]' : 'text-[11px]'}`}>
        INDIA TIME
      </span>
      <span className={`font-medium tracking-[0.14em] text-black tabular-nums ${small ? 'text-[10px]' : 'text-[11px]'}`}>
        — {time}
      </span>
    </div>
  )
}

export default function Navbar() {
  const time = useIndiaTime()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const linkClass =
    'group relative text-[11px] font-light tracking-[0.16em] text-black/70 transition-colors duration-300 hover:text-black'
  const underline = (
    <span className="absolute -bottom-1 left-0 h-px w-0 bg-orange transition-all duration-300 group-hover:w-full" />
  )

  // Stagger out in reverse on close.
  const listVariants = {
    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  }

  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-md"
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Left — live India time ticker (smaller on mobile) */}
          <div className="hidden sm:block">
            <Ticker time={time} />
          </div>
          <div className="sm:hidden">
            <Ticker time={time} small />
          </div>

          {/* Right — desktop nav links */}
          <ul className="hidden items-center gap-7 md:flex lg:gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                {link.type === 'route' ? (
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                    {underline}
                  </Link>
                ) : (
                  <a href={link.to} className={linkClass}>
                    {link.label}
                    {underline}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Right — mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="relative z-50 -mr-1 flex h-10 w-10 items-center justify-center md:hidden"
          >
            <MorphIcon open={open} />
          </button>
        </nav>
      </motion.header>

      {/* ---- Full-screen mobile overlay ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-0 z-40 flex flex-col bg-white md:hidden"
          >
            {/* subtle orange grain */}
            <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.04]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(249,115,22,0.07),transparent_70%)]" />

            {/* links */}
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2"
            >
              {NAV_LINKS.map((link) => {
                const active = link.type === 'route' && pathname === link.to
                const cls = `block text-3xl font-bold uppercase tracking-tight transition-colors duration-300 ${
                  active ? 'text-orange' : 'text-ink hover:text-orange'
                }`
                return (
                  <motion.li
                    key={link.label}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    className="py-1.5"
                  >
                    {link.type === 'route' ? (
                      <Link to={link.to} onClick={() => setOpen(false)} className={cls}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.to} onClick={() => setOpen(false)} className={cls}>
                        {link.label}
                      </a>
                    )}
                  </motion.li>
                )
              })}
            </motion.ul>

            {/* bottom block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5, ease } }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center gap-5 px-8 pb-10"
            >
              <Ticker time={time} small />

              <a
                href="https://forms.gle/JhuGFUnYRthAJFyc9"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="w-full max-w-xs rounded-full bg-orange py-3.5 text-center text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)]"
              >
                Apply Now →
              </a>

              <div className="flex items-center gap-6">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="text-black/50 transition-colors hover:text-orange"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
