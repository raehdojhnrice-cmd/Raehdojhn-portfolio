import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const SHUFFLE_WORDS = ['CHAOTIC', 'BRUTALIST', 'AUTONOMOUS', 'UTILITARIAN', 'EDITORIAL', 'ARCHIVAL']

function KineticText({ children }) {
  const [word, setWord] = useState(children)
  useEffect(() => {
    const id = setInterval(() => {
      setWord(SHUFFLE_WORDS[Math.floor(Math.random() * SHUFFLE_WORDS.length)])
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.span
      key={word}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {word}
    </motion.span>
  )
}

export default function V4ArtifactHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 })

  return (
    <section id="hero" ref={ref} className="v4-hero" data-v4-animate>
      <div className="v4-hero__meta" style={{ position: 'relative', zIndex: 10 }}>
        <div className="v4-meta-row" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', opacity: 0.8 }}>
          <span className="v4-badge" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>[ EDITION 004 ]</span>
          <div className="v4-meta-line" style={{ borderTop: '1px dashed var(--v4-line)', flex: 1, margin: '0 12px' }} />
          <span>LAT: 34.0522° N // LONG: 118.2437° W</span>
        </div>
        
        <p className="v4-kicker" style={{ fontFamily: 'var(--font-mono)', color: 'var(--v4-accent)', marginTop: '2rem', fontSize: '12px', letterSpacing: '0.1em' }}>
          DOCUMENTED_ARTIFACT / SYSTEM_V4 / データ
        </p>
        
        <h1 className="v4-title" style={{ 
          fontFamily: 'var(--font-brutal)', 
          fontSize: 'clamp(4rem, 12vw, 9rem)', 
          lineHeight: 0.85, 
          textTransform: 'uppercase', 
          letterSpacing: '0.02em', 
          margin: '24px 0',
          position: 'relative'
        }}>
          <span className="v4-chromatic-blur" style={{ display: 'inline-block' }}><KineticText>CHAOTIC</KineticText></span><br />
          <span style={{ opacity: 0.8 }}>LUXURY</span><br />
          <span style={{ color: 'var(--v4-bg)', WebkitTextStroke: '1px var(--v4-text)' }}>DISCIPLINE</span>
        </h1>
        
        <p className="v4-copy" style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', textTransform: 'uppercase', lineHeight: 1.6, maxWidth: '400px', opacity: 0.8 }}>
          Archive logic // Utility system // Functional brutality. 
          Deconstructed for the contemporary digital era. 
          <br /><span style={{ color: 'var(--v4-accent)', marginTop: '8px', display: 'block' }}>[ IP.AXIS.INDUSTRIAL ]</span>
        </p>

        <div className="v4-hero__routes" aria-label="V4 routes and modules" style={{ display: 'flex', gap: '16px', marginTop: '32px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          <Link to="/" className="v4-hero__route" style={{ borderBottom: '1px solid var(--v4-accent)' }}>← EXIT</Link>
          <a href="#work" className="v4-hero__route">WORK_INDEX</a>
          <Link to="/v4/archive" className="v4-hero__route">UPLOAD_WALL</Link>
          <a href="#contact" className="v4-hero__route">TERM_06</a>
        </div>
      </div>

      <motion.div 
        className="v4-artifact"
        style={{ 
          y,
          rotateX: springRotateX, 
          rotateY: springRotateY, 
          scale,
          perspective: 1000 
        }}
      >
        <div className="v4-artifact__foil">
          <div className="v4-artifact__glimmer" />
        </div>
        <div className="v4-artifact__content">
          <p className="v4-artifact__id"># {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <p className="v4-artifact__line">AUTHENTICATION: ARCHIVE_V4_CORE</p>
          <p className="v4-artifact__line">SYSTEM HASH: 0x42A7C...F91E</p>
          <div className="v4-meta-line" style={{ marginTop: 'auto', marginBottom: 8 }} />
          <p className="v4-artifact__line" style={{ opacity: 0.5 }}>© {new Date().getFullYear()} RAEHDOJHN — ALL RIGHTS RESERVED</p>
        </div>
      </motion.div>
    </section>
  )
}
