import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { ConfigProvider } from './context/ConfigContext'
import App from './App'

export const appData = {
  version: '0.26',
  appOpened: null as { app: string; time: number } | null,
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>
)

window.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})
