import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionDiv = motion.div
const MotionButton = motion.button
const MotionAnchor = motion.a
const MotionSpan = motion.span

const MENU_FONT = "'Times New Roman', Times, serif"

export default function MobileMenu({ onClose, toggleTheme, activeSection }) {
  const links = [
    { num: '01', label: 'HOME',      href: '#hero' },
    { num: '02', label: 'WORK',      href: '#work' },
    { num: '03', label: 'SERVICES',  href: '#services' },
    { num: '04', label: 'ABOUT',     href: '#about' },
    { num: '05', label: 'CONTACT',   href: '#contact' },
    { num: '06', label: 'BLOG',      href: '#blog' },
    { num: '07', label: 'INFLUENCES',href: '#influences' },
  ]

  return (
    <MotionDiv
      className="mobile-menu"
      initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Close button */}
      <MotionButton
        className="mobile-menu__close"
        onClick={onClose}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        aria-label="Close menu"
      >
        <span className="mobile-menu__close-line mobile-menu__close-line--1" />
        <span className="mobile-menu__close-line mobile-menu__close-line--2" />
      </MotionButton>

      {/* Navigation Links */}
      <nav className="mobile-menu__nav">
        {links.map((link, i) => {
          const sectionId = link.href.replace('#', '')
          const isActive = activeSection === sectionId
          return (
            <MotionAnchor
              key={link.href}
              href={link.href}
              className={`mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                const id = link.href.replace('#', '')
                const el = document.getElementById(id)
                if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 80), behavior: 'smooth' })
                onClose()
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isActive ? 1 : 0.45, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ opacity: 1, scale: 1.04 }}
              style={{
                fontFamily: MENU_FONT,
                justifyContent: 'center',
                textAlign: 'center',
                letterSpacing: '0.04em',
                gap: 14,
              }}
            >
              <span className="mobile-menu__link-num" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {link.num}
              </span>
              <span className="mobile-menu__link-label">{link.label}</span>
              {isActive && (
                <MotionSpan
                  className="mobile-menu__link-indicator"
                  layoutId="activeIndicator"
                  transition={{ duration: 0.3 }}
                />
              )}
            </MotionAnchor>
          )
        })}

        {/* V4 — link to alternate portfolio */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + links.length * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <Link
            to="/v4"
            className="mobile-menu__link"
            onClick={onClose}
            style={{
              fontFamily: MENU_FONT,
              justifyContent: 'center',
              textAlign: 'center',
              letterSpacing: '0.04em',
              gap: 14,
              color: 'var(--accent)',
              opacity: 1,
            }}
          >
            <span className="mobile-menu__link-num" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>08</span>
            <span className="mobile-menu__link-label">V4</span>
          </Link>
        </MotionDiv>

        {/* Nodear* */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + (links.length + 1) * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <Link
            to="/nodear"
            className="mobile-menu__link"
            onClick={onClose}
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              justifyContent: 'center',
              textAlign: 'center',
              letterSpacing: '0.1em',
              gap: 14,
              color: '#8b1a1a',
              opacity: 1,
            }}
          >
            <span className="mobile-menu__link-num" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>09</span>
            <span className="mobile-menu__link-label" style={{ textTransform: 'none' }}>Nodear*</span>
          </Link>
        </MotionDiv>
      </nav>

      {/* Bottom controls */}
      <MotionDiv
        className="mobile-menu__footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <button className="theme-toggle" onClick={toggleTheme} style={{ width: 'auto', padding: '10px 20px', gap: '8px', display: 'flex', alignItems: 'center' }}>
          <span className="mono-tag">TOGGLE THEME</span>
        </button>
        <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>
          © 2026 RAEHDOJHN
        </span>
      </MotionDiv>
    </MotionDiv>
  )
}
