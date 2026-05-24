import { useEffect, useRef, useState } from 'react'

export default function GradientCursor() {
  const cursorRef = useRef(null)
  const glowRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return

    let raf
    const cursor = cursorRef.current
    const glow = glowRef.current

    const colors = [
      { r: 220, g: 40, b: 40 },    // red
      { r: 200, g: 60, b: 100 },   // magenta
      { r: 180, g: 80, b: 180 },   // purple
      { r: 100, g: 120, b: 220 },  // blue
      { r: 60, g: 200, b: 160 },   // teal
      { r: 196, g: 122, b: 90 },   // rust
      { r: 220, g: 40, b: 40 },    // back to red
    ]

    const lerpColor = (t) => {
      const segments = colors.length - 1
      const segment = Math.min(Math.floor(t * segments), segments - 1)
      const localT = (t * segments) - segment
      const a = colors[segment], b = colors[segment + 1]
      const r = Math.round(a.r + (b.r - a.r) * localT)
      const g = Math.round(a.g + (b.g - a.g) * localT)
      const bl = Math.round(a.b + (b.b - a.b) * localT)
      return `rgb(${r}, ${g}, ${bl})`
    }

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    const animate = () => {
      const pos = posRef.current
      const target = targetRef.current
      // Smooth interpolation
      pos.x += (target.x - pos.x) * 0.15
      pos.y += (target.y - pos.y) * 0.15

      if (cursor) {
        cursor.style.transform = `translate(${pos.x - 10}px, ${pos.y - 10}px)`
      }
      if (glow) {
        glow.style.transform = `translate(${pos.x - 60}px, ${pos.y - 60}px)`
      }

      // Color based on scroll position
      const scrollPct = Math.min(
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),
        1
      )
      const color = lerpColor(scrollPct)

      if (cursor) {
        cursor.style.borderColor = color
        cursor.style.boxShadow = `0 0 12px ${color}, 0 0 24px ${color}40`
      }
      if (glow) {
        glow.style.background = `radial-gradient(circle, ${color}15 0%, transparent 70%)`
      }

      raf = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    raf = requestAnimationFrame(animate)

    // Add cursor: none to body
    document.body.style.cursor = 'none'

    // Also hide cursor on all interactive elements
    const style = document.createElement('style')
    style.textContent = 'a, button, input, textarea, select, [role="button"] { cursor: none !important; }'
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(raf)
      document.body.style.cursor = ''
      style.remove()
    }
  }, [visible])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

  return (
    <>
      {/* Glow halo */}
      <div
        ref={glowRef}
        className="beacon-glow"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="beacon-cursor"
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  )
}
