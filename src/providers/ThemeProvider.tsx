import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ThemeContextValue {
  darkMode: boolean
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('aura-dark') === '1')

  useEffect(() => {
    localStorage.setItem('aura-dark', darkMode ? '1' : '0')
  }, [darkMode])

  const toggleDark = () => setDarkMode(d => !d)

  return <ThemeContext.Provider value={{ darkMode, toggleDark }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return ctx
}
