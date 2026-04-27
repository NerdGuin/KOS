import { useState, useMemo } from 'react'
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
    window: 'navigation',
  },
  {
    icon: 'ri-spotify-fill',
    label: 'Spotify',
    color: '#1db954',
    favorite: true,
    window: 'spotify',
  },
  {
    icon: 'ri-camera-fill',
    label: 'Câmeras',
    color: '#8B5CF6',
    favorite: true,
    window: 'cameras',
  },
  {
    icon: 'ri-roadster-fill',
    label: 'Veículo',
    color: '#ff4500',
    favorite: true,
    window: 'vehicle',
  },
  {
    icon: 'ri-youtube-fill',
    label: 'YouTube',
    color: '#ff0000',
    favorite: true,
    window: 'youtube',
  },
  {
    icon: 'ri-radio-2-fill',
    label: 'Rádio',
    color: '#ff9800',
    favorite: true,
    window: 'radio',
  },
  {
    icon: 'ri-sun-cloudy-fill',
    label: 'Clima',
    color: '#ffc107',
    favorite: true,
    window: 'climate',
  },
  {
    icon: 'ri-settings-4-fill',
    label: 'Configurações',
    color: '#9aa0a6',
    favorite: true,
    window: 'settings',
  },
  {
    icon: 'ri-apps-2-add-fill',
    label: 'Adicionar',
    color: '#E0E0E0',
    favorite: false,
    window: 'add',
  },
]

function App() {
  const [activePage, setActivePage] = useState<string | null>(null)
  const [openPages, setOpenPages] = useState<AppItem[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const { configs } = useConfig()

  const favoriteApps = useMemo(() => APPS.filter((a) => a.favorite), [])
  const otherApps = useMemo(() => APPS.filter((a) => !a.favorite), [])

  const openApp = (app: AppItem) => {
    if (!app.window) return

    const isLocal = localApps.includes(app.window as any)

    if (isLocal) {
      setOpenPages((prev) => {
        if (prev.some((p) => p.window === app.window)) return prev
        return [...prev, app].slice(-5)
      })

      appManager.open(app.window)
      setActivePage(app.window)
      return
    }

    fetch(`${configs.serverRemote}/open/${app.window}`)
      .then((res) => res.json())
      .then(() => appManager.open({ app: app.window } as any))
      .catch(console.error)
  }

  const handleNavClick = (
    target: string,
    action?: 'open' | 'back' | 'close'
  ) => {
    if (action === 'back') return setActivePage(null)

    if (action === 'close') return handleCloseApp(target)

    if (action === 'open') return setActivePage(target)

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
    radio: RadioApplication,
  }

  const handleCloseApp = (windowName: string) => {
    setOpenPages((prev) => prev.filter((p) => p.window !== windowName))
    if (activePage === windowName) setActivePage(null)
    appManager.close()
  }

  return (
    <>
      <div className="bg-pattern" />
      <div className="bg-glow" />

      <StatusBar />

      {!activePage && (
        <div className="container">
          <Carousel currentIndex={slideIndex} onChangeIndex={setSlideIndex}>
            <Dashboard apps={favoriteApps} onAppClick={openApp} />
            <Dashboard apps={otherApps} onAppClick={openApp} />
          </Carousel>
        </div>
      )}

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

      <NavigationBar
        active={currentPage}
        onClick={handleNavClick}
        openPages={openPages}
      />
    </>
  )
}

export default App
