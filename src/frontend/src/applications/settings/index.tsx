import { useState } from 'react'
import Sidebar from './sidebar'
import WifiPage from './WifiPage'
import ScreenPage from './ScreenPage'
import AboutPage from './AboutPage'
import './index.css'

type Page = 'screen' | 'about' | 'wifi'

interface SettingsWindowProps {
  visible: boolean
  onClose: () => void
}

export default function SettingsWindow({ visible }: SettingsWindowProps) {
  const [activePage, setActivePage] = useState<Page>('about')

  const renderPage = () => {
    switch (activePage) {
      case 'wifi':
        return <WifiPage />
      case 'screen':
        return <ScreenPage />
      case 'about':
        return <AboutPage />
      default:
        return null
    }
  }

  return (
    <div
      className="main-container"
      id="settings"
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      {renderPage()}
    </div>
  )
}
