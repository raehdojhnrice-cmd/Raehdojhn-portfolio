import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const DB_NAME = 'rae-video-db'
const STORE_NAME = 'backgrounds'

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveVideoFile(file) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.put(file, 'custom-bg')
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

async function loadVideoFile() {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get('custom-bg')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function clearVideoFile() {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.delete('custom-bg')
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export default function VideoBackground() {
  const { scrollY } = useScroll()
  const glassBlur = useTransform(scrollY, [0, 800], ['blur(0px)', 'blur(30px)'])
  const glassOpacity = useTransform(scrollY, [0, 800], [0, 0.85])

  const videoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef(null)
  const isScrolling = useRef(false)

  // Initialize background video from DB or localStorage on mount
  useEffect(() => {
    async function initVideo() {
      try {
        const file = await loadVideoFile()
        if (file) {
          setVideoSrc(URL.createObjectURL(file))
          return
        }
      } catch (err) {
        console.error('Failed to load video from IDB', err)
      }
      
      const lsUrl = localStorage.getItem('rae-bg-video')
      if (lsUrl) {
        setVideoSrc(lsUrl)
      }
    }
    initVideo()
  }, [])

  // Scroll-reactive video playback
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    let targetSpeed = 1
    let currentSpeed = 1
    let scrollTimeout = null
    let lastScrollY = window.scrollY
    let rafId = null

    // Ensure the video plays continuously at baseline
    video.playbackRate = 1
    video.play().catch(() => {})

    const smoothSpeed = () => {
      // Interpolate towards target speed smoothly
      currentSpeed += (targetSpeed - currentSpeed) * 0.1
      
      // Clamp just in case floating point drifts
      if (Math.abs(targetSpeed - currentSpeed) < 0.01) {
        currentSpeed = targetSpeed
      }

      if (video) {
        video.playbackRate = currentSpeed
      }

      if (currentSpeed !== targetSpeed) {
        rafId = requestAnimationFrame(smoothSpeed)
      } else {
        rafId = null
      }
    }

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY)
      // Map scroll intensity: baseline 1x, up to 3x max when scrolling fast
      const calculatedSpeed = Math.min(Math.max(1 + (delta / 50), 1), 3)
      targetSpeed = calculatedSpeed
      lastScrollY = window.scrollY

      if (!rafId) {
        rafId = requestAnimationFrame(smoothSpeed)
      }

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        // Return to normal speed when scrolling stops
        targetSpeed = 1
        if (!rafId) {
          rafId = requestAnimationFrame(smoothSpeed)
        }
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [videoSrc])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setShowUpload(false)
    localStorage.removeItem('rae-bg-video')
    
    // Store in IndexedDB for persistence
    try {
      await saveVideoFile(file)
    } catch (err) {
      console.error('Failed to save file to IndexedDB', err)
    }
  }

  const handleURLInput = async (e) => {
    e.preventDefault()
    const url = e.target.elements.videoUrl.value.trim()
    if (url) {
      setVideoSrc(url)
      localStorage.setItem('rae-bg-video', url)
      setShowUpload(false)
      
      try { await clearVideoFile() } catch (err) {}
    }
  }

  const removeVideo = async () => {
    setVideoSrc('')
    localStorage.removeItem('rae-bg-video')
    try { await clearVideoFile() } catch (err) {}
  }

  return (
    <>
      {/* Video Layer */}
      <div className="video-bg">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="video-bg__video"
            src={videoSrc}
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <div className="video-bg__placeholder" />
        )}
        <div className="video-bg__overlay" />
        <motion.div 
          style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            backdropFilter: glassBlur, WebkitBackdropFilter: glassBlur,
            backgroundColor: 'var(--bg-primary)', opacity: glassOpacity,
            transition: 'background-color var(--duration-slow)'
          }}
        />
      </div>

      {/* Upload Toggle */}
      <button
        className="video-bg__upload-btn"
        onClick={() => setShowUpload(!showUpload)}
        title="Upload background video"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <polygon points="10,8 16,12 10,16"/>
        </svg>
      </button>

      {/* Upload Panel */}
      {showUpload && (
        <div className="video-bg__panel">
          <h4 className="mono-tag" style={{ marginBottom: '12px' }}>BACKGROUND VIDEO</h4>

          <div className="video-bg__panel-section">
            <label className="mono-tag" style={{ fontSize: '9px', marginBottom: '8px', display: 'block' }}>
              UPLOAD FILE
            </label>
            <label className="video-bg__file-label">
              <span className="mono-tag">Choose video file</span>
              <input type="file" accept="video/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="video-bg__panel-divider">
            <span className="mono-tag">OR</span>
          </div>

          <form onSubmit={handleURLInput} className="video-bg__panel-section">
            <label className="mono-tag" style={{ fontSize: '9px', marginBottom: '8px', display: 'block' }}>
              PASTE URL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                name="videoUrl"
                className="form-input"
                placeholder="https://... .mp4"
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
              />
              <button type="submit" className="btn btn--primary" style={{ padding: '8px 16px' }}>SET</button>
            </div>
          </form>

          {videoSrc && (
            <button
              className="btn btn--ghost"
              style={{ marginTop: '12px', color: 'var(--error)', fontSize: '10px' }}
              onClick={removeVideo}
            >
              REMOVE VIDEO
            </button>
          )}
        </div>
      )}
    </>
  )
}
