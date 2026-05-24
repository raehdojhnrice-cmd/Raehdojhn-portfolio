import { motion, useReducedMotion } from 'framer-motion'

const TAGS = ['RAW', 'ANNOTATED', 'SCAN', 'INDEX', 'DRAFT']

export default function ChaosStamps() {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      {TAGS.map((tag, i) => (
        <motion.span
          key={tag}
          className="archive-chip"
          initial={{ opacity: 0, y: 8 }}
          animate={
            reduce
              ? { opacity: 0.2 }
              : { opacity: 0.2, y: [0, -4, 0], x: [0, 3, 0] }
          }
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          style={{
            position: 'absolute',
            top: `${12 + i * 15}%`,
            left: `${6 + i * 17}%`,
            fontSize: '8px',
            transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`,
            borderColor: i % 2 === 0 ? 'var(--archive-line)' : 'var(--color-rust, #A65D3F)',
            color: i % 2 === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
            background: 'transparent',
            userSelect: 'none',
          }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  )
}
