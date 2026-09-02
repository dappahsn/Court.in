import { useEffect, useRef, useState } from 'react'

/**
 * AnimatedCounter
 * Smooth count-up animation that triggers when element is scrolled into view.
 * Uses requestAnimationFrame with cubic ease-out for 60fps/120fps buttery performance.
 */
export default function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  duration = 1600,
  className = '',
}) {
  const [count, setCount] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return Number(target)
      }
      if (!('IntersectionObserver' in window)) {
        return Number(target)
      }
    }
    return 0
  })
  const elementRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    if (typeof window !== 'undefined') {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }
      if (!('IntersectionObserver' in window)) {
        return
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          let startTime = null
          const startVal = 0
          const endVal = Number(target)

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Cubic ease-out: 1 - (1 - progress)^3
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const currentVal = Math.round(startVal + (endVal - startVal) * easeOut)

            setCount(currentVal)

            if (progress < 1) {
              window.requestAnimationFrame(step)
            } else {
              setCount(endVal)
            }
          }

          window.requestAnimationFrame(step)
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px',
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [target, duration])

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
