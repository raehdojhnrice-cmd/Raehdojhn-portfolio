import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import ArchiveSectionChrome from './ui/ArchiveSectionChrome'

const EASE = [0.16, 1, 0.3, 1]

const STORAGE_KEY = 'rae-blog-posts'

/* ─── SAMPLE BLOG DATA ─────────────────────────────────────────
   Replace or extend with your actual posts. Posts with 'platform'
   = 'medium' or 'substack' will show an external-link icon and
   open in a new tab. Posts with platform = 'local' will render
   inline content.
   ─────────────────────────────────────────────────────────────── */
const DEFAULT_POSTS = [
  {
    id: 1,
    title: 'The Modern Renaissance: Why Multidisciplinary Creativity Wins',
    excerpt: 'We stand at the edge of a new Renaissance — a moment where the boundaries between disciplines dissolve and a single creative can orchestrate entire worlds across mediums.',
    date: '2026-03-28',
    tags: ['Essay', 'Creative Direction'],
    platform: 'local',
    url: '',
    coverColor: 'var(--accent)',
  },
  {
    id: 2,
    title: 'Building a Brutalist Design System from Scratch',
    excerpt: 'How I approached creating a design system rooted in brutalist aesthetics — from color tokens to component architecture, using React and CSS custom properties.',
    date: '2026-03-15',
    tags: ['Technical', 'Design Systems'],
    platform: 'medium',
    url: 'https://medium.com/@raehdojhn',
    coverColor: 'var(--cyan-light)',
  },
  {
    id: 3,
    title: 'AI-Integrated Workflows: Rethinking Creative Production',
    excerpt: 'A deep dive into how generative AI tools fit into a holistic creative pipeline — not as replacements, but as accelerators for human-directed work.',
    date: '2026-02-22',
    tags: ['AI', 'Workflow'],
    platform: 'substack',
    url: 'https://raehdojhn.substack.com',
    coverColor: 'var(--accent-marker)',
  },
]

function getPlatformLabel(platform) {
  switch (platform) {
    case 'medium': return 'MEDIUM'
    case 'substack': return 'SUBSTACK'
    default: return 'BLOG'
  }
}

function getPlatformIcon(platform) {
  switch (platform) {
    case 'medium':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      )
    case 'substack':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
        </svg>
      )
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/>
        </svg>
      )
  }
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function BlogCard({ post, index, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const isExternal = post.platform === 'medium' || post.platform === 'substack'

  const handleClick = () => onSelect(post)

  return (
    <FadeIn delay={index * 0.08}>
      <div
        className="blog-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        style={{
          borderColor: hovered ? 'var(--border-hover)' : 'var(--border-subtle)',
          background: hovered ? 'rgba(17,17,17,0.6)' : 'transparent',
          cursor: 'pointer',
        }}
      >
        {/* Accent strip */}
        <div className="blog-card__strip" style={{ background: post.coverColor }} />
        
        {/* Header */}
        <div className="blog-card__header">
          <div className="blog-card__platform">
            {getPlatformIcon(post.platform)}
            <span>{getPlatformLabel(post.platform)}</span>
          </div>
          <span className="blog-card__date">
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h3 className="blog-card__title" style={{
          color: hovered ? 'var(--bone)' : 'var(--dust)',
        }}>
          {post.title}
          {isExternal && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"
              style={{ marginLeft: 6, opacity: hovered ? 1 : 0.3, transition: 'opacity 0.2s', verticalAlign: 'middle' }}
            >
              <path d="M3 1H9V7"/><line x1="9" y1="1" x2="1" y2="9"/>
            </svg>
          )}
        </h3>

        {/* Excerpt */}
        <p className="blog-card__excerpt">{post.excerpt}</p>

        {/* Tags */}
        <div className="blog-card__tags">
          {post.tags.map(tag => (
            <span key={tag} className="blog-card__tag">{tag}</span>
          ))}
        </div>

        {/* Read indicator */}
        <motion.div
          className="blog-card__arrow"
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          →
        </motion.div>
      </div>
    </FadeIn>
  )
}

/* ─── Tabs ──────────────────────────────────────────────────── */
function TabButton({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em',
        textTransform: 'uppercase', padding: '8px 16px',
        color: active ? 'var(--bone)' : 'var(--ash)',
        borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
        background: 'transparent', cursor: 'pointer', transition: 'all 0.25s ease',
      }}
    >
      {label}
      {count !== undefined && (
        <span style={{ marginLeft: 6, color: 'var(--border-raised)', fontSize: '8px' }}>
          {count}
        </span>
      )}
    </button>
  )
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function Blog() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const sectionRef = useRef(null)
  const headerInView = useInView(sectionRef, { once: true, amount: 0.08 })

  // Admin form state
  const [addForm, setAddForm] = useState({ title: '', excerpt: '', platform: 'local', url: '', content: '' })

  // Load posts from localStorage or defaults
  const [posts, setPosts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      return stored && stored.length > 0 ? stored : DEFAULT_POSTS
    } catch {
      return DEFAULT_POSTS
    }
  })

  // Submit new post
  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!addForm.title) return
    const newPost = {
      id: Date.now(),
      title: addForm.title,
      excerpt: addForm.excerpt,
      date: new Date().toISOString().split('T')[0],
      tags: ['Uploaded'],
      platform: addForm.platform,
      url: addForm.url,
      content: addForm.content,
      coverColor: addForm.platform === 'medium' ? 'var(--cyan-light)' : addForm.platform === 'substack' ? 'var(--accent-marker)' : 'var(--bone)',
    }
    const updated = [newPost, ...posts]
    setPosts(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setAddForm({ title: '', excerpt: '', platform: 'local', url: '', content: '' })
    setShowAdmin(false)
  }

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter(p => p.platform === activeTab)

  const allCount = posts.length
  const localCount = posts.filter(p => p.platform === 'local').length
  const mediumCount = posts.filter(p => p.platform === 'medium').length
  const substackCount = posts.filter(p => p.platform === 'substack').length

  return (
    <section id="blog" ref={sectionRef} className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="section__container" style={{ maxWidth: 1440 }}>
        {/* Section Header */}
        <ArchiveSectionChrome 
          index="04" 
          label="DOCUMENTATION" 
          title="Archive Log" 
          subtitle="Essays on design, technology, and culture — published here and across platforms."
        />

        {/* Tab filters and Admin Add Post button */}
        <FadeIn delay={0.08}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-subtle)', marginBottom: 'clamp(32px, 4vw, 48px)'
          }}>
            <div style={{ display: 'flex', gap: 0, overflowX: 'auto', flex: 1 }}>
              <TabButton label="All" active={activeTab === 'all'} onClick={() => setActiveTab('all')} count={allCount} />
              <TabButton label="Blog" active={activeTab === 'local'} onClick={() => setActiveTab('local')} count={localCount} />
              <TabButton label="Medium" active={activeTab === 'medium'} onClick={() => setActiveTab('medium')} count={mediumCount} />
              <TabButton label="Substack" active={activeTab === 'substack'} onClick={() => setActiveTab('substack')} count={substackCount} />
            </div>
            
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', background: showAdmin ? 'var(--accent)' : 'transparent',
                color: showAdmin ? 'var(--bone)' : 'var(--text-secondary)', padding: '6px 12px', border: '1px solid var(--border-hover)',
                cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap', marginTop: '6px'
              }}
            >
              [ {showAdmin ? '-' : '+'} ADMIN: ADD POST ]
            </button>
          </div>
        </FadeIn>

        {/* Admin Interface form */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: '32px' }}
            >
              <form onSubmit={handleAddSubmit} style={{ background: 'var(--bg-secondary)', padding: '24px', border: '1px solid var(--border-subtle)' }}>
                <h3 className="mono-tag" style={{ color: 'var(--accent)', marginBottom: '24px' }}>PUBLISH NEW ARTICLE</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <input className="form-input" placeholder="Article Title..." value={addForm.title} onChange={e => setAddForm(f => ({...f, title: e.target.value}))} required />
                  <select className="form-input" value={addForm.platform} onChange={e => setAddForm(f => ({...f, platform: e.target.value}))} style={{ background: 'var(--bg-primary)' }}>
                    <option value="local">Native Portfolio Blog</option>
                    <option value="substack">Substack Embed Link</option>
                    <option value="medium">Medium Embed Link</option>
                  </select>
                </div>
                <input className="form-input" placeholder="Short Excerpt Summary..." value={addForm.excerpt} onChange={e => setAddForm(f => ({...f, excerpt: e.target.value}))} style={{ marginBottom: '16px' }} />
                
                {addForm.platform === 'local' ? (
                  <textarea className="form-input form-textarea" placeholder="Write your full markdown blog post here..." value={addForm.content} onChange={e => setAddForm(f => ({...f, content: e.target.value}))} style={{ minHeight: '180px', marginBottom: '16px' }} />
                ) : (
                  <input className="form-input" placeholder="Paste Substack or Medium URL here..." value={addForm.url} onChange={e => setAddForm(f => ({...f, url: e.target.value}))} style={{ marginBottom: '16px' }} />
                )}
                
                <button type="submit" className="btn btn--primary">PUBLISH ARTICLE</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Grid */}
        <div className="blog-grid">
          {filteredPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} onSelect={setSelectedPost} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p className="mono-tag" style={{ color: 'var(--ash)', fontSize: '10px' }}>
              No posts in this category yet.
            </p>
          </div>
        )}

        {/* Inline Post Reader */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              className="blog-reader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ background: 'var(--bg-secondary)', padding: '24px', border: '1px solid var(--border-subtle)', marginTop: '24px' }}
            >
              <div className="blog-reader__header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '24px' }}>
                <button onClick={() => setSelectedPost(null)} className="btn btn--secondary" style={{ padding: '8px 16px', fontSize: '9px' }}>
                  ← BACK TO POSTS
                </button>
                <span className="blog-reader__date" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                  {new Date(selectedPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="blog-reader__title" style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '16px' }}>{selectedPost.title}</h2>
              
              {selectedPost.platform === 'local' ? (
                <div className="blog-reader__body">
                  <p style={{ fontSize: '18px', color: 'var(--dust)', marginBottom: '24px' }}>{selectedPost.excerpt}</p>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {selectedPost.content ? (
                      Array.isArray(selectedPost.content) ? (
                        selectedPost.content.map((p, i) => (
                          <p key={i} style={{ marginBottom: '1.5rem' }}>{p}</p>
                        ))
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: String(selectedPost.content).replace(/\n/g, '<br />') }} />
                      )
                    ) : (
                      <p style={{ color: 'var(--ash)', fontStyle: 'italic', marginTop: 24 }}>No internal body written for this post.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '70vh', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <iframe 
                    src={selectedPost.url} 
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title={selectedPost.title}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
