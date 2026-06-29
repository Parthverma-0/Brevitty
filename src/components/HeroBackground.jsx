import { motion, useScroll, useTransform } from 'framer-motion'

// Slow-moving white/orange orbs + a subtle drifting gradient wash.
export default function HeroBackground() {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#fff7ed_0%,#ffffff_55%)]" />

      {/* drifting orbs */}
      <motion.div
        style={{ y: y1 }}
        className="orb left-[-6%] top-[12%] h-[26rem] w-[26rem] bg-orange/25"
        // animate via CSS keyframes for the slow ambient drift
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-full w-full animate-[drift_18s_ease-in-out_infinite] rounded-full bg-orange/30" />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="orb right-[-8%] top-[28%] h-[32rem] w-[32rem] bg-orange-soft/20"
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <div className="h-full w-full animate-[drift_22s_ease-in-out_infinite_reverse] rounded-full bg-orange-soft/25" />
      </motion.div>

      <motion.div
        className="orb bottom-[-10%] left-[34%] h-[24rem] w-[24rem] bg-amber-200/30"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      >
        <div className="h-full w-full animate-[drift_26s_ease-in-out_infinite] rounded-full bg-amber-200/30" />
      </motion.div>

      {/* faint grid lines for the "premium/technical" feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_30%,transparent_75%)]" />
    </div>
  )
}
