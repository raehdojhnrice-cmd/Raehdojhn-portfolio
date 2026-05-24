import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactPlayer from 'react-player'
import RotaryKnob from './audio/RotaryKnob'
import WaveformProgress from './audio/WaveformProgress'
import defaultPlaylist from '../data/playlist.json'

const STORAGE_KEY = 'rae-music-playlist'
const COLOR_KEY   = 'rae-player-color'
const EASE = [0.16, 1, 0.3, 1]

const COLORS = [
  { id: 'crimson', hex: '#DC143C', label: 'Crimson'  },
  { id: 'amber',   hex: '#F59E0B', label: 'Amber'    },
  { id: 'cyan',    hex: '#22D3EE', label: 'Cyan'     },
  { id: 'violet',  hex: '#8B5CF6', label: 'Violet'   },
  { id: 'emerald', hex: '#10B981', label: 'Emerald'  },
  { id: 'bone',    hex: '#E8E4DC', label: 'Bone'     },
]

// ─── EQ Bands & Presets ───────────────────────────────────────────────────────
const EQ_BANDS = [
  { id: 'sub',    label: 'SUB',   freq: 60,    type: 'lowshelf'  },
  { id: 'bass',   label: 'BASS',  freq: 200,   type: 'peaking'   },
  { id: 'low',    label: 'LOW',   freq: 800,   type: 'peaking'   },
  { id: 'mid',    label: 'MID',   freq: 2500,  type: 'peaking'   },
  { id: 'hmid',   label: 'HMID',  freq: 8000,  type: 'peaking'   },
  { id: 'treble', label: 'AIR',   freq: 16000, type: 'highshelf' },
]

const EQ_PRESETS = {
  FLAT:   [ 0,   0,   0,   0,   0,   0  ],
  BASS:   [ 4,   3,   1,   0,   0,   0  ],
  VOCAL:  [-1,  -1,   1,   3,   2,   1  ],
  'V-SHP':[ 3,   2,  -1,  -1,   2,   3  ],
  CLUB:   [ 2,   3,   2,   0,   0,   0  ],
  AIR:    [ 0,   0,   0,   1,   3,   4  ],
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function getPlaylist() {
  try {
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) return JSON.parse(local)
    return defaultPlaylist || []
  } catch {
    return defaultPlaylist || []
  }
}
function savePlaylist(pl) { localStorage.setItem(STORAGE_KEY, JSON.stringify(pl)) }

// ─── EQ Display ──────────────────────────────────────────────────────────────
const NUM_BANDS = 24

function EQDisplay({ isPlaying, color, eqGains }) {
  const canvasRef = useRef(null)
  const barsRef   = useRef(Array.from({ length: NUM_BANDS }, () => Math.random() * 0.3 + 0.05))
  const peakRef   = useRef(Array.from({ length: NUM_BANDS }, () => 0))
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const tick = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const barW = Math.floor(W / NUM_BANDS) - 1
      const gap  = 1

      // Map EQ slider gains (index 0-5 bands) to the 24 display bands
      const gainCurve = Array.from({ length: NUM_BANDS }, (_, i) => {
        const t         = i / (NUM_BANDS - 1)
        const bandIndex = Math.floor(t * (EQ_BANDS.length - 1))
        const bandFrac  = t * (EQ_BANDS.length - 1) - bandIndex
        const g0        = (eqGains?.[bandIndex]     ?? 0) / 12  // normalise -1..1
        const g1        = (eqGains?.[bandIndex + 1] ?? 0) / 12
        return g0 + (g1 - g0) * bandFrac  // lerp
      })

      barsRef.current = barsRef.current.map((h, i) => {
        const gain = gainCurve[i] * 0.4 // scale contribution
        if (!isPlaying) {
          const target = 0.04 + Math.sin(Date.now() * 0.001 + i * 0.7) * 0.04 + Math.max(0, gain * 0.3)
          return h + (target - h) * 0.08
        }
        const bassBoost = i < 4  ? 1.5 : 1
        const trebleDip = i > 18 ? 0.6 : 1
        const noise     = Math.random() * 0.45
        const target    = Math.min(0.97, noise * bassBoost * trebleDip + Math.max(0, gain * 0.4))
        return h + (target - h) * 0.35
      })

      peakRef.current = peakRef.current.map((p, i) => {
        const bar = barsRef.current[i]
        if (bar >= p) return bar
        return Math.max(0, p - 0.008)
      })

      // area fill
      ctx.beginPath()
      ctx.moveTo(0, H)
      barsRef.current.forEach((h, i) => {
        const x = i * (barW + gap) + barW / 2
        ctx.lineTo(x, H - Math.max(2, h * H))
      })
      ctx.lineTo(W, H)
      ctx.closePath()
      const areaGrad = ctx.createLinearGradient(0, 0, 0, H)
      areaGrad.addColorStop(0, color + 'aa')
      areaGrad.addColorStop(1, color + '08')
      ctx.fillStyle = areaGrad
      ctx.fill()

      // bars
      ctx.shadowBlur = 0
      barsRef.current.forEach((h, i) => {
        const x      = i * (barW + gap)
        const barH   = Math.max(2, h * H)
        const y      = H - barH
        const bright = h > 0.75

        const barGrad = ctx.createLinearGradient(0, y, 0, H)
        barGrad.addColorStop(0, bright ? '#ffffff' : color)
        barGrad.addColorStop(1, color + '44')
        ctx.shadowColor = bright ? color : 'transparent'
        ctx.shadowBlur  = bright ? 10 : 0
        ctx.fillStyle   = barGrad
        ctx.fillRect(x, y, barW, barH)

        // top cap
        ctx.shadowBlur = 0
        ctx.fillStyle  = bright ? '#ffffff' : color + 'cc'
        ctx.fillRect(x, y, barW, 2)
      })

      // peak hold dots
      peakRef.current.forEach((p, i) => {
        if (p < 0.05) return
        const x = i * (barW + gap)
        const y = H - Math.max(2, p * H) - 3
        ctx.fillStyle  = color
        ctx.shadowColor = color
        ctx.shadowBlur  = 6
        ctx.fillRect(x, y, barW, 2)
      })
      ctx.shadowBlur = 0

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, color, eqGains])

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={48}
      style={{ width: '100%', height: '48px', display: 'block' }}
    />
  )
}

// ─── VU Meters ────────────────────────────────────────────────────────────────
function VUMeters({ isPlaying, color }) {
  const lBarRef = useRef(null)
  const rBarRef = useRef(null)
  const lVal    = useRef(0)
  const rVal    = useRef(0)
  const rafRef  = useRef(null)

  useEffect(() => {
    const tick = () => {
      if (isPlaying) {
        lVal.current += (0.3 + Math.random() * 0.65 - lVal.current) * 0.35
        rVal.current += (0.3 + Math.random() * 0.65 - rVal.current) * 0.35
      } else {
        lVal.current += (0.02 - lVal.current) * 0.1
        rVal.current += (0.02 - rVal.current) * 0.1
      }
      if (lBarRef.current) lBarRef.current.style.width = `${lVal.current * 100}%`
      if (rBarRef.current) rBarRef.current.style.width = `${rVal.current * 100}%`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  const vuRow = (label, barRef) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: color + 'aa', letterSpacing: '0.1em', width: '8px', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${color}33`, borderRadius: '2px', overflow: 'hidden' }}>
        <div ref={barRef} style={{ height: '100%', width: '2%', background: `linear-gradient(90deg, ${color}bb 0%, ${color} 70%, #ffffff 100%)`, boxShadow: `0 0 8px ${color}88`, borderRadius: '1px' }} />
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {vuRow('L', lBarRef)}
      {vuRow('R', rBarRef)}
    </div>
  )
}

// ─── Speaker Grille ───────────────────────────────────────────────────────────
function SpeakerGrille({ color }) {
  const dots = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) dots.push(`${r}-${c}`)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 4px)', gridTemplateRows: 'repeat(4, 4px)', gap: '4px', opacity: 0.35 }}>
      {dots.map(k => <div key={k} style={{ width: '3px', height: '3px', borderRadius: '50%', background: color }} />)}
    </div>
  )
}

// ─── HUD Corner Brackets ──────────────────────────────────────────────────────
function HudBrackets({ color, size = 10 }) {
  const s = `${size}px`, w = '2px'
  const corners = [
    { top: 0,    left: 0,    borderTop: w, borderLeft: w    },
    { top: 0,    right: 0,   borderTop: w, borderRight: w   },
    { bottom: 0, left: 0,    borderBottom: w, borderLeft: w  },
    { bottom: 0, right: 0,   borderBottom: w, borderRight: w },
  ]
  return (
    <>
      {corners.map((style, i) => (
        <div key={i} style={{ position: 'absolute', width: s, height: s, ...style, borderStyle: 'solid', borderColor: color, opacity: 0.7 }} />
      ))}
    </>
  )
}

// ─── REC Status Dot ───────────────────────────────────────────────────────────
function RecDot({ active, color }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? color : 'rgba(255,255,255,0.15)', boxShadow: active ? `0 0 6px ${color}, 0 0 12px ${color}66` : 'none', display: 'inline-block', animation: active ? 'recBlink 1.2s ease-in-out infinite' : 'none' }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', letterSpacing: '0.15em', color: active ? color : 'rgba(255,255,255,0.2)' }}>
        {active ? 'REC' : 'SBY'}
      </span>
    </span>
  )
}

// ─── EQ Slider Panel ─────────────────────────────────────────────────────────
function EQSliderPanel({ color, eqGains, onGainChange, onPreset }) {
  return (
    <motion.div
      key="eq-panel"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.62)',
        border: `1px solid ${color}22`,
        borderTop: `1px solid ${color}44`,
        borderLeft: `1px solid ${color}44`,
        padding: '12px',
        marginTop: '10px',
        backdropFilter: 'blur(12px)',
        borderRadius: '4px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color, letterSpacing: '0.15em' }}>EQ  MIXER</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: color + '66', letterSpacing: '0.1em' }}>±12 dB</span>
      </div>

      {/* Preset buttons */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {Object.keys(EQ_PRESETS).map(name => (
          <button
            key={name}
            onClick={() => onPreset(name)}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '7px',
              padding: '3px 7px', borderRadius: '3px', cursor: 'pointer',
              letterSpacing: '0.1em',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.4) 100%)',
              color, border: `1px solid ${color}44`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 8px ${color}44` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = color + '44'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)' }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Vertical sliders */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
        {EQ_BANDS.map((band, i) => {
          const gain = eqGains[i] ?? 0
          const isPositive = gain > 0
          const isNegative = gain < 0
          return (
            <div key={band.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
              {/* dB readout */}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '7px',
                color: isPositive ? color : isNegative ? color + 'aa' : color + '55',
                letterSpacing: '0.05em', minHeight: '10px', textAlign: 'center',
              }}>
                {gain > 0 ? `+${gain}` : gain !== 0 ? gain : '0'}
              </span>

              {/* Vertical range input */}
              <div style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Track background */}
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '80px', background: color + '22', borderRadius: '1px' }} />
                {/* Zero line */}
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '1px', background: color + '44' }} />
                {/* Filled portion */}
                {gain !== 0 && (
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    background: color,
                    boxShadow: `0 0 4px ${color}88`,
                    borderRadius: '1px',
                    ...(gain > 0
                      ? { bottom: '50%', height: `${(gain / 12) * 40}px` }
                      : { top: '50%',    height: `${(-gain / 12) * 40}px` }),
                  }} />
                )}
                <input
                  type="range"
                  min="-12" max="12" step="0.5"
                  value={gain}
                  onChange={e => onGainChange(i, parseFloat(e.target.value))}
                  style={{
                    position: 'absolute',
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    WebkitAppearance: 'slider-vertical',
                    height: '80px',
                    width: '20px',
                    cursor: 'pointer',
                    opacity: 0,
                    zIndex: 2,
                  }}
                />
                {/* Thumb indicator */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: `${50 - (gain / 12) * 50}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '10px', height: '4px',
                  background: color,
                  borderRadius: '2px',
                  boxShadow: `0 0 6px ${color}88`,
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />
              </div>

              {/* Frequency label */}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: color + '77', letterSpacing: '0.05em', textAlign: 'center' }}>
                {band.label}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MusicPlayer() {
  const [expanded, setExpanded]         = useState(false)
  const [hidden, setHidden]             = useState(false)
  const [playing, setPlaying]           = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress]         = useState(0)
  const [currentTime, setCurrentTime]   = useState(0)
  const [duration, setDuration]         = useState(0)
  const [volume, setVolume]             = useState(0.7)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [showAddTrack, setShowAddTrack] = useState(false)
  const [showEQ, setShowEQ]             = useState(false)
  const [playlist, setPlaylist]         = useState(getPlaylist)
  const [addForm, setAddForm]           = useState({ title: '', artist: '', url: '', source: 'upload' })
  const [dragFiles, setDragFiles]       = useState(false)
  const [color, setColor]               = useState(() => localStorage.getItem(COLOR_KEY) || COLORS[0].hex)
  const [eqGains, setEqGains]           = useState([0, 0, 0, 0, 0, 0])
  const [showScWidget, setShowScWidget] = useState(false)
  const [scWidgetUrl, setScWidgetUrl]   = useState('')
  const [scEmbedUrl, setScEmbedUrl]     = useState('')

  const playerRef      = useRef(null)
  const vinylRef       = useRef(null)
  const vinylRot       = useRef(0)
  const animFrameRef   = useRef(null)
  const audioCtxRef    = useRef(null)
  const filtersRef     = useRef([])
  const audioSourceRef = useRef(null)

  const track = playlist[currentTrack] || null

  const pickColor = (hex) => { setColor(hex); localStorage.setItem(COLOR_KEY, hex) }

  // ── Web Audio EQ setup ────────────────────────────────────────────────────
  const setupWebAudio = useCallback(() => {
    if (audioCtxRef.current) return
    try {
      const internal = playerRef.current?.getInternalPlayer()
      if (!(internal instanceof HTMLAudioElement)) return
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const source = ctx.createMediaElementSource(internal)
      audioSourceRef.current = source

      const filters = EQ_BANDS.map(band => {
        const f = ctx.createBiquadFilter()
        f.type = band.type
        f.frequency.value = band.freq
        f.Q.value = 1.4
        f.gain.value = 0
        return f
      })
      filtersRef.current = filters

      // chain source → f0 → f1 → ... → destination
      source.connect(filters[0])
      filters.reduce((prev, curr) => { prev.connect(curr); return curr })
      filters[filters.length - 1].connect(ctx.destination)

      audioCtxRef.current = ctx
      ctx.resume()
    } catch {
      // Silently fail — visual EQ still works for streaming sources
    }
  }, [])

  const updateGain = useCallback((index, value) => {
    setEqGains(prev => {
      const next = [...prev]
      next[index] = value
      // Apply to Web Audio filter if available
      const filter = filtersRef.current[index]
      if (filter) filter.gain.setTargetAtTime(value, audioCtxRef.current.currentTime, 0.01)
      return next
    })
  }, [])

  const applyPreset = useCallback((name) => {
    const gains = EQ_PRESETS[name]
    if (!gains) return
    setEqGains([...gains])
    filtersRef.current.forEach((f, i) => {
      if (f && audioCtxRef.current) f.gain.setTargetAtTime(gains[i], audioCtxRef.current.currentTime, 0.01)
    })
  }, [])

  // ── Vinyl rotation ────────────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      if (playing) {
        vinylRot.current += 0.5
        if (vinylRef.current) vinylRef.current.style.transform = `rotate(${vinylRot.current}deg)`
      }
      animFrameRef.current = requestAnimationFrame(animate)
    }
    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [playing])

  const togglePlay = useCallback(() => {
    if (!track) return
    if (!playing) setupWebAudio()
    setPlaying(p => !p)
  }, [track, playing, setupWebAudio])

  const nextTrack  = useCallback(() => { if (!playlist.length) return; setCurrentTrack(t => (t + 1) % playlist.length); setProgress(0); setCurrentTime(0) }, [playlist.length])
  const prevTrack  = useCallback(() => { if (!playlist.length) return; setCurrentTrack(t => (t - 1 + playlist.length) % playlist.length); setProgress(0); setCurrentTime(0) }, [playlist.length])

  const seekTo             = (pct) => { if (playerRef.current) playerRef.current.seekTo(pct) }
  const handleProgress     = (s)   => { setCurrentTime(s.playedSeconds); setProgress(s.played) }
  const handleDuration     = (d)   => setDuration(d)
  const handleVolumeChange = (v)   => setVolume(v)

  const handleFileUpload = (e) => {
    const files = e.target.files || e.dataTransfer?.files
    if (!files || files.length === 0) return
    const newTracks = []
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('audio/')) return
      newTracks.push({ title: file.name.replace(/\.[^/.]+$/, ''), artist: 'RAEHDOJHN', url: URL.createObjectURL(file), source: 'upload' })
    })
    if (newTracks.length > 0) {
      const updated = [...playlist, ...newTracks]
      setPlaylist(updated)
      savePlaylist(updated.map(t => t.source === 'upload' ? { ...t, url: '' } : t))
      setShowAddTrack(false)
      setDragFiles(false)
      setCurrentTrack(updated.length - newTracks.length)
      setPlaying(true)
    }
  }

  const addTrackFromURL = (e) => {
    e.preventDefault()
    if (!addForm.url) return
    const newTrack = { title: addForm.title || 'Untitled', artist: addForm.artist || 'Unknown', url: addForm.url, source: addForm.source }
    const updated  = [...playlist, newTrack]
    setPlaylist(updated)
    savePlaylist(updated)
    setAddForm({ title: '', artist: '', url: '', source: 'url' })
    setShowAddTrack(false)
    setCurrentTrack(updated.length - 1)
    setPlaying(true)
  }

  const removeTrack = (index) => {
    const updated = playlist.filter((_, i) => i !== index)
    setPlaylist(updated)
    savePlaylist(updated)
    if (currentTrack >= updated.length) setCurrentTrack(Math.max(0, updated.length - 1))
  }

  const playTrackAt   = (index) => { setCurrentTrack(index); setPlaying(true); setShowPlaylist(false) }
  const handleDragOver  = (e) => { e.preventDefault(); setDragFiles(true) }
  const handleDragLeave = ()  => setDragFiles(false)
  const handleDrop      = (e) => { e.preventDefault(); handleFileUpload(e) }

  const exportPlaylist = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(playlist, null, 2))
    const a = document.createElement('a')
    a.setAttribute('href', dataStr); a.setAttribute('download', 'playlist.json')
    document.body.appendChild(a); a.click(); a.remove()
    alert('Downloaded playlist.json! Drag this file into your `src/data/` folder and commit it to instantly deploy this music.')
  }

  const sourceIcon = (src) => ({ soundcloud: '☁', spotify: '●', youtube: '▶' }[src] ?? '♫')

  // ── Hidden pill ─────────────────────────────────────────────────────────────
  if (hidden) {
    return (
      <motion.button className="gp-show-btn" onClick={() => setHidden(false)}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, borderColor: color }} transition={{ duration: 0.3, ease: EASE }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <span className="mono-tag" style={{ fontSize: '8px', letterSpacing: '0.15em' }}>PLAYER</span>
      </motion.button>
    )
  }

  // ── Hardware button helper ────────────────────────────────────────────────
  const hwBtn = (label, active, onClick) => (
    <button key={label} onClick={onClick} style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
      background: active
        ? `linear-gradient(180deg, ${color}cc 0%, ${color}88 100%)`
        : 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.5) 100%)',
      color: active ? '#000' : color,
      padding: '5px 10px', border: `1px solid ${active ? color : color + '44'}`, borderRadius: '4px',
      cursor: 'pointer', letterSpacing: '0.1em',
      boxShadow: active ? `0 0 10px ${color}55, inset 0 -1px 0 rgba(0,0,0,0.3)` : 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
      transition: 'all 0.15s ease',
    }}>{label}</button>
  )

  // ── Transport button helper ───────────────────────────────────────────────
  const transBtn = (onClick, label, children) => (
    <button onClick={onClick} aria-label={label} style={{
      width: '34px', height: '34px', borderRadius: '6px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 100%)',
      border: `1px solid ${color}33`, color: 'var(--text-primary)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'transform 0.08s ease',
    }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.94)' }}
      onMouseUp={e   => { e.currentTarget.style.transform = 'scale(1)' }}
    >{children}</button>
  )

  // ── Player ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes recBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        .gp-lcd-scanlines::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
          background: repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(0,0,0,0.18) 1px, rgba(0,0,0,0.18) 2px);
        }
      `}</style>

      <motion.div
        className={`gp ${expanded ? 'gp--expanded' : 'gp--mini gp--quiet'}`}
        key="music-player-core"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        drag dragListener={!expanded} dragMomentum={false}
        dragConstraints={{ left: -400, right: 400, top: -200, bottom: 200 }}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {dragFiles && (
            <motion.div key="drag-overlay" className="gp__drag-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="gp__drag-content">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                <span className="mono-tag" style={{ color }}>DROP AUDIO FILES</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="gp__shimmer" aria-hidden="true" />

        {/* ── Device header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${color}33`, paddingBottom: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', letterSpacing: '0.2em', color: color + 'bb' }}>GP-7000</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-primary)' }}>RAEHDOJHN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RecDot active={playing} color={color} />
            <div style={{ width: '1px', height: '14px', background: color + '33' }} />
            <button className="gp__ctrl" onClick={() => setExpanded(e => !e)} title={expanded ? 'Minimize' : 'Expand'}>
              <svg width="10" height="10" viewBox="0 0 10 10">{expanded ? <path d="M1 3L5 7L9 3" fill="none" stroke="currentColor" strokeWidth="1.5"/> : <path d="M1 7L5 3L9 7" fill="none" stroke="currentColor" strokeWidth="1.5"/>}</svg>
            </button>
            <button className="gp__ctrl" onClick={() => setShowPlaylist(s => !s)} title="Playlist">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><line x1="0" y1="2" x2="10" y2="2"/><line x1="0" y1="5" x2="7" y2="5"/><line x1="0" y1="8" x2="10" y2="8"/></svg>
            </button>
            <button className="gp__ctrl" onClick={() => setHidden(true)} title="Hide">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/></svg>
            </button>
          </div>
        </div>

        {/* ── Color swatches ── */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px', alignItems: 'center' }}>
          {COLORS.map(c => (
            <button key={c.id} title={c.label} onClick={() => pickColor(c.hex)} style={{
              width: color === c.hex ? '16px' : '10px', height: color === c.hex ? '16px' : '10px',
              borderRadius: '50%', background: c.hex,
              border: color === c.hex ? `2px solid ${c.hex}` : '2px solid transparent',
              boxShadow: color === c.hex ? `0 0 8px ${c.hex}88, 0 0 16px ${c.hex}44` : 'none',
              cursor: 'pointer', padding: 0, transition: 'all 0.18s ease', flexShrink: 0,
            }} />
          ))}
        </div>

        {/* ── LCD song display ── */}
        <div className="gp-lcd-scanlines" style={{ position: 'relative', background: 'rgba(0,0,0,0.82)', border: `1px solid ${color}44`, borderRadius: '4px', padding: '10px 12px', marginBottom: '12px', boxShadow: `inset 0 2px 8px rgba(0,0,0,0.6), inset 0 0 12px ${color}11`, overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color, textShadow: `0 0 10px ${color}cc, 0 0 20px ${color}66`, letterSpacing: '0.08em', textTransform: 'uppercase', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginBottom: '3px' }}>
              {track ? track.title : 'NO SIGNAL'}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: color + '99', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {track ? `${sourceIcon(track.source)}  ${track.artist}` : 'DRAG & DROP AUDIO'}
            </div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
              {['FLAC', '24bit', '96kHz'].map(badge => (
                <span key={badge} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color, background: `${color}18`, border: `1px solid ${color}44`, padding: '1px 5px', borderRadius: '2px', letterSpacing: '0.1em' }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Vinyl + VU + Grille ── */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div className={`gp__vinyl ${playing ? 'gp__vinyl--spin' : ''}`}>
              <div className="gp__vinyl-disc" ref={vinylRef}>
                <div className="gp__vinyl-grooves" />
                <div className="gp__vinyl-label" style={{ background: `linear-gradient(135deg, ${color}bb 0%, ${color}66 100%)`, border: `2px solid ${color}` }}>
                  <span className="gp__vinyl-text" style={{ color: '#fff', textShadow: `0 0 8px ${color}` }}>RAE</span>
                </div>
              </div>
              <div className="gp__tonearm-wrap"><div className={`gp__tonearm ${playing ? 'gp__tonearm--on' : ''}`} /></div>
            </div>
            <HudBrackets color={color} size={10} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <VUMeters isPlaying={playing} color={color} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SpeakerGrille color={color} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end', marginLeft: 'auto' }}>
                {['–6', '–12', '–18'].map(db => (
                  <span key={db} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: color + '55' }}>{db}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── EQ Canvas Display ── */}
        <div style={{ margin: '8px 0', borderTop: `1px solid ${color}22`, borderBottom: `1px solid ${color}22`, padding: '6px 0', background: 'rgba(0,0,0,0.4)', borderRadius: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: color + '66', letterSpacing: '0.15em' }}>EQ</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: color + '66', letterSpacing: '0.1em' }}>24-BAND</span>
          </div>
          <EQDisplay isPlaying={playing} color={color} eqGains={eqGains} />
        </div>

        {/* ── Waveform (includes time row) ── */}
        <div style={{ margin: '10px 0' }}>
          <WaveformProgress progress={progress} duration={duration} onSeek={seekTo} accentColor={color} />
        </div>

        {/* ── Transport ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '14px' }}>
          {transBtn(prevTrack, 'Previous',
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="19,20 9,12 19,4"/><rect x="5" y="4" width="2" height="16"/></svg>
          )}

          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}88 60%, ${color}44)`,
            border: `2px solid ${color}`,
            boxShadow: `0 4px 20px ${color}55, 0 0 30px ${color}33, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.3)`,
            color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'box-shadow 0.15s ease, transform 0.08s ease',
          }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.94)' }}
            onMouseUp={e   => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {playing
              ? <span style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>❚❚</span>
              : <span style={{ fontSize: '18px', marginLeft: '3px' }}>▶</span>}
          </button>

          {transBtn(nextTrack, 'Next',
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,4 15,12 5,20"/><rect x="17" y="4" width="2" height="16"/></svg>
          )}

          <AnimatePresence>
            {expanded && (
              <motion.div key="rotary" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <RotaryKnob value={volume} onChange={handleVolumeChange} size={36} accentColor={color} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Hardware bottom buttons ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div key="hw-btns" style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '14px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {hwBtn('EQ',      showEQ,        () => setShowEQ(s => !s))}
              {hwBtn('PL',      showPlaylist,  () => setShowPlaylist(s => !s))}
              {hwBtn('⏏ ADD',  showAddTrack,  () => setShowAddTrack(s => !s))}
              {hwBtn('☁ SC',   showScWidget,  () => setShowScWidget(s => !s))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── EQ Slider Panel ── */}
        <AnimatePresence>
          {showEQ && expanded && (
            <EQSliderPanel
              color={color}
              eqGains={eqGains}
              onGainChange={updateGain}
              onPreset={applyPreset}
            />
          )}
        </AnimatePresence>

        {/* ── Playlist panel ── */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div key="playlist-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}22`, borderTop: `1px solid ${color}44`, borderLeft: `1px solid ${color}44`, padding: '8px', marginTop: '12px', overflow: 'hidden', backdropFilter: 'blur(12px)', borderRadius: '4px' }}>
              <div style={{ background: `linear-gradient(90deg, ${color}44 0%, ${color}11 100%)`, padding: '3px 6px', marginBottom: '8px', borderRadius: '2px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color, letterSpacing: '0.12em' }}>PLAYLIST  ({playlist.length})</span>
              </div>
              {playlist.length === 0 ? (
                <p style={{ fontFamily: "'JetBrains Mono', monospace", padding: '14px 8px', textAlign: 'center', color, fontSize: '8px', letterSpacing: '0.1em' }}>NO TRACKS LOADED — [⏏ ADD]</p>
              ) : (
                <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  {playlist.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', background: i === currentTrack ? `${color}22` : 'transparent', color: i === currentTrack ? color : 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', cursor: 'pointer', borderLeft: i === currentTrack ? `2px solid ${color}` : '2px solid transparent', marginBottom: '1px' }}>
                      <div onClick={() => playTrackAt(i)} style={{ flex: 1, display: 'flex', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <span style={{ opacity: 0.5 }}>{String(i + 1).padStart(2, '0')}.</span>
                        <span>{i === currentTrack && playing ? '► ' : '  '}{t.artist} — {t.title}</span>
                      </div>
                      <button onClick={() => removeTrack(i)} style={{ background: 'none', border: 'none', color: i === currentTrack ? color : 'var(--text-muted)', cursor: 'pointer', padding: '0 4px', opacity: 0.6 }}>✕</button>
                    </div>
                  ))}
                  {playlist.length > 0 && (
                    <button onClick={exportPlaylist} style={{ width: '100%', marginTop: '8px', padding: '6px', background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.3) 100%)', color, border: `1px solid ${color}44`, cursor: 'pointer', fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', borderRadius: '3px' }}>
                      ↓  EXPORT DEPLOYABLE PLAYLIST
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Add Track panel ── */}
        <AnimatePresence>
          {showAddTrack && expanded && (
            <motion.div key="add-track-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}22`, borderTop: `1px solid ${color}44`, borderLeft: `1px solid ${color}44`, padding: '12px', marginTop: '12px', overflow: 'hidden', backdropFilter: 'blur(12px)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {['upload', 'soundcloud', 'youtube', 'url'].map(src => (
                  <button key={src} onClick={() => setAddForm(f => ({ ...f, source: src }))} style={{
                    flex: 1, padding: '4px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', cursor: 'pointer', letterSpacing: '0.08em',
                    background: addForm.source === src ? `linear-gradient(180deg, ${color}cc 0%, ${color}88 100%)` : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)',
                    color: addForm.source === src ? '#000' : color, border: `1px solid ${addForm.source === src ? color : color + '44'}`, borderRadius: '3px',
                  }}>{src.toUpperCase()}</button>
                ))}
              </div>
              {addForm.source === 'upload' ? (
                <div style={{ border: `1px dashed ${color}66`, padding: '20px 12px', textAlign: 'center', background: `${color}08`, borderRadius: '4px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '18px' }}>⏏</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color, letterSpacing: '0.1em' }}>CLICK OR DROP AUDIO</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>MP3  WAV  FLAC  OGG</span>
                    <input type="file" accept="audio/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              ) : (
                <form onSubmit={addTrackFromURL} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${color}44`, padding: '6px 8px', color, fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', outline: 'none', borderRadius: '3px' }}
                    placeholder={addForm.source === 'soundcloud' ? 'SOUNDCLOUD URL...' : addForm.source === 'youtube' ? 'YOUTUBE URL...' : 'DIRECT AUDIO URL...'}
                    value={addForm.url} onChange={e => setAddForm(f => ({ ...f, url: e.target.value }))} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: `1px solid ${color}44`, padding: '6px 8px', color, fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', outline: 'none', borderRadius: '3px' }} placeholder="TITLE" value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} />
                    <input style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: `1px solid ${color}44`, padding: '6px 8px', color, fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', outline: 'none', borderRadius: '3px' }} placeholder="ARTIST" value={addForm.artist} onChange={e => setAddForm(f => ({ ...f, artist: e.target.value }))} />
                  </div>
                  <button type="submit" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.4) 100%)', border: `1px solid ${color}55`, padding: '8px', color, fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', cursor: 'pointer', borderRadius: '3px', letterSpacing: '0.1em' }}>
                    [+]  ADD TO PLAYLIST
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SoundCloud Widget Panel ── */}
        <AnimatePresence>
          {showScWidget && expanded && (
            <motion.div key="sc-widget-panel"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}22`, borderTop: `1px solid ${color}44`, borderLeft: `1px solid ${color}44`, padding: '12px', marginTop: '12px', overflow: 'hidden', backdropFilter: 'blur(12px)', borderRadius: '4px' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', letterSpacing: '0.2em', color }}>
                  ☁ SOUNDCLOUD WIDGET
                </span>
                <div style={{ flex: 1, height: '1px', background: color + '33' }} />
              </div>

              {/* URL input row */}
              <form
                onSubmit={e => {
                  e.preventDefault()
                  const raw = scWidgetUrl.trim()
                  if (!raw) return
                  // Build SoundCloud oEmbed-style embed URL
                  const encoded = encodeURIComponent(raw)
                  setScEmbedUrl(
                    `https://w.soundcloud.com/player/?url=${encoded}` +
                    `&color=${color.replace('#', '')}&auto_play=true&hide_related=false` +
                    `&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`
                  )
                }}
                style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}
              >
                <input
                  style={{
                    flex: 1, background: 'rgba(0,0,0,0.5)', border: `1px solid ${color}44`,
                    padding: '6px 8px', color, fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '8px', outline: 'none', borderRadius: '3px',
                  }}
                  placeholder="PASTE SOUNDCLOUD TRACK OR PLAYLIST URL..."
                  value={scWidgetUrl}
                  onChange={e => setScWidgetUrl(e.target.value)}
                />
                <button type="submit" style={{
                  padding: '6px 10px', background: `linear-gradient(180deg, ${color}cc 0%, ${color}88 100%)`,
                  border: `1px solid ${color}`, color: '#000', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '8px', cursor: 'pointer', borderRadius: '3px', letterSpacing: '0.1em', fontWeight: 700,
                }}>▶ LOAD</button>
              </form>

              {/* Hint */}
              {!scEmbedUrl && (
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: color + '77', letterSpacing: '0.08em', textAlign: 'center', margin: 0 }}>
                  Supports any public SoundCloud track, set, or playlist URL
                </p>
              )}

              {/* Live embed */}
              {scEmbedUrl && (
                <div style={{ borderRadius: '4px', overflow: 'hidden', border: `1px solid ${color}33` }}>
                  <iframe
                    key={scEmbedUrl}
                    allow="autoplay"
                    src={scEmbedUrl}
                    style={{ width: '100%', height: '166px', border: 'none', display: 'block' }}
                    title="SoundCloud Widget"
                  />
                  <button
                    onClick={() => { setScEmbedUrl(''); setScWidgetUrl('') }}
                    style={{
                      width: '100%', padding: '5px', background: 'rgba(0,0,0,0.5)',
                      border: 'none', borderTop: `1px solid ${color}22`,
                      color: color + '88', fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '7px', cursor: 'pointer', letterSpacing: '0.1em',
                    }}
                  >
                    ✕ CLEAR
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {track && (
          <div style={{ display: 'none' }}>
            <ReactPlayer ref={playerRef} url={track.url} playing={playing} volume={volume}
              onProgress={handleProgress} onDuration={handleDuration} onEnded={nextTrack}
              width="0" height="0"
              config={{
                file: { forceAudio: true },
                youtube: { playerVars: { origin: typeof window !== 'undefined' ? window.location.origin : '' } }
              }}
            />
          </div>
        )}
      </motion.div>
    </>
  )
}
