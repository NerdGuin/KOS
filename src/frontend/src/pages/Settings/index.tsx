import BrightnessSlider from './BrightnessSlider'
import './index.css'

interface SettingsWindowProps {
  onClose: () => void
}

export default function SettingsWindow({}: SettingsWindowProps) {
  return (
    <div className="settings-container" id="settings">
      <div className="main-container">
        <nav className="sidebar">
          <div className="nav-item">
            <i className="ri-wifi-line"></i>
            <span>Wi-Fi</span>
          </div>
          <div className="nav-item">
            <i className="ri-bluetooth-line"></i>
            <span>Bluetooth</span>
          </div>
          <div className="nav-item active">
            <i className="ri-sun-line"></i>
            <span>Tela & Brilho</span>
          </div>
          <div className="nav-item">
            <i className="ri-equalizer-line"></i>
            <span>Config. de Áudio</span>
          </div>
          <div className="nav-item">
            <i className="ri-settings-4-line"></i>
            <span>Sistema</span>
          </div>
          <div className="nav-item">
            <i className="ri-information-line"></i>
            <span>Sobre</span>
          </div>
        </nav>

        <main className="settings-detail">
          <div className="detail-header">
            <div className="detail-title">
              <i className="ri-tv-2-line" style={{ marginTop: '7px' }}></i>
              Tela & Brilho
            </div>
            <div className="detail-subtitle">
              Ajustar brilho da tela, modo noturno e preferências de tema
            </div>
          </div>

          <div className="setting-group">
            <div className="group-title">Brilho da Tela</div>
            <div
              className="setting-row"
              style={{ flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <BrightnessSlider />
            </div>
          </div>

          <div className="setting-group">
            <div className="group-title">Modo de Exibição</div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Brilho Automático</span>
                <span className="setting-desc">
                  Ajustar brilho com base na luz ambiente
                </span>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Modo Noturno</span>
                <span className="setting-desc">
                  Use cores mais escuras após o pôr do sol
                </span>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-group">
            <div className="group-title">Tempo de Inatividade da Tela</div>
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Suspensão Automática</span>
                <span className="setting-desc">
                  Desligar tela após inatividade
                </span>
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <span>5 Minutos</span>
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
