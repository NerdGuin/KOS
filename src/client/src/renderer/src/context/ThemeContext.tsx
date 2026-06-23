import React, { createContext, useContext, useState } from 'react'

export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
}

const defaultTheme: Theme = {
  name: 'default',
  colors: {
    primary: '#4285f4',
    secondary: '#9aa0a6',
    background: 'rgba(0, 0, 0, 0.9)',
    text: '#fff',
    accent: '#ff4500'
  }
}

const newTheme: Theme = {
  name: 'new',
  colors: {
    primary: '#4285f4',
    secondary: '#9aa0a6',
    background: 'rgba(0, 0, 0, 0.9)',
    text: '#fff',
    accent: '#ff4500'
  }
}

const themes: Record<string, Theme> = {
  default: defaultTheme,
  new: newTheme
}

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeName: string) => void
  availableThemes: string[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState<string>('new')

  const currentTheme = themes[currentThemeName]

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName)
    }
  }

  const availableThemes = Object.keys(themes)

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  )
}
