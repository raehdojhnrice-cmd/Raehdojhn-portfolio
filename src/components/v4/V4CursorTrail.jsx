import { useEffect, useRef, useState } from 'react'

const SYMBOLS = ['◊', '✦', '⟐', '△', '○', '□', '×', '▸', '⊕', '⌬', '∿', '⬡']

/**
 * V4CursorTrail — Floating ASCII/symbol particles that drift from cursor position.
 * Low opacity, subtle ambient effect. Non-interactive.
 */
export default function V4CursorTrail() {
  const [particles, setParticles] = useState([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const tickRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const interval = setInterval(() => {
      tickRef.current++
      if (tickRef.current % 3 !== 0) return /* Emit every 3rd tick */

      const { x, y } = mouseRef.current
      if (x === 0 && y === 0) return

      const id = Date.now() + Math.random()
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      const drift = {
        x: (Math.random() - 0.5) * 80,
        y: -(Math.random() * 60 + 20),
      }

      setParticles((prev) => {
        const next = [...prev, { id, x, y, symbol, drift }]
        return next.slice(-12) /* Cap at 12 particles */
      })

      /* Auto-remove after animation */
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id))
      }, 1200)
    }, 100)

    document.addEventListener('mousemove', onMove)

    return () => {
      document.removeEventListener('mousemove', onMove)
      clearInterval(interval)
    }
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="v4-cursor-trail" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="v4-cursor-trail__particle"
          style={{
            left: p.x,
            top: p.y,
            '--drift-x': `${p.drift.x}px`,
            '--drift-y': `${p.drift.y}px`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  )
}
