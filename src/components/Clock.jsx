import { useEffect, useMemo, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EASE = [0.16, 1, 0.3, 1]

// 12 Earthly Branches (十二時辰) — traditional Chinese shichen system.
// Each shichen lasts two modern hours. 子 (Rat) starts at 23:00.
const SHICHEN = [
  { ch: '子', pinyin: 'zǐ',   zodiac: 'Rat',     start: 23 },
  { ch: '丑', pinyin: 'chǒu', zodiac: 'Ox',      start: 1  },
  { ch: '寅', pinyin: 'yín',  zodiac: 'Tiger',   start: 3  },
  { ch: '卯', pinyin: 'mǎo',  zodiac: 'Rabbit',  start: 5  },
  { ch: '辰', pinyin: 'chén', zodiac: 'Dragon',  start: 7  },
  { ch: '巳', pinyin: 'sì',   zodiac: 'Snake',   start: 9  },
  { ch: '午', pinyin: 'wǔ',   zodiac: 'Horse',   start: 11 },
  { ch: '未', pinyin: 'wèi',  zodiac: 'Goat',    start: 13 },
  { ch: '申', pinyin: 'shēn', zodiac: 'Monkey',  start: 15 },
  { ch: '酉', pinyin: 'yǒu',  zodiac: 'Rooster', start: 17 },
  { ch: '戌', pinyin: 'xū',   zodiac: 'Dog',     start: 19 },
  { ch: '亥', pinyin: 'hài',  zodiac: 'Pig',     start: 21 },
]

// Returns the index 0..11 into SHICHEN for a given hour (0..23) + minute.
function currentShichenIndex(hours, minutes) {
  // Hour-of-day within the 2-hour shichen, offset so 23:00 → index 0.
  const shifted = (hours + 1) % 24 + minutes / 60
  return Math.floor(shifted / 2) % 12
}

// Format a IANA timezone like "America/Los_Angeles" → "LOS ANGELES".
function prettyCity(timeZone) {
  if (!timeZone) return ''
  const parts = timeZone.split('/')
  const city = parts[parts.length - 1].replace(/_/g, ' ')
  return city.toUpperCase()
}

export default function Clock() {
  const [now, setNow] = useState(() => new Date())
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const tz = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone }
    catch { return 'UTC' }
  }, [])

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  // ── Analog clock geometry ─────────────────────────────────────────
  const secondAngle = seconds * 6
  const minuteAngle = minutes * 6 + seconds * 0.1
  const hourAngle = ((hours % 12) * 30) + minutes * 0.5

  // ── Oriental (shichen) clock state ────────────────────────────────
  const idx = currentShichenIndex(hours, minutes)
  const sh = SHICHEN[idx]
  // Pointer angle — sweep continuously across the 2-hour window.
  const shHourFloat = ((hours + 1) % 24 + minutes / 60 + seconds / 3600) / 2
  const shichenAngle = (shHourFloat * 30) % 360
  // Quarter (刻) — each shichen is divided into 8 刻 of 15 min.
  const minsInShichen = (((hours + 1) % 2) * 60 + minutes) % 120
  const ke = Math.floor(minsInShichen / 15) + 1

  // Digital display in 24h tabular form.
  const hhmm = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
  const ss = String(seconds).padStart(2,'0')

  // Day / date for the readout.
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const dateStr = `${days[now.getDay()]} · ${months[now.getMonth()]} ${String(now.getDate()).padStart(2,'0')} · ${now.getFullYear()}`

  return (
    <section id="time" ref={ref} className="section clock-section" aria-label="Local time">
      <div className="section__container">
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="section__overline mono-tag" style={{ color: 'var(--accent-marker)', letterSpacing: '0.35em' }}>
            08 — TEMPORAL
          </p>
          <h2 className="section__title">
            Time<span style={{ color: 'var(--accent)', margin: '0 0.3em' }}>/</span>
            <span style={{ fontFamily: "'DotGothic16', 'Noto Sans CJK SC', sans-serif", fontWeight: 400 }}>時間</span>
          </h2>
          <p className="section__subtitle">
            Your local instant — measured twice: once by hand, once by tradition.
          </p>
        </motion.div>

        <div className="clock-pair">
          {/* ─── ORIENTAL · 十二時辰 ─────────────────────────────── */}
          <motion.div
            className="clock-card"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <header className="clock-card__head">
              <span className="clock-card__num">01</span>
              <span className="clock-card__label">十二時辰 · Shichen</span>
            </header>

            <div className="clock-face-wrap">
              <svg viewBox="0 0 240 240" className="clock-face clock-face--oriental" role="img" aria-label="Oriental shichen clock">
                <defs>
                  <radialGradient id="orientalGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"  stopColor="rgba(255, 154, 0, 0.10)" />
                    <stop offset="60%" stopColor="rgba(255, 154, 0, 0)" />
                  </radialGradient>
                </defs>

                <circle cx="120" cy="120" r="115" fill="url(#orientalGlow)" />
                <circle cx="120" cy="120" r="110" fill="none" stroke="var(--border-hover)" strokeWidth="1" />
                <circle cx="120" cy="120" r="92"  fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
                <circle cx="120" cy="120" r="74"  fill="none" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="2 4" />

                {/* 12 earthly-branch characters arranged around the dial */}
                {SHICHEN.map((s, i) => {
                  // index 0 (子) at the top (270° = -90°), then clockwise
                  const a = (i * 30 - 90) * Math.PI / 180
                  const r = 99
                  const x = 120 + r * Math.cos(a)
                  const y = 120 + r * Math.sin(a)
                  const active = i === idx
                  return (
                    <g key={s.ch}>
                      <text
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="'DotGothic16', 'Noto Sans CJK SC', serif"
                        fontSize={active ? 18 : 15}
                        fill={active ? 'var(--accent)' : 'var(--bone)'}
                        opacity={active ? 1 : 0.55}
                        style={{ transition: 'opacity 400ms ease, fill 400ms ease, font-size 400ms ease' }}
                      >
                        {s.ch}
                      </text>
                    </g>
                  )
                })}

                {/* Outer minute ticks — 60 fine ticks */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const a = (i * 6 - 90) * Math.PI / 180
                  const inner = i % 5 === 0 ? 113 : 116
                  const outer = 119
                  const x1 = 120 + inner * Math.cos(a)
                  const y1 = 120 + inner * Math.sin(a)
                  const x2 = 120 + outer * Math.cos(a)
                  const y2 = 120 + outer * Math.sin(a)
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={i % 5 === 0 ? 'var(--border-raised)' : 'var(--border-subtle)'}
                      strokeWidth={i % 5 === 0 ? 1 : 0.5} />
                  )
                })}

                {/* Shichen pointer — rotates once every 24h */}
                <g style={{ transform: `rotate(${shichenAngle}deg)`, transformOrigin: '120px 120px', transition: 'transform 1s linear' }}>
                  <line x1="120" y1="120" x2="120" y2="36" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="120" cy="36" r="3" fill="var(--accent)" />
                </g>

                {/* Centerpiece — small kanji "時" */}
                <circle cx="120" cy="120" r="14" fill="var(--bg-primary)" stroke="var(--border-raised)" strokeWidth="0.75" />
                <text x="120" y="121" textAnchor="middle" dominantBaseline="central"
                  fontFamily="'DotGothic16', 'Noto Sans CJK SC', serif"
                  fontSize="14" fill="var(--accent-marker)">時</text>
              </svg>
            </div>

            <dl className="clock-readout">
              <div className="clock-readout__row">
                <dt>Shichen</dt>
                <dd>
                  <span className="cjk-large">{sh.ch}</span>
                  <span className="readout-meta">{sh.pinyin} · {sh.zodiac}</span>
                </dd>
              </div>
              <div className="clock-readout__row">
                <dt>Window</dt>
                <dd className="mono">
                  {String(sh.start).padStart(2,'0')}:00 — {String((sh.start + 2) % 24).padStart(2,'0')}:00
                </dd>
              </div>
              <div className="clock-readout__row">
                <dt>Quarter (刻)</dt>
                <dd className="mono">{ke} / 8</dd>
              </div>
            </dl>
          </motion.div>

          {/* ─── ANALOG ─────────────────────────────────────────── */}
          <motion.div
            className="clock-card"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          >
            <header className="clock-card__head">
              <span className="clock-card__num">02</span>
              <span className="clock-card__label">Analog · Mechanical</span>
            </header>

            <div className="clock-face-wrap">
              <svg viewBox="0 0 240 240" className="clock-face clock-face--analog" role="img" aria-label="Analog clock">
                <defs>
                  <radialGradient id="analogGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"  stopColor="rgba(232, 228, 220, 0.05)" />
                    <stop offset="70%" stopColor="rgba(232, 228, 220, 0)" />
                  </radialGradient>
                </defs>

                <circle cx="120" cy="120" r="115" fill="url(#analogGlow)" />
                <circle cx="120" cy="120" r="110" fill="none" stroke="var(--border-hover)" strokeWidth="1" />
                <circle cx="120" cy="120" r="100" fill="none" stroke="var(--border-subtle)" strokeWidth="0.5" />

                {/* Minute ticks */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const a = (i * 6 - 90) * Math.PI / 180
                  const inner = i % 5 === 0 ? 96 : 104
                  const outer = 109
                  const x1 = 120 + inner * Math.cos(a)
                  const y1 = 120 + inner * Math.sin(a)
                  const x2 = 120 + outer * Math.cos(a)
                  const y2 = 120 + outer * Math.sin(a)
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={i % 5 === 0 ? 'var(--bone)' : 'var(--border-raised)'}
                      strokeWidth={i % 5 === 0 ? 1.25 : 0.5} />
                  )
                })}

                {/* Roman numerals at 12, 3, 6, 9 */}
                {[
                  { num: 'XII', x: 120, y: 32 },
                  { num: 'III', x: 208, y: 120 },
                  { num: 'VI',  x: 120, y: 208 },
                  { num: 'IX',  x: 32,  y: 120 },
                ].map(({ num, x, y }) => (
                  <text key={num}
                    x={x} y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="18"
                    fontStyle="italic"
                    fill="var(--bone)"
                    opacity="0.9"
                  >
                    {num}
                  </text>
                ))}

                {/* Hour hand */}
                <g style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '120px 120px', transition: 'transform 0.5s var(--ease-out)' }}>
                  <line x1="120" y1="132" x2="120" y2="64" stroke="var(--bone)" strokeWidth="3.5" strokeLinecap="round" />
                </g>

                {/* Minute hand */}
                <g style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '120px 120px', transition: 'transform 0.5s var(--ease-out)' }}>
                  <line x1="120" y1="138" x2="120" y2="40" stroke="var(--bone)" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Second hand — accent red, ticks every second */}
                <g style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '120px 120px', transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <line x1="120" y1="146" x2="120" y2="36" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="120" cy="50" r="3" fill="none" stroke="var(--accent)" strokeWidth="1" />
                </g>

                {/* Centerpiece */}
                <circle cx="120" cy="120" r="5" fill="var(--bone)" />
                <circle cx="120" cy="120" r="2" fill="var(--accent)" />
              </svg>
            </div>

            <dl className="clock-readout">
              <div className="clock-readout__row">
                <dt>Now</dt>
                <dd className="mono mono--lg">
                  {hhmm}<span className="clock-seconds">:{ss}</span>
                </dd>
              </div>
              <div className="clock-readout__row">
                <dt>Date</dt>
                <dd className="mono">{dateStr}</dd>
              </div>
              <div className="clock-readout__row">
                <dt>Zone</dt>
                <dd className="mono">
                  <span style={{ color: 'var(--bone)' }}>{prettyCity(tz)}</span>
                  <span className="readout-meta">{tz}</span>
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
