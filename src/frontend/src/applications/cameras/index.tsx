import { useState } from 'react'
import Carousel from '../../components/Carousel'
import './index.css'
import { BACKEND_URL } from '../../config/apps'

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
          <img src={`${BACKEND_URL}/camera/0`} />
          <p>Câmera Traseira</p>
        </div>
        <div className="cam">
          <p>Câmera Dianteira</p>
        </div>

        <div className="cam">
          <p>Câmera Esquerda</p>
        </div>
        <div className="cam">
          <p>Câmera Direita</p>
        </div>
      </Carousel>
    </div>
  )
}
