// @ts-ignore
import './New.css'

interface NewStatusBarProps {
  time: string
  wireless: any
}

export default function NewStatusBar({ time, wireless }: NewStatusBarProps) {
  return (
    <>
      <div className="wallpaper"></div>
      <header className="status-bar status-bar--new">
        <div className="cyber-status">
          <div className={`time`}>{time}</div>
          <div className="status-icons">
            <i
              className="ri-signal-wifi-fill"
              style={{
                display: wireless?.wifiConnected == true ? 'block' : 'none'
              }}
            ></i>
            <i
              className="ri-bluetooth-connect-fill"
              style={{
                display: wireless?.bluetoothConnected == true ? 'block' : 'none'
              }}
            ></i>
          </div>
        </div>
      </header>
    </>
  )
}
