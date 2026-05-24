import { useEffect, useRef, useState } from 'react'

const TAGLINES = [
  'Archive mode initialized...',
  'Creative systems loaded.',
  'Brutalist discipline engaged.',
  'Visual DNA: Abloh × Ross × Owens × Apple.',
  'Portfolio v4 — chaos with structure.',
  'All systems nominal.',
  'Rendering alter ego surface...',
  'Design is not what it looks like — it is how it works.',
]

/**
 * V4TerminalWindow — Persistent background terminal with typewriter tagline animation.
 * Cycles through taglines, supports ESC to skip, and shows system-style output.
 */
export default function V4TerminalWindow() {
  const [lines, setLines] = useState(['> RAEHDOJHN OS v4.0', '> BOOT SEQUENCE COMPLETE', ''])
  const [currentText, setCurrentText] = useState('')
  const taglineIdx = useRef(0)
  const charIdx = useRef(0)
  const intervalRef = useRef(null)
  const pauseRef = useRef(null)

  useEffect(() => {
    const typeNext = () => {
      const tagline = TAGLINES[taglineIdx.current % TAGLINES.length]

      intervalRef.current = setInterval(() => {
        if (charIdx.current < tagline.length) {
          setCurrentText(tagline.slice(0, charIdx.current + 1))
          charIdx.current++
        } else {
          clearInterval(intervalRef.current)
          /* Pause then move to next */
          pauseRef.current = setTimeout(() => {
            setLines((prev) => [...prev, `> ${tagline}`].slice(-14))
            setCurrentText('')
            charIdx.current = 0
            taglineIdx.current++
            typeNext()
          }, 2200)
        }
      }, 45)
    }

    const bootTimeout = setTimeout(() => typeNext(), 800)

    return () => {
      clearTimeout(bootTimeout)
      clearInterval(intervalRef.current)
      clearTimeout(pauseRef.current)
    }
  }, [])

  /* ESC to skip current tagline */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        clearInterval(intervalRef.current)
        clearTimeout(pauseRef.current)
        const tagline = TAGLINES[taglineIdx.current % TAGLINES.length]
        setLines((prev) => [...prev, `> ${tagline}`].slice(-14))
        setCurrentText('')
        charIdx.current = 0
        taglineIdx.current++
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="v4-bg-terminal" aria-hidden="true">
      <div className="v4-bg-terminal__header">
        <span className="v4-bg-terminal__dot v4-bg-terminal__dot--red" />
        <span className="v4-bg-terminal__dot v4-bg-terminal__dot--yellow" />
        <span className="v4-bg-terminal__dot v4-bg-terminal__dot--green" />
        <span className="v4-bg-terminal__title">terminal — v4</span>
      </div>
      <div className="v4-bg-terminal__body">
        {lines.map((line, i) => (
          <p key={i} className="v4-bg-terminal__line">{line || '\u00A0'}</p>
        ))}
        {currentText && (
          <p className="v4-bg-terminal__line v4-bg-terminal__line--active">
            {'> '}{currentText}<span className="v4-bg-terminal__cursor">█</span>
          </p>
        )}
      </div>
    </div>
  )
}
