import React, { useEffect } from 'react'
import './nodear.css'

export default function NodearBackground({ children }) {
  // Lock body scroll so only the vault scrolls in an isolated context
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="nodear-scope" style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--void)', // Pure dark neutral
      zIndex: 99999, // Covers the entire portfolio app
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* 
        All background physics and gradients have been stripped to conform 
        to the Virgil/Frank Ocean flat-container archive ideology. 
        The container is invisible. The content speaks. 
      */}
      {children}
    </div>
  )
}
