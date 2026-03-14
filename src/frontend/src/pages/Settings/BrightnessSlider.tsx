import { useState } from 'react'

export default function BrightnessSlider() {
  const [value, setValue] = useState(60)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
        }}
      >
        <span className="setting-label">Nível</span>
        <span className="setting-label">{value}%</span>
      </div>
      <div className="range-container">
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={handleChange}
          className="range-slider"
          style={{
            background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${value}%, #333 ${value}%, #333 100%)`,
          }}
        />
        <div
          style={{
            marginTop: '5px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <i className="ri-sun-line" style={{ fontSize: '16px' }}></i>
          <i className="ri-sun-fill" style={{ fontSize: '24px' }}></i>
        </div>
      </div>
    </>
  )
}
