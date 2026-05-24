import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
//  EDIT THIS DATA to update your "Media I've consumed lately" section
// ─────────────────────────────────────────────────────────────────────────────
const MEDIA = [
  {
    type: 'youtube',
    title: 'Kanye West Documentary – Jeen-yuhs',
    creator: 'Netflix',
    date: '2025-04',
    url: 'https://www.youtube.com/watch?v=0oe2z6JhKgY',
    embedId: '0oe2z6JhKgY',
    note: 'Re-watching this. The hunger in the early footage is unreal.',
    tags: ['film', 'music', 'culture'],
  },
  {
    type: 'spotify',
    title: 'Utopia',
    creator: 'Travis Scott',
    date: '2025-04',
    url: 'https://open.spotify.com/album/18NOKLkZETa4sWwLMIm0UL',
    note: "Still on heavy rotation. The production on 'MY EYES' is disorienting in the best way.",
    tags: ['music', 'rap'],
  },
  {
    type: 'soundcloud',
    title: 'Sango – Norte',
    creator: 'Sango',
    date: '2025-03',
    url: 'https://soundcloud.com/sangosoundcloud/norte',
    note: 'Found this again while going through old playlists. Pure texture.',
    tags: ['music', 'electronic'],
  },
  {
    type: 'article',
    title: 'The Shifting Meaning of "Authenticity" in Design',
    creator: 'Eye on Design',
    date: '2025-04',
    url: 'https://eyeondesign.aiga.org/',
    note: 'Made me rethink how I talk about my own work.',
    tags: ['design', 'culture'],
  },
  {
    type: 'youtube',
    title: 'Rick Rubin on the Creative Act',
    creator: 'Lex Fridman',
    date: '2025-03',
    url: 'https://www.youtube.com/watch?v=H_szemxPcTI',
    embedId: 'H_szemxPcTI',
    note: 'Listening to this while building. The chapter on "empty space" hit.',
    tags: ['art', 'creativity'],
  },
  {
    type: 'article',
    title: 'What Brutalism Means Now',
    creator: 'Dezeen',
    date: '2025-04',
    url: 'https://www.dezeen.com/',
    note: 'Great context for where brutalist web design is heading.',
    tags: ['design', 'architecture'],
  },
  {
    type: 'spotify',
    title: 'CHROMAKOPIA',
    creator: 'Tyler, the Creator',
    date: '2025-04',
    url: 'https://open.spotify.com/album/64tNsm6TnZe1p2LmLGFvsI',
    note: "The color-coded masking concept throughout the album is brilliant.",
    tags: ['music', 'rap'],
  },
]

const TYPE_META = {
  youtube:    { icon: '▶', label: 'YouTube', color: '#FF0000' },
  spotify:    { icon: '♫', label: 'Spotify', color: '#1DB954' },
  soundcloud: { icon: '◉', label: 'SoundCloud', color: '#FF5500' },
  article:    { icon: '◈', label: 'Article', color: '#8B9EC7' },
}

const FILTERS = ['all', 'youtube', 'spotify', 'soundcloud', 'article']

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
}

function MediaCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const meta = TYPE_META[item.type]

  return (
    <motion.div
      className="v4-media-card"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      layout
    >
      {/* Type badge */}
      <div className="v4-media-card__type" style={{ '--type-color': meta.color }}>
        <span className="v4-media-card__type-icon">{meta.icon}</span>
        <span>{meta.label}</span>
      </div>

      {/* YouTube embed thumbnail */}
      {item.type === 'youtube' && item.embedId && (
        <div
          className="v4-media-card__thumb"
          onClick={() => setExpanded(e => !e)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={`https://img.youtube.com/vi/${item.embedId}/mqdefault.jpg`}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div className="v4-media-card__play-overlay">
            <span>{expanded ? '✕' : '▶'}</span>
          </div>
        </div>
      )}

      {/* Expanded YouTube iframe */}
      <AnimatePresence>
        {expanded && item.embedId && (
          <motion.div
            className="v4-media-card__embed"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${item.embedId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '200px', border: 'none', display: 'block' }}
              title={item.title}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <div className="v4-media-card__body">
        <div className="v4-media-card__meta">
          <span className="v4-media-card__creator">{item.creator}</span>
          <span className="v4-media-card__date">{item.date}</span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="v4-media-card__title"
        >
          {item.title}
          <span className="v4-media-card__link-arrow">↗</span>
        </a>
        {item.note && (
          <p className="v4-media-card__note">"{item.note}"</p>
        )}
        <div className="v4-media-card__tags">
          {(item.tags || []).map(t => (
            <span key={t} className="v4-media-card__tag">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function V4MediaConsumed() {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all'
    ? MEDIA
    : MEDIA.filter(m => m.type === filter)

  return (
    <section className="v4-media-section">
      {/* Header */}
      <div className="v4-media-section__header">
        <div className="v4-media-section__overline">LOG · ONGOING</div>
        <h2 className="v4-media-section__title">Media I've consumed lately</h2>
        <p className="v4-media-section__sub">
          A running list of videos, music, and articles I've been sitting with — updated as I go.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="v4-media-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`v4-media-filter-tab${filter === f ? ' v4-media-filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'ALL' : TYPE_META[f]?.icon + ' ' + TYPE_META[f]?.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div className="v4-media-grid" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <MediaCard key={`${item.type}-${item.title}`} item={item} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
