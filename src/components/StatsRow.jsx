import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ArchiveMetaRow from './ui/ArchiveMetaRow'

const EASE = [0.16, 1, 0.3, 1]
const MotionDiv = motion.div

const STATS = [
  { serial: 'AX-01', value: '5', label: 'Disciplines', note: 'Design · Code · Audio · Film · AI' },
  { serial: 'AX-02', value: '∞', label: 'Creative Range', note: 'No lane. No ceiling.' },
]

const STATS_MANIFEST = [
  'SNAPSHOT STRIP',
  'CREATIVE RANGE',
  'DISCIPLINE INDEX',
  'SYSTEM ACTIVE',
]

function StatItem({ stat, i, inView }) {
  return (
    <MotionDiv
      className="stats-row__item"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay: i * 0.11 }}
    >
      <span className="stats-row__eyebrow">{stat.serial}</span>
      <span className="stats-row__value">{stat.value}</span>
      <span className="stats-row__label">{stat.label}</span>
      <span className="stats-row__note">{stat.note}</span>
    </MotionDiv>
  )
}

export default function StatsRow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  return (
    <section id="stats" ref={ref} className="stats-row" aria-label="Credentials at a glance">
      <div className="stats-row__intro">
        <ArchiveMetaRow left="SNAPSHOT" right="CREDENTIALS / RANGE / SYSTEM STATE" />
        <div className="stats-row__manifest-row">
          {STATS_MANIFEST.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="archive-rule" style={{ opacity: 0.15 }} />
      <div className="stats-row__grid stats-row__grid--archive">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} i={i} inView={inView} />
        ))}
      </div>
      <div className="archive-rule" style={{ opacity: 0.15 }} />
    </section>
  )
}
