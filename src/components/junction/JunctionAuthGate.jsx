import { useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

// ⚠️ DEMO-ONLY GATE. Hardcoded credentials, no real auth, no data behind it —
// purely to show the flow. Never use this pattern to protect anything real;
// the actual cost/abuse protection lives server-side in api/generate.js.
const DEMO_EMAIL = 'test@gmail.com'
const DEMO_PASSWORD = 'test@1234'

export default function JunctionAuthGate({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(0)

  const submit = (e) => {
    e.preventDefault()
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem('sj_authed', '1')
      onAuthed()
    } else {
      setError('Those credentials don’t match. Use the demo login below.')
      setShake((s) => s + 1)
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 pt-16">
      {/* warm radial glow — same warmth as the hero */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_38%,rgba(249,115,22,0.10),transparent_70%)]" />

      <motion.form
        key={shake}
        onSubmit={submit}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: error ? [0, -10, 10, -6, 6, 0] : 0,
        }}
        transition={{ duration: 0.55, ease }}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-black/10 bg-white p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.3)]"
      >
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">
          The Startup Junction
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
          Enter the toolkit
        </h1>
        <p className="mt-2 text-sm text-black/55">
          Sign in to access the nine AI advisory tools.
        </p>

        <label className="mt-7 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          autoComplete="username"
          placeholder="you@email.com"
          className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-sm text-ink outline-none transition-colors focus:border-orange"
        />

        <label className="mt-4 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-sm text-ink outline-none transition-colors focus:border-orange"
        />

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)]"
        >
          Sign in
          <span>→</span>
        </motion.button>

        {/* demo credentials hint */}
        <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-black/[0.02] px-4 py-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
            Demo access
          </p>
          <p className="mt-1.5 font-mono text-xs text-black/60">
            test@gmail.com · test@1234
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-black/40">
            Non-secure demo gate — for showing the flow only.
          </p>
        </div>
      </motion.form>
    </section>
  )
}
