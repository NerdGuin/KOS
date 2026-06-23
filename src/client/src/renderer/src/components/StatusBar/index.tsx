// @ts-ignore
import './index.css'
import { useEffect, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'
import { useTheme } from '../../context/ThemeContext'
import { useWireless } from '../../context/WirelessContext'

// THEMES
import NewStatusBar from './New'

export default function StatusBar() {
  const { configs } = useConfig()
  const { currentTheme } = useTheme()
  const { status } = useWireless()

  const [time, setTime] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(
        String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const isNewTheme = currentTheme.name === 'new'

  if (isNewTheme) {
    return <NewStatusBar time={time} wireless={status} />
  }

  return (
    <header className="status-bar">
      <div className="brand-area">
        <span className="brand-text">
          K<span className="brand-accent">OS</span>
        </span>

        {configs.devBadge && <div className="model-badge">EM DESENVOLVIMENTO</div>}
      </div>

      <div className="status-info">
        <div className="status-icons">
          <i
            className="ri-signal-wifi-fill"
            style={{
              display: status?.wifiConnected == true ? 'block' : 'none'
            }}
          ></i>

          <i
            className="ri-bluetooth-connect-fill"
            style={{
              display: status?.bluetoothConnected == true ? 'block' : 'none'
            }}
          ></i>
        </div>

        <div className={`time ${configs.clockPosition}`}>{time}</div>
      </div>
    </header>
  )
}
