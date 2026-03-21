import { useState, useEffect } from 'react'

export type ThemeId = 'dark-amber' | 'gemstone-dusk' | 'sapphire' | 'aquamarine' | 'tallgeese' | 'matrix' | 'aliens' | 'cyberpunk'

export interface Theme {
  id: ThemeId
  name: string
  accent: string   // swatch color for the picker
}

export const THEMES: Theme[] = [
  { id: 'cyberpunk',     name: 'Cyberpunk',              accent: '#FF007C' },
  { id: 'dark-amber',    name: 'Dark Amber',           accent: '#E8A835' },
  { id: 'gemstone-dusk', name: 'Gemstone Dusk',         accent: '#A162A1' },
  { id: 'sapphire',      name: 'Sapphire Whisper',      accent: '#749DD0' },
  { id: 'aquamarine',    name: 'Aquamarine Citrine',    accent: '#FA7305' },
  { id: 'tallgeese',     name: 'Tallgeese',             accent: '#F54B5D' },
  { id: 'matrix',        name: 'The Matrix',            accent: '#00FF41' },
  { id: 'aliens',        name: 'Aliens (1986)',          accent: '#A8C832' },
]

const STORAGE_KEY = 'tempbox_theme'

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId
    const valid = THEMES.map((t) => t.id)
    return valid.includes(saved) ? saved : 'dark-amber'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Apply on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const setTheme = (id: ThemeId) => {
    setThemeState(id)
    localStorage.setItem(STORAGE_KEY, id)
    document.documentElement.setAttribute('data-theme', id)
  }

  return { theme, setTheme, themes: THEMES }
}
