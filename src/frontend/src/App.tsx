import StatusBar from './components/StatusBar'
import NavigationBar from './components/NavigationBar'
import ClimateWidget from './components/ClimateWidget'
import Dashboard from './components/Dashboard'

function App() {
  const apps = [
    {
      icon: 'ri-map-pin-2-fill',
      label: 'Navegação',
      color: '#4285f4',
      favorite: true,
    },
    {
      icon: 'ri-spotify-fill',
      label: 'Spotify',
      color: '#1db954',
      favorite: true,
    },
    {
      icon: 'ri-phone-fill',
      label: 'Telefone',
      color: '#34a853',
      favorite: true,
    },
    {
      icon: 'ri-roadster-fill',
      label: 'Veículo',
      color: '#ff4500',
      favorite: true,
    },
    {
      icon: 'ri-youtube-fill',
      label: 'YouTube',
      color: '#ff0000',
      favorite: true,
    },
    {
      icon: 'ri-radio-2-fill',
      label: 'Rádio',
      color: '#ff9800',
      favorite: true,
    },
    {
      icon: 'ri-sun-cloudy-fill',
      label: 'Clima',
      color: '#ffc107',
      favorite: true,
    },
    {
      icon: 'ri-settings-4-fill',
      label: 'Configurações',
      color: '#9aa0a6',
      favorite: true,
    },

    // Apps não favoritos
    {
      icon: 'ri-settings-4-fill',
      label: 'TESTE',
      color: '#ff0000',
      favorite: false,
    },
    {
      icon: 'ri-settings-4-fill',
      label: 'TESTE',
      color: '#ff0000',
      favorite: false,
    },
    {
      icon: 'ri-settings-4-fill',
      label: 'TESTE',
      color: '#ff0000',
      favorite: false,
    },
    {
      icon: 'ri-settings-4-fill',
      label: 'TESTE',
      color: '#ff0000',
      favorite: false,
    },
    {
      icon: 'ri-settings-4-fill',
      label: 'TESTE',
      color: '#ff0000',
      favorite: false,
    },
    {
      icon: 'ri-settings-4-fill',
      label: 'TESTE',
      color: '#ff0000',
      favorite: false,
    },
  ]

  return (
    <>
      <div className="bg-pattern"></div>
      <div className="bg-glow"></div>
      <div className="container">
        <StatusBar />

        <Dashboard apps={apps.filter((app) => app.favorite)} />
        {/* <Dashboard apps={apps} /> */}

        <ClimateWidget />
        <NavigationBar />
      </div>
    </>
  )
}

export default App
