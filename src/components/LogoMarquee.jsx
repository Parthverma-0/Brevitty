import { STARTUPS } from '../data/startups.js'

function LogoChip({ s }) {
  return (
    <div className="group/chip mx-3 flex shrink-0 items-center gap-3 rounded-2xl border border-black/10 bg-white px-6 py-4">
      <span
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg font-display text-base font-bold text-white grayscale transition-all duration-500 group-hover/chip:grayscale-0"
        style={{ backgroundColor: s.logo ? '#fff' : s.color }}
      >
        {s.logo ? (
          <img
            src={s.logo}
            alt={`${s.name} logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          s.mark
        )}
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-black/40 transition-colors duration-500 group-hover/chip:text-ink">
        {s.name}
      </span>
    </div>
  )
}

// One row = the logo set rendered twice back-to-back so a -50% translate loops seamlessly.
function MarqueeRow({ direction }) {
  const animClass =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
  return (
    <div className="flex w-max">
      <div className={`flex w-max ${animClass}`}>
        {STARTUPS.map((s) => (
          <LogoChip key={`a-${s.name}`} s={s} />
        ))}
        {STARTUPS.map((s) => (
          <LogoChip key={`b-${s.name}`} s={s} />
        ))}
      </div>
    </div>
  )
}

export default function LogoMarquee() {
  return (
    <div className="marquee-track relative mt-20 flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <MarqueeRow direction="left" />
      <MarqueeRow direction="right" />
    </div>
  )
}
