import { useState } from 'react'
import Carousel from '../../components/Carousel'
import './index.css'
import { useConfig } from './../../context/ConfigContext'

interface SettingsWindowProps {
  onClose: () => void
  visible: boolean
}

export default function SettingsWindow({ visible }: SettingsWindowProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const { configs } = useConfig()

  return (
    <div
      className="cameras-container"
      style={{ display: `${visible ? 'flex' : 'none'}` }}
    >
      <Carousel currentIndex={slideIndex} onChangeIndex={setSlideIndex}>
        <div className="cam">
          <img src={`${configs.serverRemote}/camera/0`} />
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
