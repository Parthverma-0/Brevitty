import { useEffect, useState } from 'react'

function diff(target) {
  const total = Math.max(0, target - Date.now())
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

// Ticking countdown to a target Date. Defaults to a live near-future target.
export default function CountdownTimer({ target, dark = false }) {
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const units = [
    ['Days', t.days],
    ['Hrs', t.hours],
    ['Min', t.minutes],
    ['Sec', t.seconds],
  ]

  return (
    <div className="flex items-center gap-3">
      {units.map(([label, value], i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`font-display text-3xl font-bold tabular-nums sm:text-4xl ${dark ? 'text-white' : 'text-ink'}`}
            >
              {String(value).padStart(2, '0')}
            </span>
            <span
              className={`mt-1 text-[10px] font-medium uppercase tracking-[0.18em] ${dark ? 'text-white/40' : 'text-black/40'}`}
            >
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="-mt-4 text-2xl font-bold text-orange">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
