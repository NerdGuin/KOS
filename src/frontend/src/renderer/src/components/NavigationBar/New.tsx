import './New.css'

interface AppItem {
  icon: string
  label: string
  color: string
  favorite: boolean
  window?: string
}

interface CyberpunkNavigationBarProps {
  active: string
  onClick: (target: string, action?: 'open' | 'back' | 'close') => void
  openPages?: AppItem[]
}

export default function CyberpunkNavigationBar({
  active,
  onClick,
  openPages = [],
}: CyberpunkNavigationBarProps) {
  const hasActivePage = active !== 'home' && active !== 'apps'

  return (
    <footer className="bottom-bar bottom-bar--new">
      <div className="control-dock">
        {hasActivePage ? (
          <>
            <div className="control-btn new" onClick={() => onClick(active, 'back')}>
              <i className="ri-arrow-go-back-line"></i>
            </div>
            <div className="control-btn new" onClick={() => onClick(active, 'close')}>
              <i className="ri-close-large-fill"></i>
            </div>
          </>
        ) : (
          <>
            <div className="control-btn new" onClick={() => onClick('home')}>
              <i className="ri-home-5-fill"></i>
            </div>
            <div className="control-btn new" onClick={() => onClick('apps')}>
              <i className="ri-apps-2-fill"></i>
            </div>
          </>
        )}

        {openPages.length > 0 && <div className="nav-divider"></div>}

        <div className="open-pages" style={{ display: 'contents' }}>
          {openPages.map((page, i) => (
            <div
              className={`control-btn ${
                active === page.window ? 'active' : ''
              }`}
              key={page.window ?? i}
              onClick={() => page.window && onClick(page.window, 'open')}
              title={page.label}
            >
              <i className={page.icon} style={{ color: page.color }}></i>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}