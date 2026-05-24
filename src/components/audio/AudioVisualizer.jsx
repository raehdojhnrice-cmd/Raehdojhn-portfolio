import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AudioVisualizer({ isPlaying, styleType = 'bars', accentColor = 'var(--accent)', audioElement, source }) {
  const animationRef = useRef(null)
  const [bars, setBars] = useState(Array(32).fill(0.1))
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)

  useEffect(() => {
    // 1. Establish Web Audio API if valid local source is supplied
    if (audioElement && source === 'upload' && !audioElement.__source_connected__) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        audioCtxRef.current = new AudioContext()
        analyserRef.current = audioCtxRef.current.createAnalyser()
        analyserRef.current.fftSize = 128 // Gives 64 frequency bins

        audioElement.crossOrigin = "anonymous"
        const mediaSource = audioCtxRef.current.createMediaElementSource(audioElement)
        mediaSource.connect(analyserRef.current)
        analyserRef.current.connect(audioCtxRef.current.destination)
        
        audioElement.__source_connected__ = true
      } catch (e) {
        console.warn("Web Audio API binding failed or already bound:", e)
      }
    }

    // Attempt to resume audio context seamlessly on playback (Safari block bypass)
    if (isPlaying && audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }

    // 2. Rendering Loop
    let lastTime = performance.now()
    const dataArray = analyserRef.current ? new Uint8Array(analyserRef.current.frequencyBinCount) : null

    const animate = (time) => {
      // TRUE FREQUENCIES (Local Audio)
      if (analyserRef.current && source === 'upload') {
        if (isPlaying) {
          analyserRef.current.getByteFrequencyData(dataArray)
          // Map first 32 bins (Low to High frequencies)
          const newBars = Array.from(dataArray).slice(0, 32).map(val => val / 255)
          setBars(newBars)
        } else {
          // Gracefully decay to 0.05
          setBars(curr => curr.map(v => Math.max(0.05, v - 0.05)))
        }
      } 
      // SYNTHETIC FALLBACK (YouTube, SoundCloud iFrames via ReactPlayer)
      else {
        if (time - lastTime > 66) {
          setBars(curr => curr.map((val, i) => {
            if (!isPlaying) return Math.max(0.05, val - 0.05)
            // Distribute pseudo-frequencies: Lows hit harder, Mids dynamic, Highs flutter
            const isLow = i < 10
            const isMid = i >= 10 && i < 24
            const boost = isLow ? 0.3 : (isMid ? 0.1 : -0.1)
            return 0.1 + (Math.random() * 0.6) + boost
          }))
          lastTime = time
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate(performance.now())

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, audioElement, source])

  const withAlpha = (color, alphaHex) => (
    /^#[0-9a-f]{6}$/i.test(color) ? `${color}${alphaHex}` : color
  )

  const getBarColor = (height) => {
    if (height > 0.82) return '#ffffff'
    if (height > 0.62) return accentColor
    if (height > 0.34) return withAlpha(accentColor, 'cc')
    return withAlpha(accentColor, '2e')
  }

  // default 'bars'
  return (
    <div style={{ height: '40px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', padding: '0 4px' }}>
      {bars.map((value, index) => (
        <motion.div
          key={index}
          style={{ width: '4px', borderRadius: '1px 1px 0 0', background: getBarColor(value) }}
          animate={{ height: `${Math.max(4, value * 36)}px` }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  )
}
