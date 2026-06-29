import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#f97316', '#fb923c', '#0a0a0a', '#22c55e', '#fde68a', '#ffffff']

// Pure-Framer confetti burst — no external library.
export default function Confetti({ count = 60 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map(() => {
        const angle = Math.random() * Math.PI * 2
        const distance = 120 + Math.random() * 220
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 60,
          rotate: Math.random() * 720 - 360,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 6 + Math.random() * 8,
          delay: Math.random() * 0.15,
          round: Math.random() > 0.5,
        }
      }),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? '9999px' : '2px',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 260],
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: [1, 1, 0.6],
          }}
          transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
