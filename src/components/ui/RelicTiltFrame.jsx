import { useState } from 'react'
import { motion } from 'framer-motion'

export default function RelicTiltFrame({ src, alt = '', className = '', style = {} }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (py - 0.5) * -8,
      y: (px - 0.5) * 8,
    })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
      style={{
        position: 'relative',
        border: '1px solid var(--archive-line)',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        perspective: 1000,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            display: 'block',
            filter: 'saturate(0.78) contrast(1.05)',
          }}
          loading="lazy"
        />
      ) : null}

      {/* Vertical scanline overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(90deg, transparent 0 16px, rgba(255,255,255,0.045) 16px 17px)',
          mixBlendMode: 'soft-light',
          zIndex: 2,
        }}
      />

      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.04,
          mixBlendMode: 'overlay',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0 0.5px, transparent 0.6px)',
          backgroundSize: '3px 3px',
          zIndex: 3,
        }}
      />
    </motion.div>
  )
}
