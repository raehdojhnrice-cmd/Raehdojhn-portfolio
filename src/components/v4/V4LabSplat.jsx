import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import V4LabSplatCanvas from './V4LabSplatCanvas'

/* ── Prompt Generator ── */

const SUBJECTS = [
  'a fragmented identity archive',
  'noise degrading into signal',
  'brutalist editorial spread',
  'glitched luxury typography',
  'aerial surveillance grid',
  'corrupted color field',
  'temporal overlap sequence',
  'negative space manifesto',
  'redacted data portrait',
  'spectral gradient collapse',
  'monolithic form study',
  'chaotic grid break',
  'distorted UI artifact',
  'lo-fi transmission loop',
  'raw material documentation',
  'overexposed brand ritual',
  'phantom interface layer',
  'signal-to-noise portrait',
  'deconstructed brand system',
  'abstract typographic erosion',
]

const MOODS = [
  'rendered in deep obsidian with red accents',
  'brutalist — high contrast, no softness',
  'editorial — asymmetric, intentional white space',
  'ethereal — overexposed, barely there',
  'archival — worn, typewritten, damaged',
  'luxe noir — velvet shadows, gold traces',
  'glitch — signal interrupted, artifacts present',
  'minimal swiss — grid-locked, disciplined',
  'chaotic — multiple layers, illegible hierarchy',
  'cinematic — wide frame, dramatic negative space',
  'raw — unfinished, material, exposed process',
  'high-key — washed-out, bleached palette',
]

const TECH = [
  'using only CSS clip-path animations',
  'as a Framer Motion stagger sequence',
  'generated from noise function seed',
  'as WebGL shader with custom GLSL',
  'via GSAP timeline with ScrollTrigger',
  'expressed through variable font axes',
  'as canvas-drawn particle system',
  'using CSS custom property animation chains',
  'as SVG filter composition',
  'with Three.js instanced geometry',
  'via CSS mask and backdrop-filter layers',
  'as a CSS scroll-driven animation',
]

const FORMATS = [
  'for a magazine double-page spread',
  'as a loading state concept',
  'for mobile-first portrait viewport',
  'as a hero section above the fold',
  'as a data visualization dashboard',
  'for a portfolio case study header',
  'as ambient background motion',
  'for a brand identity reveal',
  'as an interactive web exhibit',
  'for a limited-run print series',
  'as an OS-level UI pattern',
  'as a generative poster series',
]

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function generatePrompt() {
  return `Design ${pick(SUBJECTS)}, ${pick(MOODS)}, ${pick(TECH)} — ${pick(FORMATS)}.`
}

const ACCESS_CODE = 'NODEAR'

export default function V4LabSplat() {
  const [isUnlocked] = useState(true) // Open creative engine for V4
  const [activeTab, setActiveTab] = useState('prompt')
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState([])
  const [copyStatus, setCopyStatus] = useState('idle')
  const inputRef = useRef(null)

  const handleGenerate = () => {
    const p = generatePrompt()
    setPrompt(p)
    setHistory((prev) => [p, ...prev].slice(0, 6))
    setCopyStatus('idle')
  }

  const handleCopy = () => {
    if (!prompt) return
    navigator.clipboard.writeText(prompt).then(() => {
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 1800)
    }).catch(() => {})
  }

  const selectHistoryItem = (p) => {
    setPrompt(p)
    setCopyStatus('idle')
  }

  return (
    <section id="lab" className="relative py-32 bg-void overflow-hidden" data-v4-animate>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="lab__overline">LAB / SYSTEM TOOLS</p>
            <h2 className="lab__title">CREATIVE ENGINE</h2>
          </div>
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-6 py-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-all ${activeTab === 'prompt' ? 'text-accent-red border-b-2 border-accent-red' : 'text-text-muted hover:text-text-primary'}`}
            >
              PROMPT_GEN
            </button>
            <button
              onClick={() => setActiveTab('splat')}
              className={`px-6 py-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-all ${activeTab === 'splat' ? 'text-accent-red border-b-2 border-accent-red' : 'text-text-muted hover:text-text-primary'}`}
            >
              SPLAT_TOOL
            </button>
          </div>
        </div>

        <div className="bg-surface-dark border border-border relative overflow-hidden">
          {/* Panel Header */}
          <div className="bg-void/50 border-b border-border px-6 py-3 flex justify-between items-center">
            <span className="font-mono text-[9px] text-text-muted opacity-50 uppercase tracking-widest">SYSTEM_STATUS: {isUnlocked ? 'AUTHORIZED' : 'ENCRYPTED'}</span>
            <div className="flex gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? 'bg-accent-green' : 'bg-accent-red animate-pulse'}`} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div style={{ display: activeTab === 'prompt' ? 'block' : 'none' }}>
              <div className="space-y-12">
                {/* Output Display */}
                <div
                  className="relative min-h-[160px] flex items-center justify-center p-8 bg-void border border-white/5 transition-all duration-700 cursor-pointer hover:border-accent/30"
                  onClick={handleGenerate}
                >
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    {prompt ? (
                      <p className="lab__display">{prompt}</p>
                    ) : (
                      <p className="lab__display opacity-40 italic">Ready for generation signal...</p>
                    )}
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      onClick={handleGenerate}
                      className="btn btn--primary flex-1 md:flex-none"
                    >
                      GENERATE
                    </button>
                    <button
                      onClick={handleCopy}
                      disabled={!prompt}
                      className="btn btn--secondary uppercase"
                    >
                      {copyStatus === 'copied' ? 'COPIED_SIGNAL' : 'EXTRACT_PROMPT'}
                    </button>
                  </div>
                </div>

                {/* History Section */}
                {history.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="pt-8 border-t border-white/5"
                  >
                    <p className="lab__history-title">/ ARCHIVE_HISTORY</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {history.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => selectHistoryItem(p)}
                          className="lab__history-item group"
                        >
                          <p className="lab__history-text line-clamp-2">{p}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div style={{ display: activeTab === 'splat' ? 'block' : 'none' }}>
              <div className="relative aspect-video bg-void border border-white/5 overflow-hidden">
                <V4LabSplatCanvas />
                <div className="absolute top-4 left-4 font-mono text-[8px] text-text-muted opacity-50 uppercase tracking-[0.4em]">CANVAS_PROTO_v8.2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
