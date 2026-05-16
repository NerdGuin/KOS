import './New.css'

interface CyberpunkStatusBarProps {
  time: string
  wireless: any
  clockPosition: string
}

export default function CyberpunkStatusBar({
  time,
  wireless,
}: CyberpunkStatusBarProps) {
  return (
    <>
      <div className="wpp"></div>
      <header className="status-bar status-bar--new">
        <div className="cyber-status">
          <div className={`time`}>{time}</div>
          <div className="status-icons">
            <i
              className="ri-signal-wifi-fill"
              style={{
                display:
                  wireless && wireless['wifi_connected'] ? 'block' : 'none',
              }}
            ></i>
            <i
              className="ri-bluetooth-connect-fill"
              style={{
                display:
                  wireless && wireless['bluetooth_connected']
                    ? 'block'
                    : 'none',
              }}
            ></i>
          </div>
        </div>
      </header>
    </>
  )
}
