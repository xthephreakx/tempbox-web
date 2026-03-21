import { useState } from 'react'
import { useThemeContext } from '../../context/ThemeContext'
import { THEMES } from '../../hooks/useTheme'

export function ThemePicker() {
  const { theme, setTheme } = useThemeContext()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const label = hoveredId
    ? THEMES.find((t) => t.id === hoveredId)?.name
    : null

  return (
    <div className="theme-picker">
      <div className="theme-swatches">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={`theme-swatch ${theme === t.id ? 'theme-swatch--active' : ''}`}
            style={{ background: t.accent }}
            onClick={() => setTheme(t.id)}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}
      </div>
      <span className="theme-label">{label ?? '\u00A0'}</span>
    </div>
  )
}
