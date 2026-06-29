import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { getMentor } from '../data/mentorsFull.js'

const ease = [0.22, 1, 0.36, 1]

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('')
}

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

function Section({ children, className = '' }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-bold text-ink">Mentor not found.</h1>
      <Link to="/mentors" className="mt-4 text-sm font-semibold text-orange">
        ← Back to all mentors
      </Link>
    </div>
  )
}

function CareerTimeline({ career }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 80%'],
  })

  return (
    <div ref={ref} className="relative mt-6 pl-8">
      {/* self-drawing line */}
      <svg
        className="absolute left-[10px] top-2 h-[calc(100%-1rem)] w-1 overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 1 100"
      >
        <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="#0000001a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <motion.line
          x1="0.5" y1="0" x2="0.5" y2="100"
          stroke="#f97316" strokeWidth="2" strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>

      <div className="space-y-5">
        {(career || []).map((role, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease, delay: i * 0.05 }}
            className="relative rounded-2xl border border-black/10 bg-white p-5"
          >
            <span className="absolute -left-[26px] top-6 h-3.5 w-3.5 rounded-full border-2 border-orange bg-white" />
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="font-display text-lg font-bold text-ink">{role.company}</h4>
              <span className="shrink-0 text-xs font-medium text-black/40">{role.years}</span>
            </div>
            <p className="text-sm font-semibold text-orange">{role.role}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-black/55">{role.impact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function MentorProfilePage() {
  const { slug } = useParams()
  const mentor = getMentor(slug)

  if (!mentor) return <NotFound />

  return (
    <div className="bg-white pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link
          to="/mentors"
          className="text-xs font-semibold tracking-wide text-black/45 transition-colors hover:text-ink"
        >
          ← All mentors
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* ---- Left sticky column ---- */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
              <div className="overflow-hidden rounded-2xl">
                {mentor.photo ? (
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="aspect-square w-full object-cover object-top"
                  />
                ) : (
                  <div
                    className="flex aspect-square w-full items-center justify-center font-display text-6xl font-bold text-white/90"
                    style={{ backgroundImage: `linear-gradient(135deg, ${(mentor.gradient || ['#f97316', '#db2777'])[0]}, ${(mentor.gradient || ['#f97316', '#db2777'])[1]})` }}
                  >
                    {initials(mentor.name)}
                  </div>
                )}
              </div>

              <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">{mentor.name}</h1>
              <p className="mt-1 text-sm text-white/60">{mentor.title}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(mentor.companies || []).map((c) => (
                  <span key={c} className="rounded-md border border-white/15 px-2 py-0.5 text-[10px] font-medium text-white/55">
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(mentor.tags || []).map((t) => (
                  <span key={t} className="rounded-full bg-orange/20 px-2.5 py-1 text-[11px] font-semibold text-orange">
                    {t}
                  </span>
                ))}
              </div>

              <a
                href={`mailto:hello@brevitty.in?subject=${encodeURIComponent(`Connect with ${mentor.name}`)}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-orange py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Connect on LinkedIn →
              </a>
              <a
                href={`mailto:hello@brevitty.in?subject=${encodeURIComponent(`Bookounder a session with ${mentor.name}`)}`}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/25 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              >
                Book a Session
              </a>
            </div>
          </motion.div>

          {/* ---- Right scrollable column ---- */}
          <div className="space-y-16 lg:col-span-2">
            {/* Their story */}
            <Section>
              <h2 className="font-display text-2xl font-bold text-ink">Their Story</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-black/60">
                {(mentor.bio || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Section>

            {/* What I help with */}
            <Section>
              <h2 className="font-display text-2xl font-bold text-ink">What I Help Founders With</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {(mentor.helpWith || []).map((h, i) => (
                  <div key={i} className="rounded-2xl border border-black/10 bg-white p-5">
                    <h3 className="font-display text-base font-bold text-ink">{h.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-black/55">{h.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Career timeline */}
            <Section>
              <h2 className="font-display text-2xl font-bold text-ink">Companies I&rsquo;ve Built or Scaled</h2>
              <CareerTimeline career={mentor.career} />
            </Section>

            {/* Testimonials */}
            <Section>
              <h2 className="font-display text-2xl font-bold text-ink">What Founders Say</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {(mentor.testimonials || []).map((t, i) => (
                  <figure key={i} className="rounded-2xl bg-orange/5 p-6">
                    <blockquote className="text-sm italic leading-relaxed text-ink">“{t.quote}”</blockquote>
                    <figcaption className="mt-4 text-xs font-semibold text-black/55">
                      {t.founder} <span className="font-normal text-black/40">· {t.startup}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Section>

            {/* Sessions */}
            <Section>
              <h2 className="font-display text-2xl font-bold text-ink">Sessions at brevitty</h2>
              <ul className="mt-5 divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/10">
                {(mentor.sessions || []).map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/events/${s.slug}`}
                      className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-orange/[0.04]"
                    >
                      <span className="text-sm font-medium text-ink">{s.name}</span>
                      <span className="text-xs font-semibold text-orange opacity-0 transition-opacity group-hover:opacity-100">
                        View event →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
