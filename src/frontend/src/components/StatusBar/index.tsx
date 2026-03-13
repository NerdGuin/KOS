import './index.css'
import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
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
        <div className="model-badge">EM DESENVOLVIMENTO</div>
      </div>

      <div className="status-info">
        <div className="status-icons">
          <i className="ri-signal-wifi-fill"></i>
          <i className="ri-bluetooth-connect-fill"></i>
        </div>

        <div className="time">{time}</div>
      </div>
    </header>
  )
}
