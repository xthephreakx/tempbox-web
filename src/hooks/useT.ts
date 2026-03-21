import { useThemeContext } from '../context/ThemeContext'
import { leetify } from '../lib/leet'

export function useT() {
  const { theme } = useThemeContext()
  return (text: string) => theme === 'matrix' ? leetify(text) : text
}
