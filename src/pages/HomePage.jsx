import { motion } from 'framer-motion'
import Hero from '../components/Hero.jsx'
import Counter from '../components/Counter.jsx'
import StartupsSection from '../components/StartupsSection.jsx'
import FounderJourney from '../components/FounderJourney.jsx'
import MentorsSection from '../components/MentorsSection.jsx'
import Testimonials from '../components/Testimonials.jsx'
import ApplyCTA from '../components/ApplyCTA.jsx'

const ease = [0.22, 1, 0.36, 1]

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: i * 0.12 },
  }),
}

const stats = [
  { value: 140, suffix: '+', label: 'Startups Incubated' },
  { value: 10, prefix: '₹', suffix: 'Cr+', label: 'Revenue Earned by Startups' },
  { value: 500, suffix:'+',label: 'Guest Speakers' },
]

export default function HomePage() {
  return (
    <div className="grain relative bg-white">
      <main>
        <Hero />

        {/* Second "scene" — scroll-triggered reveals + number counters */}
        <section
          id="brevitty-engine"
          className="relative mx-auto max-w-7xl px-6 py-32 lg:px-10"
        >
          <motion.p
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="text-[11px] font-medium tracking-[0.2em] text-orange"
          >
            THE brevitty ENGINE
          </motion.p>

          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            custom={1}
            className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            A community built to take founders from conviction to capital.
          </motion.h2>

          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-black/10 pt-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                custom={i}
                className="flex flex-col"
              >
                <span className="font-display text-4xl font-bold text-ink lg:text-5xl">
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    prefix={s.prefix}
                    decimals={s.decimals}
                  />
                </span>
                <span className="mt-2 text-sm text-black/50">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <StartupsSection />

        <FounderJourney />

        <MentorsSection />

        <Testimonials />

        <ApplyCTA />
      </main>
    </div>
  )
}
