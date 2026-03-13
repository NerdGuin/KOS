import { useEffect, useState } from 'react'
import './index.css'

export default function ClimateWidget() {
  const [temperature, setTemp] = useState<number | null>(null)

  useEffect(() => {
    const updateTemp = async () => {
      try {
        const res = await fetch(
          'http://localhost:8000/api/temp?lat=-22.90&lon=-43.19'
        )
        const data = await res.json()

        setTemp(data.temp)
      } catch (err) {
        console.error('Erro ao pegar temperatura:', err)
      }
    }

    updateTemp()
    const interval = setInterval(updateTemp, 60000)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="widget-area">
      <div className="temp-display">
        <i className="ri-temp-hot-line"></i> {temperature}°C Externo
      </div>
    </div>
  )
}
