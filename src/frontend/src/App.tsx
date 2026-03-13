import StatusBar from './components/StatusBar'
import NavigationBar from './components/NavigationBar'
import ClimateWidget from './components/ClimateWidget'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <>
      <div className="bg-pattern"></div>
      <div className="bg-glow"></div>
      <div className="container">
        <StatusBar />
        <Dashboard />
        <ClimateWidget />
        <NavigationBar />
      </div>
    </>
  )
}

export default App
