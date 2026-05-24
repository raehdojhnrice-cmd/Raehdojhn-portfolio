import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WaveformProgress({ progress, duration, onSeek, accentColor = '#FF3366' }) {
  const containerRef = useRef(null)
  const [waveform] = useState(() => Array(50).fill(0).map(() => 0.2 + Math.random() * 0.8))
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = (e) => {
    if (!containerRef.current || !duration) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    onSeek(x / rect.width)
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentTime  = progress * duration
  const remainingTime = duration - currentTime

  return (
    <div style={{ width: '100%' }}>
      {/* Waveform bars — fill full width via flex */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          height: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
          position: 'relative',
          width: '100%',
        }}
      >
        {waveform.map((value, index) => {
          const barProgress = index / waveform.length
          const isPlayed    = barProgress <= progress
          return (
            <div
              key={index}
              style={{
                flex: '1 1 0',
                minWidth: 0,
                height: `${value * 24}px`,
                borderRadius: 1.5,
                background: isPlayed ? accentColor : accentColor + '28',
                boxShadow: isPlayed ? `0 0 4px ${accentColor}55` : 'none',
                transition: 'background 0.1s, box-shadow 0.1s',
              }}
            />
          )
        })}

        {/* Playhead */}
        <div
          style={{
            position: 'absolute',
            left: `${progress * 100}%`,
            top: -2, bottom: -2,
            width: 2,
            background: accentColor,
            boxShadow: `0 0 6px ${accentColor}aa`,
            pointerEvents: 'none',
          }}
        />

        {/* Scrubber thumb on hover */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              key="scrubber"
              style={{
                position: 'absolute',
                left: `${progress * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 10, height: 10,
                borderRadius: '50%',
                background: '#fff',
                border: `2px solid ${accentColor}`,
                boxShadow: `0 0 8px ${accentColor}88`,
                pointerEvents: 'none',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Time row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: accentColor }}>
          {formatTime(currentTime)}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: accentColor + '66' }}>
          -{formatTime(remainingTime)}
        </span>
      </div>
    </div>
  )
}
