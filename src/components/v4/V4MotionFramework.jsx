import { useEffect } from 'react'

/**
 * V4MotionFramework
 * Orchestrates stagger-reveal animations for V4 windows using IntersectionObserver.
 * Each `.v4-window` gets class `is-inview` when it enters the viewport,
 * with staggered delays via CSS custom property `--v4-window-delay`.
 *
 * This is a global effect — no visual output.
 */
export default function V4MotionFramework() {
  useEffect(() => {
    /* Smooth-scroll override for anchor links inside V4 */
    const handleHashClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')?.slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    document.addEventListener('click', handleHashClick)
    return () => document.removeEventListener('click', handleHashClick)
  }, [])

  return null
}
