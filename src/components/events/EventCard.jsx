import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TYPE_STYLES, LOW_SEATS } from '../../data/events.js'

const ease = [0.22, 1, 0.36, 1]

const TYPE_GRADIENT = {
  Summit: ['#f97316', '#db2777'],
  Conference: ['#0a0a0a', '#3f3f46'],
  Networking: ['#0ea5e9', '#0891b2'],
}

const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <rect x="3" y="4.5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 2.5v4M16 2.5v4" strokeLinecap="round" />
  </svg>
)

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

function LiveCount({ n, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-black/60">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      {n} {label}
    </span>
  )
}

function Meta({ event }) {
  return (
    <div className="space-y-1.5 text-sm text-black/55">
      <span className="flex items-center gap-2">
        <CalIcon /> {event.dateLabel} · {event.time}
      </span>
      <span className="flex items-center gap-2">
        <PinIcon /> {event.location}
      </span>
    </div>
  )
}

export default function EventCard({ event, index = 0, large = false, view = 'grid' }) {
  const low = !event.completed && event.seatsLeft <= LOW_SEATS
  const grad = TYPE_GRADIENT[event.type] || ['#f97316', '#db2777']
  const side = index % 2 === 0 ? -1 : 1

  // Card is wrapped in a <Link>; stop the click bubbling so we open the real
  // event/registration page instead of navigating to the detail route.
  const register = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (event.registerUrl) {
      window.open(event.registerUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const tag = (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${TYPE_STYLES[event.type]}`}>
      {event.type}
    </span>
  )

  const fillingFast = low && (
    <span className="absolute right-3 top-3 z-10 rotate-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
      Filling Fast
    </span>
  )

  const completedBadge = event.completed && (
    <span className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
      Completed
    </span>
  )

  const seatsLine = event.completed ? (
    <span className="text-xs text-black/45">{event.registered} attended</span>
  ) : low ? (
    <span className="text-xs font-semibold text-red-500">
      Only {event.seatsLeft} seats left
    </span>
  ) : (
    <span className="text-xs text-black/45">{event.seatsLeft} seats left</span>
  )

  const registerBtn = event.completed ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black/40">
      View recap
    </span>
  ) : (
    <button
      onClick={register}
      className="group/btn inline-flex items-center gap-1.5 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(249,115,22,0.7)]"
    >
      Register Now
      <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
    </button>
  )

  const motionProps = {
    layout: true,
    initial: { opacity: 0, x: side * 40, y: 20 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.5, ease, delay: (index % 6) * 0.06 },
    whileHover: { y: -6 },
  }

  // ---- List view ----
  if (view === 'list') {
    return (
      <motion.div {...motionProps} className={event.completed ? 'opacity-60 grayscale' : ''}>
        <Link
          to={`/events/${event.slug}`}
          className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-black/10 bg-white p-5 transition-all duration-300 hover:border-orange/40 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center"
        >
          {fillingFast}
          {completedBadge}
          <div
            className="hidden h-20 w-28 shrink-0 rounded-xl bg-cover bg-center sm:block"
            style={{
              backgroundImage: event.image
                ? `url(${event.image})`
                : `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">{tag}</div>
            <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-ink">{event.name}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-black/50">{event.short}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black/55">
              <span className="flex items-center gap-1.5"><CalIcon /> {event.dateLabel}</span>
              <span className="flex items-center gap-1.5"><PinIcon /> {event.location}</span>
              {!event.completed && <LiveCount n={event.registered} label="registered" />}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {seatsLine}
            {registerBtn}
          </div>
        </Link>
      </motion.div>
    )
  }

  // ---- Grid view ----
  return (
    <motion.div {...motionProps} className={event.completed ? 'opacity-60 grayscale' : ''}>
      <Link
        to={`/events/${event.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:border-orange/40 hover:shadow-[0_28px_56px_-26px_rgba(0,0,0,0.3)]"
      >
        {fillingFast}
        {completedBadge}

        {/* photo banner with the type tag overlaid */}
        <div
          className={`relative bg-cover bg-center ${large ? 'h-44' : 'h-36'}`}
          style={{
            backgroundImage: event.image
              ? `url(${event.image})`
              : `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-5">{tag}</div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className={`font-display font-bold tracking-tight text-ink ${large ? 'text-2xl' : 'text-xl'}`}>
            {event.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-black/55">{event.short}</p>

          <div className="mt-5">
            <Meta event={event} />
          </div>

          {!event.completed && (
            <div className="mt-4 flex items-center gap-4">
              <LiveCount n={event.registered} label="registered" />
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-6">
            {seatsLine}
            {registerBtn}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
