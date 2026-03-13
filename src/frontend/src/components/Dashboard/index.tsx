import './index.css'

const apps = [
  { icon: 'ri-map-pin-2-fill', label: 'Navegação', color: '#4285f4' },
  { icon: 'ri-spotify-fill', label: 'Spotify', color: '#1db954' },
  { icon: 'ri-phone-fill', label: 'Telefone', color: '#34a853' },
  { icon: 'ri-roadster-fill', label: 'Veículo', color: '#ff4500' },
  { icon: 'ri-youtube-fill', label: 'YouTube', color: '#ff0000' },
  { icon: 'ri-radio-2-fill', label: 'Rádio', color: '#ff9800' },
  { icon: 'ri-sun-cloudy-fill', label: 'Clima', color: '#ffc107' },
  { icon: 'ri-settings-4-fill', label: 'Configurações', color: '#9aa0a6' },
]

export default function Dashboard() {
  return (
    <main className="dashboard">
      <div className="app-grid">
        {apps.map((app, i) => (
          <div className="app-item" key={i}>
            <div className="app-icon-wrapper">
              <div className="active-ring"></div>
              <i
                className={`app-icon ${app.icon}`}
                style={{ color: app.color }}
              ></i>
            </div>
            <span className="app-label">{app.label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
