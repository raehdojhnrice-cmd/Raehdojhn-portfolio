const CAPABILITIES = [
  {
    id: 'c-01',
    title: 'CREATIVE DIRECTION',
    metric: '12+ PROJECTS',
    description: 'Concept-to-execution visual leadership across brand, editorial, and digital. Setting the tone, guiding the aesthetic, owning the output.',
  },
  {
    id: 'c-02',
    title: 'BRAND IDENTITY',
    metric: '8 SYSTEMS BUILT',
    description: 'Type selection, color architecture, logo systems, motion language, and guidelines. Everything from naming to the final asset kit.',
  },
  {
    id: 'c-03',
    title: 'MOTION DESIGN',
    metric: 'LOTTIE + AE + FM',
    description: 'Micro-interactions, page transitions, scroll choreography, and brand animation primitives. Framer Motion, GSAP, After Effects.',
  },
  {
    id: 'c-04',
    title: 'AUDIO PRODUCTION',
    metric: '50+ TRACKS',
    description: 'Beat production, mixing, mastering, sound design. Ableton, FL Studio, Pro Tools. From ambient textures to full arrangements.',
  },
  {
    id: 'c-05',
    title: 'AI-INTEGRATED WORKFLOWS',
    metric: 'CLAUDE + GEMINI',
    description: 'Prompt engineering, generative design pipelines, AI-powered content systems, and autonomous agent architectures.',
  },
  {
    id: 'c-06',
    title: 'WEB DEVELOPMENT',
    metric: 'REACT + VITE',
    description: 'Production React, Next.js, and Vite applications. Component architecture, animation systems, CMS integration, and deployment.',
  },
]

export default function V4CapabilityDeck() {
  return (
    <section className="v4-capabilities" data-v4-animate>
      <div className="v4-capabilities__head">
        <p className="v4-kicker">CAPABILITY / SERVICE MODEL</p>
      </div>

      <div className="v4-capabilities__grid">
        {CAPABILITIES.map((cap, index) => (
          <article key={cap.id} className="v4-cap-card">
            <div className="v4-cap-card__header">
              <span className="v4-cap-card__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="v4-cap-card__metric">{cap.metric}</span>
            </div>
            <h3 className="v4-cap-card__title">{cap.title}</h3>
            <p className="v4-cap-card__desc">{cap.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
