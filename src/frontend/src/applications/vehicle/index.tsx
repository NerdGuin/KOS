import ModelViewer from '../../assets/scripts/ModelViewer'
import './index.css'

interface SettingsWindowProps {
  onClose: () => void
  visible: boolean
}

export default function SettingsWindow({ visible }: SettingsWindowProps) {
  return (
    <div
      className="vehicle-container"
      style={{ display: `${visible ? 'flex' : 'none'}` }}
    >
      <ModelViewer />
    </div>
  )
}
