import { motion } from 'framer-motion'

const ITEMS = [
  'STARTUP SAMVAD · JULY 3',
  'VCs & ANGELS IN ONE ROOM',
  'STARTUP GRIND JAIPUR · MONTHLY',
  'eCHAI FOUNDER MEETUPS',
]

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 text-sm font-semibold tracking-[0.18em] text-orange">
            {item}
          </span>
          <span className="text-orange/50">·</span>
        </span>
      ))}
    </div>
  )
}

// Infinite horizontal scroll — duplicated row + Framer x animation.
export default function EventTicker() {
  return (
    <div className="relative overflow-hidden border-y border-orange/20 bg-orange/[0.04] py-3">
      <motion.div
        className="flex w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <Row />
        <Row />
      </motion.div>
    </div>
  )
}
