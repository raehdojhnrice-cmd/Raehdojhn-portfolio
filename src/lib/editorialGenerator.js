const MOOD_LAYOUTS = {
  chaotic: ['hero', 'image_cluster', 'split_stagger', 'pull_quote', 'deep_text', 'negative_space', 'full_bleed_image', 'closing'],
  minimal: ['hero', 'full_bleed_image', 'intro_text', 'pull_quote', 'deep_text', 'negative_space', 'closing'],
  introspective: ['hero', 'split_stagger', 'intro_text', 'pull_quote', 'full_bleed_image', 'deep_text', 'negative_space', 'closing'],
  futuristic: ['hero', 'full_bleed_image', 'data_overlay', 'split_stagger', 'pull_quote', 'image_cluster', 'deep_text', 'closing'],
}

const MOOD_MEDIA = {
  chaotic: [
    'Blurred flash portrait, heavy grain, kinetic framing',
    'Night street motion streaks with blown highlights',
    'Raw backstage stills with high contrast noise',
  ],
  minimal: [
    'Single portrait in controlled studio light with negative space',
    'Monochrome still with clean background and strict framing',
    'Architectural frame with one isolated subject',
  ],
  introspective: [
    'Soft portrait with muted neutrals and gentle contrast',
    'Quiet environmental still with natural light',
    'Slow observational video loop with subtle texture',
  ],
  futuristic: [
    'Dark interface scene with crisp edge lighting and data overlays',
    'High-contrast macro with metallic texture and cool highlights',
    'Minimal cybernetic composition with modular geometry',
  ],
}

const TONE_SUBHEADS = {
  observational: [
    'A close read on process, pressure, and intent.',
    'An editorial field note on work in motion.',
    'A measured look at what shapes the output.',
  ],
  poetic: [
    'A mood-led study in texture, memory, and movement.',
    'Fragments of signal, stitched into a narrative arc.',
    'A lyrical map of tension between form and feeling.',
  ],
  journalistic: [
    'A structured breakdown of context, decisions, and results.',
    'A report-style narrative with documented turning points.',
    'A clear account of method, iteration, and impact.',
  ],
}

const SECTION_LABELS = {
  hero: 'Hero',
  intro_text: 'Intro Text',
  split_stagger: 'Split Stagger',
  pull_quote: 'Pull Quote',
  full_bleed_image: 'Full-Bleed Visual',
  image_cluster: 'Editorial Cluster',
  deep_text: 'Deep Narrative',
  data_overlay: 'Data Overlay',
  negative_space: 'Negative Space Beat',
  closing: 'Closing',
}

export const EDITORIAL_OPTIONS = {
  moods: [
    { value: 'chaotic', label: 'Chaotic' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'introspective', label: 'Introspective' },
    { value: 'futuristic', label: 'Futuristic' },
  ],
  tones: [
    { value: 'observational', label: 'Observational' },
    { value: 'poetic', label: 'Poetic' },
    { value: 'journalistic', label: 'Journalistic' },
  ],
  intensities: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
  imageDensities: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
}

function hashSeed(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function pick(list, seed, offset = 0) {
  if (!Array.isArray(list) || list.length === 0) return ''
  const index = (hashSeed(`${seed}:${offset}`) + offset) % list.length
  return list[index]
}

function toTitleCase(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function normalizeInput(input = {}) {
  const subject = String(input.subject || '').trim() || 'Untitled Subject'
  const mood = MOOD_LAYOUTS[input.mood] ? input.mood : 'introspective'
  const tone = TONE_SUBHEADS[input.tone] ? input.tone : 'observational'
  const intensity = ['low', 'medium', 'high'].includes(input.intensity) ? input.intensity : 'medium'
  const imageDensity = ['low', 'medium', 'high'].includes(input.imageDensity) ? input.imageDensity : 'medium'
  return { subject, mood, tone, intensity, imageDensity }
}

function generateHeadline({ subject, mood, intensity, seed }) {
  const titleSubject = toTitleCase(subject)
  const stems = {
    chaotic: [
      `${titleSubject} In Fragments`,
      `${titleSubject}, Uncontained`,
      `${titleSubject} Under Pressure`,
    ],
    minimal: [
      `A Study Of ${titleSubject}`,
      `${titleSubject}`,
      `${titleSubject}: Field Notes`,
    ],
    introspective: [
      `Nothing About ${titleSubject} Feels Accidental`,
      `${titleSubject} In Slow Detail`,
      `Reading ${titleSubject} Between The Lines`,
    ],
    futuristic: [
      `${titleSubject}: Next State`,
      `${titleSubject} As Interface`,
      `${titleSubject} / System Forecast`,
    ],
  }
  const base = pick(stems[mood], seed, 2)
  if (intensity === 'high') return `${base} //`
  if (intensity === 'low') return base.replace(' //', '')
  return base
}

function generateSubhead({ mood, tone, seed }) {
  const moodSuffix = {
    chaotic: 'Built for impact-first reading.',
    minimal: 'Built for clarity-first reading.',
    introspective: 'Built for reflective pacing.',
    futuristic: 'Built for system-level narrative.',
  }
  return `${pick(TONE_SUBHEADS[tone], seed, 3)} ${moodSuffix[mood]}`
}

function withFinalPeriod(text) {
  const trimmed = text.trim()
  if (!trimmed) return trimmed
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function generateParagraphs({ subject, mood, tone, intensity, seed }) {
  const intros = [
    `${subject} enters the frame through context before spectacle, letting the story establish its own gravity.`,
    `The opening beat stays anchored in observation, so every design decision reads as intent instead of decoration.`,
    `What follows is paced to scroll like an editorial spread: pressure, pause, then release.`,
  ]
  const depth = [
    `In ${mood} mode, sections alternate between text density and visual interruption to keep cadence alive.`,
    `The ${tone} voice keeps each paragraph short and directional, so readers can track one idea at a time.`,
    `Intensity set to ${intensity} shifts typographic scale, spacing tension, and transition weight without changing structure.`,
    `This keeps the post modular for reuse while preserving a distinct authored feel.`,
  ]
  const closing = [
    `The article closes without over-explaining, leaving a final line that extends the mood beyond the viewport.`,
    `As a system, the format stays repeatable while every subject still feels custom.`,
  ]

  return {
    intro: intros.map(withFinalPeriod),
    deep: depth.map(withFinalPeriod),
    closing: closing.map(withFinalPeriod),
    pullQuote: withFinalPeriod(
      pick(
        [
          `The system stays strict, but the feeling stays alive`,
          `Clarity and chaos can live in the same layout`,
          `Every module should carry story, not just style`,
          `A post should read like a spread, not a template`,
        ],
        seed,
        5
      )
    ),
    isolationLine: withFinalPeriod(
      pick(
        [
          `One line can reset the entire pace`,
          `Silence is part of the composition`,
          `The pause is where the story lands`,
          `Constraint creates character`,
        ],
        seed,
        9
      )
    ),
  }
}

function buildLayoutOrder({ mood, imageDensity }) {
  const base = [...MOOD_LAYOUTS[mood]]
  if (imageDensity === 'low') {
    return base.filter((module) => module !== 'image_cluster').map((module) => (module === 'full_bleed_image' ? 'intro_text' : module))
  }
  if (imageDensity === 'high' && !base.includes('image_cluster')) {
    base.splice(Math.max(2, base.length - 3), 0, 'image_cluster')
  }
  return base
}

function markdownFromStructure({ headline, subhead, paragraphs, layoutOrder, mediaDirection }) {
  const body = [
    `# ${headline}`,
    `> ${subhead}`,
    '',
    '## Hero Direction',
    mediaDirection,
    '',
    '## Layout Order',
    layoutOrder.map((module, i) => `${i + 1}. ${SECTION_LABELS[module] || module}`).join('\n'),
    '',
    '## Opening',
    ...paragraphs.intro,
    '',
    '## Pull Quote',
    `"${paragraphs.pullQuote}"`,
    '',
    '## Deep Section',
    ...paragraphs.deep,
    '',
    '## Negative Space Beat',
    paragraphs.isolationLine,
    '',
    '## Closing',
    ...paragraphs.closing,
  ]
  return body.join('\n\n').trim()
}

export function generateCopyStructure(input = {}) {
  const normalized = normalizeInput(input)
  const seed = `${normalized.subject}|${normalized.mood}|${normalized.tone}|${normalized.intensity}|${normalized.imageDensity}`
  const headline = generateHeadline({ ...normalized, seed })
  const subhead = generateSubhead({ ...normalized, seed })
  const paragraphs = generateParagraphs({ ...normalized, seed })
  const mediaDirection = pick(MOOD_MEDIA[normalized.mood], seed, 7)
  const layoutOrder = buildLayoutOrder(normalized)
  const markdown = markdownFromStructure({ headline, subhead, paragraphs, layoutOrder, mediaDirection })
  const excerpt = `${paragraphs.intro[0]} ${paragraphs.intro[1]}`.slice(0, 260)

  return {
    headline,
    subhead,
    excerpt,
    mediaDirection,
    pullQuote: paragraphs.pullQuote,
    paragraphs,
    layoutOrder,
    markdown,
    tags: ['Editorial Generator', toTitleCase(normalized.mood), toTitleCase(normalized.tone)],
  }
}

export function generateEditorialLayout(input = {}) {
  const normalized = normalizeInput(input)
  const copy = generateCopyStructure(normalized)
  const generatedAt = new Date().toISOString()

  const modules = copy.layoutOrder.map((module, index) => ({
    id: `${module}-${index + 1}`,
    key: module,
    label: SECTION_LABELS[module] || module,
    index: index + 1,
    directive: `Use ${SECTION_LABELS[module] || module} in ${normalized.mood} mood with ${normalized.intensity} intensity.`,
  }))

  return {
    id: `draft-${Date.now()}`,
    generatedAt,
    input: normalized,
    hero: {
      headline: copy.headline,
      subhead: copy.subhead,
      mediaDirection: copy.mediaDirection,
    },
    modules,
    layoutOrder: copy.layoutOrder,
    copy,
    antigravityPrompt: [
      `Generate an editorial blog draft for "${normalized.subject}".`,
      `Mood: ${normalized.mood}. Tone: ${normalized.tone}. Intensity: ${normalized.intensity}. Image density: ${normalized.imageDensity}.`,
      `Use this module order: ${copy.layoutOrder.join(' -> ')}.`,
      'Preserve readability and keep transitions restrained.',
    ].join(' '),
  }
}
