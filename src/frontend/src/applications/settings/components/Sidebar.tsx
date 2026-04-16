import type { Page } from '../index'
import lang from '../../../assets/langs/br.json'

interface SidebarProps {
  activePage: Page
  setActivePage: (page: Page) => void
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div
        className={`nav-item ${activePage === 'wifi' ? 'active' : ''}`}
        onClick={() => setActivePage('wifi')}
      >
        <i className="ri-wifi-line"></i>
        <span>Wi-Fi</span>
      </div>

      <div className="nav-item">
        <i className="ri-bluetooth-line"></i>
        <span>Bluetooth</span>
      </div>

      <div
        className={`nav-item ${activePage === 'screen' ? 'active' : ''}`}
        onClick={() => setActivePage('screen')}
      >
        <i className="ri-sun-line"></i>
        <span>{lang.screen_brightness}</span>
      </div>

      <div className="nav-item">
        <i className="ri-equalizer-line"></i>
        <span>{lang.audio_settings}</span>
      </div>

      <div
        className={`nav-item ${activePage === 'system' ? 'active' : ''}`}
        onClick={() => setActivePage('system')}
      >
        <i className="ri-settings-4-line"></i>
        <span>{lang.system}</span>
      </div>

      <div
        className={`nav-item ${activePage === 'about' ? 'active' : ''}`}
        onClick={() => setActivePage('about')}
      >
        <i className="ri-information-line"></i>
        <span>{lang.about}</span>
      </div>
    </nav>
  )
}
