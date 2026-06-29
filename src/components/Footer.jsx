import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ease = [0.22, 1, 0.36, 1]

// Quick-link label → app route.
const QUICK_LINK_TO = (label) => (label === 'Home' ? '/' : `/${label.toLowerCase()}`)

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: i * 0.1 },
  }),
}

const stripContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const stripItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

// const QUICK_LINKS = ['Home', 'About', 'Community', 'Events', 'Mentors', 'Partners']

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/brevitty.incubation?igsh=MWhsNXVnaDNsN2w4NQ==',
    icon: (
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.2 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.99-11.4a1.58 1.58 0 1 0 1.58 1.57 1.58 1.58 0 0 0-1.58-1.57Z" />
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/brevittyincubationhub/',
    icon: (
      <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5ZM2.9 8.4h4.16V21H2.9ZM9.34 8.4h3.99v1.72h.06c.56-1.05 1.92-2.16 3.95-2.16 4.22 0 5 2.78 5 6.4V21h-4.16v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93V21H9.34Z" />
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com',
    icon: (
      <path d="M17.2 3h3.3l-7.2 8.23L22 21h-6.6l-5.17-6.76L4.3 21H1l7.7-8.8L1.5 3h6.77l4.67 6.18ZM16.04 19h1.83L7.06 4.9H5.1Z" />
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    ),
  },
]

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative mt-24 overflow-hidden border-t border-black/10 bg-white"
    >
      <div className="flex">
        {/* ---- Main body (left / center) ---- */}
        <div className="flex-1 px-6 py-16 lg:px-10 lg:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-12"
          >
            {/* Brand + tagline + newsletter */}
            <motion.div
              variants={reveal}
              custom={0}
              className="md:col-span-5"
            >
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                brevitty<span className="text-orange">.</span>
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-black/55">
                Incubating Bold Ideas Since 2025 - Jaipur, India.
              </p>

              {/* Newsletter */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-8 max-w-sm"
              >
                <label className="text-[11px] font-medium tracking-[0.18em] text-black/45">
                  SUBSCRIBE TO OUR NEWSLETTER
                </label>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-black/15 bg-white p-1 pl-4 transition-colors focus-within:border-black/40">
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-black/35"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="shrink-0 rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-white shadow-[0_8px_24px_-10px_rgba(249,115,22,0.7)]"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Quick links */}
            {/* <motion.div
              variants={reveal}
              custom={1}
              className="md:col-span-3"
            >
              <h4 className="text-[11px] font-medium tracking-[0.18em] text-black/45">
                EXPLORE
              </h4>
              <ul className="mt-5 space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link}>
                    <Link
                      to={QUICK_LINK_TO(link)}
                      className="group inline-flex items-center text-sm text-black/65 transition-colors hover:text-ink"
                    >
                      <span className="mr-0 h-px w-0 bg-orange transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div> */}
            <motion.div
              className="md:col-span-3"
            ></motion.div>
            {/* Contact */}
            <motion.div
              variants={reveal}
              custom={2}
              className="md:col-span-4"
            >
              <h4 className="text-[11px] font-medium tracking-[0.18em] text-black/45">
                GET IN TOUCH
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-black/65">
                <li>
                  <a
                    href="mailto:hello@brevitty.in"
                    className="transition-colors hover:text-orange"
                  >
                    brevittyincubationhub@gmail.com
                  </a>
                </li>
                <li className="leading-relaxed">
                  Jagatpura, Jaipur
                  <br />
                  Rajasthan 302001, India
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* ---- Social strip (right vertical sidebar) ---- */}
        <motion.div
          variants={stripContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex w-14 shrink-0 flex-col items-stretch bg-orange sm:w-16"
        >
          {SOCIALS.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              variants={stripItem}
              whileHover={{ scale: 1.15 }}
              aria-label={s.label}
              title={s.label}
              className="group flex flex-1 items-center justify-center border-b border-white/15 text-white transition-colors duration-300 last:border-b-0 hover:bg-ink"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 transition-transform duration-300"
              >
                {s.icon}
              </svg>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-black/45 sm:flex-row lg:px-10">
          <span>© {new Date().getFullYear()} brevitty. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Made by <a href='https://www.linkedin.com/in/parth-verma-576719371/' className='text-blue-500 font-semibold underline'>Parth Verma</a> <span className="text-orange">🧡</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
