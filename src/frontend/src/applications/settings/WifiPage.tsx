export default function WifiPage() {
  return (
    <main className="settings-detail">
      <div className="detail-header">
        <div className="detail-title">
          <i className="ri-wifi-line" style={{ marginTop: '6px' }}></i>
          Wi-Fi
        </div>
        <div className="detail-subtitle">Conectar e gerenciar redes Wi-Fi</div>
      </div>

      <div className="setting-group">
        <div className="group-title">REDES DISPONÍVEIS</div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">
              <i
                className="ri-signal-wifi-2-fill"
                style={{ marginRight: '10px' }}
              ></i>
              ...
            </span>
          </div>
          <div className="setting-action">
            <i className="ri-link"></i>
          </div>
        </div>
      </div>
    </main>
  )
}
