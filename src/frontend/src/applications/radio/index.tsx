import './index.css'

interface RadioWindowProps {
  onClose: () => void
  visible: boolean
}

export default function RadioWindow({ visible }: RadioWindowProps) {
  return (
    <div
      className="radio-container"
      style={{ display: `${visible ? 'flex' : 'none'}` }}
    >
      <audio controls autoPlay>
        <source
          src="https://26573.live.streamtheworld.com/JBFMAAC.aac?1771934687401"
          type="audio/mpeg"
        />
      </audio>

      <div className="main-content">
        {/* Radio Display Area */}
        <div className="radio-display">
          {/* Prev Button */}
          <div className="nav-btn glass">
            <i className="ri-arrow-left-s-line"></i>
          </div>

          {/* Frequency Circle */}
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
              <div className="freq-number">99.9</div>
              <div className="freq-unit">MHz</div>
            </div>
          </div>

          {/* Next Button */}
          <div className="nav-btn glass">
            <i className="ri-arrow-right-s-line"></i>
          </div>
        </div>

        {/* Song Info */}
        <div className="song-info">
          <div className="song-title">
            Music Name <div className="artist-name">Artist Name</div>
          </div>
        </div>
      </div>
    </div>
  )
}
