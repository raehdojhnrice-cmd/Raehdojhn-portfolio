import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import defaultProjects from '../data/projects.json'
import ArchiveMetaRow from './ui/ArchiveMetaRow'
import ArchiveSectionChrome from './ui/ArchiveSectionChrome'

const STORAGE_KEY = 'rae-projects-v2'
const CATEGORIES = ['all', 'design', 'code', 'music', 'ai', 'video']
const DEPRECATED_EMBED_URLS = new Set([
  '/projects/ranaan-garments-store/index.html',
  '/projects/bks-designs-store/index.html',
])

// Native iframe viewport width we design against
const IFRAME_NATIVE_W = 1440
const IFRAME_NATIVE_H = 900

function getProjects() {
  try {
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      const localProjects = JSON.parse(local).filter(project => (
        !DEPRECATED_EMBED_URLS.has(project.embedUrl || project.link)
      ))
      const known = new Set(localProjects.map(project => project.embedUrl || project.link || project.title))
      const missingDefaults = (defaultProjects || []).filter(project => {
        const key = project.embedUrl || project.link || project.title
        return !known.has(key)
      })
      return [...missingDefaults, ...localProjects]
    }
    return defaultProjects || []
  } catch {
    return defaultProjects || []
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

// ── Bento Project Card — glassmorphic, live iframe preview ────────────────────
function BentoProjectCard({ project, index }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(0.27)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / IFRAME_NATIVE_W)
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const previewH = Math.round(IFRAME_NATIVE_H * scale)
  const tags = project.categories || []

  return (
    <motion.article
      className={`bento-card${project.featured ? ' bento-card--featured' : ''}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.09, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Live interactive preview ── */}
      <div ref={wrapRef} className="bento-card__preview" style={{ height: previewH }}>
        {project.embedUrl ? (
          <iframe
            src={project.embedUrl}
            title={project.title}
            loading="lazy"
            style={{
              display: 'block',
              width: IFRAME_NATIVE_W,
              height: IFRAME_NATIVE_H,
              border: 'none',
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
              pointerEvents: 'auto',
            }}
          />
        ) : project.image ? (
          <img src={project.image} alt={project.title} className="bento-card__fallback-img" />
        ) : (
          <div className="bento-card__fallback-num">
            {String(index + 1).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* ── Info strip ── */}
      <div className="bento-card__info">
        <div className="bento-card__copy">
          <h3 className="bento-card__title">{project.title || 'Untitled'}</h3>
          <p className="bento-card__sub">{project.subtitle || ''}</p>
        </div>
        <div className="bento-card__footer">
          <div className="bento-card__tags">
            {tags.map(t => (
              <span key={t} className={`bento-tag bento-tag--${t}`}>{t.toUpperCase()}</span>
            ))}
          </div>
          <a
            href={project.link || project.embedUrl}
            target="_blank"
            rel="noreferrer"
            className="bento-card__open"
            aria-label={`Open ${project.title}`}
          >
            ↗
          </a>
        </div>
      </div>
    </motion.article>
  )
}

export default function ProjectGrid() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAdmin, setShowAdmin] = useState(false)
  const [formData, setFormData] = useState({
    title: '', subtitle: '', year: new Date().getFullYear(),
    categories: '', tools: '', link: '', image: '', featured: false
  })

  useEffect(() => {
    setProjects(getProjects())
    const handler = () => setProjects(getProjects())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => (p.categories || []).some(c => c.toLowerCase() === filter))

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width, h = img.height
        if (w > 1200) { h = (1200 / w) * h; w = 1200 }
        if (h > 1500) { w = (1500 / h) * w; h = 1500 }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        setFormData(fd => ({ ...fd, image: canvas.toDataURL('image/jpeg', 0.85) }))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const addProject = (e) => {
    e.preventDefault()
    const project = {
      ...formData,
      categories: formData.categories.split(',').map(s => s.trim()).filter(Boolean),
      tools: formData.tools.split(',').map(s => s.trim()).filter(Boolean),
      year: parseInt(formData.year) || new Date().getFullYear(),
      createdAt: new Date().toISOString()
    }
    const updated = [...projects, project]
    saveProjects(updated)
    setProjects(updated)
    setFormData({ title: '', subtitle: '', year: new Date().getFullYear(), categories: '', tools: '', link: '', image: '', featured: false })
    setShowAdmin(false)
  }

  const deleteProject = (index) => {
    if (!confirm('Delete this project?')) return
    const updated = projects.filter((_, i) => i !== index)
    saveProjects(updated)
    setProjects(updated)
  }

  const exportForDeployment = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2))
    const a = document.createElement('a')
    a.setAttribute("href", dataStr)
    a.setAttribute("download", "projects.json")
    document.body.appendChild(a)
    a.click()
    a.remove()
    alert("Downloaded projects.json! Drag this file into your `src/data/` folder and push to deploy.")
  }

  return (
    <section className="section" id="work">
      <div className="section__container">
        <ArchiveSectionChrome index="01" label="SELECTED WORK" title="Work" />
        <ArchiveMetaRow left="ARCHIVE GRID" right={`${filtered.length} ITEMS`} />

        <motion.div
          className="filters"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-tab${filter === cat ? ' filter-tab--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </motion.div>



        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <div className="project-grid" key="grid">
              {filtered.map((project, i) => (
                <BentoProjectCard key={project.createdAt || i} project={project} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="empty-state"
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="empty-state__icon">—</p>
              <p className="empty-state__text">
                {projects.length === 0
                  ? 'No projects yet. Add your first project below.'
                  : 'No projects match this filter.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="manage-link" style={{ marginTop: '48px' }}>
          <button className="btn btn--secondary" onClick={() => setShowAdmin(!showAdmin)}>
            {showAdmin ? 'CLOSE EDITOR' : '⚙ ADD / MANAGE PROJECTS'}
          </button>
        </div>

        {/* INLINE ADMIN PANEL */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden', marginTop: '32px' }}
            >
              <div style={{
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--border-radius)',
                padding: '32px', background: 'var(--bg-secondary)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', marginBottom: '24px', color: 'var(--text-secondary)' }}>
                  ADD NEW PROJECT
                </h3>
                <form onSubmit={addProject}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label mono-tag">TITLE *</label>
                      <input className="form-input" required value={formData.title}
                        onChange={e => setFormData(fd => ({...fd, title: e.target.value}))}
                        placeholder="Project name" />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label mono-tag">YEAR</label>
                      <input className="form-input" type="number" value={formData.year}
                        onChange={e => setFormData(fd => ({...fd, year: e.target.value}))} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label mono-tag">SUBTITLE</label>
                    <input className="form-input" value={formData.subtitle}
                      onChange={e => setFormData(fd => ({...fd, subtitle: e.target.value}))}
                      placeholder="Brief description" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label mono-tag">CATEGORIES (comma separated)</label>
                      <input className="form-input" value={formData.categories}
                        onChange={e => setFormData(fd => ({...fd, categories: e.target.value}))}
                        placeholder="design, code, ai" />
                    </div>
                    <div className="form-group">
                      <label className="form-label mono-tag">TOOLS</label>
                      <input className="form-input" value={formData.tools}
                        onChange={e => setFormData(fd => ({...fd, tools: e.target.value}))}
                        placeholder="figma, react, python" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label mono-tag">LINK</label>
                    <input className="form-input" type="url" value={formData.link}
                      onChange={e => setFormData(fd => ({...fd, link: e.target.value}))}
                      placeholder="https://..." />
                  </div>

                  <div className="form-group">
                    <label className="form-label mono-tag">IMAGE</label>
                    <div style={{
                      border: '2px dashed var(--border-subtle)', borderRadius: 'var(--border-radius)',
                      padding: '24px', textAlign: 'center', cursor: 'pointer', position: 'relative',
                      background: formData.image ? 'none' : 'var(--bg-primary)',
                      maxHeight: '200px', overflow: 'hidden'
                    }}>
                      {formData.image ? (
                        <img src={formData.image} alt="preview" style={{ maxHeight: '180px', margin: '0 auto', objectFit: 'contain' }} />
                      ) : (
                        <span className="mono-tag">Click or drag to upload</span>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="mono-tag" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" checked={formData.featured}
                        onChange={e => setFormData(fd => ({...fd, featured: e.target.checked}))}
                        style={{ accentColor: 'var(--accent)' }} />
                      FEATURED (spans 2 columns)
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn--primary">ADD PROJECT</button>
                    <button type="button" className="btn btn--secondary" onClick={() => setShowAdmin(false)}>CANCEL</button>
                    <button type="button" className="btn btn--secondary" onClick={exportForDeployment}
                      style={{ marginLeft: 'auto', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                      ↓ EXPORT JSON FOR DEPLOYMENT
                    </button>
                  </div>
                </form>

                {projects.length > 0 && (
                  <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                    <p className="mono-tag" style={{ marginBottom: '16px' }}>YOUR PROJECTS ({projects.length})</p>
                    {projects.map((p, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--border-radius)', marginBottom: '8px',
                        background: 'var(--bg-primary)'
                      }}>
                        <div style={{
                          width: '48px', height: '60px', borderRadius: 'var(--border-radius)',
                          overflow: 'hidden', flexShrink: 0, background: 'var(--bg-surface)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {p.image ? (
                            <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span className="mono-tag">{String(i + 1).padStart(2, '0')}</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.title}</div>
                          <div className="mono-tag">{p.year} {p.featured ? '· ★ FEATURED' : ''}</div>
                        </div>
                        <button className="btn btn--ghost" style={{ color: 'var(--error)' }}
                          onClick={() => deleteProject(i)}>DELETE</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
