import './index.css'

import { useEffect, useMemo, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'

interface RadioWindowProps {
  onClose: () => void
  visible: boolean
}

interface RadioStation {
  id: string
  name: string
  frequency: string
  genre: string
  stream_url: string
  website?: string
  logo_url?: string
  description?: string
}

export default function RadioWindow({ visible }: RadioWindowProps) {
  const { configs } = useConfig()
  const [stations, setStations] = useState<RadioStation[]>([])
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!visible) return

    const controller = new AbortController()
    async function loadStations() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${configs.serverRemote}/api/radio/stations`,
          {
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error('Falha ao carregar estações')
        }

        const data: RadioStation[] = await response.json()
        setStations(data)

        if (!currentStation && data.length > 0) {
          setCurrentStation(data[0])
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError('Não foi possível carregar as estações')
      } finally {
        setLoading(false)
      }
    }

    loadStations()
    return () => controller.abort()
  }, [configs.serverRemote, currentStation, visible])

  const stationIndex = useMemo(
    () => stations.findIndex((station) => station.id === currentStation?.id),
    [currentStation, stations]
  )

  async function changeStation(nextIndex: number) {
    if (stations.length === 0) return
    const wrappedIndex = (nextIndex + stations.length) % stations.length
    const station = stations[wrappedIndex]

    try {
      const response = await fetch(
        `${configs.serverRemote}/api/radio/select/${encodeURIComponent(station.id)}`
      )
      if (!response.ok) {
        throw new Error('Erro ao selecionar estação')
      }
      const data = await response.json()
      setCurrentStation(data.station)
    } catch (err) {
      setError('Erro ao trocar estação')
    }
  }

  const handlePrev = () => {
    if (stationIndex < 0) return
    changeStation(stationIndex - 1)
  }

  const handleNext = () => {
    if (stationIndex < 0) return
    changeStation(stationIndex + 1)
  }

  return (
    <div
      className="radio-container"
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <div className="radio-window">
        <audio controls autoPlay key={currentStation?.stream_url ?? 'none'}>
          {currentStation ? (
            <source src={currentStation.stream_url} type="audio/mpeg" />
          ) : null}
          Seu navegador não suporta áudio.
        </audio>

        <div className="main-content">
          <div className="radio-display">
            <button
              className="nav-btn glass"
              type="button"
              onClick={handlePrev}
              disabled={loading || stations.length === 0}
              aria-label="Estação anterior"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            <div style={{ position: 'relative' }}>
              <svg className="svg-ring" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="rgba(255,107,53,0.2)"
                  strokeWidth="0.2"
                  strokeDasharray="1 2"
                />
              </svg>
              <div className="frequency-circle">
                <div className="freq-band">FM</div>
                <div className="freq-number">
                  {currentStation?.frequency ?? '--'}
                </div>
                <div className="freq-unit">MHz</div>
              </div>
            </div>

            <button
              className="nav-btn glass"
              type="button"
              onClick={handleNext}
              disabled={loading || stations.length === 0}
              aria-label="Próxima estação"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>

          <div className="song-info">
            <div className="song-title">
              {loading
                ? ''
                : (currentStation?.name ?? 'Sem estação')}
              {/* <div className="artist-name">
                {currentStation
                  ? `${currentStation.description}`
                  : 'Aguardando…'}
              </div> */}
            </div>
          </div>

          {error ? <div className="radio-error">{error}</div> : null}
        </div>
      </div>
      <div className="volume-container glass">
        <i className="ri-volume-up-line volume-icon"></i>
        <div className="volume-slider-wrapper">
          <div className="volume-fill"></div>
          <div className="volume-thumb"></div>
        </div>
        <i className="ri-volume-down-line volume-icon"></i>
      </div>
    </div>
  )
}
