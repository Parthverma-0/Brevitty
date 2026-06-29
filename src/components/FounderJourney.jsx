import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useInView,
  animate,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// ---- Icons (subtle line glyphs) ----
const Icon = ({ d }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    {d}
  </svg>
);

const STEPS = [
  {
    title: "Apply",
    desc: "Submit your idea. We read every application personally.",
    icon: (
      <Icon
        d={
          <>
            <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5Z" />
          </>
        }
      />
    ),
    bg: "step1.jpg",
  },
  {
    title: "Get Shortlisted",
    desc: "Top founders get a call with the brevitty team within 7 days.",
    icon: (
      <Icon
        d={
          <path d="M4 5c0 8.3 6.7 15 15 15v-3.5l-4-1.5-2 2a11 11 0 0 1-5-5l2-2-1.5-4H4Z" />
        }
      />
    ),
    bg:"step2.jpeg",
  },
  {
    title: "Join the Cohort",
    desc: "Selected startups enter a structured 90-day incubation program.",
    icon: (
      <Icon
        d={
          <>
            <circle cx="9" cy="8" r="3" />
            <path d="M3 20a6 6 0 0 1 12 0" />
            <path d="M16 6a3 3 0 0 1 0 5M21 20a6 6 0 0 0-5-5.9" />
          </>
        }
      />
    ),
    bg:"step3.jpg",
  },
  {
    title: "Build in Public",
    desc: "Access mentors, co-working space, workshops, and peer founders.",
    icon: (
      <Icon
        d={
          <>
            <path d="M14.7 6.3a4 4 0 0 0-5.3 5.3L3 18v3h3l6.4-6.4a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.2-.6-.6-2.2 2.5-2.5Z" />
          </>
        }
      />
    ),
    bg:"step4.jpeg",
  },
  {
    title: "Demo Day",
    desc: "Present to a room of investors, angels, and industry leaders.",
    icon: (
      <Icon
        d={
          <>
            <path d="M3 4h18v11H3zM12 15v4M8 21h8" />
            <path d="M8 11l3-3 2 2 3-4" />
          </>
        }
      />
    ),
    bg:"step5.jpg",
  },
  {
    title: "Get Funded",
    desc: "Walk away with capital, connections, and a community behind you.",
    icon: (
      <Icon
        d={
          <>
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M6 12h.01M18 12h.01" />
          </>
        }
      />
    ),
    bg:"step6.jpg",
  },
];

// Big faded number that counts up the first time the card scrolls into view.
function StepNumber({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const mv = useMotionValue(0);
  const [n, setN] = useState("00");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 0.9,
      ease,
      onUpdate: (v) => setN(String(Math.round(v)).padStart(2, "0")),
    });
    return controls.stop;
  }, [inView, value, mv]);

  return (
    <span
      ref={ref}
      className="pointer-events-none absolute right-6 top-2 select-none font-display text-[7rem] font-bold leading-none text-black/[0.04] tabular-nums"
    >
      {n}
    </span>
  );
}

function StepCard({ step, index, isActive }) {
  return (
    <motion.div
      animate={{
        scale: isActive ? 1 : 0.92,
        opacity: isActive ? 1 : 0.5,
      }}
      transition={{ duration: 0.5, ease }}
      className="group relative z-10 flex h-[58vh] max-h-[440px] w-[78vw] max-w-sm shrink-0 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-8 transition-colors duration-500 hover:bg-orange/[0.03]"
      style={
        isActive ? { backgroundColor: "rgba(249,115,22,0.03)" } : undefined
      }
    >
      {/* background photo — solid, full-color */}
      {step.bg && (
        <>
          <img
            src={step.bg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          {/* light scrim — keeps the text/icons readable over the photo */}
          <div className="pointer-events-none absolute inset-0 bg-white/40" />
        </>
      )}

      {/* animated left accent bar — solid orange when active/hover */}
      <span
        className={`absolute inset-y-0 left-0 w-1 origin-top bg-orange transition-transform duration-500 group-hover:scale-y-100 ${
          isActive ? "scale-y-100" : "scale-y-0"
        }`}
      />

      <StepNumber value={index + 1} />

      {/* icon + step label */}
      <div className="relative flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange">
          {step.icon}
        </span>
        <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-black/40">
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          STEP {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-auto">
        <h3 className="font-display text-3xl font-bold tracking-tight text-ink">
          {step.title}
        </h3>
        <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-black/55">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function FounderJourney() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);

  // Measure how far the horizontal track must travel.
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
      setViewportH(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Vertical scroll → horizontal movement of the track.
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  // Background drifts from white to a warm cream.
  const bg = useTransform(scrollYProgress, [0, 1], ["#ffffff", "#fbf3e7"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.round(v * (STEPS.length - 1)));
    if (v > 0.01) setStarted(true);
    else setStarted(false);
  });

  return (
    <section id="experience">
      {/* ============ Desktop: scroll-jacked horizontal timeline ============ */}
      <div
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ height: scrollRange + viewportH || "300vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* background shift layer */}
          <motion.div
            style={{ backgroundColor: bg }}
            className="absolute inset-0"
          />

          <div className="relative flex h-full flex-col">
            {/* pinned header */}
            <div className="px-10 pt-24 lg:px-16">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-orange">
                THE JOURNEY
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink lg:text-5xl">
                From Ideation to Funding.
              </h2>
            </div>

            {/* horizontal track */}
            <div className="relative flex flex-1 items-center">
              <motion.div
                ref={trackRef}
                style={{ x }}
                className="relative flex items-center gap-10 pl-10 pr-[35vw] lg:pl-16"
              >
                {/* progress line — runs behind cards, visible through the gaps */}
                <svg
                  className="absolute inset-x-0 top-1/2 -z-0 h-1 w-full -translate-y-1/2 overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 1"
                >
                  <line
                    x1="0"
                    y1="0.5"
                    x2="100"
                    y2="0.5"
                    stroke="#0000001a"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <motion.line
                    x1="0"
                    y1="0.5"
                    x2="100"
                    y2="0.5"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength: scrollYProgress }}
                  />
                </svg>

                {STEPS.map((step, i) => (
                  <StepCard
                    key={step.title}
                    step={step}
                    index={i}
                    isActive={i === active}
                  />
                ))}
              </motion.div>
            </div>

            {/* scroll hint — fades out once scrolling starts */}
            <motion.div
              animate={{ opacity: started ? 0 : 1, y: started ? 8 : 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-2 pb-10 text-xs font-medium tracking-[0.18em] text-black/40"
            >
              SCROLL TO EXPLORE THE JOURNEY
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-orange"
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ============ Mobile: clean vertical timeline ============ */}
      <div className="px-6 py-24 md:hidden">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-orange">
          THE JOURNEY
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
          From First Idea to First Cheque.
        </h2>

        <div className="relative mt-12 pl-10">
          {/* connecting line */}
          <div className="absolute bottom-2 left-[14px] top-2 w-px bg-black/10" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease }}
              className="relative mb-10 last:mb-0"
            >
              {/* node */}
              <span className="absolute -left-10 flex h-7 w-7 items-center justify-center rounded-full border border-orange/30 bg-white">
                <span className="h-2.5 w-2.5 rounded-full bg-orange" />
              </span>

              <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6">
                {/* background photo — solid, full-color */}
                {step.bg && (
                  <>
                    <img
                      src={step.bg}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-white/40" />
                  </>
                )}

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10 text-orange">
                      {step.icon}
                    </span>
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-black/40">
                      STEP {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
