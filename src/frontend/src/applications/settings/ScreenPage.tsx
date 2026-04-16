import { useConfig } from '../../assets/ConfigContext'
import BrightnessSlider from './components/BrightnessSlider'

export default function ScreenPage() {
  const { configs, setConfigs } = useConfig()

  return (
    <main className="settings-detail">
      <div className="detail-header">
        <div className="detail-title">
          <i className="ri-tv-2-line" style={{ marginTop: '7px' }}></i> Tela &
          Brilho
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
          <BrightnessSlider
            value={configs.brightness}
            onChange={(value) => setConfigs({ ...configs, brightness: value })}
            disabled={configs.brightnessAuto}
          />
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
            <input
              type="checkbox"
              checked={configs.brightnessAuto}
              onChange={(e) =>
                setConfigs({ ...configs, brightnessAuto: e.target.checked })
              }
            />
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
            <input
              type="checkbox"
              checked={configs.nightMode}
              onChange={(e) =>
                setConfigs({ ...configs, nightMode: e.target.checked })
              }
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      <div className="setting-group">
        <div className="group-title">Tempo de Inatividade da Tela</div>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Suspensão Automática</span>
            <span className="setting-desc">Desligar tela após inatividade</span>
          </div>
          <div className="setting-action">
            <span>5 Minutos</span>
            <i className="ri-arrow-right-s-line"></i>
          </div>
        </div>
      </div>
    </main>
  )
}
