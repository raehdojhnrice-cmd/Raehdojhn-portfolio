import React, { useState, useEffect, useRef, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import GradientCursor from './components/GradientCursor'
import MarqueeBar from './components/MarqueeBar'
import Navbar from './components/Navbar'
import MobileMenu from './components/MobileMenu'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Blog from './components/Blog'
import Influences from './components/Influences'
import Clock from './components/Clock'
import Footer from './components/Footer'
import Spinner from './components/Spinner'
import './index.css'

const VideoBackground = React.lazy(() => import('./components/VideoBackground'))
const MusicPlayer = React.lazy(() => import('./components/MusicPlayer'))
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('rae-theme') || 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rae-theme', theme)
  }, [theme])

  // Track active section for hamburger menu highlighting
  useEffect(() => {
    const sections = ['hero', 'work', 'services', 'about', 'contact', 'blog', 'influences']
    const observers = []
    let timeoutId = null

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
              setActiveSection(id)
            }, 100)
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      clearTimeout(timeoutId)
      observers.forEach(o => o.disconnect())
    }
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <VideoBackground />
      </Suspense>
      <GradientCursor />
      <div className="grain-overlay" aria-hidden="true" />
      <MarqueeBar />
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onMenuOpen={() => setMenuOpen(true)}
        activeSection={activeSection}
      />
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            onClose={() => setMenuOpen(false)}
            toggleTheme={toggleTheme}
            activeSection={activeSection}
          />
        )}
      </AnimatePresence>
      <Hero />
      <ProjectGrid />
      <Services />
      <About />
      <Contact />
      <Blog />
      <Influences />
      <Clock />
      <Footer />
      <Suspense fallback={<div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}><Spinner /></div>}>
        <MusicPlayer />
      </Suspense>
    </>
  )
}
