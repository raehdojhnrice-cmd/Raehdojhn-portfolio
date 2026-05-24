import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AccessGate({ 
  children, 
  password: targetPassword, 
  title = 'RESTRICTED ACCESS', 
  sessionKey = 'auth_session' 
}) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem(sessionKey) === 'true') {
      setIsUnlocked(true)
    }
    setIsChecking(false)
  }, [sessionKey])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.toLowerCase() === targetPassword.toLowerCase()) {
      sessionStorage.setItem(sessionKey, 'true')
      setIsUnlocked(true)
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2000)
    }
  }

  if (isChecking) return null

  if (isUnlocked) {
    return children
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
      position: 'relative',
      zIndex: 9999
    }}>
      {/* Aesthetic Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', position: 'relative' }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          color: '#888',
          fontSize: '10px',
          letterSpacing: '0.3em',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          {title}
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '280px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError(false)
            }}
            autoFocus
            placeholder={error ? "ACCESS DENIED" : "ENTER PASSWORD"}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${error ? '#cc2222' : '#222'}`,
              color: error ? '#cc2222' : '#e8e2d8',
              padding: '0.8rem 0',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.25em',
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.3s'
            }}
          />
        </form>
      </motion.div>

      <Link to="/" style={{ 
        position: 'absolute', 
        bottom: '3rem', 
        color: '#333', 
        fontFamily: "'Space Mono', monospace", 
        fontSize: '9px', 
        letterSpacing: '0.2em', 
        textTransform: 'uppercase', 
        textDecoration: 'none',
        transition: 'color 0.3s'
      }}
      onMouseEnter={(e) => e.target.style.color = '#666'}
      onMouseLeave={(e) => e.target.style.color = '#333'}
      >
        RETURN TO INTERFACE
      </Link>
    </div>
  )
}
