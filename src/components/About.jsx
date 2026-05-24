import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ArchiveSectionChrome from './ui/ArchiveSectionChrome'

const EASE = [0.16, 1, 0.3, 1]

const SKILLS = [
  { category: 'Design', accent: 'var(--accent)', items: ['Visual Identity', 'Art Direction', 'Brand Systems', 'Editorial Design', 'Motion Design', 'Spatial Design'] },
  { category: 'Development', accent: 'var(--cyan-light)', items: ['React / JavaScript', 'Next.js', 'CSS / Animation', 'Three.js', 'WebGL', 'Design Systems'] },
  { category: 'Tools', accent: 'var(--ash)', items: ['Figma', 'Adobe Suite', 'Cinema 4D', 'After Effects', 'Pro Tools', 'Ableton', 'FL Studio', 'DaVinci Resolve', 'Claude', 'Gemini'] },
  { category: 'Process', accent: 'var(--border-raised)', items: ['Research & Strategy', 'Prototyping', 'Creative Direction', 'Client Relations'] },
]

function FadeIn({ children, delay = 0, className, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const headerInView = useInView(sectionRef, { once: true, amount: 0.08 })

  return (
    <section id="about" ref={sectionRef} className="section about-section">
      <div className="section__container" style={{ maxWidth: 1440 }}>
        {/* Section Header */}
        <ArchiveSectionChrome 
          index="03" 
          label="PERSONA & PROCESS" 
          title="About"
          subtitle="Design at the edge of language."
        />

        {/* Split layout */}
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
          {/* Bio */}
          <FadeIn>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.2vw, 17px)', fontWeight: 300, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              <p style={{ marginTop: 0 }}>
                I'm Raehdojhn — a classically trained artist from Charlotte, North Carolina,
                now creating from Los Angeles. My work exists at the intersection of
                traditional craft and emerging technology — a modern renaissance where
                the boundaries between disciplines dissolve.
              </p>

              {/* Pull quote */}
              <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '1.5rem', margin: '2rem 0' }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)',
                  fontWeight: 400, lineHeight: 1.4, letterSpacing: '-0.015em',
                  color: 'var(--text-primary)', margin: 0, fontStyle: 'italic',
                }}>
                  "The future belongs to those who refuse to be categorized."
                </p>
              </div>

              <p>
                I see this moment as a time when an artist can be an engineer, a coder can
                be a painter, and a single creative can orchestrate entire worlds across mediums.
                I work across audio, visual, code, and copy — not because I can't choose a lane,
                but because the lane itself is obsolete.
              </p>
            </div>
          </FadeIn>


          {/* Skills Grid */}
          <FadeIn delay={0.12}>
            <div style={{ paddingTop: 32, borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Skills & Tools
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px 32px', marginTop: 24 }}>
                {SKILLS.map(group => (
                  <div key={group.category}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 3, height: 10, background: group.accent, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: group.accent }}>
                        {group.category}
                      </span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {group.items.map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 3, height: 3, background: group.accent, opacity: 0.4, flexShrink: 0 }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Availability */}
          <FadeIn delay={0.16}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, paddingTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 5, height: 5, background: 'var(--signal)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--online)' }}>
                  Available for work
                </span>
              </div>
              <div style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Los Angeles / Remote
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
