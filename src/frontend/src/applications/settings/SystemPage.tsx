import { useConfig } from '../../assets/ConfigContext'

export default function SystemPage() {
  const { configs, setConfigs } = useConfig()

  return (
    <main className="settings-detail">
      <div className="detail-header">
        <div className="detail-title">
          <i className="ri-settings-4-line" style={{ marginTop: '7px' }}></i>{' '}
          Sistema
        </div>
        <div className="detail-subtitle">Configurar as opções do sistema</div>
      </div>
      <div className="setting-group">
        <div className="group-title">Barra de Status</div>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">
              Exibir mensagem de desenvolvimento
            </span>
            <span className="setting-desc">
              Exibe um badge indicando que o sistema está em desenvolvimento
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={configs.devBadge}
              onChange={(e) =>
                setConfigs((prev) => ({
                  ...prev,
                  devBadge: e.target.checked,
                }))
              }
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Centralizar horário</span>
            <span className="setting-desc">
              Centraliza o relógio na barra de status
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={configs.clockPosition === 'center'}
              onChange={(e) =>
                setConfigs((prev) => ({
                  ...prev,
                  clockPosition: e.target.checked ? 'center' : 'right',
                }))
              }
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </main>
  )
}
