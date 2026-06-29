import { motion } from 'framer-motion'
import { PARTNERS } from '../../data/partners.js'
import PartnerLogo from './PartnerLogo.jsx'

function Chip({ p }) {
  return (
    <div className="group/chip mx-3 flex shrink-0 items-center gap-3 rounded-2xl border border-black/10 bg-white px-6 py-3.5">
      <PartnerLogo
        p={p}
        className="h-9 w-9 rounded-lg text-xs"
      />
      <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight text-black/40 transition-colors duration-500 group-hover/chip:text-ink">
        {p.name}
      </span>
    </div>
  )
}

function Row({ direction = 'left', duration = 30 }) {
  const from = direction === 'left' ? '0%' : '-50%'
  const to = direction === 'left' ? '-50%' : '0%'
  return (
    <motion.div
      className="flex w-max"
      animate={{ x: [from, to] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {[...PARTNERS, ...PARTNERS].map((p, i) => (
        <Chip key={`${p.name}-${i}`} p={p} />
      ))}
    </motion.div>
  )
}

// `rows`: 1 (single) or 2 (opposite directions). `speed`: lower = faster.
export default function PartnerMarquee({ rows = 1, speed = 30 }) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <Row direction="left" duration={speed} />
      {rows === 2 && <Row direction="right" duration={speed} />}
    </div>
  )
}
