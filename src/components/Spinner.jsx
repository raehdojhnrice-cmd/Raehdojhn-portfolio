import React from 'react'
import { motion } from 'framer-motion'

export default function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '120px' }}>
      <motion.div
        style={{
          width: 40, height: 40,
          border: '2px solid rgba(255, 51, 102, 0.1)',
          borderTop: '2px solid var(--accent)',
          borderRadius: '50%'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <span className="mono-tag" style={{ marginLeft: 16, color: 'var(--accent)', fontSize: '10px', letterSpacing: '0.2em' }}>
        LOADING...
      </span>
    </div>
  )
}
