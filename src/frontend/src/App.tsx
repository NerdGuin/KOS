import { useState, memo } from 'react'
import StatusBar from './components/StatusBar'
import NavigationBar from './components/NavigationBar'
import Dashboard from './components/Dashboard'
import SettingsWindow from './pages/Settings'

interface AppItem {
  icon: string
  label: string
  color: string
  favorite: boolean
  window?: string
}

const DashboardMemo = memo(Dashboard)

function App() {
  const [activePage, setActivePage] = useState<null | string>(null)
  const [openPages, setOpenPages] = useState<string[]>([])

  const apps: AppItem[] = [
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
      icon: 'ri-phone-fill',
      label: 'Telefone',
      color: '#34a853',
      favorite: true,
      window: 'phone',
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
  ]

  const openApp = (app: AppItem) => {
    if (!app.window) return

    const localOverlays = apps.filter((a) => a.window).map((a) => a.window!)
    const localApps = ['settings', 'profile']

    if (
      localOverlays.includes(localApps.find((a) => app.window!.includes(a))!)
    ) {
      setOpenPages((prev) => {
        if (prev.includes(app.window!)) return prev
        const newPages = [...prev, app.window!]
        return newPages.slice(-5)
      })
      setActivePage(app.window)
    } else {
      fetch(`http://localhost:8000/open/${app.window}`)
        .then((res) => res.json())
        .then((data) => console.log('API response:', data))
        .catch((err) => console.error(err))
    }
  }

  const handleNavClick = (
    target: string,
    action?: 'open' | 'back' | 'close'
  ) => {
    if (action === 'back') {
      setActivePage(null)
      return
    }

    if (action === 'close') {
      setOpenPages((prev) => prev.filter((p) => p !== target))
      if (activePage === target) setActivePage(null)
      return
    }

    if (action === 'open') {
      setActivePage(target)
      return
    }
  }

  return (
    <>
      <div className="bg-pattern"></div>
      <div className="bg-glow"></div>
      <StatusBar />

      {!activePage && (
        <div className="container" id="home">
          <DashboardMemo apps={apps} onAppClick={openApp} />
        </div>
      )}

      {activePage === 'settings' && (
        <SettingsWindow onClose={() => setActivePage(null)} />
      )}
      {/* {activePage === 'profile' && <ProfilePage onClose={() => setActivePage(null)} />} */}

      {/* <ClimateWidget /> */}

      <NavigationBar
        active={activePage || 'home'}
        onClick={handleNavClick}
        openPages={openPages}
      />
    </>
  )
}

export default App
