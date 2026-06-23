import { useEffect, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'

export default function WifiPage() {
  const { configs } = useConfig()

  const [networks, setNetworks] = useState<
    {
      ssid: string
      signal: number
      security: string
      connected: boolean
    }[]
  >([])

  useEffect(() => {
    const updateNetwork = async () => {
      try {
        const res = await fetch(
          `${configs.serverRemote}/api/system/wireless/list`
        )

        if (!res.ok) {
          return
        }

        const data = await res.json()
        setNetworks(data)
      } catch {
        setNetworks([])
      }
    }

    updateNetwork()
    const interval = setInterval(updateNetwork, 3000)

    return () => clearInterval(interval)
  }, [configs.serverRemote])

  function getWifiIcon(signal: number) {
    if (signal >= 80) return 'ri-signal-wifi-fill'
    if (signal >= 67) return 'ri-signal-wifi-3-fill'
    if (signal >= 34) return 'ri-signal-wifi-2-fill'
    return 'ri-signal-wifi-1-fill'
  }

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

        {networks.length === 0 ? (
          <div className="setting-row">
            <span className="setting-label">Nenhuma rede encontrada</span>
          </div>
        ) : (
          networks.map((network) => (
            <div
              key={`${network.ssid}-${network.signal}`}
              className="setting-row"
            >
              <div className="setting-info">
                <span className="setting-label">
                  <i
                    className={getWifiIcon(network.signal)}
                    style={{ marginRight: '10px' }}
                  ></i>
                  {network.ssid || 'Rede sem nome'}
                </span>
              </div>
              <div className="setting-action">
                <i
                  className={network.connected ? 'ri-link-unlink' : 'ri-link'}
                ></i>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
