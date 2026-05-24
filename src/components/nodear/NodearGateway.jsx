import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NodearGateway({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [displayText, setDisplayText] = useState('')
  
  const fullText = `NODEAR_ARCHIVE · LOADING · [${new Date().toISOString().split('.')[0]}]`

  // Typewriter effect mimicking early terminal boot sequences
  useEffect(() => {
    let currentText = ''
    let currentIndex = 0
    
    // Tiny delay before starting the text sequence
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          currentText += fullText[currentIndex]
          setDisplayText(currentText)
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 45) // Typwriter speed
      
      return () => clearInterval(interval)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [fullText])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'nodear2026' || password === 'NODEAR2026') {
      onUnlock()
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#050505',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        color: '#c8c3bc', // var(--bone)
        fontSize: '11px',
        letterSpacing: '0.15em',
        marginBottom: '4rem',
        textTransform: 'uppercase',
        height: '20px' // Keep space reserved
      }}>
        {displayText}
        <motion.span 
          animate={{ opacity: [1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
        >_</motion.span>
      </div>

      <AnimatePresence>
        {displayText === fullText && (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            onSubmit={handleSubmit}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(false)
              }}
              autoFocus
              placeholder={error ? "ACCESS DENIED" : "AUTHORIZATION"}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${error ? '#cc2222' : '#272525'}`, // iron or blood-b
                color: error ? '#cc2222' : '#e8e2d8', // parchment
                padding: '0.5rem 0',
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.2em',
                textAlign: 'center',
                outline: 'none',
                transition: 'border-color 0.3s, color 0.3s'
              }}
            />
          </motion.form>
        )}
      </AnimatePresence>
      <Link to="/" style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        color: '#272525', 
        fontFamily: "'Space Mono', monospace", 
        fontSize: '10px', 
        letterSpacing: '0.2em', 
        textTransform: 'uppercase', 
        textDecoration: 'none' 
      }}>RETURN TO RAEHDOJHN</Link>
    </div>
  )
}
