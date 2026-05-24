import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import V4ChaosWidgets from './V4ChaosWidgets'
import { setV4PlayerTheme } from './useV4PlayerPaletteTheme'

// ── Quick theme palette ────────────────────────────────────────────────────────
const QUICK_THEMES = [
  { id: 'sound-room',           label: 'Dark',     dot: '#0a0a0a',  dot2: '#18d4ff' },
  { id: 'charcoal',             label: 'Charcoal', dot: '#050505',  dot2: '#9bd9f5' },
  { id: 'showdown-tracklist',   label: 'Cobalt',   dot: '#19265A',  dot2: '#E74A26' },
  { id: 'amber-crt',            label: 'Amber',    dot: '#140b00',  dot2: '#ffd27f' },
  { id: 'mint-hud',             label: 'Mint',     dot: '#091310',  dot2: '#78ffbf' },
  { id: 'ty-kawabe',            label: 'Neon',     dot: '#050505',  dot2: '#f4f000' },
  { id: 'elite-designs',        label: 'Cream',    dot: '#ede8e3',  dot2: '#c94135' },
  { id: 'off-white',            label: 'Light',    dot: '#f4f4f4',  dot2: '#ffdb00' },
  { id: 'inverse',              label: 'White',    dot: '#fafafa',  dot2: '#205cff' },
]

const THEME_LS_KEY = 'rae-v4-theme-id'

function readQuickTheme() {
  try { return localStorage.getItem(THEME_LS_KEY) || 'sound-room' } catch { return 'sound-room' }
}

function setQuickTheme(id) {
  try {
    localStorage.setItem(THEME_LS_KEY, id)
    document.documentElement.setAttribute('data-archive-theme', id)
    // Also update the player palette
    setV4PlayerTheme(id)
  } catch {}
}

const CHAOS_FILES = [
  { id: 'f-01', label: 'LOOKBOOK_001.psd', kind: 'image' },
  { id: 'f-02', label: 'notes-on-chaos.txt', kind: 'note' },
  { id: 'f-03', label: 'wire_v4.sketch', kind: 'doc' },
  { id: 'f-04', label: 'untitled-final-final.zip', kind: 'archive' },
  { id: 'f-05', label: 'screen-grab_044.png', kind: 'image' },
  { id: 'f-06', label: 'brand-tokens.csv', kind: 'doc' },
  { id: 'f-07', label: 'folder-moods', kind: 'folder' },
]

/* ── macOS Big Sur–style dock icons ── */

/* Finder: blue gradient bg + two-tone smiley faces */
function IconFinder() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="gf-bg" x1="0" y1="0" x2="55" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#70CBFA" />
          <stop offset="1" stopColor="#0B65CE" />
        </linearGradient>
        <linearGradient id="gf-lface" x1="14" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAF6FF" />
          <stop offset="1" stopColor="#B8DFF5" />
        </linearGradient>
        <linearGradient id="gf-rface" x1="28" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B9FD4" />
          <stop offset="1" stopColor="#2A6FAF" />
        </linearGradient>
        <clipPath id="gf-clip">
          <rect width="60" height="60" rx="13" />
        </clipPath>
      </defs>
      {/* Background */}
      <rect width="60" height="60" rx="13" fill="url(#gf-bg)" />
      {/* All content clipped to squircle */}
      <g clipPath="url(#gf-clip)">
        {/* Right face (behind left) */}
        <ellipse cx="38" cy="32" rx="15" ry="18" fill="url(#gf-rface)" />
        {/* Left face (on top) */}
        <ellipse cx="24" cy="32" rx="15" ry="18" fill="url(#gf-lface)" />
        {/* Left face eyes */}
        <ellipse cx="20" cy="28" rx="2.4" ry="2.6" fill="#1B4E82" />
        <ellipse cx="28" cy="28" rx="2.4" ry="2.6" fill="#1B4E82" />
        {/* Left eye highlights */}
        <circle cx="21" cy="27" r="0.9" fill="rgba(255,255,255,0.65)" />
        <circle cx="29" cy="27" r="0.9" fill="rgba(255,255,255,0.65)" />
        {/* Left smile */}
        <path d="M18 36 Q24 42 30 36" stroke="#1B4E82" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Right face eyes */}
        <ellipse cx="35" cy="28" rx="2.4" ry="2.6" fill="#0A1F38" />
        <ellipse cx="43" cy="28" rx="2.4" ry="2.6" fill="#0A1F38" />
        {/* Right eye highlights */}
        <circle cx="36" cy="27" r="0.9" fill="rgba(255,255,255,0.5)" />
        <circle cx="44" cy="27" r="0.9" fill="rgba(255,255,255,0.5)" />
        {/* Right smile */}
        <path d="M33 36 Q38 42 45 36" stroke="#0A1F38" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Top gloss */}
        <ellipse cx="30" cy="8" rx="24" ry="8" fill="rgba(255,255,255,0.1)" />
      </g>
    </svg>
  )
}

/* Terminal: near-black gradient + traffic dots + >_ prompt */
function IconTerminal() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="gt-bg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#484848" />
          <stop offset="1" stopColor="#1C1C1C" />
        </linearGradient>
        <clipPath id="gt-clip">
          <rect width="60" height="60" rx="13" />
        </clipPath>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#gt-bg)" />
      <g clipPath="url(#gt-clip)">
        {/* Title bar band */}
        <rect x="0" y="0" width="60" height="18" fill="rgba(255,255,255,0.06)" />
        {/* Traffic lights */}
        <circle cx="13" cy="10" r="4" fill="#FF5F57" />
        <circle cx="13" cy="10" r="1.6" fill="rgba(0,0,0,0.18)" />
        <circle cx="23" cy="10" r="4" fill="#FEBC2E" />
        <circle cx="23" cy="10" r="1.6" fill="rgba(0,0,0,0.15)" />
        <circle cx="33" cy="10" r="4" fill="#28C840" />
        <circle cx="33" cy="10" r="1.6" fill="rgba(0,0,0,0.18)" />
        {/* Chevron prompt */}
        <path d="M9 36 L18 28 L9 20" stroke="#4AFA72" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Cursor line */}
        <rect x="22" y="32" width="14" height="3" rx="1.5" fill="#4AFA72" opacity="0.85" />
        {/* Top gloss */}
        <ellipse cx="30" cy="4" rx="22" ry="5" fill="rgba(255,255,255,0.06)" />
      </g>
    </svg>
  )
}

/* Folder: macOS Big Sur sky-blue folder with 3-D depth */
function IconFolder() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="gfo-back" x1="6" y1="14" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#62C8F5" />
          <stop offset="1" stopColor="#2888DC" />
        </linearGradient>
        <linearGradient id="gfo-front" x1="6" y1="26" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#92DAFF" />
          <stop offset="1" stopColor="#4BAFF0" />
        </linearGradient>
        <clipPath id="gfo-clip">
          <rect width="60" height="60" rx="13" />
        </clipPath>
      </defs>
      <rect width="60" height="60" rx="13" fill="#D6EFFE" />
      <g clipPath="url(#gfo-clip)">
        {/* Folder back */}
        <path d="M6 22 Q6 16 12 16 H25 L30 11 H50 Q56 11 56 17 V48 Q56 54 50 54 H12 Q6 54 6 48 Z" fill="url(#gfo-back)" />
        {/* Folder front panel */}
        <rect x="6" y="26" width="50" height="28" rx="5" fill="url(#gfo-front)" />
        {/* Front top gloss */}
        <rect x="6" y="26" width="50" height="9" rx="5" fill="rgba(255,255,255,0.28)" />
        {/* Inner shadow at bottom */}
        <rect x="6" y="48" width="50" height="6" rx="5" fill="rgba(0,0,0,0.06)" />
      </g>
    </svg>
  )
}

/* Work / Launchpad: colorful grid of app icons on dark bg */
function IconDocument() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="gd-bg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1C1C2E" />
          <stop offset="1" stopColor="#0D0D1A" />
        </linearGradient>
        <clipPath id="gd-clip">
          <rect width="60" height="60" rx="13" />
        </clipPath>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#gd-bg)" />
      <g clipPath="url(#gd-clip)">
        {/* 3×3 mini-icon grid — Launchpad style */}
        {/* Row 1 */}
        <rect x="9"  y="10" width="12" height="12" rx="3" fill="#FF5F57" />
        <rect x="24" y="10" width="12" height="12" rx="3" fill="#FEBC2E" />
        <rect x="39" y="10" width="12" height="12" rx="3" fill="#28C840" />
        {/* Row 2 */}
        <rect x="9"  y="25" width="12" height="12" rx="3" fill="#007AFF" />
        <rect x="24" y="25" width="12" height="12" rx="3" fill="#AF52DE" />
        <rect x="39" y="25" width="12" height="12" rx="3" fill="#FF9F0A" />
        {/* Row 3 */}
        <rect x="9"  y="40" width="12" height="12" rx="3" fill="#32ADE6" />
        <rect x="24" y="40" width="12" height="12" rx="3" fill="#FF2D55" />
        <rect x="39" y="40" width="12" height="12" rx="3" fill="#30D158" />
        {/* Subtle white grid lines */}
        <line x1="6" y1="22" x2="54" y2="22" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="6" y1="37" x2="54" y2="37" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="21" y1="7" x2="21" y2="53" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="36" y1="7" x2="36" y2="53" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </g>
    </svg>
  )
}

/* Messages: green gradient + white speech bubble + typing dots */
function IconMessages() {
  return (
    <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="gm-bg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4EDF6A" />
          <stop offset="1" stopColor="#1DB942" />
        </linearGradient>
        <linearGradient id="gm-bubble" x1="10" y1="8" x2="52" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F0F0F0" />
        </linearGradient>
        <clipPath id="gm-clip">
          <rect width="60" height="60" rx="13" />
        </clipPath>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#gm-bg)" />
      <g clipPath="url(#gm-clip)">
        {/* Top gloss */}
        <ellipse cx="30" cy="8" rx="24" ry="8" fill="rgba(255,255,255,0.18)" />
        {/* Speech bubble body */}
        <path
          d="M10 13 Q10 7 16 7 H44 Q50 7 50 13 V33 Q50 39 44 39 H34 L24 53 V39 H16 Q10 39 10 33 Z"
          fill="url(#gm-bubble)"
        />
        {/* Bubble shadow */}
        <path
          d="M10 13 Q10 7 16 7 H44 Q50 7 50 13 V33 Q50 39 44 39 H34 L24 53 V39 H16 Q10 39 10 33 Z"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1"
        />
        {/* Typing indicator dots */}
        <circle cx="22" cy="23" r="3.8" fill="#28C840" />
        <circle cx="30" cy="23" r="3.8" fill="#28C840" />
        <circle cx="38" cy="23" r="3.8" fill="#28C840" />
      </g>
    </svg>
  )
}

const DOCK_ITEMS = [
  { id: 'main', label: 'Main', to: '/', kind: 'finder', iconSrc: '/v4-dock/Finder.png', Icon: IconFinder },
  { id: 'v4', label: 'V4', to: '/v4', kind: 'terminal', iconSrc: '/v4-dock/Terminal.png', Icon: IconTerminal },
  { id: 'archive', label: 'Archive', to: '/v4/archive', kind: 'folder', iconSrc: '/v4-dock/Folder.png', Icon: IconFolder },
  { id: 'work', label: 'Work', href: '#work', kind: 'doc', iconSrc: '/v4-dock/Figma.png', Icon: IconDocument },
  { id: 'contact', label: 'Contact', href: '#contact', kind: 'message', iconSrc: '/v4-dock/Mail.png', Icon: IconMessages },
]

const LAYOUT_STORAGE_KEY = 'v4-desktop-layout-mode'
const WIDGET_STORAGE_KEY = 'v4-desktop-widget-toggles'

const LAYOUT_OPTIONS = [
  { id: 'scatter', label: 'Scatter' },
  { id: 'stack', label: 'Stack' },
  { id: 'rail', label: 'Rail' },
]

const WIDGET_OPTIONS = [
  { id: 'trail', label: 'Trail' },
  { id: 'clock', label: 'Clock' },
]

const LAYOUT_PRESETS = {
  scatter: {
    'f-01': { x: '6%', y: '14%', rotate: '-8deg' },
    'f-02': { x: '16%', y: '58%', rotate: '7deg' },
    'f-03': { x: '33%', y: '10%', rotate: '-5deg' },
    'f-04': { x: '43%', y: '64%', rotate: '9deg' },
    'f-05': { x: '64%', y: '17%', rotate: '-6deg' },
    'f-06': { x: '78%', y: '56%', rotate: '6deg' },
    'f-07': { x: '87%', y: '24%', rotate: '-4deg' },
  },
  stack: {
    'f-01': { x: '7%', y: '12%', rotate: '-3deg' },
    'f-02': { x: '12%', y: '18%', rotate: '2deg' },
    'f-03': { x: '17%', y: '24%', rotate: '-2deg' },
    'f-04': { x: '72%', y: '12%', rotate: '4deg' },
    'f-05': { x: '76%', y: '20%', rotate: '-2deg' },
    'f-06': { x: '80%', y: '28%', rotate: '3deg' },
    'f-07': { x: '84%', y: '36%', rotate: '-1deg' },
  },
  rail: {
    'f-01': { x: '8%', y: '12%', rotate: '-2deg' },
    'f-02': { x: '8%', y: '33%', rotate: '1deg' },
    'f-03': { x: '8%', y: '54%', rotate: '-1deg' },
    'f-04': { x: '82%', y: '14%', rotate: '3deg' },
    'f-05': { x: '82%', y: '35%', rotate: '-2deg' },
    'f-06': { x: '82%', y: '56%', rotate: '2deg' },
    'f-07': { x: '66%', y: '18%', rotate: '-4deg' },
  },
}

function formatMenuTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function readLayoutMode() {
  if (typeof window === 'undefined') return 'scatter'

  try {
    const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY)
    return stored && LAYOUT_PRESETS[stored] ? stored : 'scatter'
  } catch {
    return 'scatter'
  }
}

function readWidgetState() {
  if (typeof window === 'undefined') return { trail: false, clock: false }

  try {
    const raw = window.localStorage.getItem(WIDGET_STORAGE_KEY)
    if (!raw) return { trail: false, clock: false }
    const parsed = JSON.parse(raw)
    return {
      trail: Boolean(parsed?.trail),
      clock: Boolean(parsed?.clock),
    }
  } catch {
    return { trail: false, clock: false }
  }
}

function DockIcon({ item, pulsing }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <span
      className={`v4-dock__glyph v4-dock__glyph--mac ${pulsing ? 'is-pulse' : ''}`}
      aria-hidden="true"
    >
      {item.iconSrc && !imageFailed ? (
        <img
          className="v4-dock__icon"
          src={item.iconSrc}
          alt=""
          draggable="false"
          loading="eager"
          onError={() => setImageFailed(true)}
        />
      ) : (
        item.Icon ? <item.Icon /> : null
      )}
    </span>
  )
}

export default function V4DesktopShell() {
  const location = useLocation()
  const dockRef = useRef(null)
  const itemRefs = useRef({})
  const [menuTime, setMenuTime] = useState(() => formatMenuTime(new Date()))
  const [hoveredId, setHoveredId] = useState(null)
  const [dockMouseX, setDockMouseX] = useState(null)
  const [pulsingItem, setPulsingItem] = useState('')
  const [iconCenters, setIconCenters] = useState({})
  const [layoutMode, setLayoutMode] = useState(readLayoutMode)
  const [widgets, setWidgets] = useState(readWidgetState)
  const [activeTheme, setActiveTheme] = useState(readQuickTheme)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const onArchive = location.pathname.startsWith('/v4/archive')

  // Apply saved theme on mount
  useEffect(() => {
    setQuickTheme(activeTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyTheme = (id) => {
    setActiveTheme(id)
    setQuickTheme(id)
    setShowThemePicker(false)
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      setMenuTime(formatMenuTime(new Date()))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, layoutMode)
    } catch {
      /* ignore persistence failures */
    }
  }, [layoutMode])

  useEffect(() => {
    try {
      window.localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(widgets))
    } catch {
      /* ignore persistence failures */
    }
  }, [widgets])

  const measureDockCenters = useCallback(() => {
    const next = {}
    DOCK_ITEMS.forEach((entry) => {
      const node = itemRefs.current[entry.id]
      if (!node) return
      const rect = node.getBoundingClientRect()
      next[entry.id] = rect.left + rect.width / 2
    })
    setIconCenters(next)
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(measureDockCenters)
    window.addEventListener('resize', measureDockCenters)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', measureDockCenters)
    }
  }, [measureDockCenters])

  const triggerPulse = (id) => {
    setPulsingItem(id)
    window.setTimeout(() => {
      setPulsingItem((previous) => (previous === id ? '' : previous))
    }, 360)
  }

  const computeScale = (id) => {
    return id === hoveredId ? 1.34 : 1
  }

  const changeLayoutMode = (nextMode) => {
    setLayoutMode(nextMode)
  }

  const toggleWidget = (widgetId) => {
    setWidgets((previous) => ({
      ...previous,
      [widgetId]: !previous[widgetId],
    }))
  }

  return (
    <>
      <header className="v4-os-menubar" aria-label="V4 desktop menubar">
        <div className="v4-os-menubar-left">
          <span className="v4-os-menubar-item" style={{ fontWeight: 800 }}>RAEHDOJHN OS</span>
          <span className="v4-os-menubar-item">File</span>
          <span className="v4-os-menubar-item">Edit</span>
          <span className="v4-os-menubar-item">View</span>
          <span className="v4-os-menubar-item">Go</span>
          <span className="v4-os-menubar-item">Window</span>
          <span className="v4-os-menubar-item">Help</span>
        </div>
        <div className="v4-os-menubar-right" style={{ position: 'relative' }}>

          {/* Theme picker button */}
          <button
            className="v4-os-menubar-item v4-theme-menu-btn"
            onClick={() => setShowThemePicker(s => !s)}
            aria-label="Theme picker"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'inherit', font: 'inherit', padding: '0 8px',
            }}
          >
            {/* Active theme dot */}
            <span style={{
              display: 'inline-block', width: 12, height: 12, borderRadius: '50%',
              background: QUICK_THEMES.find(t => t.id === activeTheme)?.dot2 || '#18d4ff',
              border: '2px solid rgba(255,255,255,0.4)',
              boxShadow: `0 0 6px ${QUICK_THEMES.find(t => t.id === activeTheme)?.dot2 || '#18d4ff'}88`,
            }} />
            <span style={{ fontSize: 12 }}>
              {QUICK_THEMES.find(t => t.id === activeTheme)?.label || 'Theme'}
            </span>
          </button>

          {/* Theme picker dropdown */}
          {showThemePicker && (
            <div
              style={{
                position: 'absolute', top: 32, right: 0,
                background: 'rgba(16,16,20,0.96)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: '12px 10px',
                zIndex: 9999,
                minWidth: 220,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ fontSize: 9, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)', marginBottom: 10, padding: '0 4px', fontFamily: 'var(--font-mono)' }}>
                SELECT WALLPAPER
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {QUICK_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                      background: activeTheme === theme.id
                        ? `linear-gradient(135deg, ${theme.dot2}33, rgba(255,255,255,0.06))`
                        : 'rgba(255,255,255,0.04)',
                      border: activeTheme === theme.id
                        ? `1px solid ${theme.dot2}88`
                        : '1px solid rgba(255,255,255,0.08)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Mini wallpaper preview */}
                    <div style={{
                      width: 44, height: 28, borderRadius: 4, overflow: 'hidden',
                      background: `linear-gradient(135deg, ${theme.dot}, ${theme.dot2}66)`,
                      border: '1px solid rgba(255,255,255,0.12)',
                    }} />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Light/Dark quick toggle */}
              <div style={{ marginTop: 10, display: 'flex', gap: 6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
                <button
                  onClick={() => applyTheme('sound-room')}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 6, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.1em',
                  }}
                >
                  🌙 DARK
                </button>
                <button
                  onClick={() => applyTheme('off-white')}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 6, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.15)',
                    color: '#050505', fontSize: 10, fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.1em',
                  }}
                >
                  ☀️ LIGHT
                </button>
              </div>
            </div>
          )}

          <span className="v4-os-menubar-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <span className="v4-os-menubar-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </span>
          <span className="v4-os-menubar-item">{menuTime}</span>
        </div>
      </header>

      <div className="v4-os-desktop-icons">
        {CHAOS_FILES.map((item) => {
          return (
            <div key={item.id} className="v4-os-desktop-icon">
              <div className="icon-bg">
                {item.kind === 'folder' ? '📁' : item.kind === 'image' ? '🖼️' : '📄'}
              </div>
              <span className="icon-label">{item.label}</span>
            </div>
          )
        })}
      </div>

      <V4ChaosWidgets widgets={widgets} />

      <div className="v4-os-dock-container">
        <nav
          ref={dockRef}
          className="v4-os-dock"
          aria-label="V4 dock"
          onMouseEnter={measureDockCenters}
          onMouseMove={(event) => setDockMouseX(event.clientX)}
          onMouseLeave={() => {
            setHoveredId(null)
            setDockMouseX(null)
          }}
        >
          {DOCK_ITEMS.map((item) => {
            const active =
              (item.to && location.pathname === item.to) ||
              (item.href && location.hash === item.href)
            const scale = computeScale(item.id)

            const iconEl = <DockIcon item={item} pulsing={pulsingItem === item.id} />

            if (item.to) {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  ref={(node) => {
                    if (node) itemRefs.current[item.id] = node
                    else delete itemRefs.current[item.id]
                  }}
                  className="v4-os-dock-icon"
                  aria-label={item.label}
                  onClick={() => triggerPulse(item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {iconEl}
                </Link>
              )
            }

            return (
              <a
                key={item.id}
                href={item.href}
                ref={(node) => {
                  if (node) itemRefs.current[item.id] = node
                  else delete itemRefs.current[item.id]
                }}
                className="v4-os-dock-icon"
                aria-label={item.label}
                onClick={() => triggerPulse(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {iconEl}
              </a>
            )
          })}
        </nav>
      </div>
    </>
  )
}
