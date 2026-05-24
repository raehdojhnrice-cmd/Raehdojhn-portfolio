import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'v4-archive-work-items'
const VIEW_MODE_STORAGE_KEY = 'v4-archive-view-mode'
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']
const MAX_IMAGE_SIZE_MB = 12
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
const VIEW_MODES = [
  { id: 'grid', label: 'Grid', detail: 'Tumblr bento default' },
  { id: 'reel', label: 'Reel', detail: 'Horizontal strip viewer' },
  { id: 'stack-book', label: 'Stack-Book', detail: 'Editorial spread stack' },
]

function readItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function cardSize(index) {
  const pattern = ['v4-archive__item--wide', 'v4-archive__item--tall', 'v4-archive__item--square', 'v4-archive__item--wide']
  return pattern[index % pattern.length]
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read file.'))
    reader.readAsDataURL(file)
  })
}

function parseTags(raw) {
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 8)
}

function isSafeUrl(value) {
  const text = value.trim()
  if (!text) return true

  try {
    const url = new URL(text)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function formatArchiveSerial(index) {
  return `ARC-${String(index + 1).padStart(3, '0')}`
}

function readViewMode() {
  try {
    const raw = localStorage.getItem(VIEW_MODE_STORAGE_KEY)
    return VIEW_MODES.some((mode) => mode.id === raw) ? raw : 'grid'
  } catch {
    return 'grid'
  }
}

export default function V4ArchiveUploadGrid() {
  const [items, setItems] = useState(() => readItems())
  const [viewMode, setViewMode] = useState(() => readViewMode())
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState({ tone: 'idle', message: '' })
  const [form, setForm] = useState({
    title: '',
    caption: '',
    tags: '',
    link: '',
    image: '',
  })

  const countLabel = useMemo(() => `${items.length} ${items.length === 1 ? 'entry' : 'entries'}`, [items.length])
  const activeMode = VIEW_MODES.find((mode) => mode.id === viewMode) || VIEW_MODES[0]
  const setFeedback = (message, tone = 'info') => setStatus({ message, tone })
  const setField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }))

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode)
  }, [viewMode])

  const applyFile = async (file) => {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFeedback('Invalid file type. Use PNG, JPG, WEBP, GIF, or AVIF.', 'error')
      return
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFeedback(`Image exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`, 'error')
      return
    }

    try {
      const image = await toDataUrl(file)
      setField('image', image)
      setFeedback('Image loaded. Add metadata and publish.', 'success')
    } catch {
      setFeedback('Unable to read this file. Try another image.', 'error')
    }
  }

  const onDrop = async (event) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer?.files?.[0]
    await applyFile(file)
  }

  const publish = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (title.length < 2) {
      setFeedback('Title must be at least 2 characters.', 'error')
      return
    }

    if (!form.image) {
      setFeedback('Add an image before publishing.', 'error')
      return
    }

    if (!isSafeUrl(form.link)) {
      setFeedback('External link must be a valid http(s) URL.', 'error')
      return
    }

    const tags = parseTags(form.tags)
    const item = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      caption: form.caption.trim(),
      tags,
      link: form.link.trim(),
      image: form.image,
      createdAt: new Date().toISOString(),
    }

    const next = [item, ...items]
    setItems(next)
    saveItems(next)
    setForm({ title: '', caption: '', tags: '', link: '', image: '' })
    setFeedback('Published to archive.', 'success')
  }

  const removeItem = (id) => {
    const next = items.filter((item) => item.id !== id)
    setItems(next)
    saveItems(next)
    setFeedback('Entry deleted from archive.', 'info')
  }

  return (
    <section id="work" className="v4-archive" data-v4-animate>
      <div className="v4-archive__head v4-app-panel">
        <p className="v4-kicker">UNRELATED PROJECT ARCHIVE / CHAOTIC CREATIVE EXPERIMENTALISM</p>
        <h2 className="v4-h2">UPLOAD + BENTO WALL</h2>
        <p className="v4-archive__subtle">
          Tumblr-like irregular grid with direct upload, tags, links, and strict validation states.
        </p>
      </div>

      <form className="v4-archive__form v4-app-panel" onSubmit={publish}>
        <div
          className={`v4-archive__dropzone ${dragging ? 'is-dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {form.image ? (
            <img src={form.image} alt="Upload preview" className="v4-archive__preview" />
          ) : (
            <p>Drop image here or use the file picker.</p>
          )}
          <label className="v4-archive__file">
            Pick file
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={async (event) => {
                const file = event.target.files?.[0]
                await applyFile(file)
              }}
            />
          </label>
        </div>

        <div className="v4-archive__fields">
          <label>
            Title *
            <input value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="Project title" />
          </label>
          <label>
            Caption
            <textarea value={form.caption} onChange={(event) => setField('caption', event.target.value)} placeholder="Short context" />
          </label>
          <label>
            Tags (comma separated, max 8)
            <input value={form.tags} onChange={(event) => setField('tags', event.target.value)} placeholder="fashion, photo, ui" />
          </label>
          <label>
            External link
            <input value={form.link} onChange={(event) => setField('link', event.target.value)} placeholder="https://..." />
          </label>
          <button type="submit">Publish to archive</button>
          {status.message ? (
            <p className={`v4-archive__status is-${status.tone}`} role="status">
              {status.message}
            </p>
          ) : null}
        </div>
      </form>

      <div className="v4-archive__toolbar v4-app-toolbar">
        <div className="v4-archive__meta">
          <span>{countLabel}</span>
          <span>Storage key: {STORAGE_KEY}</span>
          <span>Max file: {MAX_IMAGE_SIZE_MB}MB</span>
          <span>Viewer: {activeMode.label}</span>
        </div>

        <div className="v4-archive__viewer">
          <p className="v4-archive__viewer-copy">{activeMode.detail}</p>
          <div className="v4-archive__viewer-switch" role="group" aria-label="Archive viewer modes">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`v4-archive__viewer-btn ${viewMode === mode.id ? 'is-active' : ''}`}
                onClick={() => setViewMode(mode.id)}
                aria-pressed={viewMode === mode.id}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`v4-archive__grid v4-archive__grid--${viewMode}`}>
        {items.map((item, index) => (
          <article key={item.id} className={`v4-archive__item ${cardSize(index)}`}>
            <div className="v4-archive__media-wrap">
              <img src={item.image} alt={item.title} className="v4-archive__image" loading="lazy" />
              <div className="v4-archive__media-overlay">
                <div className="v4-archive__overlay-row">
                  <span className="v4-archive__overlay-chip">Still / IMG</span>
                  <span className="v4-archive__overlay-chip">{formatArchiveSerial(index)}</span>
                </div>
                <div className="v4-archive__overlay-row">
                  <span className={`v4-archive__overlay-chip ${item.tags.length ? '' : 'is-muted'}`}>
                    {item.tags.length ? `${item.tags.length} tags` : 'Untagged'}
                  </span>
                  {item.link ? (
                    <a
                      className="v4-archive__overlay-link"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch
                    </a>
                  ) : (
                    <span className="v4-archive__overlay-chip is-muted">Local only</span>
                  )}
                </div>
              </div>
            </div>
            <div className="v4-archive__content">
              <p className="v4-archive__stamp">{new Date(item.createdAt).toLocaleDateString()}</p>
              <h3>{item.title}</h3>
              {item.caption ? <p>{item.caption}</p> : null}
              {item.tags.length ? (
                <div className="v4-archive__tags">
                  {item.tags.map((tag) => (
                    <span key={`${item.id}-${tag}`}>#{tag}</span>
                  ))}
                </div>
              ) : null}
              <div className="v4-archive__actions">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                ) : (
                  <span className="is-muted">No link</span>
                )}
                <button type="button" onClick={() => removeItem(item.id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}

        {!items.length ? (
          <div className="v4-archive__empty">
            <p>No uploads yet. Add your first unrelated project to start the archive wall.</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
