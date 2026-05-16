import './New.css'

interface AppItem {
  icon: string
  label: string
  color: string
  favorite: boolean
  window?: string
}

interface NewDashboardProps {
  apps: AppItem[]
  onAppClick: (app: AppItem) => void
}

export default function NewDashboard({ apps, onAppClick }: NewDashboardProps) {
  return (
    <main className="dashboard dashboard--new">
      <div className="app-grid">
        {apps.map((app, i) => (
          <div
            className="app-item app-item--new"
            key={i}
            onClick={() => onAppClick(app)}
          >
            <div className="app-icon-wrapper app-icon-wrapper--new">
              <i
                className={`app-icon app-icon--new ${app.icon}`}
                style={{ color: app.color }}
              ></i>
            </div>
            <span className="app-label app-label--new">{app.label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
