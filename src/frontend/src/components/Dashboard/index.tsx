import './index.css'

interface AppItem {
  icon: string
  label: string
  color: string
  favorite: boolean
}

interface DashboardProps {
  apps: AppItem[]
}

export default function Dashboard({ apps }: DashboardProps) {
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
