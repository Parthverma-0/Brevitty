import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Counter from '../components/Counter.jsx'

const ease = [0.22, 1, 0.36, 1]

/* ------------------------------------------------------------------ *
 * Placeholder photo. Swap the gradient for a real <img> later — the
 * `label` doubles as the data hint for which shot goes here.
 * ------------------------------------------------------------------ */
function Photo({ label, from, to, className = '', speed = 40, labelSize = 'text-sm' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed])
  const labelX = useTransform(scrollYProgress, [0, 1], [-28, 28])

  return (
    <div
      ref={ref}
      data-photo={label}
      className={`group relative overflow-hidden rounded-2xl bg-black/5 ${className}`}
    >
      {/* PLACEHOLDER — replace this motion.div's gradient with an <img> */}
      <motion.div
        style={{ y }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6, ease }}
        className="absolute inset-[-8%]"
      >
        <div
          className="h-full w-full"
          style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <motion.span
        style={{ x: labelX }}
        className={`pointer-events-none absolute bottom-4 left-5 z-10 font-medium tracking-wide text-white ${labelSize}`}
      >
        {label}
      </motion.span>
    </div>
  )
}

function UnderlineField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block flex-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">
        {label}
      </span>
      <div className="group relative mt-1.5">
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="peer w-full border-b border-black/15 bg-transparent pb-2 text-sm text-ink outline-none placeholder:text-black/30"
        />
        <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange transition-transform duration-300 peer-focus:scale-x-100" />
      </div>
    </label>
  )
}

const AMENITIES = [
  ['🖥️', 'High-speed Fibre Internet', 'Gigabit lines that never make you wait.'],
  ['☕', 'Unlimited Coffee + Tea', 'Single-origin beans, on the house, all day.'],
  ['🔒', '24/7 Secure Access', 'Keycard entry whenever inspiration strikes.'],
  ['📽️', 'AV-equipped Meeting Rooms', 'Screens, mics and whiteboards, ready to go.'],
  ['🖨️', 'Print + Scan Station', 'Everything you need for the paperwork days.'],
  ['📦', 'Dedicated Storage Lockers', 'Leave your gear, take only your laptop.'],
  ['🎧', 'Quiet Focus Zones', 'Library-silent rooms for deep work.'],
  ['🤝', 'Community Events Access', 'Every brevitty workshop and mixer, included.'],
  ['🅿️', 'Free Parking', 'Two-wheeler and car spots on site.'],
]

const PLANS = [
  {
    name: 'Drop In',
    price: '₹499',
    unit: '/day',
    features: ['Desk access', 'WiFi', 'Coffee'],
    popular: false,
  },
  {
    name: 'Dedicated',
    price: '₹9,999',
    unit: '/month',
    features: ['Fixed desk', '24/7 access', 'Storage locker', 'All amenities'],
    popular: true,
  },
  {
    name: 'Flexi',
    price: '₹5,999',
    unit: '/month',
    features: ['10 days/month', 'All amenities', 'Hot desk'],
    popular: false,
  },
]

const QUOTES = [
  { quote: 'The space killed my excuses to not work.', name: 'Aarav Mehta', startup: 'StackLane' },
  { quote: 'I closed my first investor meeting in room 2.', name: 'Priya Nair', startup: 'Zenvoy' },
  { quote: 'Best ₹9,999 I spend every month.', name: 'Rohan Sinha', startup: 'Fieldr' },
]

function VirtualTourModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            {/* video placeholder */}
            <div className="flex aspect-video w-full items-center justify-center bg-[linear-gradient(135deg,#1f2937,#0a0a0a)] text-sm font-medium tracking-wide text-white/40">
              ▶ Virtual tour video — player placeholder
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function SpacePage() {
  const [tourOpen, setTourOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', date: '' })
  const [submitted, setSubmitted] = useState(false)
  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const headline = 'Where Founders Come to Build'.split(' ')

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* PLACEHOLDER — full-bleed hero photo, Ken Burns zoom */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 10, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(135deg,#3f3f46,#18181b 60%,#0a0a0a)' }}
          data-photo="Hero — full bleed photo of the space"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[11px] font-semibold tracking-[0.24em] text-orange"
          >
            brevitty HQ · JAIPUR
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } } }}
            className="mt-4 flex flex-wrap justify-center gap-x-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
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
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-5 max-w-xl text-base text-white/65 sm:text-lg"
          >
            A space designed for deep work, bold conversations, and accidental breakthroughs.
          </motion.p>

          <motion.a
            href="mailto:hello@brevitty.in?subject=Book%20a%20visit%20to%20the%20Bravity%20space"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 1.5 }}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-15px_rgba(249,115,22,0.8)]"
          >
            Book a Visit →
          </motion.a>
        </div>
      </section>

      {/* ===== Stats strip ===== */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-6 py-12 lg:grid-cols-4 lg:px-10">
          {[
            { node: <Counter value={5000} />, label: 'Total Space (sq ft)' },
            { node: <Counter value={80} suffix="+" />, label: 'Dedicated Desks' },
            { node: <Counter value={3} />, label: 'Private Meeting Rooms' },
            { node: '24/7', label: 'Access for Members' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center lg:border-orange/30 ${i > 0 ? 'lg:border-l' : ''}`}
            >
              <span className="font-display text-4xl font-bold text-ink lg:text-5xl">{s.node}</span>
              <span className="mt-2 text-sm text-black/50">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Editorial gallery ===== */}
      <section className="mx-auto max-w-7xl space-y-4 px-6 py-16 lg:px-10">
        <Photo label="The Main Floor" from="#6b7280" to="#1f2937" className="h-[60vh]" speed={50} labelSize="text-lg font-semibold" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          <Photo label="Focus Pods" from="#a16207" to="#7c2d12" className="h-72 md:row-span-2 md:h-full" speed={60} />
          <Photo label="Standing Desks" from="#0e7490" to="#155e75" className="h-64 md:col-span-2" speed={35} />
          <Photo label="Phone Booths" from="#475569" to="#1e293b" className="h-64 md:col-span-2" speed={45} />
        </div>

        <Photo label="The Lounge" from="#b45309" to="#78350f" className="h-[55vh]" speed={50} labelSize="text-lg font-semibold" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Photo label="Meeting Rooms" from="#374151" to="#111827" className="h-80" speed={40} />
          <Photo label="The Café Corner" from="#92400e" to="#451a03" className="h-80" speed={40} />
        </div>
      </section>

      {/* ===== Amenities ===== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-orange">WHAT YOU GET</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Everything you need. Nothing you don&rsquo;t.
          </h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {AMENITIES.map(([icon, title, desc]) => (
              <motion.div
                key={title}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-black/10 bg-white p-6 transition-colors duration-300 hover:border-orange/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-2xl">
                  {icon}
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-black/55">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Membership plans ===== */}
      <section className="bg-[#fafaf8] py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-orange">MEMBERSHIP</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Pick your pace.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl bg-white p-8 ${
                  plan.popular
                    ? 'border-2 border-orange shadow-[0_30px_60px_-30px_rgba(249,115,22,0.5)] md:scale-[1.06]'
                    : 'border border-black/10'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-ink">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-black/45">{plan.unit}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-black/65">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" className="h-4 w-4 shrink-0">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:hello@brevitty.in?subject=Book%20Bravity%20workspace"
                  className={`mt-8 rounded-full py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
                    plan.popular
                      ? 'bg-orange text-white shadow-[0_14px_30px_-12px_rgba(249,115,22,0.7)]'
                      : 'border border-black/15 text-ink hover:border-black/30'
                  }`}
                >
                  Get Started →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Virtual tour ===== */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#08070a] py-24">
        {/* PLACEHOLDER — blurred photo of the space */}
        <div
          className="absolute inset-0 opacity-40 blur-2xl"
          style={{ backgroundImage: 'linear-gradient(135deg,#3f3f46,#0a0a0a)' }}
          data-photo="Virtual tour — blurred background photo"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <motion.button
            onClick={() => setTourOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_0_60px_-10px_rgba(249,115,22,0.6)]"
            aria-label="Play virtual tour"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange/30" />
            <svg viewBox="0 0 24 24" fill="#f97316" className="ml-1 h-8 w-8">
              <path d="M7 5v14l12-7z" />
            </svg>
          </motion.button>

          <h2 className="mt-8 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Can&rsquo;t visit in person?
          </h2>
          <p className="mt-3 max-w-md text-base text-white/55">
            Take a virtual walkthrough of the space before you book.
          </p>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-3 lg:px-10">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl bg-[#fdf8f1] p-7"
            >
              <blockquote className="font-display text-lg font-semibold leading-snug text-ink">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-ink">{q.name}</span>
                <span className="text-black/45"> · {q.startup}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ===== Book a visit ===== */}
      <section id="book" className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Come see it for yourself.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-black/55">
            Book a free 1-hour visit. No commitment. Just good coffee and a great space.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease }}
                className="mt-12 rounded-2xl bg-orange/5 py-14"
              >
                <p className="font-display text-2xl font-bold text-ink">
                  We&rsquo;ll see you soon. ☕
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="mt-12 flex flex-col gap-6 text-left sm:flex-row sm:items-end"
              >
                <UnderlineField label="Name" value={form.name} onChange={setField('name')} placeholder="Your name" />
                <UnderlineField label="Email" type="email" value={form.email} onChange={setField('email')} placeholder="you@email.com" />
                <UnderlineField label="Preferred date" type="date" value={form.date} onChange={setField('date')} />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-orange px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(249,115,22,0.7)] transition-transform hover:scale-[1.03]"
                >
                  Book Now →
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      <VirtualTourModal open={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  )
}
