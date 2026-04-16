import './index.css'
import { useEffect, useState } from 'react'
import { useConfig } from '../../assets/ConfigContext'

export default function StatusBar() {
  const { configs } = useConfig()

  const [time, setTime] = useState('')
  const [wireless, setWireless] = useState(null)

  useEffect(() => {
    const update = async () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      )

      try {
        const res = await fetch('http://localhost:8000/api/system/wireless')
        const data = await res.json()

        setWireless(data)
      } catch (err) {}
    }

    update()
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [])

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
