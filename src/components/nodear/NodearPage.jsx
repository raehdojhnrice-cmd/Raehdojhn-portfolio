import React, { useState, useEffect } from 'react'
import NodearBackground from './NodearBackground'
import NodearGateway from './NodearGateway'
import NodearVault from './NodearVault'
import { motion, AnimatePresence } from 'framer-motion'

export default function NodearPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Check if they unlocked it previously in this session
  useEffect(() => {
    if (sessionStorage.getItem('nodear_auth') === 'true') {
      setIsUnlocked(true)
    }
  }, [])

  const handleUnlock = () => {
    sessionStorage.setItem('nodear_auth', 'true')
    setIsUnlocked(true)
  }

  return (
    <NodearBackground>
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="gateway"
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ width: '100%', height: '100%' }}
          >
            <NodearGateway onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="vault"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          >
            <NodearVault />
          </motion.div>
        )}
      </AnimatePresence>
    </NodearBackground>
  )
}
