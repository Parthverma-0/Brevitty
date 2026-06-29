import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroBackground from "./HeroBackground.jsx";

const MotionLink = motion(Link);
const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const pop = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16"
    >
      <HeroBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        {/* eyebrow */}
        <motion.div
          variants={fadeUp}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] text-black/60 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          STARTUP INCUBATION · JAIPUR, INDIA
        </motion.div>

        {/* headline */}
        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl"
        >
          Where Bold Ideas
          <br />
          Become{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-orange">Funded Startups</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 1, ease }}
              className="absolute bottom-1.5 left-0 z-0 h-3 w-full origin-left rounded-sm bg-orange/20"
            />
          </span>
        </motion.h1>

        {/* subtext */}
        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-xl text-base leading-relaxed text-black/55 sm:text-lg"
        >
          Brevitty's Incubation Centers are Jaipur&rsquo;s home for ambitious
          founders - turning early conviction into funded Startups.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={pop}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <motion.a
            href="https://forms.gle/JhuGFUnYRthAJFyc9"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(249,115,22,0.6)] transition-shadow hover:shadow-[0_14px_40px_-8px_rgba(249,115,22,0.7)]"
          >
            Apply Now
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </motion.a>

          <MotionLink
            to="/startup-junction"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-7 py-3.5 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:border-black/30 hover:bg-white"
          >
            Startup Junction 2026
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </MotionLink>
        </motion.div>

        {/* trust strip */}
        <motion.div
          variants={fadeUp}
          className="mt-14 flex items-center gap-8 text-center"
        >
          {[
            ["140+", "Startups Incubated"],
            ["5+", "Incubation Cohorts"],
            ["500+", "Founders Supported"],
          ].map(([stat, label]) => (
            <div key={label} className="flex flex-col">
              <span className="font-display text-xl font-bold text-ink">
                {stat}
              </span>
              <span className="mt-0.5 text-[11px] tracking-wide text-black/45">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-black/20 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-orange"
          />
        </div>
      </motion.div>
    </section>
  );
}
