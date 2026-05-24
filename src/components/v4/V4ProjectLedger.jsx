import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'

const PROJECTS = [
  {
    id: 'p-01',
    title: 'SOVEREIGN BRAND SYSTEM',
    category: 'Brand Identity',
    year: '2025',
    tech: ['Figma', 'After Effects', 'React'],
    brief: 'End-to-end identity for a luxury streetwear label — type system, color architecture, motion language, and digital touchpoints.',
    status: 'Shipped',
    serial: 'OBJ_ID-001',
    timestamp: '2025-02-14T09:00:00Z',
  },
  {
    id: 'p-02',
    title: 'NEURAL ARCHIVE INTERFACE',
    category: 'Technical Design',
    year: '2025',
    tech: ['Next.js', 'GSAP', 'Three.js'],
    brief: 'Experimental editorial interface for an AI research archive. Scroll-driven 3D transitions, generative typography, and ambient particle fields.',
    status: 'Live',
    serial: 'OBJ_ID-002',
    timestamp: '2025-03-22T14:30:00Z',
  },
  {
    id: 'p-03',
    title: 'OBSIDIAN EDITORIAL PLATFORM',
    category: 'Creative Direction',
    year: '2024',
    tech: ['Framer', 'Cinema 4D', 'Webflow'],
    brief: 'Creative direction for a global culture magazine. Art direction, layout systems, digital-first editorial design, and print bridge.',
    status: 'Shipped',
    serial: 'OBJ_ID-003',
    timestamp: '2024-11-02T11:15:00Z',
  },
  {
    id: 'p-04',
    title: 'SIGNAL PROCESSING TOOLKIT',
    category: 'Audio Production',
    year: '2024',
    tech: ['Ableton', 'Max/MSP', 'Python'],
    brief: 'Custom audio processing chain for generative music production — spectral analysis, granular synthesis, and real-time visualization hooks.',
    status: 'Active',
    serial: 'OBJ_ID-004',
    timestamp: '2024-08-19T16:45:00Z',
  },
  {
    id: 'p-05',
    title: 'PHANTOM MOTION STUDY',
    category: 'Motion Design',
    year: '2025',
    tech: ['After Effects', 'Lottie', 'Framer Motion'],
    brief: 'Motion identity system for a tech startup — micro-interactions, loading choreography, page transitions, and brand animation primitives.',
    status: 'Shipped',
    serial: 'OBJ_ID-005',
    timestamp: '2025-01-05T10:20:00Z',
  },
  {
    id: 'p-06',
    title: 'VOID COMMERCE ENGINE',
    category: 'AI Workflows',
    year: '2025',
    tech: ['Claude', 'Vercel AI SDK', 'Stripe'],
    brief: 'AI-integrated commerce prototype — conversational product discovery, dynamic pricing surfaces, and automated creative asset generation.',
    status: 'Prototype',
    serial: 'OBJ_ID-006',
    timestamp: '2025-04-10T13:00:00Z',
  },
]

const FEATURED_PREVIEWS = [
  {
    id: 'seoulstice',
    eyebrow: 'LIVE PROJECT // SEOULSTICE',
    title: 'Seoulstice',
    description: 'Soft retail identity, ritual skincare world, and old-web campaign residue.',
    href: '/projects/seoulstice/index.html',
    mediaType: 'iframe',
    tags: ['Design', 'Code', 'AI'],
  },
  {
    id: 'ranaan-ccc',
    eyebrow: 'LIVE PROJECT // RANAAN CCC',
    title: 'Ranaan CCC',
    description: 'Future Archives flip issue with campaign image systems and interactive spreads.',
    href: '/projects/ranaan-ccc/index.html',
    image: '/projects/ranaan-ccc/cover_hero_1776994472537.png',
    tags: ['Design', 'Code', 'AI'],
  },
  {
    id: 'jiayou-website',
    eyebrow: 'LIVE PROJECT // JIAYOU WEBSITE',
    title: 'Jiayou Calm-Energy Coffee',
    description: 'Editorial coffee-shop site with shop, menu, and club rituals.',
    href: '/projects/jiayou/jiayou-coffee-shop-website-v3.html',
    mediaType: 'iframe',
    tags: ['Design', 'Code', 'Brand'],
  },
  {
    id: 'jiayou-magazine',
    eyebrow: 'LIVE PROJECT // JIAYOU MAGAZINE',
    title: 'Jiayou Editorial Magazine',
    description: 'Hover-scrub virtual magazine exploring calm energy and coffee rituals.',
    href: '/projects/jiayou/jiayou-editorial-coffee-shop-v2.html',
    mediaType: 'iframe',
    tags: ['Design', 'Code', 'Editorial'],
  },
]

const STATUS_COLORS = {
  Shipped: 'var(--v4-accent)',
  Live: '#28C840',
  Active: '#FEBC2E',
  Prototype: '#AF52DE',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function V4ProjectLedger() {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <section id="work" className="v4-ledger" data-v4-animate>
      <div className="v4-ledger__head">
        <p className="v4-kicker">LEDGER / WORK INDEX</p>
        <h2 className="v4-h2">PROJECT RECORD</h2>
      </div>

      <Motion.div
        className="v4-ledger-bento"
        aria-label="Featured project previews"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {FEATURED_PREVIEWS.map((preview) => (
          <Motion.a
            key={preview.id}
            className={`v4-ledger-bento__card v4-ledger-bento__card--${preview.id}`}
            href={preview.href}
            target="_blank"
            rel="noreferrer"
            variants={itemVariants}
          >
            <div className="v4-ledger-bento__media" aria-hidden="true">
              {preview.mediaType === 'iframe' ? (
                <iframe
                  src={preview.href}
                  title={`${preview.title} preview`}
                  tabIndex="-1"
                  loading="lazy"
                />
              ) : (
                <img src={preview.image} alt="" loading="lazy" />
              )}
            </div>

            <div className="v4-ledger-bento__content">
              <span>{preview.eyebrow}</span>
              <strong>{preview.title}</strong>
              <p>{preview.description}</p>
              <div className="v4-ledger-bento__tags" aria-label={`${preview.title} tags`}>
                {preview.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </Motion.a>
        ))}
      </Motion.div>

      <Motion.div 
        className="v4-ledger__list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="v4-ledger__table-head">
          <span className="v4-kicker">#</span>
          <span className="v4-kicker">ASSET NAME</span>
          <span className="v4-kicker">CATEGORY_SYS</span>
          <span className="v4-kicker">CYCLE</span>
          <span className="v4-kicker">STATE</span>
          <span className="v4-kicker" />
        </div>

        {PROJECTS.map((project, index) => {
          const isOpen = expandedId === project.id
          return (
            <Motion.article
              key={project.id}
              variants={itemVariants}
              className={`v4-ledger__item ${isOpen ? 'is-open' : ''}`}
              onClick={() => setExpandedId(isOpen ? null : project.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isOpen ? null : project.id)}
              aria-expanded={isOpen}
            >
              <div className="v4-ledger__row">
                <span className="v4-ledger__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="v4-ledger__title">{project.title}</span>
                <span className="v4-ledger__cat">{project.category}</span>
                <span className="v4-ledger__year">{project.year}</span>
                <span
                  className="v4-ledger__status"
                  style={{ color: STATUS_COLORS[project.status] || 'var(--v4-muted)' }}
                >
                  <span className="v4-ledger__status-dot" style={{ backgroundColor: STATUS_COLORS[project.status] }} />
                  {project.status.toUpperCase()}
                </span>
                <span className="v4-ledger__chevron">
                  <Motion.span animate={{ rotate: isOpen ? 45 : 0 }}>+</Motion.span>
                </span>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <Motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="v4-ledger__detail"
                  >
                    <div className="v4-meta-row" style={{ marginTop: 0 }}>
                      <span className="v4-badge">{project.serial}</span>
                      <div className="v4-meta-line" />
                      <span>LAST_MOD: {project.timestamp}</span>
                    </div>

                    <p className="v4-ledger__brief">{project.brief}</p>
                    
                    <div className="v4-ledger__tech">
                      <span className="v4-kicker" style={{ display: 'block', marginBottom: 8, fontSize: '8px' }}>TECH_STACK</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {project.tech.map((t) => (
                          <span key={t} className="v4-ledger__chip">{t}</span>
                        ))}
                      </div>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.article>
          )
        })}
      </Motion.div>

      <div className="v4-ledger__footer">
        <div className="v4-meta-line" style={{ marginBottom: 12 }} />
        <span className="v4-kicker">{PROJECTS.length} OBJECTS INDEXED IN DATABASE_V4</span>
      </div>
    </section>
  )
}
