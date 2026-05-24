import { useEffect, useRef, useState } from 'react'

const TRAIL_LIFE_MS = 820
const TRAIL_LABELS = ['//', 'RAE', '::', '<>']
const CLOCK_MODE_STORAGE_KEY = 'v4-chaos-clock-mode'
const CLOCK_MODES = [
  { id: 'orbital', label: 'Orbital' },
  { id: 'digital', label: 'Digital' },
  { id: 'analog', label: 'Analog' },
]

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatDate(date) {
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })
}

function readClockMode() {
  if (typeof window === 'undefined') return 'orbital'

  try {
    const stored = window.localStorage.getItem(CLOCK_MODE_STORAGE_KEY)
    return CLOCK_MODES.some((mode) => mode.id === stored) ? stored : 'orbital'
  } catch {
    return 'orbital'
  }
}

function padNumber(value) {
  return String(value).padStart(2, '0')
}

function getClockDisplay(date) {
  const formatter = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const parts = formatter.formatToParts(date)
  const hour = parts.find((part) => part.type === 'hour')?.value || '00'
  const minute = parts.find((part) => part.type === 'minute')?.value || '00'
  const dayPeriod = parts.find((part) => part.type === 'dayPeriod')?.value?.toUpperCase() || ''

  return {
    hourMinute: `${hour}:${minute}`,
    meridiem: dayPeriod,
  }
}

export default function V4ChaosWidgets({ widgets }) {
  const [trailPoints, setTrailPoints] = useState([])
  const [clockState, setClockState] = useState(() => ({
    now: new Date(),
    progress: 0,
  }))
  const [clockMode, setClockMode] = useState(readClockMode)
  const lastTrailRef = useRef(0)
  const trailSeedRef = useRef(0)

  useEffect(() => {
    if (!widgets.trail) return undefined

    if (window.matchMedia('(pointer: coarse)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const emitTrail = (event) => {
      const now = performance.now()
      if (now - lastTrailRef.current < 52) return
      lastTrailRef.current = now
      trailSeedRef.current += 1

      const nextPoint = {
        id: `${Date.now()}-${trailSeedRef.current}`,
        label: TRAIL_LABELS[trailSeedRef.current % TRAIL_LABELS.length],
        x: event.clientX,
        y: event.clientY,
        createdAt: Date.now(),
      }

      setTrailPoints((previous) => [nextPoint, ...previous].slice(0, 12))
    }

    const prune = window.setInterval(() => {
      const cutoff = Date.now() - TRAIL_LIFE_MS
      setTrailPoints((previous) => previous.filter((point) => point.createdAt > cutoff))
    }, 90)

    window.addEventListener('pointermove', emitTrail, { passive: true })

    return () => {
      window.clearInterval(prune)
      window.removeEventListener('pointermove', emitTrail)
    }
  }, [widgets.trail])

  useEffect(() => {
    if (!widgets.clock) return undefined

    const updateClock = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      setClockState({
        now: new Date(),
        progress,
      })
    }

    updateClock()
    const intervalId = window.setInterval(updateClock, 1000)
    window.addEventListener('scroll', updateClock, { passive: true })
    window.addEventListener('resize', updateClock)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('scroll', updateClock)
      window.removeEventListener('resize', updateClock)
    }
  }, [widgets.clock])

  useEffect(() => {
    try {
      window.localStorage.setItem(CLOCK_MODE_STORAGE_KEY, clockMode)
    } catch {
      /* ignore persistence failures */
    }
  }, [clockMode])

  const hours = clockState.now.getHours() % 12
  const minutes = clockState.now.getMinutes()
  const seconds = clockState.now.getSeconds()
  const hourAngle = hours * 30 + minutes * 0.5
  const minuteAngle = minutes * 6 + seconds * 0.1
  const secondAngle = seconds * 6
  const { hourMinute, meridiem } = getClockDisplay(clockState.now)

  return (
    <>
      {widgets.clock ? (
        <aside className={`v4-chaos-clock v4-chaos-clock--${clockMode}`} aria-label={`Chaos ${clockMode} clock`}>
          <div className="v4-chaos-clock__header">
            <div className="v4-chaos-clock__head-copy">
              <p>Time relay</p>
              <span>{clockMode} mode</span>
            </div>
            <div className="v4-chaos-clock__mode-switch" role="group" aria-label="Clock modes">
              {CLOCK_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`v4-chaos-clock__mode-btn ${clockMode === mode.id ? 'is-active' : ''}`}
                  onClick={() => setClockMode(mode.id)}
                  aria-pressed={clockMode === mode.id}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {clockMode === 'orbital' ? (
            <div className="v4-chaos-clock__orbital">
              <span className="v4-chaos-clock__ring v4-chaos-clock__ring--hour" style={{ '--v4-orbit-rotation': `${hourAngle}deg` }} />
              <span className="v4-chaos-clock__ring v4-chaos-clock__ring--minute" style={{ '--v4-orbit-rotation': `${minuteAngle}deg` }} />
              <span className="v4-chaos-clock__ring v4-chaos-clock__ring--second" style={{ '--v4-orbit-rotation': `${secondAngle}deg` }} />
              <span className="v4-chaos-clock__core" />
            </div>
          ) : null}

          {clockMode === 'digital' ? (
            <div className="v4-chaos-clock__digital" aria-hidden="true">
              <div className="v4-chaos-clock__digital-main">
                <strong>{hourMinute}</strong>
                <span>{meridiem}</span>
              </div>
              <div className="v4-chaos-clock__digital-strip">
                <div>
                  <label>SEC</label>
                  <strong>{padNumber(seconds)}</strong>
                </div>
                <div>
                  <label>DATE</label>
                  <strong>{formatDate(clockState.now)}</strong>
                </div>
              </div>
              <div className="v4-chaos-clock__progressbar">
                <span style={{ width: `${Math.max(clockState.progress * 100, 6)}%` }} />
              </div>
            </div>
          ) : null}

          {clockMode === 'analog' ? (
            <div className="v4-chaos-clock__analog">
              <div className="v4-chaos-clock__analog-face">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span
                    key={`tick-${index}`}
                    className="v4-chaos-clock__analog-tick"
                    style={{ '--v4-tick-rotation': `${index * 30}deg` }}
                  />
                ))}
                <span
                  className="v4-chaos-clock__analog-hand v4-chaos-clock__analog-hand--hour"
                  style={{ '--v4-hand-rotation': `${hourAngle}deg` }}
                />
                <span
                  className="v4-chaos-clock__analog-hand v4-chaos-clock__analog-hand--minute"
                  style={{ '--v4-hand-rotation': `${minuteAngle}deg` }}
                />
                <span
                  className="v4-chaos-clock__analog-hand v4-chaos-clock__analog-hand--second"
                  style={{ '--v4-hand-rotation': `${secondAngle}deg` }}
                />
                <span className="v4-chaos-clock__analog-center" />
              </div>
            </div>
          ) : null}

          <div className="v4-chaos-clock__readout">
            <p>
              {clockMode === 'orbital' ? 'Orbital clock / scroll sync' : null}
              {clockMode === 'digital' ? 'Digital readout / live telemetry' : null}
              {clockMode === 'analog' ? 'Analog face / studio time' : null}
            </p>
            <div className="v4-chaos-clock__time-stack">
              <strong>{formatTime(clockState.now)}</strong>
              <div className="v4-chaos-clock__labels">
                <span>H</span>
                <span>M</span>
                <span>S</span>
              </div>
            </div>
            <span>{formatDate(clockState.now)}</span>
            <span>Progress {Math.round(clockState.progress * 100)}%</span>
          </div>
        </aside>
      ) : null}

      {widgets.trail ? (
        <div className="v4-chaos-trail" aria-hidden="true">
          {trailPoints.map((point, index) => (
            <span
              key={point.id}
              className="v4-chaos-trail__glyph"
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                '--v4-trail-depth': index,
              }}
            >
              {point.label}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}
