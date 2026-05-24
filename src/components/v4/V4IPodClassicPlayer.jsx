import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import ReactPlayer from 'react-player'
import AudioVisualizer from '../audio/AudioVisualizer'
import WaveformProgress from '../audio/WaveformProgress'
import defaultPlaylist from '../../data/playlist.json'
import { deleteMediaFile, getMediaObjectUrl, saveMediaFile } from '../../lib/mediaVault'
import { PLAYER_THEME_KEY, V4_PLAYER_THEME_EVENT } from './useV4PlayerPaletteTheme'

const PLAYLIST_KEY = 'v4-ipod-classic-playlist'
const VOLUME_KEY = 'v4-ipod-classic-volume'
const WIDTH_KEY = 'v4-ipod-classic-width'
const POSITION_KEY = 'v4-ipod-classic-position'
const MODE_KEY = 'v4-ipod-classic-mode'
const SOURCE_OPTIONS = ['upload', 'soundcloud', 'youtube', 'youtube_playlist', 'url']
const DEFAULT_WIDTH = 336
const MIN_WIDTH = 280
const MAX_WIDTH = 460
const DEFAULT_POSITION = { x: 0, y: 0 }
const RESIZE_HANDLES = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']
const MotionDiv = motion.div
const DEFAULT_PLAYER_PALETTE = {
  bg: '#0f1217',
  surface: '#1c222b',
  line: 'rgba(203,214,227,0.22)',
  text: '#f3f4f6',
  muted: '#8f98a3',
  accent: '#d84545',
}

function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00'
  const mins = Math.floor(sec / 60)
  const secs = Math.floor(sec % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function getPlaylist() {
  try {
    const local = localStorage.getItem(PLAYLIST_KEY)
    if (local) return JSON.parse(local)
    return defaultPlaylist || []
  } catch {
    return defaultPlaylist || []
  }
}

function serializePlaylist(playlist) {
  return playlist.map((track) => (
    track.source === 'upload'
      ? { ...track, url: '' }
      : track
  ))
}

function savePlaylist(playlist) {
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(serializePlaylist(playlist)))
}

function readNumber(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? parseFloat(raw) : fallback
  } catch {
    return fallback
  }
}

function readPosition() {
  try {
    const raw = localStorage.getItem(POSITION_KEY)
    if (!raw) return DEFAULT_POSITION
    const parsed = JSON.parse(raw)
    return {
      x: Number.isFinite(parsed?.x) ? parsed.x : DEFAULT_POSITION.x,
      y: Number.isFinite(parsed?.y) ? parsed.y : DEFAULT_POSITION.y,
    }
  } catch {
    return DEFAULT_POSITION
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getSafePositionForViewport(position, width = DEFAULT_WIDTH) {
  if (typeof window === 'undefined') return position
  if (window.innerWidth <= 720) return DEFAULT_POSITION

  return {
    x: clamp(position.x, Math.min(0, width + 84 - window.innerWidth - 30), 60),
    y: clamp(position.y, Math.min(-window.innerHeight + 340, -220), 50),
  }
}

function getResizeCursor(edge) {
  switch (edge) {
    case 'n':
    case 's':
      return 'ns-resize'
    case 'e':
    case 'w':
      return 'ew-resize'
    case 'ne':
    case 'sw':
      return 'nesw-resize'
    case 'nw':
    case 'se':
      return 'nwse-resize'
    default:
      return 'default'
  }
}

function normalizeAngle(delta) {
  if (delta > 180) return delta - 360
  if (delta < -180) return delta + 360
  return delta
}

function getAngleFromEvent(event, node) {
  const rect = node.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  return Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI)
}

function sourceIcon(source) {
  switch (source) {
    case 'soundcloud':
      return 'SC'
    case 'youtube':
      return 'YT'
    case 'youtube_playlist':
      return 'PL'
    case 'upload':
      return 'HD'
    default:
      return 'URL'
  }
}

function readRootPlayerPalette() {
  if (typeof window === 'undefined') return DEFAULT_PLAYER_PALETTE

  const rootStyles = window.getComputedStyle(document.documentElement)
  return {
    bg: rootStyles.getPropertyValue('--v4-player-bg').trim() || DEFAULT_PLAYER_PALETTE.bg,
    surface: rootStyles.getPropertyValue('--v4-player-surface').trim() || DEFAULT_PLAYER_PALETTE.surface,
    line: rootStyles.getPropertyValue('--v4-player-line').trim() || DEFAULT_PLAYER_PALETTE.line,
    text: rootStyles.getPropertyValue('--v4-player-text').trim() || DEFAULT_PLAYER_PALETTE.text,
    muted: rootStyles.getPropertyValue('--v4-player-muted').trim() || DEFAULT_PLAYER_PALETTE.muted,
    accent: rootStyles.getPropertyValue('--v4-player-accent').trim() || DEFAULT_PLAYER_PALETTE.accent,
  }
}

export default function V4IPodClassicPlayer() {
  const [playlist, setPlaylist] = useState(getPlaylist)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(() => readNumber(VOLUME_KEY, 0.7))
  const [view, setView] = useState('now')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [addForm, setAddForm] = useState({ title: '', artist: '', url: '', source: 'upload' })
  const [dragFiles, setDragFiles] = useState(false)
  const [audioElement, setAudioElement] = useState(null)
  const [playerPalette, setPlayerPalette] = useState(readRootPlayerPalette)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [width, setWidth] = useState(() => clamp(readNumber(WIDTH_KEY, DEFAULT_WIDTH), MIN_WIDTH, MAX_WIDTH))
  const [isResizing, setIsResizing] = useState(false)
  const [resizeCursor, setResizeCursor] = useState('')
  const [appearance, setAppearance] = useState(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY)
      return saved === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  const objectUrlsRef = useRef(new Set())
  const playerRef = useRef(null)
  const wrapperRef = useRef(null)
  const wheelRef = useRef(null)
  const fileInputRef = useRef(null)
  const wheelGestureRef = useRef({ active: false, lastAngle: 0, accumulated: 0 })
  const resizeGestureRef = useRef(null)

  const startPosition = getSafePositionForViewport(readPosition(), width)
  const x = useMotionValue(startPosition.x)
  const y = useMotionValue(startPosition.y)
  const dragControls = useDragControls()

  const track = playlist[currentTrack] || null
  const currentSourceIndex = Math.max(0, SOURCE_OPTIONS.indexOf(addForm.source))
  const showPlaylist = view === 'playlist'
  const showAdd = view === 'add'

  const screenTitle = useMemo(() => {
    if (showPlaylist) return 'Library'
    if (showAdd) return 'Add Source'
    return playing ? 'Now Playing' : 'Ready'
  }, [playing, showAdd, showPlaylist])

  const syncAudioElement = useCallback(() => {
    const instance = playerRef.current
    if (!instance || typeof instance.getInternalPlayer !== 'function') {
      setAudioElement(null)
      return
    }
    setAudioElement(instance.getInternalPlayer() || null)
  }, [])

  useEffect(() => {
    const syncPalette = () => setPlayerPalette(readRootPlayerPalette())

    const handleStorage = (event) => {
      if (event.key === PLAYER_THEME_KEY) {
        syncPalette()
      }
    }

    syncPalette()
    window.addEventListener(V4_PLAYER_THEME_EVENT, syncPalette)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(V4_PLAYER_THEME_EVENT, syncPalette)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    const objectUrls = objectUrlsRef.current
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
      objectUrls.clear()
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function hydrateUploads() {
      const nextPlaylist = await Promise.all(
        playlist.map(async (item) => {
          if (item.source !== 'upload' || item.url || !item.assetId) return item

          try {
            const objectUrl = await getMediaObjectUrl(item.assetId)
            if (!objectUrl) return item
            objectUrlsRef.current.add(objectUrl)
            return { ...item, url: objectUrl }
          } catch {
            return item
          }
        })
      )

      if (!cancelled) {
        setPlaylist((previous) => {
          const changed = previous.some((item, index) => item !== nextPlaylist[index])
          return changed ? nextPlaylist : previous
        })
      }
    }

    hydrateUploads()

    return () => {
      cancelled = true
    }
  }, [playlist])

  useEffect(() => {
    const frame = window.requestAnimationFrame(syncAudioElement)
    return () => window.cancelAnimationFrame(frame)
  }, [track?.url, syncAudioElement])

  useEffect(() => {
    try {
      localStorage.setItem(VOLUME_KEY, String(volume))
    } catch {
      /* ignore write failures */
    }
  }, [volume])

  useEffect(() => {
    try {
      localStorage.setItem(WIDTH_KEY, String(width))
    } catch {
      /* ignore write failures */
    }
  }, [width])

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, appearance)
    } catch {
      /* ignore write failures */
    }
  }, [appearance])

  useEffect(() => {
    const handleViewportReset = () => {
      const safePosition = getSafePositionForViewport({ x: x.get(), y: y.get() }, width)
      x.set(safePosition.x)
      y.set(safePosition.y)
    }

    handleViewportReset()
    window.addEventListener('resize', handleViewportReset)

    return () => window.removeEventListener('resize', handleViewportReset)
  }, [width, x, y])

  useEffect(() => {
    if (!isResizing) return undefined

    const handlePointerMove = (event) => {
      const gesture = resizeGestureRef.current
      if (!gesture) return

      const deltaX = event.clientX - gesture.startX
      const deltaY = event.clientY - gesture.startY
      let widthDelta = 0

      if (gesture.edge.includes('e')) widthDelta += deltaX
      if (gesture.edge.includes('w')) widthDelta -= deltaX

      if (!gesture.edge.includes('e') && !gesture.edge.includes('w')) {
        widthDelta += gesture.edge.includes('n') ? -deltaY : deltaY
      } else if (gesture.edge.length === 2) {
        widthDelta += (gesture.edge.includes('n') ? -deltaY : deltaY) * 0.45
      }

      const nextWidth = clamp(Math.round(gesture.startWidth + widthDelta), MIN_WIDTH, MAX_WIDTH)
      const appliedDelta = nextWidth - gesture.startWidth

      let nextX = gesture.startPosition.x
      if (gesture.edge.includes('e')) {
        nextX = gesture.startPosition.x + appliedDelta
      } else if (!gesture.edge.includes('w')) {
        nextX = gesture.startPosition.x + (appliedDelta / 2)
      }

      const safePosition = getSafePositionForViewport({ x: nextX, y: gesture.startPosition.y }, nextWidth)
      setWidth(nextWidth)
      x.set(safePosition.x)
      y.set(safePosition.y)
    }

    const handlePointerUp = () => {
      const safePosition = getSafePositionForViewport({ x: x.get(), y: y.get() }, width)
      x.set(safePosition.x)
      y.set(safePosition.y)
      setIsResizing(false)
      setResizeCursor('')
      resizeGestureRef.current = null

      try {
        localStorage.setItem(POSITION_KEY, JSON.stringify(safePosition))
      } catch {
        /* ignore write failures */
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [isResizing, width, x, y])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const previousCursor = document.body.style.cursor
    if (resizeCursor) {
      document.body.style.cursor = resizeCursor
    }

    return () => {
      document.body.style.cursor = previousCursor
    }
  }, [resizeCursor])

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds)
    setProgress(state.played)
  }

  const handleDuration = (value) => {
    setDuration(value)
  }

  const toggleAppearance = useCallback(() => {
    setAppearance((previous) => (previous === 'light' ? 'dark' : 'light'))
  }, [])

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return
    setCurrentTrack((previous) => (previous + 1) % playlist.length)
    setSelectedIndex((previous) => (previous + 1) % playlist.length)
    setProgress(0)
    setCurrentTime(0)
  }, [playlist.length])

  const prevTrack = useCallback(() => {
    if (playlist.length === 0) return
    setCurrentTrack((previous) => (previous - 1 + playlist.length) % playlist.length)
    setSelectedIndex((previous) => (previous - 1 + playlist.length) % playlist.length)
    setProgress(0)
    setCurrentTime(0)
  }, [playlist.length])

  const playTrackAt = useCallback((index) => {
    if (!playlist[index]) return
    setCurrentTrack(index)
    setSelectedIndex(index)
    setPlaying(true)
    setView('now')
  }, [playlist])

  const seekTo = (pct) => {
    if (!playerRef.current) return
    playerRef.current.seekTo(pct, 'fraction')
  }

  const togglePlay = () => {
    if (!track?.url) return
    setPlaying((previous) => !previous)
  }

  const updateSource = (nextIndex) => {
    const safeIndex = ((nextIndex % SOURCE_OPTIONS.length) + SOURCE_OPTIONS.length) % SOURCE_OPTIONS.length
    setAddForm((previous) => ({
      ...previous,
      source: SOURCE_OPTIONS[safeIndex],
    }))
  }

  const stepWheel = useCallback((direction) => {
    if (showPlaylist) {
      if (!playlist.length) return
      setSelectedIndex((previous) => ((previous + direction) % playlist.length + playlist.length) % playlist.length)
      return
    }

    if (showAdd) {
      updateSource(currentSourceIndex + direction)
      return
    }

    setVolume((previous) => clamp(previous + direction * 0.03, 0, 1))
  }, [currentSourceIndex, playlist.length, showAdd, showPlaylist])

  const handleWheelPointerDown = (event) => {
    event.stopPropagation()
    if (!wheelRef.current) return
    wheelGestureRef.current.active = true
    wheelGestureRef.current.lastAngle = getAngleFromEvent(event, wheelRef.current)
    wheelGestureRef.current.accumulated = 0
    wheelRef.current.setPointerCapture?.(event.pointerId)
  }

  const handleWheelPointerMove = (event) => {
    if (!wheelGestureRef.current.active || !wheelRef.current) return
    const nextAngle = getAngleFromEvent(event, wheelRef.current)
    const delta = normalizeAngle(nextAngle - wheelGestureRef.current.lastAngle)
    wheelGestureRef.current.lastAngle = nextAngle
    wheelGestureRef.current.accumulated += delta
    setWheelRotation((previous) => previous + delta * 0.35)

    while (wheelGestureRef.current.accumulated >= 18) {
      stepWheel(1)
      wheelGestureRef.current.accumulated -= 18
    }

    while (wheelGestureRef.current.accumulated <= -18) {
      stepWheel(-1)
      wheelGestureRef.current.accumulated += 18
    }
  }

  const handleWheelPointerEnd = (event) => {
    event.stopPropagation()
    wheelGestureRef.current.active = false
    wheelGestureRef.current.accumulated = 0
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || event.dataTransfer?.files || [])
    if (!files.length) return

    const uploads = await Promise.all(
      files
        .filter((file) => file.type.startsWith('audio/'))
        .map(async (file) => {
          const stored = await saveMediaFile(file, 'audio')
          const url = URL.createObjectURL(file)
          objectUrlsRef.current.add(url)
          return {
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'RAEHDOJHN',
            url,
            source: 'upload',
            mediaType: 'audio',
            assetId: stored.assetId,
          }
        })
    )

    if (!uploads.length) return

    const nextPlaylist = [...playlist, ...uploads]
    setPlaylist(nextPlaylist)
    savePlaylist(nextPlaylist)
    setCurrentTrack(nextPlaylist.length - uploads.length)
    setSelectedIndex(nextPlaylist.length - uploads.length)
    setPlaying(true)
    setView('now')
    setDragFiles(false)
  }

  const addTrackFromURL = (event) => {
    event.preventDefault()
    if (!addForm.url.trim()) return

    const newTrack = {
      title: addForm.title.trim() || 'Untitled',
      artist: addForm.artist.trim() || 'Unknown',
      url: addForm.url.trim(),
      source: addForm.source,
      mediaType: addForm.source === 'youtube' || addForm.source === 'youtube_playlist' ? 'video-audio' : 'audio',
    }

    const nextPlaylist = [...playlist, newTrack]
    setPlaylist(nextPlaylist)
    savePlaylist(nextPlaylist)
    setAddForm({ title: '', artist: '', url: '', source: 'upload' })
    setCurrentTrack(nextPlaylist.length - 1)
    setSelectedIndex(nextPlaylist.length - 1)
    setPlaying(true)
    setView('now')
  }

  const removeTrack = async (index) => {
    const target = playlist[index]

    if (target?.source === 'upload' && target.assetId) {
      try {
        await deleteMediaFile(target.assetId)
      } catch {
        /* ignore storage deletion failures */
      }
    }

    if (target?.url && target.url.startsWith('blob:') && objectUrlsRef.current.has(target.url)) {
      URL.revokeObjectURL(target.url)
      objectUrlsRef.current.delete(target.url)
    }

    const nextPlaylist = playlist.filter((_, itemIndex) => itemIndex !== index)
    setPlaylist(nextPlaylist)
    savePlaylist(nextPlaylist)

    if (!nextPlaylist.length) {
      setCurrentTrack(0)
      setSelectedIndex(0)
      setPlaying(false)
      setProgress(0)
      setCurrentTime(0)
      return
    }

    if (index === currentTrack) {
      const nextIndex = index >= nextPlaylist.length ? nextPlaylist.length - 1 : index
      setCurrentTrack(nextIndex)
      setSelectedIndex(nextIndex)
      setPlaying(false)
      setProgress(0)
      setCurrentTime(0)
      return
    }

    if (currentTrack > index) {
      setCurrentTrack((previous) => previous - 1)
    }

    setSelectedIndex((previous) => clamp(previous, 0, nextPlaylist.length - 1))
  }

  const handleMenu = () => {
    setView((previous) => (previous === 'playlist' ? 'now' : 'playlist'))
    if (playlist.length) {
      setSelectedIndex(currentTrack)
    }
  }

  const handleAdd = () => {
    setView((previous) => (previous === 'add' ? 'now' : 'add'))
  }

  const handleCenter = () => {
    if (showPlaylist) {
      playTrackAt(selectedIndex)
      return
    }

    if (showAdd) {
      if (addForm.source === 'upload') {
        fileInputRef.current?.click()
      } else if (addForm.url.trim()) {
        addTrackFromURL({ preventDefault() {} })
      }
      return
    }

    togglePlay()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    handleFileUpload(event)
  }

  const handleDragEnd = () => {
    const safePosition = getSafePositionForViewport({ x: x.get(), y: y.get() }, width)
    x.set(safePosition.x)
    y.set(safePosition.y)

    try {
      localStorage.setItem(POSITION_KEY, JSON.stringify(safePosition))
    } catch {
      /* ignore write failures */
    }
  }

  const startResize = (edge, event) => {
    event.preventDefault()
    event.stopPropagation()

    setResizeCursor(getResizeCursor(edge))
    resizeGestureRef.current = {
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: width,
      startPosition: { x: x.get(), y: y.get() },
    }
    setIsResizing(true)
  }

  return (
    <MotionDiv
      ref={wrapperRef}
      className={`v4-ipod-app v4-ipod-app--${appearance} ${dragFiles ? 'is-drop-target' : ''} ${isResizing ? 'is-resizing' : ''}`}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        x,
        y,
        width,
        '--v4-ipod-shell-width': `${width}px`,
        '--v4-ipod-screen-frame': 'var(--v4-player-surface)',
        '--v4-ipod-screen-text': '#141814',
        '--v4-ipod-screen-muted': 'rgba(20, 24, 20, 0.78)',
        '--v4-ipod-screen-faint': 'rgba(20, 24, 20, 0.60)',
        '--v4-ipod-screen-line': 'rgba(20, 24, 20, 0.22)',
        '--v4-ipod-toolbar-text': 'color-mix(in srgb, var(--v4-player-text) 82%, transparent)',
        '--v4-ipod-shell-glow': 'color-mix(in srgb, var(--v4-player-accent) 28%, transparent)',
        '--v4-ipod-shell-highlight': 'color-mix(in srgb, var(--v4-player-text) 22%, transparent)',
        '--v4-ipod-wheel-text': 'color-mix(in srgb, var(--v4-player-text) 86%, transparent)',
      }}
      onDragEnd={handleDragEnd}
      onDragOver={(event) => {
        event.preventDefault()
        setDragFiles(true)
      }}
      onDragLeave={() => setDragFiles(false)}
      onDrop={handleDrop}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {RESIZE_HANDLES.map((edge) => (
        <button
          key={edge}
          type="button"
          className={`v4-ipod-app__resize-handle v4-ipod-app__resize-handle--${edge}`}
          aria-label={`Resize iPod from ${edge} edge`}
          onPointerDown={(event) => startResize(edge, event)}
        />
      ))}

      <div className="v4-ipod-app__toolbar">
        <button
          type="button"
          className="v4-ipod-app__grabber"
          onPointerDown={(event) => {
            if (isResizing) return
            dragControls.start(event)
          }}
          aria-label="Drag iPod player"
        >
          <span />
          <p>drag iPod</p>
        </button>

        <button
          type="button"
          className="v4-ipod-app__mode-toggle"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={toggleAppearance}
          aria-label={`Switch iPod to ${appearance === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={appearance === 'dark'}
          title={`Theme: ${appearance === 'light' ? 'Light' : 'Dark'} (click to switch)`}
        >
          <span className="v4-ipod-app__mode-pill" aria-hidden="true">
            {appearance === 'light' ? 'LGT' : 'DRK'}
          </span>
          <span className="v4-ipod-app__mode-copy">
            <span className="v4-ipod-app__mode-title">Theme</span>
            <span className="v4-ipod-app__mode-value">{appearance === 'light' ? 'Light' : 'Dark'}</span>
          </span>
        </button>
      </div>

      <div className="v4-ipod-body">
        <div className="v4-ipod-body__screen" onPointerDown={(event) => event.stopPropagation()}>
          <div className="v4-ipod-screen__chrome">
            <span>{screenTitle}</span>
            <span>{sourceIcon(track?.source || 'upload')}</span>
          </div>

          {!showPlaylist && !showAdd ? (
            <div className="v4-ipod-screen__now">
              <div className="v4-ipod-screen__headline">
                <strong>{track ? track.title : 'No source loaded'}</strong>
                <span>{track ? track.artist : 'Upload audio or paste a link'}</span>
              </div>

              <div className="v4-ipod-screen__statrow">
                <span>{playing ? 'Playing' : 'Paused'}</span>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              <div className="v4-ipod-screen__media">
                <div className="v4-ipod-screen__visualizer">
                  <AudioVisualizer
                    isPlaying={playing}
                    styleType="bars"
                    accentColor={playerPalette.accent}
                    audioElement={audioElement}
                    source={track ? track.source : null}
                  />
                </div>

                <div className="v4-ipod-screen__wave">
                  <WaveformProgress progress={progress} duration={duration} onSeek={seekTo} accentColor={playerPalette.accent} />
                </div>
              </div>

              <div className="v4-ipod-screen__footer">
                <span>Vol {Math.round(volume * 100)}%</span>
                <span>{playlist.length} items</span>
              </div>
            </div>
          ) : null}

          {showPlaylist ? (
            <div className="v4-ipod-screen__list" onPointerDown={(event) => event.stopPropagation()}>
              <div className="v4-ipod-screen__list-head">
                <span>Library</span>
                <span>{selectedIndex + 1}/{Math.max(playlist.length, 1)}</span>
              </div>
              {playlist.length ? (
                <div className="v4-ipod-screen__list-items">
                  {playlist.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className={`v4-ipod-screen__list-item ${index === selectedIndex ? 'is-selected' : ''} ${index === currentTrack ? 'is-current' : ''}`}
                    >
                      <button
                        type="button"
                        className="v4-ipod-screen__list-open"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() => playTrackAt(index)}
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span>{item.title}</span>
                      </button>
                      <button
                        type="button"
                        className="v4-ipod-screen__list-remove"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() => removeTrack(index)}
                        aria-label={`Remove ${item.title}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="v4-ipod-screen__empty">No tracks in library</p>
              )}
            </div>
          ) : null}

          {showAdd ? (
            <div className="v4-ipod-screen__add" onPointerDown={(event) => event.stopPropagation()}>
              <div className="v4-ipod-screen__list-head">
                <span>Add source</span>
                <span>{SOURCE_OPTIONS[currentSourceIndex].replace('_', ' ')}</span>
              </div>

              <div className="v4-ipod-screen__sources">
                {SOURCE_OPTIONS.map((source) => (
                  <button
                    key={source}
                    type="button"
                    className={addForm.source === source ? 'is-active' : ''}
                    onClick={() => setAddForm((previous) => ({ ...previous, source }))}
                  >
                    {source === 'youtube_playlist' ? 'yt list' : source}
                  </button>
                ))}
              </div>

              {addForm.source === 'upload' ? (
                <button
                  type="button"
                  className="v4-ipod-screen__upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse local audio
                </button>
              ) : (
                <form className="v4-ipod-screen__form" onSubmit={addTrackFromURL}>
                  <input
                    value={addForm.url}
                    onChange={(event) => setAddForm((previous) => ({ ...previous, url: event.target.value }))}
                    placeholder={
                      addForm.source === 'soundcloud' ? 'SoundCloud URL'
                        : addForm.source === 'youtube' ? 'YouTube URL'
                          : addForm.source === 'youtube_playlist' ? 'YouTube playlist URL'
                            : 'Direct audio URL'
                    }
                  />
                  <input
                    value={addForm.title}
                    onChange={(event) => setAddForm((previous) => ({ ...previous, title: event.target.value }))}
                    placeholder="Title"
                  />
                  <input
                    value={addForm.artist}
                    onChange={(event) => setAddForm((previous) => ({ ...previous, artist: event.target.value }))}
                    placeholder="Artist"
                  />
                  <button type="submit">Add to library</button>
                </form>
              )}
            </div>
          ) : null}
        </div>

        <div
          ref={wheelRef}
          className="v4-ipod-wheel"
          style={{ '--v4-ipod-wheel-rotation': `${wheelRotation}deg` }}
          onPointerDown={handleWheelPointerDown}
          onPointerMove={handleWheelPointerMove}
          onPointerUp={handleWheelPointerEnd}
          onPointerCancel={handleWheelPointerEnd}
          onPointerLeave={handleWheelPointerEnd}
        >
          <div className="v4-ipod-wheel__touchring" aria-hidden="true" />
          <button type="button" className="v4-ipod-wheel__btn v4-ipod-wheel__btn--top" onPointerDown={(event) => event.stopPropagation()} onClick={handleMenu}>
            MENU
          </button>
          <button
            type="button"
            className="v4-ipod-wheel__btn v4-ipod-wheel__btn--left"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => (showPlaylist ? setSelectedIndex((previous) => clamp(previous - 1, 0, Math.max(playlist.length - 1, 0))) : prevTrack())}
          >
            ◀◀
          </button>
          <button
            type="button"
            className="v4-ipod-wheel__btn v4-ipod-wheel__btn--right"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => (showPlaylist ? setSelectedIndex((previous) => clamp(previous + 1, 0, Math.max(playlist.length - 1, 0))) : nextTrack())}
          >
            ▶▶
          </button>
          <button type="button" className="v4-ipod-wheel__btn v4-ipod-wheel__btn--bottom" onPointerDown={(event) => event.stopPropagation()} onClick={handleAdd}>
            ADD
          </button>
          <button type="button" className="v4-ipod-wheel__center" onPointerDown={(event) => event.stopPropagation()} onClick={handleCenter}>
            {showPlaylist ? 'OPEN' : showAdd ? 'LOAD' : playing ? 'PAUSE' : 'PLAY'}
          </button>
        </div>

        <div className="v4-ipod-body__meta">
          <span>Drag handle</span>
          <span>{appearance === 'light' ? 'Silver' : 'Black'}</span>
          <span>Resize edges</span>
          <span>{Math.round(width)} px</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        hidden
      />

      {track?.url ? (
        <div className="v4-ipod-player__ghost" aria-hidden="true">
          <ReactPlayer
            ref={playerRef}
            url={track.url}
            playing={playing}
            volume={volume}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={nextTrack}
            onReady={syncAudioElement}
            onError={() => setPlaying(false)}
            width="1px"
            height="1px"
            config={{
              file: { forceAudio: true },
              youtube: {
                playerVars: {
                  origin: typeof window !== 'undefined' ? window.location.origin : '',
                  autoplay: 1,
                  playsinline: 1,
                },
              },
              soundcloud: {
                options: { auto_play: true },
              },
            }}
          />
        </div>
      ) : null}

      {dragFiles ? (
        <div className="v4-ipod-drop">
          <span>Drop audio files to load into the iPod library</span>
        </div>
      ) : null}
    </MotionDiv>
  )
}
