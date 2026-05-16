import React, { useState, useMemo, useEffect } from 'react'
import './index.css'

import StatusBar from './components/StatusBar'
import NavigationBar from './components/NavigationBar'
import Carousel from './components/Carousel'
import Dashboard from './components/Dashboard'

import SettingsWindow from './applications/settings'
import CamerasApplication from './applications/cameras'
import VehicleApplication from './applications/vehicle'
import RadioApplication from './applications/radio'

import { appManager } from './core/appManager'
import { localApps } from './config/apps'
import { useConfig } from './context/ConfigContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'

interface AppItem {
  icon: string
  label: string
  color: string
  favorite: boolean
  window?: string
}

const APPS: AppItem[] = [
  {
    icon: 'ri-map-pin-2-fill',
    label: 'Navegação',
    color: '#4285f4',
    favorite: true,
    window: 'navigation'
  },
  {
    icon: 'ri-spotify-fill',
    label: 'Spotify',
    color: '#18D860',
    favorite: true,
    window: 'spotify'
  },
  {
    icon: 'ri-camera-fill',
    label: 'Câmeras',
    color: '#8B5CF6',
    favorite: true,
    window: 'cameras'
  },
  {
    icon: 'ri-roadster-fill',
    label: 'Veículo',
    color: '#ff4500',
    favorite: true,
    window: 'vehicle'
  },
  {
    icon: 'ri-youtube-fill',
    label: 'YouTube',
    color: '#ff0000',
    favorite: true,
    window: 'youtube'
  },
  {
    icon: 'ri-radio-2-fill',
    label: 'Rádio',
    color: '#ff9800',
    favorite: true,
    window: 'radio'
  },
  {
    icon: 'ri-sun-cloudy-fill',
    label: 'Clima',
    color: '#ffc107',
    favorite: true,
    window: 'climate'
  },
  {
    icon: 'ri-settings-4-fill',
    label: 'Configurações',
    color: '#9aa0a6',
    favorite: true,
    window: 'settings'
  },
  {
    icon: 'ri-apps-2-add-fill',
    label: 'Adicionar',
    color: '#E0E0E0',
    favorite: false,
    window: 'add'
  }
]

const ThemeApplier: React.FC = () => {
  const { currentTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = currentTheme.name
    root.style.setProperty('--theme-primary', currentTheme.colors.primary)
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary)
    root.style.setProperty('--theme-background', currentTheme.colors.background)
    root.style.setProperty('--theme-text', currentTheme.colors.text)
    root.style.setProperty('--theme-accent', currentTheme.colors.accent)
  }, [currentTheme])

  return null
}

function App() {
  const [activePage, setActivePage] = useState<string | null>(null)
  const [openPages, setOpenPages] = useState<AppItem[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const { configs } = useConfig()
  const { setTheme, currentTheme } = useTheme()

  const favoriteApps = useMemo(() => APPS.filter((a) => a.favorite), [])
  const otherApps = useMemo(() => APPS.filter((a) => !a.favorite), [])

  const openApp = (app: AppItem) => {
    const windowName = app.window
    if (!windowName) return

    const isLocal = localApps.includes(windowName as any)

    if (isLocal || !isLocal) {
      setOpenPages((prev) => {
        if (prev.some((p) => p.window === windowName)) return prev
        return [...prev, app].slice(-5)
      })

      appManager.open(windowName)
      setActivePage(windowName)
      return
    }
  }

  const handleNavClick = (target: string, action?: 'open' | 'back' | 'close') => {
    if (action === 'back') return handleMinimizeApp(target)

    if (action === 'close') return handleCloseApp(target)

    if (action === 'open') {
      if (activePage === target) return setActivePage(null)

      const app = APPS.find((item) => item.window === target)
      if (app && !localApps.includes(target as any)) {
        return openApp(app)
      }

      return setActivePage(target)
    }

    if (target === 'apps') {
      setSlideIndex(1)
      setActivePage(null)
      return
    }

    if (target === 'home') {
      setSlideIndex(0)
      setActivePage(null)
    }
  }

  const currentPage = activePage ?? (slideIndex === 1 ? 'apps' : 'home')

  const appComponents: Record<
    string,
    React.ComponentType<{ visible: boolean; onClose: () => void }>
  > = {
    settings: SettingsWindow,
    cameras: CamerasApplication,
    vehicle: VehicleApplication,
    radio: RadioApplication
  }

  const handleCloseApp = (windowName: string) => {
    setOpenPages((prev) => prev.filter((p) => p.window !== windowName))
    if (activePage === windowName) setActivePage(null)

    appManager.close()
  }

  const handleMinimizeApp = (windowName: string) => {
    if (activePage === windowName) setActivePage(null)

    appManager.back()
  }

  return (
    <>
      <ThemeApplier />
      {/* <div className="bg-pattern" />
      <div className="bg-glow" /> */}

      <button
        onClick={() => setTheme(currentTheme.name === 'default' ? 'new' : 'default')}
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          zIndex: 1000,
          padding: '10px',
          background: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          textTransform: 'uppercase',
          opacity: 0.2
        }}
      >
        {currentTheme.name}
      </button>

      <StatusBar />

      {!activePage ? (
        <div className="container">
          <Carousel currentIndex={slideIndex} onChangeIndex={setSlideIndex}>
            <Dashboard apps={favoriteApps} onAppClick={openApp} />
            <Dashboard apps={otherApps} onAppClick={openApp} />
          </Carousel>
        </div>
      ) : null}

      {openPages.map((app) => {
        if (!app.window) return null
        const Component = appComponents[app.window]
        if (!Component) return null

        return (
          <Component
            key={app.window}
            visible={activePage === app.window}
            onClose={() => handleCloseApp(app.window as string)}
          />
        )
      })}

      <NavigationBar active={currentPage} onClick={handleNavClick} openPages={openPages} />
    </>
  )
}

const AppWrapper: React.FC = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
)

export default AppWrapper
