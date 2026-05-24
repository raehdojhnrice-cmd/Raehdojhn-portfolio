import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import ArchiveSectionChrome from './ui/ArchiveSectionChrome'

const EASE = [0.16, 1, 0.3, 1]

// ─── TOOLTIP DATA ────────────────────────────────────────────────────────────
const TOOLTIP_DATA = {
  'Rick Owens': { discipline: 'Designer', field: 'Fashion', quote: 'Brutalist fashion pioneer who collapsed the boundary between streetwear and high concept.' },
  'Virgil Abloh': { discipline: 'Designer', field: 'Fashion / Art', quote: 'Proved that the architect, DJ, and fashion designer could be the same person.' },
  'Raf Simons': { discipline: 'Designer', field: 'Fashion', quote: 'Channeled youth rebellion into couture — punk as a design language.' },
  'Rei Kawakubo': { discipline: 'Designer', field: 'Fashion / Art', quote: 'Destroyed and rebuilt the rules of what clothing could mean.' },
  'Vivienne Westwood': { discipline: 'Designer', field: 'Fashion', quote: 'Made punk wearable and politics fashionable before anyone else.' },
  'Jean-Michel Basquiat': { discipline: 'Painter', field: 'Neo-Expressionism', quote: 'Crown prince of raw, unfiltered creative energy on canvas.' },
  'Salvador Dalí': { discipline: 'Painter', field: 'Surrealism', quote: 'Turned the subconscious into spectacle — dreams as high art.' },
  'Leonardo da Vinci': { discipline: 'Polymath', field: 'Renaissance', quote: 'The original multidisciplinary creative — art, science, engineering as one.' },
  'George Condo': { discipline: 'Painter', field: 'Contemporary', quote: 'Artificial realism — grotesque beauty where old masters meet pop culture.' },
  'Stanley Kubrick': { discipline: 'Director', field: 'Film', quote: 'Obsessive precision in service of something deeply human.' },
  'Quentin Tarantino': { discipline: 'Director', field: 'Film', quote: 'Made dialogue a weapon and pastiche a philosophy.' },
  'Gaspar Noé': { discipline: 'Director', field: 'Film', quote: 'Cinema as assault — time, color, and the body pushed to their limits.' },
  'Harmony Korine': { discipline: 'Director', field: 'Film', quote: 'Beauty in the broken — lo-fi chaos as a legitimate art form.' },
  'Hype Williams': { discipline: 'Director', field: 'Music Video', quote: 'Invented the visual language of hip-hop — fisheye, excess, and spectacle.' },
  'Cam Hicks': { discipline: 'Photographer', field: 'Fashion / Street', quote: 'Raw, intimate lens on Black culture and contemporary fashion.' },
  'Petra Collins': { discipline: 'Photographer', field: 'Fashion / Art', quote: 'Feminine gaze that challenged every assumption about beauty photography.' },
  'David Sorrenti': { discipline: 'Photographer', field: 'Fashion', quote: 'Defined heroin chic — raw vulnerability through a fashion lens.' },
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: 'Photographers',
    accent: 'var(--accent-marker)',
    names: [
      'Cam Hicks', 'Julian Klincewicz', 'Gunner Stahl', 'Steve Buck',
      'Rayscorruptedmind', 'YGA Film', 'David Sorrenti', 'John Cotter',
      'Max Durante', 'KMA.FR', 'Dill35mm', 'Ismael Akondo', 'Carson Jacobs',
      'Tom Schwimmbeck', 'Petra Collins', 'Sam Dameshek', 'Lewis Virn',
      'David Cabrera', 'Sagan Lockhart', 'Terry Richardson',
      'Christopher Anderson', 'Mangomaat', 'Nico Ballesteros',
      'Jack Bridgland', 'Guillermo del Toro', 'Dillon Dreiling',
      'Garrett Bruce', 'Ian Buosi', 'Ciesay', 'Brandon Bowen', 'Yudo Kurita',
    ],
  },
  {
    label: 'Designers',
    accent: 'var(--cyan-light)',
    names: [
      'Rick Owens', 'Raf Simons', 'Samuel Ross', 'Matthew Williams',
      'Phillip Kim', 'Virgil Abloh', 'Nigo', 'Martine Rose', 'Marc Jacobs',
      'Vivienne Westwood', 'Ye', 'Issey Miyake', 'Rei Kawakubo',
      'Demna Gvasalia', 'Daniel Arsham', 'Ralph Lauren',
      'Henri Alexander Levy', 'Alexander Wang', 'Heron Preston',
      'Jun Takahashi', 'Midnight Studios', 'Acne Studios',
      'Enfants Riches Déprimés', 'Ava Nirui',
    ],
  },
  {
    label: 'Painters',
    accent: 'var(--accent)',
    names: [
      'Bryant Giles', 'Jetle Parti', 'T-Rex Global', 'George Condo',
      'Indigou', 'Salvador Dalí', 'Jean-Michel Basquiat',
      'Leonardo da Vinci', 'Caravaggio', 'Michelangelo',
    ],
  },
  {
    label: 'Directors',
    accent: 'var(--border-raised)',
    names: [
      'Alfred Hitchcock', 'Stanley Kubrick', 'Quentin Tarantino',
      'Safdie Brothers', 'Wes Anderson', 'Gaspar Noé', 'Harmony Korine',
      'Lone Wolf', 'Christopher Nolan', 'Alejandro Jodorowsky',
      'Hiro Murai', 'Ari Aster', 'Grant Singer', 'Hype Williams',
      'Teo Grevet', 'Spike Jonze',
    ],
  },
]



// ─── FADE-IN ─────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── TOOLTIP CARD ────────────────────────────────────────────────────────────
function TooltipCard({ info, name }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE }}
      style={{
        position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
        transform: 'translateX(-50%)', zIndex: 100,
        backgroundColor: '#1A1A1A', border: '1px solid #3A3A3A',
        padding: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        pointerEvents: 'none', width: 'max-content', maxWidth: 260, minWidth: 180,
      }}
    >
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--bone)' }}>{name}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ash)', marginTop: 4 }}>
        {info.discipline} · {info.field}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontStyle: 'italic', color: 'var(--dust)', marginTop: 8, lineHeight: 1.5 }}>
        "{info.quote}"
      </div>
    </motion.div>
  )
}

// ─── HOVERABLE NAME ──────────────────────────────────────────────────────────
function HoverName({ name, isLast, accent }) {
  const [hovered, setHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipInfo = TOOLTIP_DATA[name]
  const hasTooltip = !!tooltipInfo
  const timerRef = useRef(null)

  const handleEnter = () => {
    setHovered(true)
    if (hasTooltip) timerRef.current = setTimeout(() => setShowTooltip(true), 200)
  }

  const handleLeave = () => {
    setHovered(false)
    setShowTooltip(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <span onMouseEnter={handleEnter} onMouseLeave={handleLeave} style={{ position: 'relative', display: 'inline' }}>
      <span style={{
        color: hovered ? 'var(--bone)' : 'var(--ash)',
        transition: 'color 0.2s ease-out',
        backgroundImage: hovered ? `linear-gradient(var(--bone), var(--bone))` : 'none',
        backgroundSize: hovered ? '100% 1px' : '0% 1px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left bottom 1px',
        paddingBottom: 1,
        transitionProperty: 'color, background-size',
        transitionDuration: '0.2s',
      }}>
        {name}
      </span>
      {!isLast ? ', ' : ''}

      <AnimatePresence>
        {showTooltip && tooltipInfo && <TooltipCard info={tooltipInfo} name={name} />}
      </AnimatePresence>

      {hasTooltip && (
        <span style={{
          display: 'inline-block', width: 3, height: 3,
          backgroundColor: accent || 'var(--accent-marker)',
          marginLeft: 3, verticalAlign: 'super',
          opacity: hovered ? 1 : 0.35, transition: 'opacity 0.2s ease',
        }} />
      )}
    </span>
  )
}



// ─── CATEGORY BLOCK ──────────────────────────────────────────────────────────
function CategoryBlock({ category, delay }) {
  return (
    <FadeIn delay={delay} style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em',
        textTransform: 'uppercase', color: category.accent, marginBottom: 16,
      }}>
        {category.label}
      </div>
      <div style={{ height: 1, background: 'var(--border-hover)', marginBottom: 16, opacity: 0.5 }} />
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.8, color: 'var(--ash)' }}>
        {category.names.map((name, i) => (
          <HoverName key={name} name={name} isLast={i === category.names.length - 1} accent={category.accent} />
        ))}
      </div>
    </FadeIn>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function Influences() {
  const sectionRef = useRef(null)
  const headerInView = useInView(sectionRef, { once: true, amount: 0.08 })

  return (
    <section id="influences" ref={sectionRef} style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: 1, background: 'var(--border-hover)', opacity: 0.4 }} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(48px, 8vw, 80px) clamp(16px, 4vw, 64px)' }}>
        {/* Section Header */}
        <ArchiveSectionChrome 
          index="05" 
          label="INSPIRATION" 
          title="Influences" 
          subtitle="The creative lineage informing the work"
        />

        {/* Categories Grid — 4 columns on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(24px, 3vw, 40px)', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          {CATEGORIES.map((cat, i) => (
            <CategoryBlock key={cat.label} category={cat} delay={0.08 * i} />
          ))}
        </div>


      </div>
    </section>
  )
}
