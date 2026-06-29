// React Bits — StarBorder
// Two radial glints travel along the top and bottom edges, framing the content.
export default function StarBorder({
  as: Component = 'button',
  className = '',
  color = '#f97316',
  speed = '5s',
  innerClassName = 'bg-ink text-white',
  children,
  ...rest
}) {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-full p-[1.5px] ${className}`}
      {...rest}
    >
      <div
        className="absolute bottom-[-11px] right-[-250%] z-0 h-1/2 w-[300%] animate-star-bottom rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute left-[-250%] top-[-11px] z-0 h-1/2 w-[300%] animate-star-top rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold ${innerClassName}`}
      >
        {children}
      </div>
    </Component>
  )
}
