import { useState, useRef, useCallback, useEffect } from 'react'
import { motion as Motion, useMotionValue, useDragControls } from 'framer-motion'

// ── Default cascade positions (right of the 248px identity rail) ──────────────
const DEFAULT_POSITIONS = {
  'app-artifact': { x: 268, y: 50  },
  'app-playback': { x: 308, y: 80  },
  'app-ledger':   { x: 348, y: 110 },
  'app-prompt':   { x: 388, y: 140 },
  'app-lab':      { x: 428, y: 170 },
  'app-contact':  { x: 468, y: 200 },
}

const DEFAULT_WIDTH  = 720
const DEFAULT_HEIGHT = 560
const MIN_WIDTH      = 360
const MIN_HEIGHT     = 280

// ── LocalStorage helpers ──────────────────────────────────────────────────────
function readWinState(id, fallback) {
  try {
    const raw = localStorage.getItem(`v4-win-${id}`)
    if (!raw) return fallback
    const p = JSON.parse(raw)
    return {
      x: Number.isFinite(p?.x) ? p.x : fallback.x,
      y: Number.isFinite(p?.y) ? p.y : fallback.y,
      w: Number.isFinite(p?.w) ? p.w : fallback.w,
      h: Number.isFinite(p?.h) ? p.h : fallback.h,
    }
  } catch {
    return fallback
  }
}

function saveWinState(id, state) {
  try {
    localStorage.setItem(`v4-win-${id}`, JSON.stringify(state))
  } catch {
    // Storage can be unavailable in hardened/private browser contexts.
  }
}

// ── Global z-index counter for bring-to-front ─────────────────────────────────
let globalZ = 100
function nextZ() { return ++globalZ }

function isNoDragTarget(target) {
  return Boolean(target?.closest?.('button, a, input, textarea, select, label, [data-v4-no-drag]'))
}

function slugifyWindowTitle(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function V4WindowChrome({
  children,
  title       = 'Window',
  serial      = '',
  status      = 'Live',
  tone        = 'default',
  revealIndex = 0,
  windowId    = '',
  metaLabel   = '',
  metaValue   = '',
  chips       = [],
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [zIndex, setZIndex] = useState(20 + revealIndex)
  const [isDragging, setIsDragging] = useState(false)

  const dragControls = useDragControls()
  const resolvedWindowId = windowId || `v4-window-${revealIndex}-${slugifyWindowTitle(title) || 'untitled'}`

  const defaultPos = DEFAULT_POSITIONS[resolvedWindowId] || {
    x: 268 + revealIndex * 40,
    y:  50 + revealIndex * 30,
  }
  const saved = readWinState(resolvedWindowId, { ...defaultPos, w: DEFAULT_WIDTH, h: DEFAULT_HEIGHT })

  const x = useMotionValue(saved.x)
  const y = useMotionValue(saved.y)

  const [size, setSize] = useState({ w: saved.w, h: saved.h })
  const sizeRef = useRef(size)
  useEffect(() => { sizeRef.current = size }, [size])

  // ── Bring to front ────────────────────────────────────────────────────────
  const bringToFront = useCallback(() => {
    setZIndex(nextZ())
  }, [])

  // ── Save position after drag ──────────────────────────────────────────────
  const onDragEnd = useCallback(() => {
    setIsDragging(false)
    saveWinState(resolvedWindowId, { x: x.get(), y: y.get(), ...sizeRef.current })
  }, [resolvedWindowId, x, y])

  const startWindowDrag = useCallback((event) => {
    if (event.button !== 0 || isNoDragTarget(event.target)) return
    bringToFront()
    setIsDragging(true)
    dragControls.start(event)
  }, [bringToFront, dragControls])

  // ── Bottom-right resize handle ────────────────────────────────────────────
  const startResize = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const startMX = e.clientX
    const startMY = e.clientY
    const startW  = sizeRef.current.w
    const startH  = sizeRef.current.h

    const onMove = (me) => {
      setSize({
        w: Math.max(MIN_WIDTH,  startW + (me.clientX - startMX)),
        h: Math.max(MIN_HEIGHT, startH + (me.clientY - startMY)),
      })
    }
    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup',   onUp)
      saveWinState(resolvedWindowId, { x: x.get(), y: y.get(), ...sizeRef.current })
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup',   onUp)
  }, [resolvedWindowId, x, y])

  if (!isOpen) return null

  return (
    <Motion.div
      id={resolvedWindowId}
      className={`v4-os-window v4-window--${tone} ${isDragging ? 'is-dragging' : ''}`}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        x,
        y,
        width:  size.w,
        height: size.h,
        zIndex,
      }}
      drag
      dragControls={dragControls}
      dragElastic={0}
      dragMomentum={false}
      dragListener={false}
      onDragStart={() => {
        bringToFront()
        setIsDragging(true)
      }}
      onDragEnd={onDragEnd}
      onPointerDown={bringToFront}
    >
      {/* ── TITLEBAR (drag handle) ── */}
      <header
        className="v4-os-window-chrome"
        data-v4-shell-part="titlebar"
        onPointerDown={startWindowDrag}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none' }}
      >
        <div className="v4-os-traffic-lights">
          <button
            className="v4-os-traffic-light v4-os-tl-red"
            aria-label="Close window"
            onClick={() => setIsOpen(false)}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ padding: 0, margin: 0, cursor: 'pointer', background: '#FF5F56', border: '1px solid #E0443E' }}
          />
          <span className="v4-os-traffic-light v4-os-tl-yellow" aria-hidden="true" />
          <span className="v4-os-traffic-light v4-os-tl-green"  aria-hidden="true" />
        </div>

        <div className="v4-os-window-title">{title}</div>

        {/* Serial + status chips */}
        {serial && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginRight: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--v4-muted)', letterSpacing: '0.12em' }}>
              {serial}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--v4-accent)',
              border: '1px solid var(--v4-accent)', padding: '1px 6px', borderRadius: 3,
              letterSpacing: '0.1em',
            }}>
              {status}
            </span>
          </div>
        )}
      </header>

      {/* ── WINDOW BODY ── */}
      <div className="v4-os-window-content" data-v4-shell-part="body">
        {(metaLabel || metaValue || chips.length > 0) && (
          <div className="v4-window__plate" data-v4-no-drag>
            {(metaLabel || metaValue) && (
              <div className="v4-window__plate-meta">
                {metaLabel && <span>{metaLabel}</span>}
                {metaValue && <span>{metaValue}</span>}
              </div>
            )}
            {chips.length > 0 && (
              <div className="v4-window__plate-row">
                {chips.map((chip) => <span key={chip}>{chip}</span>)}
              </div>
            )}
          </div>
        )}
        {children}
      </div>

      {/* ── RESIZE HANDLE (bottom-right) ── */}
      <div
        aria-hidden="true"
        onPointerDown={(e) => { e.stopPropagation(); startResize(e) }}
        style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 18, height: 18,
          cursor: 'se-resize',
          borderBottomRightRadius: 16,
          background: `linear-gradient(
            135deg,
            transparent 40%,
            rgba(255,255,255,0.18) 60%,
            rgba(255,255,255,0.32) 80%,
            transparent 100%
          )`,
        }}
      />
    </Motion.div>
  )
}
