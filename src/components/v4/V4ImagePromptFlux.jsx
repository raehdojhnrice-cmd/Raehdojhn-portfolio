import { useEffect, useMemo, useState } from 'react'
import {
  V4_JSON_CONTINUITY,
  V4_JSON_PROFILE_IMAGES,
} from '../../data/v4JsonProfileData'

const pick = (items) => items[Math.floor(Math.random() * items.length)]

const GRID_OPTIONS = Object.entries(V4_JSON_CONTINUITY.gridLegend).map(([value, label]) => ({
  value,
  label,
}))

const STYLE_OPTIONS = Array.from(new Set(V4_JSON_PROFILE_IMAGES.map((profile) => profile.style)))
const SUBJECT_OPTIONS = Array.from(
  new Set(V4_JSON_PROFILE_IMAGES.flatMap((profile) => profile.layoutPrinciples))
)

export default function V4ImagePromptFlux() {
  const [activeProfileId, setActiveProfileId] = useState(V4_JSON_PROFILE_IMAGES[0].id)
  const [style, setStyle] = useState(V4_JSON_PROFILE_IMAGES[0].style)
  const [subject, setSubject] = useState(V4_JSON_PROFILE_IMAGES[0].layoutPrinciples[0])
  const [grid, setGrid] = useState(GRID_OPTIONS[0].value)
  const [motionCue, setMotionCue] = useState(V4_JSON_CONTINUITY.motionGrammar[0])
  const [output, setOutput] = useState('')
  const [copyStatus, setCopyStatus] = useState('idle')

  const activeProfile = useMemo(() => (
    V4_JSON_PROFILE_IMAGES.find((profile) => profile.id === activeProfileId) || V4_JSON_PROFILE_IMAGES[0]
  ), [activeProfileId])

  useEffect(() => {
    setStyle(activeProfile.style)
    setSubject(activeProfile.layoutPrinciples[0] || SUBJECT_OPTIONS[0])
  }, [activeProfile])

  const compose = () => {
    const payload = {
      reference_profile: activeProfile.sourceId,
      scene: activeProfile.scene,
      style,
      subject,
      layout_grid: grid,
      motion: motionCue,
      palette_hex: activeProfile.palette.hex,
      color_grading_rule: pick(V4_JSON_CONTINUITY.colorGradingRules),
      colorist_note: pick(V4_JSON_CONTINUITY.coloristNotes),
      editorial_note: activeProfile.editorialNote,
      render_spec: '4K editorial quality, preserve grain, keep typography crisp, no smoothing',
      negative_prompt: 'no playful gradients, no rounded-casual app chrome, no typographic blur',
    }

    setOutput(JSON.stringify(payload, null, 2))
    setCopyStatus('idle')
  }

  const randomize = () => {
    const profile = pick(V4_JSON_PROFILE_IMAGES)
    setActiveProfileId(profile.id)
    setStyle(pick(STYLE_OPTIONS))
    setSubject(pick(SUBJECT_OPTIONS))
    setGrid(pick(GRID_OPTIONS).value)
    setMotionCue(pick(V4_JSON_CONTINUITY.motionGrammar))
    setOutput('')
    setCopyStatus('idle')
  }

  const handleCopy = () => {
    if (!output) return

    navigator.clipboard.writeText(output).then(() => {
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 1800)
    }).catch(() => {})
  }

  return (
    <section className="v4-prompt-flux" data-v4-animate>
      <div className="v4-prompt-flux__head">
        <p className="v4-kicker">IMAGE CONTEXT / PROFILE-CONTROLLED PROMPTING</p>
        <h2 className="v4-h2">PROMPT FLUX</h2>
      </div>

      <div className="v4-prompt-flux__palettes">
        <p className="v4-kicker" style={{ marginBottom: 8 }}>JSON PROFILE PALETTES</p>
        <div className="v4-prompt-flux__palette-row">
          {V4_JSON_PROFILE_IMAGES.map((profile) => (
            <button
              key={profile.id}
              className={`v4-prompt-flux__palette ${activeProfile.id === profile.id ? 'is-active' : ''}`}
              onClick={() => setActiveProfileId(profile.id)}
              aria-label={profile.label}
              title={profile.scene}
            >
              <div className="v4-prompt-flux__swatches">
                {profile.palette.hex.slice(0, 5).map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </div>
              <span className="v4-prompt-flux__palette-label">{profile.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="v4-prompt-flux__selectors">
        <div className="v4-prompt-flux__selector">
          <label className="v4-kicker">STYLE</label>
          <select value={style} onChange={(event) => setStyle(event.target.value)}>
            {STYLE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="v4-prompt-flux__selector">
          <label className="v4-kicker">SUBJECT DNA</label>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            {SUBJECT_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="v4-prompt-flux__selector">
          <label className="v4-kicker">GRID LOGIC</label>
          <select value={grid} onChange={(event) => setGrid(event.target.value)}>
            {GRID_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>

        <div className="v4-prompt-flux__selector">
          <label className="v4-kicker">MOTION CUE</label>
          <select value={motionCue} onChange={(event) => setMotionCue(event.target.value)}>
            {V4_JSON_CONTINUITY.motionGrammar.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="v4-prompt-flux__output">
        {output ? (
          <p style={{ whiteSpace: 'pre-wrap' }}>{output}</p>
        ) : (
          <p className="v4-prompt-flux__placeholder">Select a profile and compose a JSON-ready prompt bundle_</p>
        )}
      </div>

      <div className="v4-prompt-flux__actions">
        <button onClick={compose} className="v4-prompt-flux__btn v4-prompt-flux__btn--primary">Compose</button>
        <button onClick={randomize} className="v4-prompt-flux__btn">Randomize</button>
        <button onClick={handleCopy} className="v4-prompt-flux__btn" disabled={!output}>
          {copyStatus === 'copied' ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </section>
  )
}
