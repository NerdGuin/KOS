import './index.css'

export default function NavigationBar() {
  return (
    <footer className="bottom-bar">
      <div className="control-dock">
        <div className="control-btn">
          <i className="ri-arrow-left-line"></i>
          <span>Voltar</span>
        </div>

        <div className="control-btn active">
          <i className="ri-home-5-fill"></i>
        </div>

        <div className="control-btn">
          <i className="ri-apps-2-line"></i>
        </div>

        <div className="control-btn">
          <i className="ri-mic-line"></i>
        </div>
      </div>
    </footer>
  )
}
