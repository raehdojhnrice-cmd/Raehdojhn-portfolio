import { useEffect } from 'react'
import { V4_DEFAULT_THEME_ID, V4_THEME_PROFILES } from './v4ThemeProfiles'

export const PLAYER_THEME_KEY = 'rae-music-player-theme'
export const V4_PLAYER_THEME_EVENT = 'v4-player-theme-change'

const LEGACY_PLAYER_THEME_TOKENS = {
  noir: {
    bg: '#090909',
    surface: '#151515',
    line: 'rgba(255,255,255,0.14)',
    text: '#f4eee5',
    muted: '#8a8176',
    accent: '#ff3366',
    alert: '#ff9a00',
  },
  cobalt: {
    bg: '#071121',
    surface: '#10233f',
    line: 'rgba(126,182,255,0.3)',
    text: '#e8f0ff',
    muted: '#8294b5',
    accent: '#58a6ff',
    alert: '#8bd3ff',
  },
  amber: {
    bg: '#120b03',
    surface: '#271809',
    line: 'rgba(250,179,80,0.28)',
    text: '#fff2da',
    muted: '#a98f67',
    accent: '#f6a01a',
    alert: '#ffcc66',
  },
  emerald: {
    bg: '#051512',
    surface: '#0e2a24',
    line: 'rgba(88,217,174,0.3)',
    text: '#ddfff4',
    muted: '#82baab',
    accent: '#3dcc9a',
    alert: '#7ef2cc',
  },
  graphite: {
    bg: '#0f1217',
    surface: '#1c222b',
    line: 'rgba(203,214,227,0.22)',
    text: '#f3f4f6',
    muted: '#8f98a3',
    accent: '#d84545',
    alert: '#ff6b6b',
  },
  mintlab: {
    bg: '#dfe9e1',
    surface: '#cddcd1',
    line: 'rgba(33,82,66,0.22)',
    text: '#0f2f27',
    muted: '#58756d',
    accent: '#2b8d72',
    alert: '#55c7a1',
  },
  mono: {
    bg: '#f2f0eb',
    surface: '#e6e3dc',
    line: 'rgba(18,18,18,0.2)',
    text: '#0a0a0a',
    muted: '#5f5f5f',
    accent: '#111111',
    alert: '#555555',
  },
  cassette: {
    bg: '#353d42',
    surface: '#495257',
    line: 'rgba(231,234,229,0.18)',
    text: '#f1f2ef',
    muted: '#949a93',
    accent: '#d63d2f',
    alert: '#ff7260',
  },
  saviom: {
    bg: '#f6f2e9',
    surface: '#e8e0d1',
    line: 'rgba(64,49,30,0.2)',
    text: '#1d1913',
    muted: '#75695a',
    accent: '#d43a4f',
    alert: '#e96272',
  },
  melvin: {
    bg: '#f0ede4',
    surface: '#e6e1d7',
    line: 'rgba(24,24,24,0.2)',
    text: '#0f0f0f',
    muted: '#68635d',
    accent: '#c0392b',
    alert: '#d06458',
  },
  axis: {
    bg: '#0b0f14',
    surface: '#131a22',
    line: 'rgba(174,189,206,0.24)',
    text: '#f4f7fb',
    muted: '#8e9aab',
    accent: '#ffffff',
    alert: '#93a2b3',
  },
  neotech: {
    bg: '#050505',
    surface: '#111111',
    line: 'rgba(255,255,255,0.18)',
    text: '#ffffff',
    muted: '#929292',
    accent: '#ff6b00',
    alert: '#ffa24d',
  },
  ineffable: {
    bg: '#000000',
    surface: '#0f0f0f',
    line: 'rgba(255,255,255,0.16)',
    text: '#f6f6f6',
    muted: '#8f8f8f',
    accent: '#ffffff',
    alert: '#9c9c9c',
  },
  chaingpt: {
    bg: '#ffffff',
    surface: '#f5f5f5',
    line: 'rgba(20,20,20,0.22)',
    text: '#111111',
    muted: '#6e6e6e',
    accent: '#ff6b00',
    alert: '#ff9133',
  },
  kyiv: {
    bg: '#090909',
    surface: '#151515',
    line: 'rgba(255,255,255,0.16)',
    text: '#f7f7f7',
    muted: '#989898',
    accent: '#ff4500',
    alert: '#ff7a40',
  },
}

const PROFILE_THEME_TOKENS = Object.fromEntries(
  V4_THEME_PROFILES.map((profile) => [profile.id, profile.archive])
)

const PLAYER_THEME_TOKENS = {
  ...LEGACY_PLAYER_THEME_TOKENS,
  ...PROFILE_THEME_TOKENS,
}

const CSS_VARS = [
  ['--v4-player-bg', 'bg'],
  ['--v4-player-surface', 'surface'],
  ['--v4-player-line', 'line'],
  ['--v4-player-text', 'text'],
  ['--v4-player-muted', 'muted'],
  ['--v4-player-accent', 'accent'],
  ['--v4-player-alert', 'alert'],
  ['--v4-player-classic-blue', 'accent'],
  ['--v4-player-archive-cyan', 'alert'],
  ['--v4-player-archive-paper', 'surface'],
]

function readStoredThemeId() {
  try {
    const raw = window.localStorage.getItem(PLAYER_THEME_KEY)
    if (raw && Object.prototype.hasOwnProperty.call(PLAYER_THEME_TOKENS, raw)) {
      return raw
    }
  } catch {
    /* ignore storage errors */
  }

  return V4_DEFAULT_THEME_ID
}

function applyThemeToRoot(themeId) {
  const root = document.documentElement
  const theme = PLAYER_THEME_TOKENS[themeId] || PLAYER_THEME_TOKENS[V4_DEFAULT_THEME_ID]

  root.setAttribute('data-v4-player-theme', themeId)

  CSS_VARS.forEach(([cssVar, themeKey]) => {
    root.style.setProperty(cssVar, theme[themeKey])
  })
}

export function setV4PlayerTheme(themeId, options = {}) {
  const { persist = true, emit = true } = options
  const validThemeId = Object.prototype.hasOwnProperty.call(PLAYER_THEME_TOKENS, themeId)
    ? themeId
    : V4_DEFAULT_THEME_ID

  applyThemeToRoot(validThemeId)

  if (persist) {
    try {
      window.localStorage.setItem(PLAYER_THEME_KEY, validThemeId)
    } catch {
      /* ignore storage errors */
    }
  }

  if (emit) {
    window.dispatchEvent(new CustomEvent(V4_PLAYER_THEME_EVENT, {
      detail: { themeId: validThemeId },
    }))
  }
}

export function useV4PlayerPaletteTheme() {
  useEffect(() => {
    const syncTheme = () => {
      const themeId = readStoredThemeId()
      applyThemeToRoot(themeId)
    }

    const handleStorage = (event) => {
      if (event.key === PLAYER_THEME_KEY) {
        syncTheme()
      }
    }

    const handleThemeEvent = (event) => {
      const themeId = event?.detail?.themeId
      if (themeId && Object.prototype.hasOwnProperty.call(PLAYER_THEME_TOKENS, themeId)) {
        applyThemeToRoot(themeId)
        return
      }
      syncTheme()
    }

    syncTheme()

    window.addEventListener('storage', handleStorage)
    window.addEventListener(V4_PLAYER_THEME_EVENT, handleThemeEvent)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(V4_PLAYER_THEME_EVENT, handleThemeEvent)
    }
  }, [])
}
