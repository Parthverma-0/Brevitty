import { useState } from 'react'

// Renders a partner's real logo when `logo` is set, with graceful fallback to
// the initials-on-color tile — both when no logo exists and if the image fails.
export default function PartnerLogo({ p, className = '' }) {
  const [err, setErr] = useState(false)

  if (p.logo && !err) {
    return (
      <span className={`flex items-center justify-center overflow-hidden bg-white ${className}`}>
        <img
          src={p.logo}
          alt={p.name}
          loading="lazy"
          onError={() => setErr(true)}
          className="h-3/4 w-3/4 object-contain"
        />
      </span>
    )
  }

  return (
    <span
      className={`flex items-center justify-center font-display font-bold text-white ${className}`}
      style={{ backgroundColor: p.color }}
    >
      {p.mark}
    </span>
  )
}
