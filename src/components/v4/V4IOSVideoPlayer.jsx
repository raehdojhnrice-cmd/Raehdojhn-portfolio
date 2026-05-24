import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { deleteMediaFile, getMediaObjectUrl, saveMediaFile } from '../../lib/mediaVault'

const LIBRARY_KEY = 'v4-quicktime-library'
const INDEX_KEY = 'v4-quicktime-index'
const DEFAULT_LIBRARY = [
  {
    title: 'Background Reel',
    url: '/background-video.mp4',
    source: 'url',
    mediaType: 'video',
  },
]

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00'
  const safe = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(safe / 60)
  const secs = String(safe % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

function readLibrary() {
  try {
    const stored = localStorage.getItem(LIBRARY_KEY)
    if (!stored) return DEFAULT_LIBRARY
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_LIBRARY
  } catch {
    return DEFAULT_LIBRARY
  }
}

function saveLibrary(items) {
  const safe = items.map((item) => (
    item.source === 'upload'
      ? { ...item, url: '' }
      : item
  ))
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(safe))
}

function readIndex() {
  try {
    const stored = localStorage.getItem(INDEX_KEY)
    return stored ? Number(stored) : 0
  } catch {
    return 0
  }
}

export default function V4IOSVideoPlayer() {
  const playerRef = useRef(null)
  const objectUrlsRef = useRef(new Set())

  const [library, setLibrary] = useState(readLibrary)
  const [currentIndex, setCurrentIndex] = useState(readIndex)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [addMode, setAddMode] = useState('upload')
  const [form, setForm] = useState({ title: '', url: '' })

  const currentItem = library[currentIndex] || null

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
      const nextLibrary = await Promise.all(
        library.map(async (item) => {
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
        setLibrary((previous) => {
          const changed = previous.some((item, index) => item !== nextLibrary[index])
          return changed ? nextLibrary : previous
        })
      }
    }

    hydrateUploads()

    return () => {
      cancelled = true
    }
  }, [library])

  useEffect(() => {
    saveLibrary(library)
  }, [library])

  useEffect(() => {
    try {
      localStorage.setItem(INDEX_KEY, String(currentIndex))
    } catch {
      /* ignore index persistence failures */
    }
  }, [currentIndex])

  const handleLocalVideos = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const uploads = await Promise.all(
      files
        .filter((file) => file.type.startsWith('video/'))
        .map(async (file) => {
          const stored = await saveMediaFile(file, 'video')
          const url = URL.createObjectURL(file)
          objectUrlsRef.current.add(url)
          return {
            title: file.name.replace(/\.[^/.]+$/, ''),
            url,
            source: 'upload',
            mediaType: 'video',
            assetId: stored.assetId,
          }
        })
    )

    if (!uploads.length) return

    const nextLibrary = [...library, ...uploads]
    setLibrary(nextLibrary)
    setCurrentIndex(nextLibrary.length - uploads.length)
    setPlaying(true)
  }

  const addRemoteItem = (event) => {
    event.preventDefault()
    if (!form.url.trim()) return

    const nextLibrary = [
      ...library,
      {
        title: form.title.trim() || 'Untitled video',
        url: form.url.trim(),
        source: addMode,
        mediaType: 'video',
      },
    ]

    setLibrary(nextLibrary)
    setCurrentIndex(nextLibrary.length - 1)
    setPlaying(true)
    setForm({ title: '', url: '' })
  }

  const removeItem = async (index) => {
    const target = library[index]

    if (target?.source === 'upload' && target.assetId) {
      try {
        await deleteMediaFile(target.assetId)
      } catch {
        /* ignore deletion errors */
      }
    }

    if (target?.url && target.url.startsWith('blob:') && objectUrlsRef.current.has(target.url)) {
      URL.revokeObjectURL(target.url)
      objectUrlsRef.current.delete(target.url)
    }

    const nextLibrary = library.filter((_, itemIndex) => itemIndex !== index)
    setLibrary(nextLibrary.length ? nextLibrary : DEFAULT_LIBRARY)

    if (currentIndex >= nextLibrary.length) {
      setCurrentIndex(Math.max(0, nextLibrary.length - 1))
    }
  }

  const selectItem = (index) => {
    setCurrentIndex(index)
    setProgress(0)
    setCurrentTime(0)
    setPlaying(true)
  }

  const seek = (event) => {
    const nextValue = Number(event.target.value) / 100
    if (playerRef.current) {
      playerRef.current.seekTo(nextValue, 'fraction')
    }
    setProgress(nextValue)
  }

  return (
    <section className="v4-quicktime" aria-label="QuickTime-style media library" data-v4-animate>
      <div className="v4-quicktime__head">
        <p className="v4-kicker">REEL / QUICKTIME DECK</p>
        <h2 className="v4-h2">WATCHBOARD</h2>
      </div>

      {/* ── Quick-add bar ── */}
      <form
        className="v4-quicktime__quickadd"
        onSubmit={(e) => {
          e.preventDefault()
          const raw = e.target.elements.quickUrl.value.trim()
          if (!raw) return
          const src = raw.includes('youtube.com') || raw.includes('youtu.be') ? 'youtube' : 'url'
          const nextLibrary = [...library, { title: raw.split('/').pop().split('?')[0] || 'Video', url: raw, source: src, mediaType: 'video' }]
          setLibrary(nextLibrary)
          setCurrentIndex(nextLibrary.length - 1)
          setPlaying(true)
          e.target.reset()
        }}
      >
        <input
          name="quickUrl"
          className="v4-quicktime__quickadd-input"
          placeholder="Paste a YouTube, SoundCloud video, or direct .mp4 URL and press Enter to play instantly →"
          autoComplete="off"
        />
        <button type="submit" className="v4-quicktime__quickadd-btn">▶ PLAY</button>
      </form>

      <article className="v4-quicktime__window">
        <div className="v4-quicktime__titlebar">
          <div className="v4-quicktime__traffic" aria-hidden="true">
            <span className="v4-quicktime__traffic-dot is-red" />
            <span className="v4-quicktime__traffic-dot is-yellow" />
            <span className="v4-quicktime__traffic-dot is-green" />
          </div>
          <div className="v4-quicktime__titlecopy">
            <span>MacBook QuickTime</span>
            <strong>{currentItem ? currentItem.title : 'No media selected'}</strong>
          </div>
          <div className="v4-quicktime__meta">
            <span>{currentItem ? currentItem.source.toUpperCase() : 'IDLE'}</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>

        <div className="v4-quicktime__screen-shell">
          <div className="v4-quicktime__screen">
            {currentItem?.url ? (
              <ReactPlayer
                ref={playerRef}
                className="v4-quicktime__player"
                url={currentItem.url}
                playing={playing}
                muted={muted}
                volume={volume}
                controls
                width="100%"
                height="100%"
                onProgress={(state) => {
                  setProgress(state.played)
                  setCurrentTime(state.playedSeconds)
                }}
                onDuration={(nextDuration) => setDuration(nextDuration)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                      playsinline: 1,
                    },
                  },
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    },
                  },
                }}
              />
            ) : (
              <div className="v4-quicktime__empty">No media selected yet.</div>
            )}
            <div className="v4-quicktime__glow" aria-hidden="true" />
          </div>
          <div className="v4-quicktime__base" aria-hidden="true" />
        </div>

        <div className="v4-quicktime__transport">
          <button type="button" className="v4-quicktime__btn" onClick={() => setPlaying((previous) => !previous)}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="v4-quicktime__btn" onClick={() => setMuted((previous) => !previous)}>
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <label className="v4-quicktime__volume">
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
            />
          </label>
          <label className="v4-quicktime__seek">
            <span>Scrub</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(progress * 100)}
              onChange={seek}
            />
          </label>
        </div>

        <div className="v4-quicktime__add">
          <div className="v4-quicktime__tabs">
            {['upload', 'youtube', 'youtube_playlist', 'url'].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`v4-quicktime__tab ${addMode === mode ? 'is-active' : ''}`}
                onClick={() => setAddMode(mode)}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          {addMode === 'upload' ? (
            <label className="v4-quicktime__upload">
              <span>Add local video files</span>
              <small>MP4, MOV, WEBM, and anything your browser can decode.</small>
              <input type="file" accept="video/*" multiple onChange={handleLocalVideos} hidden />
            </label>
          ) : (
            <form className="v4-quicktime__form" onSubmit={addRemoteItem}>
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                placeholder="Title"
              />
              <input
                type="text"
                value={form.url}
                onChange={(event) => setForm((previous) => ({ ...previous, url: event.target.value }))}
                placeholder={
                  addMode === 'youtube_playlist'
                    ? 'https://www.youtube.com/playlist?list=...'
                    : addMode === 'youtube'
                      ? 'https://www.youtube.com/watch?v=...'
                      : 'Direct video URL...'
                }
              />
              <button type="submit">Add to watchboard</button>
            </form>
          )}
        </div>

        <div className="v4-quicktime__library">
          <div className="v4-quicktime__library-head">
            <span>Library</span>
            <span>{library.length} items</span>
          </div>
          <div className="v4-quicktime__library-list">
            {library.map((item, index) => (
              <div key={`${item.title}-${index}`} className={`v4-quicktime__library-item ${index === currentIndex ? 'is-active' : ''}`}>
                <button type="button" className="v4-quicktime__library-select" onClick={() => selectItem(index)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.title}</strong>
                  <em>{item.source}</em>
                </button>
                <button type="button" className="v4-quicktime__library-remove" onClick={() => removeItem(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  )
}
