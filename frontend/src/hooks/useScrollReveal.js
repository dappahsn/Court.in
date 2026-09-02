import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * useScrollReveal
 * Global hook to trigger silky-smooth scroll reveal animations
 * across pages as the user scrolls down.
 */
export default function useScrollReveal() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05,
      }
    )

    const scanAndObserve = () => {
      const elements = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale'
      )
      elements.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          observer.observe(el)
        }
      })
    }

    // Initial scan after DOM paint
    const initialTimer = setTimeout(scanAndObserve, 50)

    // Watch for dynamic DOM updates (e.g. filter changes in ExplorePage)
    let mutationTimer = null
    const mutationObserver = new MutationObserver(() => {
      if (mutationTimer) clearTimeout(mutationTimer)
      mutationTimer = setTimeout(scanAndObserve, 30)
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(initialTimer)
      if (mutationTimer) clearTimeout(mutationTimer)
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [location.pathname, location.search])
}
