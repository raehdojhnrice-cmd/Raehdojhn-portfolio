import moonx from '../../data/framer-extracted/moonx.framer.website.visual-components.json'
import kierkegaard from '../../data/framer-extracted/kierkegaard.framer.website.visual-components.json'
import noora from '../../data/framer-extracted/noora.framer.media.visual-components.json'
import jakeRoberts from '../../data/framer-extracted/jake-roberts.framer.website.visual-components.json'
import makos from '../../data/framer-extracted/makos.framer.website.visual-components.json'
import kima from '../../data/framer-extracted/kima.framer.media.visual-components.json'
import derekCole from '../../data/framer-extracted/derekcole.framer.website.visual-components.json'

const SOURCES = [
  { id: 'moonx', label: 'MoonX', host: 'moonx.framer.website', data: moonx, tone: 'azure' },
  { id: 'kierkegaard', label: 'Kierkegaard', host: 'kierkegaard.framer.website', data: kierkegaard, tone: 'amber' },
  { id: 'noora', label: 'Noora', host: 'noora.framer.media', data: noora, tone: 'coral' },
  { id: 'jake-roberts', label: 'Jake Roberts', host: 'jake-roberts.framer.website', data: jakeRoberts, tone: 'mint' },
  { id: 'makos', label: 'Makos', host: 'makos.framer.website', data: makos, tone: 'steel' },
  { id: 'kima', label: 'Kima', host: 'kima.framer.media', data: kima, tone: 'lilac' },
  { id: 'derekcole', label: 'Derek Cole', host: 'derekcole.framer.website', data: derekCole, tone: 'slate' },
]

const CATEGORY_META = {
  hero: { label: 'Hero and Intro', icon: 'H' },
  navigation: { label: 'Navigation and Brand', icon: 'N' },
  projectMedia: { label: 'Project and Media', icon: 'P' },
  socialProof: { label: 'Testimonials and Proof', icon: 'T' },
  contact: { label: 'Forms and Contact', icon: 'C' },
  metrics: { label: 'Stats and Service Signals', icon: 'S' },
  structure: { label: 'Layout and Components', icon: 'L' },
  interactions: { label: 'Interactive and Utility', icon: 'I' },
  misc: { label: 'Miscellaneous', icon: 'M' },
}

const CATEGORY_ORDER = [
  'hero',
  'navigation',
  'projectMedia',
  'socialProof',
  'contact',
  'metrics',
  'structure',
  'interactions',
  'misc',
]

function classifyComponent(name) {
  const text = name.toLowerCase()

  if (/(hero|intro|headline|title|subtitle|showreel|cover|artifact|welcome|building)/.test(text)) {
    return 'hero'
  }

  if (/(nav|menu|navbar|link|logo|brand|hamburger|portal|social|footer|copyright|back to top)/.test(text)) {
    return 'navigation'
  }

  if (/(project|work|gallery|image|video|reel|card|thumbnail|avatar|portrait|desktop image|tablet image|phone image|ticker)/.test(text)) {
    return 'projectMedia'
  }

  if (/(testimonial|review|quote|stars|customer|copied|award)/.test(text)) {
    return 'socialProof'
  }

  if (/(contact|form|email|phone|faq|helper|notifications|cta|button)/.test(text)) {
    return 'contact'
  }

  if (/(stats|number|numbers|year|service|services|tools|clients|experience|point|points|awards|capability)/.test(text)) {
    return 'metrics'
  }

  if (/(container|content|wrapper|section|column|columns|main|desktop|mobile|tablet|left|right|top|bottom|list|item|items|grid|row|backdrop|overlay|border|line|divider)/.test(text)) {
    return 'structure'
  }

  if (/(icon|dot|spinner|loading|play|arrow|variant|active|inactive|default|light|dark|shadow|blur|tilt|tooltip)/.test(text)) {
    return 'interactions'
  }

  return 'misc'
}

function createEmptyCategoryMap() {
  return CATEGORY_ORDER.reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {})
}

function buildSiteModel(source) {
  const components = Array.isArray(source?.data?.visual_component_names)
    ? source.data.visual_component_names
    : []

  const categoryMap = createEmptyCategoryMap()
  components.forEach((componentName) => {
    const bucket = classifyComponent(componentName)
    categoryMap[bucket].push(componentName)
  })

  return {
    ...source,
    total: components.length,
    categoryMap,
    components,
  }
}

function uniquePreserveOrder(items) {
  const seen = new Set()
  const output = []

  items.forEach((item) => {
    const key = String(item)
    if (seen.has(key)) return
    seen.add(key)
    output.push(item)
  })

  return output
}

function pickComponentsByCategory(siteModels, category, limit) {
  const merged = siteModels.flatMap((site) => site.categoryMap[category].map((name) => ({
    site: site.label,
    host: site.host,
    value: name,
  })))

  return uniquePreserveOrder(merged.map((entry) => `${entry.value}|||${entry.site}|||${entry.host}`))
    .slice(0, limit)
    .map((entry) => {
      const [value, site, host] = entry.split('|||')
      return { value, site, host }
    })
}

function createQuoteSamples(siteModels) {
  const quotes = []

  siteModels.forEach((site) => {
    site.components.forEach((name) => {
      const maybeSentence = /[.!?]/.test(name) || name.length > 58
      if (!maybeSentence) return
      quotes.push({ source: site.label, value: name })
    })
  })

  return uniquePreserveOrder(quotes.map((item) => `${item.value}|||${item.source}`))
    .slice(0, 6)
    .map((entry) => {
      const [value, source] = entry.split('|||')
      return { value, source }
    })
}

function getHeroHeadline(siteModels) {
  const explicit = siteModels
    .flatMap((site) => site.components)
    .find((name) => name.toUpperCase() === 'BUILDING LASTING DIGITAL CONNECTIONS')

  if (explicit) return explicit

  const heroNames = siteModels.flatMap((site) => site.categoryMap.hero)
  return heroNames[0] || 'FRAMER VISUAL SYSTEM SYNTHESIS'
}

export default function V4FramerSynthesis() {
  const siteModels = SOURCES.map(buildSiteModel)
  const heroHeadline = getHeroHeadline(siteModels)
  const navPills = pickComponentsByCategory(siteModels, 'navigation', 18)
  const projectTiles = pickComponentsByCategory(siteModels, 'projectMedia', 16)
  const statTiles = pickComponentsByCategory(siteModels, 'metrics', 12)
  const utilityTiles = pickComponentsByCategory(siteModels, 'interactions', 12)
  const quoteSamples = createQuoteSamples(siteModels)
  const totalComponents = siteModels.reduce((acc, site) => acc + site.total, 0)

  return (
    <section id="synthesis" className="v4-framer-fusion" data-v4-animate>
      <header className="v4-framer-fusion__head">
        <p className="v4-kicker">FRAMER SOURCE SYNTHESIS / 07 REFERENCES / {totalComponents} COMPONENTS</p>
        <h2 className="v4-h2">V4 VISUAL DNA SYNTHESIS ENGINE</h2>
        <p className="v4-copy">
          Every extracted visual layer from MoonX, Kierkegaard, Noora, Jake Roberts, Makos, Kima, and Derek Cole is
          mapped into one cohesive V4 system.
        </p>
      </header>

      <div className="v4-framer-fusion__hero-banner" aria-label="Unified hero and brand language">
        <p>Fusion headline</p>
        <strong>{heroHeadline}</strong>
        <span>Navigation + Hero + Gallery + Testimonials + FAQ + Contact merged into one surface.</span>
      </div>

      <div className="v4-framer-fusion__ticker" aria-hidden="true">
        <div className="v4-framer-fusion__ticker-track">
          {[...navPills, ...navPills].map((pill, index) => (
            <span key={`${pill.value}-${index}`}>{pill.value}</span>
          ))}
        </div>
      </div>

      <section className="v4-framer-fusion__modules" aria-label="Framer visual module synthesis">
        <article className="v4-framer-module v4-framer-module--gallery">
          <p className="v4-framer-module__label">Project and Media Composite</p>
          <h3>Gallery, showreel, card, and ticker vocabulary from all sources.</h3>
          <div className="v4-framer-gallery-grid">
            {projectTiles.map((tile, index) => (
              <div key={`${tile.value}-${tile.site}`} className={`v4-framer-gallery-tile is-${index % 4}`}>
                <span>{tile.site}</span>
                <strong>{tile.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="v4-framer-module v4-framer-module--proof">
          <p className="v4-framer-module__label">Testimonials and Proof Layer</p>
          <h3>Quote, review, award, and trust signals translated into V4 cards.</h3>
          <div className="v4-framer-quote-stack">
            {quoteSamples.length ? quoteSamples.map((quote) => (
              <blockquote key={`${quote.source}-${quote.value}`} className="v4-framer-quote">
                <p>{quote.value}</p>
                <cite>{quote.source}</cite>
              </blockquote>
            )) : (
              <blockquote className="v4-framer-quote">
                <p>Source quotes are indexed in the component atlas below.</p>
                <cite>V4 synthesis</cite>
              </blockquote>
            )}
          </div>
        </article>

        <article className="v4-framer-module v4-framer-module--contact">
          <p className="v4-framer-module__label">FAQ and Contact Composite</p>
          <h3>Form, CTA, FAQ, notification, and social link patterns merged.</h3>
          <div className="v4-framer-contact-grid">
            <div className="v4-framer-faq">
              <details open>
                <summary>How was this visual blend built?</summary>
                <p>By classifying every extracted Framer component and mapping it into cohesive V4 modules.</p>
              </details>
              <details>
                <summary>What stayed intact in the current V4 architecture?</summary>
                <p>Routes, existing windows, desktop shell behaviors, archive logic, and contact terminal behavior.</p>
              </details>
              <details>
                <summary>Which systems were merged?</summary>
                <p>Navigation, hero, projects, media, testimonials, FAQ, forms, social links, and footer language.</p>
              </details>
            </div>

            <form className="v4-framer-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                <span>Name</span>
                <input type="text" placeholder="Your name" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" placeholder="you@example.com" />
              </label>
              <label>
                <span>Brief</span>
                <textarea rows={3} placeholder="Describe the project signal." />
              </label>
              <button type="submit">Transmit visual brief</button>
            </form>
          </div>
        </article>

        <article className="v4-framer-module v4-framer-module--stats">
          <p className="v4-framer-module__label">Stats and Services Layer</p>
          <h3>Service, point, tools, clients, and metrics interpreted as compact badges.</h3>
          <div className="v4-framer-stat-grid">
            {statTiles.map((tile) => (
              <div key={`${tile.value}-${tile.site}`} className="v4-framer-stat">
                <span>{tile.site}</span>
                <strong>{tile.value}</strong>
              </div>
            ))}
          </div>

          <div className="v4-framer-utility-row" aria-label="Interaction and utility components">
            {utilityTiles.map((tile) => (
              <span key={`${tile.value}-${tile.site}`}>{tile.value}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="v4-framer-atlas" aria-label="Complete Framer component atlas">
        <header className="v4-framer-atlas__head">
          <p className="v4-kicker">COMPLETE COMPONENT ATLAS</p>
          <p className="v4-copy">
            Every extracted component name is listed below by source and visual role so the full report is represented
            inside the live V4 experience.
          </p>
        </header>

        {siteModels.map((site) => (
          <details key={site.id} className={`v4-framer-atlas__site is-${site.tone}`} open>
            <summary>
              <span>{site.label}</span>
              <span>{site.total} components</span>
            </summary>

            <div className="v4-framer-atlas__groups">
              {CATEGORY_ORDER.map((categoryKey) => {
                const entries = site.categoryMap[categoryKey]
                if (!entries.length) return null

                return (
                  <article key={`${site.id}-${categoryKey}`} className="v4-framer-atlas__group">
                    <h4>
                      <span>{CATEGORY_META[categoryKey].icon}</span>
                      {CATEGORY_META[categoryKey].label}
                      <em>{entries.length}</em>
                    </h4>

                    <div className="v4-framer-atlas__chips">
                      {entries.map((entry, index) => (
                        <span key={`${site.id}-${categoryKey}-${index}`} className={`v4-framer-chip is-${categoryKey}`}>
                          {entry}
                        </span>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>
          </details>
        ))}
      </section>
    </section>
  )
}
