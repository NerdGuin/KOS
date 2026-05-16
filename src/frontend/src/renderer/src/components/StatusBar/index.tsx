import './index.css'
import { useEffect, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'
import { useTheme } from '../../context/ThemeContext'

// THEMES
import CyberpunkStatusBar from './New'

export default function StatusBar() {
  const { configs } = useConfig()
  const { currentTheme } = useTheme()

  const [time, setTime] = useState('')
  const [wireless, setWireless] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(
        String(now.getHours()).padStart(2, '0') +
          ':' +
          String(now.getMinutes()).padStart(2, '0')
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateNetwork = async () => {
      try {
        const res = await fetch(`${configs.serverRemote}/api/system/wireless`)
        const data = await res.json()
        setWireless(data)
      } catch {}
    }

    updateNetwork()
    const interval = setInterval(updateNetwork, 5000)

    return () => clearInterval(interval)
  }, [])

  const isNewTheme = currentTheme.name === 'new'

  if (isNewTheme) {
    return (
      <CyberpunkStatusBar
        time={time}
        wireless={wireless}
        clockPosition={configs.clockPosition}
      />
    )
  }

  return (
    <header className="status-bar">
      <div className="brand-area">
        <span className="brand-text">
          K<span className="brand-accent">OS</span>
        </span>

        {configs.devBadge && (
          <div className="model-badge">EM DESENVOLVIMENTO</div>
        )}
      </div>

      <div className="status-info">
        <div className="status-icons">
          <i
            className="ri-signal-wifi-fill"
            style={{
              display:
                wireless && wireless['wifi_connected'] === true
                  ? 'block'
                  : 'none',
            }}
          ></i>

          <i
            className="ri-bluetooth-connect-fill"
            style={{
              display:
                wireless && wireless['bluetooth_connected'] === true
                  ? 'block'
                  : 'none',
            }}
          ></i>
        </div>

        <div className={`time ${configs.clockPosition}`}>{time}</div>
      </div>
    </header>
  )
}
