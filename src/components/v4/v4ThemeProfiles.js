import { V4_JSON_PROFILE_IMAGES } from '../../data/v4JsonProfileData'

export const V4_THEME_PROFILES = V4_JSON_PROFILE_IMAGES.map((profile) => ({
  id: profile.id,
  label: profile.label,
  scene: profile.scene,
  style: profile.style,
  layoutPrinciples: profile.layoutPrinciples,
  editorialNote: profile.editorialNote,
  palette: profile.palette,
  archive: profile.archive,
}))

export const V4_DEFAULT_THEME_ID = 'elite-designs'

export const V4_THEME_BY_ID = Object.fromEntries(
  V4_THEME_PROFILES.map((profile) => [profile.id, profile])
)
