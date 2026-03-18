import { useState } from 'react'
import Carousel from '../../components/Carousel'
import './index.css'

interface SettingsWindowProps {
  onClose: () => void
  visible: boolean
}

export default function SettingsWindow({ visible }: SettingsWindowProps) {
  const [slideIndex, setSlideIndex] = useState(0)

  return (
    <div
      className="cameras-container"
      style={{ display: `${visible ? 'flex' : 'none'}` }}
    >
      <Carousel currentIndex={slideIndex} onChangeIndex={setSlideIndex}>
        <div className="cam">
          <p>Câmera #0</p>
        </div>
        <div className="cam">
          <p>Câmera #1</p>
        </div>
      </Carousel>
    </div>
  )
}
