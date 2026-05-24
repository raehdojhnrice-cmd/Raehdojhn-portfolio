import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import V4ThemeCycler from './V4ThemeCycler'

const WINDOWS = [
  { id: 'app-artifact', label: 'Artifact Overview',  serial: 'APP-00' },
  { id: 'app-playback', label: 'Playback Deck',       serial: 'APP-01' },
  { id: 'app-ledger',   label: 'Project Ledger',      serial: 'APP-03' },
  { id: 'app-prompt',   label: 'Prompt Flux',          serial: 'APP-04' },
  { id: 'app-lab',      label: 'Chaos Lab',            serial: 'APP-05' },
  { id: 'app-contact',  label: 'Contact Terminal',     serial: 'APP-06' },
]

function useClock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-US', { hour12: false }))
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { hour12: false })), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function useActiveWindow() {
  const [activeId, setActiveId] = useState(WINDOWS[0].id)

  useEffect(() => {
    const observers = []
    const visible = new Map()

    WINDOWS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          visible.set(id, entry.intersectionRatio)
          // pick the window with highest visibility
          let best = null, bestRatio = -1
          visible.forEach((ratio, wid) => { if (ratio > bestRatio) { bestRatio = ratio; best = wid } })
          if (best) setActiveId(best)
        },
        { threshold: [0, 0.1, 0.3, 0.5, 0.8, 1] }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return activeId
}

export default function V4IdentityRail() {
  const time     = useClock()
  const activeId = useActiveWindow()
  const activeIndex = WINDOWS.findIndex((w) => w.id === activeId)
  const progress = WINDOWS.length > 1 ? activeIndex / (WINDOWS.length - 1) : 0

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="v4-rail" aria-label="Window navigator" style={{ borderRight: '1px solid var(--v4-line)', background: 'var(--v4-bg)', padding: '24px 16px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Editorial Header */}
      <div className="v4-rail__section" style={{ borderBottom: '2px solid var(--v4-text)', paddingBottom: '16px', marginBottom: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-blackletter)', fontSize: '3rem', lineHeight: 1, margin: '0 0 8px 0', textAlign: 'center' }}>Chaos Lux</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', borderTop: '1px solid var(--v4-text)', borderBottom: '1px solid var(--v4-text)', padding: '4px 0' }}>
          <span>EDITION 04</span>
          <span>{time} UTC</span>
          <span>SÃO PAULO / LA</span>
        </div>
        <div style={{ marginTop: '12px' }}>
          <V4ThemeCycler />
        </div>
      </div>

      {/* Editorial Body / Nav Index */}
      <nav className="v4-rail__nav" style={{ flex: 1 }}>
        <h2 style={{ fontFamily: 'var(--font-brutal)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '12px', borderBottom: '1px solid var(--v4-line)' }}>INDEX_06 / ARCHIVE</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {WINDOWS.map((win) => {
            const isActive = win.id === activeId
            return (
              <a
                key={win.id}
                href={`#${win.id}`}
                className={`v4-rail__link ${isActive ? 'is-active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollTo(win.id) }}
                aria-current={isActive ? 'true' : undefined}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr', 
                  gap: '8px', 
                  textDecoration: 'none', 
                  color: isActive ? 'var(--v4-bg)' : 'var(--v4-text)',
                  background: isActive ? 'var(--v4-text)' : 'transparent',
                  padding: '4px 8px',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', opacity: isActive ? 0.9 : 0.6 }}>{win.serial}</span>
                <span style={{ fontFamily: 'var(--font-brutal)', fontSize: '14px', textTransform: 'uppercase' }}>{win.label}</span>
              </a>
            )
          })}
        </div>

        {/* Newspaper style text column */}
        <div style={{ columnCount: 1, columnGap: '16px', textAlign: 'justify', fontFamily: 'var(--font-pixel)', fontSize: '10px', lineHeight: 1.4, opacity: 0.8, marginBottom: '24px' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>SYSTEM MANIFESTO</strong> — The interface is no longer a transparent window, but a textured artifact. We embrace the brutalist friction of the machine.</p>
          <p style={{ margin: 0 }}>Every interaction leaves a trace. The digital archive accumulates memory, manifesting as visual degradation and typographic noise. [IP.AXIS.INDUSTRIAL]</p>
        </div>
      </nav>

      {/* Progress indicator / Footer */}
      <div className="v4-rail__section" style={{ borderTop: '1px dashed var(--v4-line)', paddingTop: '16px', marginTop: 'auto' }}>
        <div className="v4-rail__progress" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', marginBottom: '8px' }}>
          <span>READING STATUS</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="v4-rail__progress-bar" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} style={{ height: '4px', background: 'rgba(128,128,128,0.2)', position: 'relative' }}>
          <motion.span 
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ originX: 0, position: 'absolute', top: 0, left: 0, bottom: 0, width: '100%', background: 'var(--v4-text)' }} 
          />
        </div>
        <p className="v4-rail__footnote" style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', marginTop: '12px', textAlign: 'center', opacity: 0.5 }}>© {new Date().getFullYear()} RAEHDOJHN POST</p>
      </div>
    </aside>
  )
}
