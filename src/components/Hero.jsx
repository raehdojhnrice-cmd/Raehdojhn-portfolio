import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useRef } from 'react'

const MotionDiv = motion.div
const MotionP = motion.p

const EASE = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: EASE }
  })
}
const STORAGE_KEY = 'rae-hero-video'

const BADGES = [
  'Creative Direction', 'Brand Systems', 'Technical Design',
  'AI-Integrated Workflows', 'Audio Production', 'Visual Design'
]

export default function Hero() {
  const canEditBg = import.meta.env.DEV
  const { scrollY } = useScroll()
  const scrollOpacity = useTransform(scrollY, [0, 120], [1, 0])
  const [showAdmin, setShowAdmin] = useState(false)
  const [videoUrl, setVideoUrl] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '/background-video.mp4'
  })
  const [tempUrl, setTempUrl] = useState(videoUrl)

  const headlineStageRef = useRef(null)
  const [hoverReveal, setHoverReveal] = useState({
    active: false,
    x: 0,
    y: 0,
  })

  const handleSaveVideo = (e) => {
    e.preventDefault()
    setVideoUrl(tempUrl)
    localStorage.setItem(STORAGE_KEY, tempUrl)
    setShowAdmin(false)
  }

  const handleHeadlinePointerMove = useCallback((event) => {
    const node = headlineStageRef.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    setHoverReveal({
      active: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }, [])

  const handleHeadlinePointerLeave = useCallback(() => {
    setHoverReveal((previous) => ({ ...previous, active: false }))
  }, [])

  const shadowMask = hoverReveal.active
    ? `radial-gradient(42px 50px at ${hoverReveal.x}px ${hoverReveal.y}px, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.88) 42%, rgba(0, 0, 0, 0) 74%)`
    : 'radial-gradient(0px 0px at 0 0, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)'

  return (
    <section className="hero" id="hero" style={{ position: 'relative' }}>
      {/* Background Video Layer */}
      {videoUrl && (
        <video
          key={videoUrl}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.25, zIndex: 1, pointerEvents: 'none'
          }}
          onError={(e) => e.target.style.display = 'none'}
        />
      )}

      {/* Grid overlay */}
      <div className="hero__grid-bg" aria-hidden="true" style={{ zIndex: 2 }} />

      {/* Structural lines */}
      <div className="hero__structural-lines" aria-hidden="true">
        <div className="hero__line-h" />
        <div className="hero__line-v" />
      </div>

      <div className="hero__content" style={{ textAlign: 'center' }}>
        {/* Overline */}
        <MotionP
          className="hero__overline"
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ color: 'var(--accent-marker)', justifyContent: 'center' }}
        >
          CREATIVE TECHNOLOGIST · LOS ANGELES
        </MotionP>

        {/* RAEHDOJHN — cursor-position maroon shadow reveal */}
        <MotionDiv
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ display: 'block', textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <div
            ref={headlineStageRef}
            onPointerMove={handleHeadlinePointerMove}
            onPointerLeave={handleHeadlinePointerLeave}
            style={{
              display: 'inline-block',
              position: 'relative',
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            {/* Main headline */}
            <h1
              className="hero__headline"
              style={{
                margin: 0,
                display: 'block',
                position: 'relative',
                zIndex: 2,
              }}
            >
              RAEHDOJHN
            </h1>

            {/* Shadow headline — width-matched to the word so the reveal tracks only the hovered text segment */}
            <h1
              aria-hidden="true"
              className="hero__headline"
              style={{
                margin: 0,
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                transform: 'translateY(-0.08em) scaleY(0.92)',
                transformOrigin: 'top center',
                pointerEvents: 'none',
                zIndex: 1,
                color: 'rgba(139, 26, 26, 0.92)',
                textShadow: '0 0 18px rgba(139, 26, 26, 0.55), 0 2px 6px rgba(139, 26, 26, 0.4)',
                filter: 'blur(0.3px)',
                opacity: hoverReveal.active ? 1 : 0,
                transition: 'opacity 0.09s ease',
                WebkitMaskImage: shadowMask,
                maskImage: shadowMask,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }}
            >
              RAEHDOJHN
            </h1>
          </div>
        </MotionDiv>

        {/* Tagline */}
        <motion.p
          className="hero__tagline"
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          style={{ margin: '0 auto var(--space-xl)', textAlign: 'center' }}
        >
          I build at the intersection of design, code, and culture —
          translating creative vision into systems that scale.
        </motion.p>

        {/* CTAs */}
        <MotionDiv
          className="hero__actions"
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          style={{ justifyContent: 'center' }}
        >
          <a href="#work" className="btn btn--primary">
            VIEW WORK <span className="btn__arrow">→</span>
          </a>
          {canEditBg && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="btn btn--secondary"
              style={{ padding: '16px', fontSize: '9px', letterSpacing: '0.1em' }}
            >
              [ {showAdmin ? '-' : '+'} SET BACKGROUND ]
            </button>
          )}
        </MotionDiv>

        {/* Admin Background Config */}
        {canEditBg && (
          <AnimatePresence>
            {showAdmin && (
              <MotionDiv
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', margin: '0 auto 32px', maxWidth: '400px' }}
              >
                <form
                  onSubmit={handleSaveVideo}
                  style={{ background: 'var(--bg-secondary)', padding: '16px', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(10px)' }}
                >
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', marginBottom: '12px' }}>
                    VIDEO SOURCE URL (Local or Remote)
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      className="form-input"
                      value={tempUrl}
                      onChange={e => setTempUrl(e.target.value)}
                      placeholder="/my-video.mp4"
                      style={{ flex: 1, padding: '8px' }}
                    />
                    <button type="submit" className="btn btn--primary" style={{ padding: '8px 16px' }}>SAVE</button>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Name file `background-video.mp4` and drop in `/public`, or use an external `.mp4` link.
                  </p>
                </form>
              </MotionDiv>
            )}
          </AnimatePresence>
        )}

        {/* Availability badges */}
        <MotionDiv
          className="hero__badges"
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          style={{ justifyContent: 'center' }}
        >
          {BADGES.map((badge, i) => (
            <span key={badge}>
              {i > 0 && <span className="hero__badge-sep">·</span>}
              <span className="hero__badge-text">{badge}</span>
            </span>
          ))}
        </MotionDiv>
      </div>

      {/* Scroll indicator */}
      <MotionDiv className="hero__scroll-indicator" style={{ opacity: scrollOpacity }}>
        <span className="mono-tag" style={{ fontSize: '8px', letterSpacing: '0.4em', color: 'var(--border-hover)' }}>SCROLL</span>
        <MotionDiv
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M6 2V18M6 18L1 13M6 18L11 13" stroke="var(--border-hover)" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </MotionDiv>
      </MotionDiv>

      {/* Right margin index */}
      <div className="hero__margin-index" aria-hidden="true">
        {['01','02','03','04','05'].map((n, i) => (
          <span key={n} className="hero__margin-num" style={{
            color: i === 0 ? 'var(--accent)' : 'var(--border-hover)',
            opacity: i === 0 ? 1 : 0.4,
          }}>{n}</span>
        ))}
      </div>
    </section>
  )
}
