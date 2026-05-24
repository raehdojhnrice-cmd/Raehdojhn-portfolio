import React, { useRef, useState, useEffect } from 'react'

export default function RotaryKnob({ value, onChange, size = 36 }) {
  const knobRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    handleDrag(e)
  }

  const handleDrag = (e) => {
    if (!knobRef.current) return
    const rect = knobRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
    const degrees = (angle * 180) / Math.PI
    const normalizedAngle = (degrees + 135 + 360) % 360
    const newValue = Math.min(1, Math.max(0, normalizedAngle / 270))
    onChange(newValue)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) handleDrag(e)
    }
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const rotation = -135 + value * 270
  const arcRadius = (size + 8) / 2
  const arcAngle = value * 270
  const startAngle = -135
  const endAngle = startAngle + arcAngle

  const polarToCartesian = (angle) => {
    const radians = (angle * Math.PI) / 180
    return {
      x: arcRadius + arcRadius * Math.cos(radians),
      y: arcRadius + arcRadius * Math.sin(radians),
    }
  }

  const start = polarToCartesian(startAngle)
  const end = polarToCartesian(endAngle)
  const largeArc = arcAngle > 180 ? 1 : 0
  const arcPath = `M ${start.x} ${start.y} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${end.x} ${end.y}`

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg style={{ position: 'absolute', inset: -4 }} viewBox={`0 0 ${size + 8} ${size + 8}`}>
        <path
          d={arcPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div
        ref={knobRef}
        onMouseDown={handleMouseDown}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(8,8,8,0.8) 0%, rgba(17,17,17,0.8) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.05)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div style={{ width: 2, height: 10, background: 'var(--text-primary)', position: 'absolute', top: 4, borderRadius: 1 }} />
      </div>
    </div>
  )
}
