import { appData } from '../../main'

export default function AboutPage() {
  return (
    <main className="settings-detail">
      <div className="detail-header">
        <div className="detail-title">
          <i className="ri-information-line" style={{ marginTop: '7px' }}></i>
          Sobre
        </div>
        <div className="detail-subtitle">
          Informações sobre o sistema e versão
        </div>
      </div>

      <div className="setting-group">
        <div className="group-title">Software</div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Versão Atual</span>
            <span className="setting-desc">
              <strong>
                Build {appData.version}{' '}
                <span className="version-badge">BETA</span>
              </strong>
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}