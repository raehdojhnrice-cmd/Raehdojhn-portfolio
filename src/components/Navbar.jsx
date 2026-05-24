import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ theme, toggleTheme, onMenuOpen, activeSection }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { num: '01', label: 'WORK', id: 'work' },
    { num: '02', label: 'ABOUT', id: 'about' },
    { num: '03', label: 'CONTACT', id: 'contact' },
  ]

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#hero" className="nav__logo">RAEHDOJHN<span className="nav__logo-meta">RAE / ARCHIVE</span></a>
        <nav className="nav__links">
          {links.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav__link ${activeSection === link.id ? 'nav__link--active' : ''}`}
            >
              <span className="nav__link-num">{link.num}</span> {link.label}
            </a>
          ))}
          <Link
            to="/v4"
            className="nav__link"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.65 }}
          >
            V4
          </Link>
          <Link
            to="/nodear"
            className="nav__link"
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontWeight: 700,
              color: '#8b1a1a',
              letterSpacing: '0.1em'
            }}
          >
            Nodear*
          </Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </nav>

        {/* Hamburger — always visible, works as sandwich menu */}
        <button className="nav__hamburger" onClick={onMenuOpen} aria-label="Open menu">
          <span className="nav__hamburger-line" />
          <span className="nav__hamburger-line nav__hamburger-line--short" />
          <span className="nav__hamburger-line" />
        </button>
      </div>
    </header>
  )
}
