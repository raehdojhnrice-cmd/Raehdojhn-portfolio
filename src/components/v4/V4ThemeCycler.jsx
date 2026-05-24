import { useEffect, useMemo, useState } from 'react'
import { V4_DEFAULT_THEME_ID, V4_THEME_PROFILES } from './v4ThemeProfiles'
import { setV4PlayerTheme } from './useV4PlayerPaletteTheme'

const LS_KEY = 'rae-v4-theme-id'

function findThemeIndex(themeId) {
  return Math.max(0, V4_THEME_PROFILES.findIndex((theme) => theme.id === themeId))
}

function readSavedIndex() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return findThemeIndex(V4_DEFAULT_THEME_ID)
    return findThemeIndex(raw)
  } catch {
    return findThemeIndex(V4_DEFAULT_THEME_ID)
  }
}

export default function V4ThemeCycler() {
  const [index, setIndex] = useState(readSavedIndex)

  const theme = useMemo(() => (
    V4_THEME_PROFILES[index] || V4_THEME_PROFILES[findThemeIndex(V4_DEFAULT_THEME_ID)]
  ), [index])

  useEffect(() => {
    document.documentElement.setAttribute('data-archive-theme', theme.id)

    try {
      localStorage.setItem(LS_KEY, theme.id)
    } catch {
      /* ignore quota errors */
    }

    setV4PlayerTheme(theme.id)
  }, [theme])

  return (
    <button
      type="button"
      className="v4-theme-cycler"
      onClick={() => setIndex((prev) => (prev + 1) % V4_THEME_PROFILES.length)}
      aria-label={`Cycle V4 palette profile. Current profile: ${theme.label}`}
      title={`${theme.label}: ${theme.scene}`}
    >
      <span className="v4-theme-cycler__label">PALETTE</span>
      <span className="v4-theme-cycler__value">{theme.label.toUpperCase()}</span>
      <span className="v4-theme-cycler__meta">{theme.style.toUpperCase()}</span>
    </button>
  )
}
