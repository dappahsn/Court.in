export default function Logo({
  variant = 'horizontal',
  className = 'h-8 sm:h-9',
  showText = true,
  textClassName = 'text-xl sm:text-2xl font-black',
  markClassName = 'w-8 h-8 sm:w-9 sm:h-9',
}) {
  if (variant === 'full') {
    return (
      <img
        src="/logo.png"
        alt="court.in"
        className={`${className} object-contain select-none`}
        loading="eager"
      />
    )
  }

  if (variant === 'mark') {
    return (
      <img
        src="/logo-mark.png"
        alt="court.in"
        className={`${className} object-contain select-none`}
        loading="eager"
      />
    )
  }

  return (
    <div className="inline-flex items-center gap-2 select-none group">
      <img
        src="/logo-mark.png"
        alt="court.in icon"
        className={`${markClassName} object-contain shrink-0 transition-transform duration-200 group-hover:scale-105`}
        loading="eager"
      />
      {showText && (
        <div className="flex items-baseline tracking-tight">
          <span className={`text-text-primary tracking-tight font-extrabold ${textClassName}`}>
            court
          </span>
          <span className={`text-primary font-black tracking-tight ${textClassName}`}>
            .in
          </span>
        </div>
      )}
    </div>
  )
}
