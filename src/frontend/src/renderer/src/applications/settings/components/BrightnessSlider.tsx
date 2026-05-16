type BrightnessSliderProps = {
  value: number
  onChange: (value: number) => void
  disabled: boolean
}

export default function BrightnessSlider({
  value,
  onChange,
  disabled,
}: BrightnessSliderProps) {
  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span className="setting-label">Nível</span>
        <span className="setting-label">{value}%</span>
      </div>
      <div className="range-container">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          style={
            {
              '--value': `${value}%`,
            } as React.CSSProperties
          }
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
