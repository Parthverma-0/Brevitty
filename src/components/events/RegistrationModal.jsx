import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from './Confetti.jsx'

const ease = [0.22, 1, 0.36, 1]
const STEPS = ['Personal', 'Startup', 'Confirm']

// Input with an animated orange underline on focus.
function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">
        {label}
      </span>
      <div className="group relative mt-1.5">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="peer w-full border-b border-black/15 bg-transparent pb-1.5 text-sm text-ink outline-none placeholder:text-black/30"
        />
        <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange transition-transform duration-300 peer-focus:scale-x-100" />
      </div>
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">
        {label}
      </span>
      <div className="group relative mt-1.5">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="peer w-full border-b border-black/15 bg-transparent pb-1.5 text-sm text-ink outline-none"
        >
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-orange transition-transform duration-300 peer-focus:scale-x-100" />
      </div>
    </label>
  )
}

const EMPTY = {
  name: '', email: '', phone: '', city: '', role: '',
  isFounder: false, startup: '', stage: '', sector: '', website: '', source: '',
}

export default function RegistrationModal({ event, open, onClose }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState(EMPTY)
  const [done, setDone] = useState(false)

  if (!event) return null

  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }))
  const step1Valid = data.name.trim() && /\S+@\S+\.\S+/.test(data.email)

  const go = (next) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const close = () => {
    onClose()
    // reset after the exit animation
    setTimeout(() => {
      setStep(0)
      setData(EMPTY)
      setDone(false)
    }, 300)
  }

  const slide = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* progress bar */}
            <div className="h-1 w-full bg-black/5">
              <motion.div
                className="h-full bg-orange"
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease }}
              />
            </div>

            {done ? (
              <div className="relative px-8 py-16 text-center">
                <Confetti />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange text-white"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-8 w-8">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <h3 className="mt-6 font-display text-2xl font-bold text-ink">
                  You&rsquo;re in!
                </h3>
                <p className="mt-2 text-sm text-black/55">
                  See you at {event.name}.
                </p>
                <button
                  onClick={close}
                  className="mt-8 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="px-8 pb-8 pt-6">
                {/* header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
                      Register · Step {step + 1} of {STEPS.length}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold text-ink">
                      {STEPS[step] === 'Personal' && 'Your details'}
                      {STEPS[step] === 'Startup' && 'About your startup'}
                      {STEPS[step] === 'Confirm' && 'Confirm registration'}
                    </h3>
                  </div>
                  <button
                    onClick={close}
                    className="rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-ink"
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* steps */}
                <div className="relative mt-6 min-h-[260px]">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.32, ease }}
                      className="space-y-5"
                    >
                      {step === 0 && (
                        <>
                          <Field label="Full name" value={data.name} onChange={set('name')} placeholder="Aarav Mehta" />
                          <div className="grid grid-cols-2 gap-5">
                            <Field label="Email" type="email" value={data.email} onChange={set('email')} placeholder="you@email.com" />
                            <Field label="Phone" value={data.phone} onChange={set('phone')} placeholder="+91 ..." />
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <Field label="City" value={data.city} onChange={set('city')} placeholder="Jaipur" />
                            <Field label="Profession / Role" value={data.role} onChange={set('role')} placeholder="Founder" />
                          </div>
                        </>
                      )}

                      {step === 1 && (
                        <>
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">
                              Are you a founder?
                            </span>
                            <div className="mt-2 inline-flex rounded-full border border-black/10 p-1">
                              {['Yes', 'No'].map((opt) => {
                                const on = (opt === 'Yes') === data.isFounder
                                return (
                                  <button
                                    key={opt}
                                    onClick={() => set('isFounder')(opt === 'Yes')}
                                    className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                                      on ? 'bg-orange text-white' : 'text-black/50'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <AnimatePresence initial={false}>
                            {data.isFounder && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-5 overflow-hidden"
                              >
                                <Field label="Startup name" value={data.startup} onChange={set('startup')} placeholder="StackLane" />
                                <div className="grid grid-cols-2 gap-5">
                                  <Select label="Stage" value={data.stage} onChange={set('stage')} options={['Idea', 'Pre-seed', 'Seed', 'Series A']} />
                                  <Select label="Sector" value={data.sector} onChange={set('sector')} options={['Fintech', 'Healthtech', 'Edtech', 'SaaS', 'Consumer', 'Deep Tech']} />
                                </div>
                                <Field label="Website" value={data.website} onChange={set('website')} placeholder="https://" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <Select
                            label="How did you hear about brevitty?"
                            value={data.source}
                            onChange={set('source')}
                            options={['A friend', 'Twitter / X', 'LinkedIn', 'A brevitty event', 'Search', 'Other']}
                          />
                        </>
                      )}

                      {step === 2 && (
                        <div>
                          <div className="rounded-2xl bg-orange/5 p-4 text-sm">
                            <p className="font-semibold text-ink">
                              You&rsquo;re registering for {event.name}
                            </p>
                            <p className="mt-0.5 text-black/55">
                              on {event.dateLabel} · {event.location}
                            </p>
                          </div>
                          <dl className="mt-5 space-y-2.5 text-sm">
                            {[
                              ['Name', data.name || '—'],
                              ['Email', data.email || '—'],
                              ['Phone', data.phone || '—'],
                              ['City', data.city || '—'],
                              data.isFounder ? ['Startup', data.startup || '—'] : ['Founder', 'No'],
                            ].map(([k, v]) => (
                              <div key={k} className="flex justify-between border-b border-black/5 pb-2">
                                <dt className="text-black/45">{k}</dt>
                                <dd className="font-medium text-ink">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* nav buttons */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => (step === 0 ? close() : go(step - 1))}
                    className="text-sm font-medium text-black/50 transition-colors hover:text-ink"
                  >
                    {step === 0 ? 'Cancel' : '← Back'}
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      onClick={() => go(step + 1)}
                      disabled={step === 0 && !step1Valid}
                      className="rounded-full bg-orange px-7 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      onClick={() => setDone(true)}
                      className="rounded-full bg-orange px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(249,115,22,0.7)]"
                    >
                      Confirm Registration →
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
