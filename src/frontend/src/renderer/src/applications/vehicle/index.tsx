// import ModelViewer from '../../components/ModelViewer'
import './index.css'

interface VehicleWindowProps {
  onClose: () => void
  visible: boolean
}

export default function VehicleWindow({ visible }: VehicleWindowProps) {
  return (
    <div
      className="vehicle-container"
      style={{ display: `${visible ? 'flex' : 'none'}` }}
    >
      {/* <ModelViewer /> */}
    </div>
  )
}
