import React from 'react'
import { Link } from 'react-router-dom'
import './nodear.css'

// The JSON data has been reformatted into the Blonded.co style stream pattern
const archiveStream = [
  {
    type: "image",
    code: "V.I.05 · 04:12:00",
    title: "The Ouroboros Billboard",
    text: "A baroque engraving illustration of a massive ouroboros serpent — <em>ancient dragon-serpent consuming its own tail</em> — forming a perfect circle on a void-black background. Inside the circle: a single radiating all-seeing eye with fine cross-hatch lines extending outward like a sunburst. The serpent's scales are rendered in <em>dense copper-plate engraving technique</em> with extreme detail. Surrounding the circle: 18 small eye and shell motifs equidistant. At the base of the composition: <strong>NODEAR</strong> in ornate gothic blackletter, and below it: <strong>EREHWON</strong> in spaced capitals. Four-point blood-red star above the title as punctuation mark. Parchment-cream ground inside circle, absolute black exterior. --ar 3:4 --style raw --chaos 5"
  },
  {
    type: "image",
    code: "V.I.04 · 03:33:07",
    title: "The Eye Weeps Crosses",
    text: "Extreme close-up of a single human eye, <em>heavy dark smoky makeup</em>, dramatic lashes, looking slightly downward. Below the eye: <em>metallic chrome pearl teardrops</em> fall in a cascade of 8 spheres decreasing in size, trail leading down to an <em>ornate gothic chrome cross pendant</em> with pointed finials and decorative acanthus scrollwork. Void black background with heavy 35mm film grain texture. The eye occupies the upper third, the cross the lower third. High contrast black and white rendering with the cross in dark gunmetal. <strong>EREHWON</strong> in Cinzel caps at very base of frame, blood-red, small. --ar 4:5 --style raw --chaos 3"
  },
  {
    type: "video",
    code: "V.I.03 · 12:00:00",
    title: "Crow Landing in Slow Motion",
    text: "Extreme slow motion: a <em>large black crow descends from above</em> and lands on the edge of a concrete brutalist ledge or ruined stone surface. Wings spread wide in landing position, feathers individually visible against the dark sky. Camera: low angle, eye-level with the crow, slight upward tilt. The background is pure dark sky — no horizon visible. <em>Black and white film grain.</em> At the moment of landing, the crow's talons grip the stone and it folds its wings slowly. Duration: 6-8 seconds, designed to loop. No color. --ar 9:16"
  },
  {
    type: "image",
    code: "V.I.02 · 09:12:45",
    title: "Polaroid Memory Scatter",
    text: "9-12 <em>black and white polaroid photographs</em> scattered at various angles on a dark surface. Each polaroid has a white border. The photographs show: close-up of lips, back of a head with dark hair, white balloons against dark background, an empty corridor with overhead lights, a hand holding a cross pendant, a dark monitor glow, an empty road at night. <em>Handwritten blue ink captions on the white borders</em> — words only, not sentences: \"vigil\" \"3AM\" \"erehwon\" \"before\" \"witness.\" Film grain on overall image. No faces in any polaroid. --ar 1:1 --style raw --chaos 6"
  },
  {
    type: "image",
    code: "V.I.01 · 00:00:00",
    title: "Erehwon — The Master Cover",
    text: "A fully realized <em>18th-century copper plate engraving</em> — large square format. Composition: center — a vast ouroboros serpent forming a perfect circle, its body rendered in extreme detail with baroque scale patterns. Inside the circle: the all-seeing eye radiating fine lines outward like a sunburst. Around the circle: an ornate baroque acanthus and scrollwork frame. Four gothic crosses at the quadrant points between the frame and the ouroboros. Background: <em>parchment-cream with aged texture, subtle horizontal laid-line paper grain.</em> In the lower portion inside the frame: <strong>NODEAR</strong> in ornate gothic blackletter, centered. Below it: <strong>EREHWON</strong> in Cinzel-style spaced capitals. A four-point blood-red star between the two words — the only color. <em>No photograph. Pure engraving illustration. Maximum detail. Mezzotint and aquatint techniques.</em> --ar 1:1 --style raw --chaos 2 --q 2"
  }
]

export default function NodearVault() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated form lock, resets placeholder text
    e.target.reset()
    alert('You have been initiated into the archive.')
  }

  return (
    <div className="nodear-scope">
      
      {/* ── NAIVGATION (Blonded Pattern) ── */}
      <nav className="nodear-nav">
        <button className="nodear-nav-item active">ARCHIVE</button>
        <button className="nodear-nav-item">TRANSMISSIONS</button>
        <button className="nodear-nav-item">OBJECTS</button>
        <button className="nodear-nav-item">ACCESS</button>
        <Link to="/" className="nodear-nav-item" style={{ color: 'var(--iron)' }}>RETURN</Link>
      </nav>

      <main className="nodear-main">
        {/* ── NEWSLETTER CAPTURE (Blonded Pattern) ── */}
        <section className="nodear-newsletter">
          <p className="nodear-koan">the archive opens when you enter.</p>
          <form className="nodear-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              className="nodear-input" 
              placeholder="ENTER ADDRESS" 
              required
            />
            <button type="submit" className="nodear-submit">V.I.SIGNAL</button>
          </form>
        </section>

        {/* ── ARCHIVE STREAM ── */}
        <div className="archive-feed">
          {archiveStream.map((item, i) => (
            <article className="archive-entry" key={i}>
              <div className="archive-meta">
                <span className="chapter-code">{item.code}</span>
                <span className="archive-timestamp">{item.type}</span>
              </div>
              <div className="archive-content">
                <div className="nodear-title" style={{ fontSize: '18px', marginBottom: '2rem' }}>
                  {item.title}
                </div>
                <div 
                  className="archive-text-body" 
                  dangerouslySetInnerHTML={{ __html: item.text }} 
                />
              </div>
              
              {/* The punctuating blood star used between items */}
              <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--blood-d)', fontSize: '10px' }}>✦</div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
