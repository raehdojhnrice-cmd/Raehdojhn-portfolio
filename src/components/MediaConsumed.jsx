import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ArchiveSectionChrome from './ui/ArchiveSectionChrome'
import ArchiveMetaRow from './ui/ArchiveMetaRow'
import mediaItems from '../data/media-items.json'

const EASE = [0.16, 1, 0.3, 1]
const FILTERS = ['all', 'youtube', 'spotify', 'soundcloud', 'self_hosted_audio', 'self_hosted_video']

const toLabel = (v) => v.replaceAll('_', ' ').toUpperCase()

const spotifyPath = (embedId = '') =>
  embedId.startsWith('spotify:')
    ? embedId.replace('spotify:', '').replaceAll(':', '/')
    : embedId

const queueMediaTrack = (item) => {
  const isAudio = ['spotify', 'soundcloud', 'self_hosted_audio', 'youtube'].includes(item.type)
  if (!isAudio || !item.url) return
  window.dispatchEvent(
    new CustomEvent('rae:queue-track', {
      detail: {
        title: item.title,
        artist: item.creator || 'Unknown',
        source: item.type,
        url: item.url,
      },
    })
  )
}

function MediaCard({ item, index }) {
  const [hovered, setHovered] = useState(false)
  const isAudio = ['youtube', 'spotify', 'soundcloud', 'self_hosted_audio'].includes(item.type)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="ako-grain-lite"
      style={{
        border: `1px solid ${hovered ? 'var(--color-rust)' : 'var(--archive-line)'}`,
        background: 'var(--bg-secondary)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transition: 'border-color 220ms ease',
      }}
    >
      <div className="archive-kicker">
        <span className="archive-chip">{toLabel(item.type)}</span>
        <span className="archive-dot" />
        <span>{item.date_consumed}</span>
      </div>

      {item.type === 'youtube' && item.embed_id ? (
        <iframe
          title={item.title}
          src={`https://www.youtube-nocookie.com/embed/${item.embed_id}?rel=0&modestbranding=1`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            width: '100%',
            aspectRatio: '16/9',
            border: '1px solid var(--archive-line)',
          }}
        />
      ) : null}

      {item.type === 'spotify' && item.embed_id ? (
        <iframe
          title={item.title}
          src={`https://open.spotify.com/embed/${spotifyPath(item.embed_id)}?utm_source=generator&theme=0`}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{
            width: '100%',
            height: '152px',
            border: '1px solid var(--archive-line)',
          }}
        />
      ) : null}

      {item.type === 'soundcloud' && item.url ? (
        <iframe
          title={item.title}
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(item.url)}&color=%23A65D3F&auto_play=false&hide_related=true&show_comments=false&show_user=true&visual=false`}
          loading="lazy"
          style={{
            width: '100%',
            height: '166px',
            border: '1px solid var(--archive-line)',
          }}
        />
      ) : null}

      {item.type === 'self_hosted_audio' && item.url ? (
        <audio controls preload="none" style={{ width: '100%' }}>
          <source src={item.url} />
        </audio>
      ) : null}

      {item.type === 'self_hosted_video' && item.url ? (
        <video
          controls
          preload="metadata"
          style={{
            width: '100%',
            border: '1px solid var(--archive-line)',
          }}
        >
          <source src={item.url} />
        </video>
      ) : null}

      <h3
        style={{
          fontFamily: 'var(--font-ako-display)',
          fontSize: '1.35rem',
          lineHeight: 1,
          color: 'var(--text-primary)',
        }}
      >
        {item.title}
      </h3>

      <ArchiveMetaRow label="CREATOR" value={item.creator || 'UNKNOWN'} />

      {item.note ? <p className="ako-annotation">{item.note}</p> : null}

      <div className="archive-meta-row" style={{ fontSize: '8px' }}>
        <span>{(item.tags || []).join(' • ') || 'UNTAGGED'}</span>
      </div>

      {isAudio ? (
        <button
          type="button"
          onClick={() => queueMediaTrack(item)}
          className="archive-chip"
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          QUEUE TO PLAYER
        </button>
      ) : null}
    </motion.article>
  )
}


export default function MediaConsumed() {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return mediaItems
    return mediaItems.filter((item) => item.type === filter)
  }, [filter])

  return (
    <section
      className="section"
      id="media"
      style={{ borderTop: '1px solid var(--archive-line, var(--border-subtle))' }}
    >
      <div className="section__container">
        <ArchiveSectionChrome
          index="01A"
          label="MEDIA"
          issue="RAE-26-M01"
          title="Media I've Consumed"
          subtitle="Videos, tracks, references — annotated fragments from the archive."
        />

        <div
          style={{
            marginBottom: '18px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '16px',
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`}
              style={{ fontSize: '9px' }}
            >
              {toLabel(f)}
            </button>
          ))}
        </div>

        <ArchiveMetaRow
          label="SHELF STATUS"
          value={`VISIBLE ${filtered.length} / TOTAL ${mediaItems.length}`}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2px',
            marginTop: '14px',
          }}
        >
          {filtered.map((item, i) => (
            <MediaCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
