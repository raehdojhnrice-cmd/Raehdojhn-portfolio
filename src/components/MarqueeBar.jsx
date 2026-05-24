import { useState, useEffect } from 'react'

const ISSUE = 'RAE-26-001'
const EDITION = 'EDITION ALPHA'

export default function MarqueeBar() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
      setDate(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`)
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const services = 'CREATIVE DIRECTION — BRAND SYSTEMS — TECHNICAL DESIGN — AI-INTEGRATED WORKFLOWS — AUDIO PRODUCTION — VISUAL DESIGN — '

  return (
    <div className="marquee-bar" style={{ height: 'var(--marquee-height)', backgroundColor: '#060606', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="marquee-bar__inner">
        <div className="marquee-bar__left">
          <span className="archive-chip" style={{ marginRight: 6 }}>{ISSUE}</span>
          <span className="archive-dot" style={{ marginRight: 6 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: 8 }}>{EDITION}</span>
          <span className="archive-dot" style={{ marginRight: 8 }} />
          <span className="marquee-bar__item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 5, height: 5, backgroundColor: 'var(--signal)', display: 'inline-block' }} />
            <span style={{ color: 'var(--bone)' }}>ONLINE</span>
          </span>
          <span className="marquee-bar__divider" style={{ backgroundColor: 'var(--border-subtle)' }}>|</span>
          <span className="marquee-bar__item" style={{ color: 'var(--dust)' }}>AVAILABLE FOR WORK</span>
        </div>
        <div className="marquee-bar__track">
          <div className="marquee-bar__scroll">
            <span className="marquee-bar__content" style={{ color: 'var(--bone)' }}>{services}{services}{services}{services}</span>
          </div>
        </div>
        <div className="marquee-bar__right">
          <span className="marquee-bar__item" style={{ color: 'var(--dust)' }}>LOS ANGELES, CA</span>
          <span className="marquee-bar__divider" style={{ backgroundColor: 'var(--border-subtle)' }}>|</span>
          <span className="marquee-bar__item" style={{ color: 'var(--bone)' }}>{date}</span>
          <span className="marquee-bar__divider" style={{ backgroundColor: 'var(--border-subtle)' }}>|</span>
          <span className="marquee-bar__item" style={{ color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
        </div>
      </div>
    </div>
  )
}
