import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { getEvent, TYPE_STYLES, LOW_SEATS } from '../data/events.js'
import CountdownTimer from '../components/events/CountdownTimer.jsx'

const ease = [0.22, 1, 0.36, 1]

const TYPE_GRADIENT = {
  Summit: ['#f97316', '#db2777'],
  Conference: ['#0a0a0a', '#3f3f46'],
  Networking: ['#0ea5e9', '#0891b2'],
}

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('')
}

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-bold text-ink">Event not found.</h1>
      <Link to="/events" className="mt-4 text-sm font-semibold text-orange">
        ← Back to all events
      </Link>
    </div>
  )
}

export default function EventDetailPage() {
  const { slug } = useParams()
  const event = getEvent(slug)

  const countdownTarget = useMemo(
    () => (event?.startsAt ? new Date(event.startsAt).getTime() : null),
    [event],
  )

  if (!event) return <NotFound />

  const grad = TYPE_GRADIENT[event.type] || ['#f97316', '#db2777']
  const capacity = event.registered + event.seatsLeft
  const fillPct = event.completed ? 100 : Math.round((event.registered / capacity) * 100)
  const low = !event.completed && event.seatsLeft <= LOW_SEATS

  return (
    <>
      {/* ---- Hero banner ---- */}
      <section className="relative overflow-hidden bg-[#08070a] pt-28">
        {event.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${event.image})` }}
          />
        )}
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{ backgroundImage: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070a] via-[#08070a]/70 to-transparent" />
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <Link
            to="/events"
            className="text-xs font-semibold tracking-wide text-white/50 transition-colors hover:text-white"
          >
            ← All events
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mt-6 max-w-3xl"
          >
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${TYPE_STYLES[event.type]}`}>
                {event.type}
              </span>
              {event.completed && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
                  Completed
                </span>
              )}
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              {event.name}
            </h1>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <span>📅 {event.dateLabel} · {event.time}</span>
              <span>📍 {event.location}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Body ---- */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* left column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <h2 className="font-display text-xl font-bold text-ink">About this event</h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">{event.description}</p>
            </motion.div>

            {/* agenda */}
            {event.agenda?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="mt-12"
              >
                <h2 className="font-display text-xl font-bold text-ink">Schedule</h2>
                <ul className="mt-5 space-y-0">
                  {event.agenda.map((item, i) => (
                    <li key={i} className="flex gap-5 border-l-2 border-orange/30 pl-5">
                      <div className="-ml-[27px] mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-orange bg-white" />
                      <div className="pb-6">
                        <span className="text-xs font-semibold uppercase tracking-wide text-orange">
                          {item.time}
                        </span>
                        <p className="mt-0.5 text-sm font-medium text-ink">{item.title}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* speakers */}
            {event.speakers?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="mt-12"
              >
                <h2 className="font-display text-xl font-bold text-ink">Speakers</h2>
                <div className="mt-5 flex flex-wrap gap-6">
                  {event.speakers.map((sp) => (
                    <div key={sp.name} className="flex items-center gap-3">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                        style={{ backgroundImage: `linear-gradient(135deg, ${sp.gradient[0]}, ${sp.gradient[1]})` }}
                      >
                        {initials(sp.name)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{sp.name}</p>
                        <p className="text-xs text-black/50">{sp.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* right — sticky registration card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.3)]">
              {!event.completed &&
                (countdownTarget ? (
                  <div className="mb-5 rounded-xl bg-ink p-4 text-center">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
                      Starts in
                    </span>
                    <div className="mt-2 flex justify-center">
                      <CountdownTimer target={countdownTarget} dark />
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 rounded-xl bg-ink p-4 text-center">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
                      Recurring event
                    </span>
                    <p className="mt-1 text-sm font-medium text-white/70">
                      {event.dateLabel} · {event.time}
                    </p>
                  </div>
                ))}

              {/* live headcount */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-black/60">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  {event.registered} {event.completed ? 'attended' : 'registered'}
                </span>
                {!event.completed && (
                  <span className={`text-xs font-semibold ${low ? 'text-red-500' : 'text-black/45'}`}>
                    {event.seatsLeft} left
                  </span>
                )}
              </div>

              {/* seats progress bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${fillPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease }}
                  className="h-full rounded-full bg-orange"
                />
              </div>
              <p className="mt-2 text-xs text-black/45">
                {event.completed
                  ? 'This event has ended.'
                  : `${fillPct}% full · ${capacity} capacity`}
              </p>

              {event.completed ? (
                <div className="mt-6 rounded-full bg-black/5 py-3.5 text-center text-sm font-semibold text-black/40">
                  Registration closed
                </div>
              ) : (
                <>
                  <a
                    href={event.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full rounded-full bg-orange py-3.5 text-center text-sm font-semibold text-white shadow-[0_16px_36px_-14px_rgba(249,115,22,0.7)] transition-transform hover:scale-[1.02]"
                  >
                    Register Now →
                  </a>
                  <p className="mt-3 text-center text-xs text-black/40">
                    Opens the official event page in a new tab
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
