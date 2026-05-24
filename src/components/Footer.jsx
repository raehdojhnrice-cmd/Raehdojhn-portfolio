import { useState } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const FOOTER_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Influences', href: '#influences' },
]



function FooterLink({ label, href }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-body)', fontSize: '14px',
        color: hovered ? 'var(--bone)' : 'var(--dust)',
        transition: 'color 0.2s', textDecoration: 'none',
      }}
    >
      {label}
    </a>
  )
}


export default function Footer() {
  const [emailHovered, setEmailHovered] = useState(false)
  const [backToTopHovered, setBackToTopHovered] = useState(false)

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(64px, 8vw, 96px) clamp(16px, 5vw, 64px)' }}>
        <div className="footer-grid">
          {/* Column 1: Logo + tagline */}
          <div className="footer-col footer-col--brand">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.35em', color: 'var(--accent)', textTransform: 'uppercase' }}>R.R</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--bone)' }}>Raehdojhn</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, color: 'var(--dust)', maxWidth: 340 }}>
              Artist. Technologist. Modern Renaissance. Blending creativity and technology across audio, visual, code, and copy.
            </p>

            {/* Email */}
            <a
              href="mailto:raehdojhn@gmail.com"
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 24,
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: emailHovered ? 'var(--red-hover)' : 'var(--accent)',
                transition: 'color 0.2s',
              }}
            >
              <motion.div
                animate={{ width: emailHovered ? 36 : 20 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ height: 1, background: emailHovered ? 'var(--red-hover)' : 'var(--accent)' }}
              />
              raehdojhn@gmail.com
            </a>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-col">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--border-raised)', marginBottom: 16 }}>
              Navigation
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FOOTER_LINKS.map(link => <FooterLink key={link.label} {...link} />)}
            </div>
          </div>



          {/* Column 4: Status */}
          <div className="footer-col">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--border-raised)', marginBottom: 16 }}>
              Status
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ width: 5, height: 5, background: 'var(--online)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--online)' }}>
                Available for work
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24 }}>
              Los Angeles / Remote
            </p>

            {/* Back to top */}
            <button
              onClick={handleBackToTop}
              onMouseEnter={() => setBackToTopHovered(true)}
              onMouseLeave={() => setBackToTopHovered(false)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: backToTopHovered ? 'var(--bone)' : 'var(--ash)',
                background: 'transparent',
                border: `1px solid ${backToTopHovered ? 'var(--border-raised)' : 'var(--border-subtle)'}`,
                padding: '8px 16px', cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', gap: 8,
                transform: backToTopHovered ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{ transform: 'rotate(180deg)' }}>
                <path d="M5 1V9M5 9L1 5.5M5 9L9 5.5" stroke={backToTopHovered ? 'var(--bone)' : 'var(--ash)'} strokeWidth="1" strokeLinecap="square" />
              </svg>
              Back to top
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: 'clamp(40px, 5vw, 64px)', paddingTop: 20,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--border-hover)' }}>
            © 2026 Raehdojhn. All rights reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--border-hover)' }}>
            Designed & built with intention.
          </span>
        </div>
      </div>
    </footer>
  )
}
