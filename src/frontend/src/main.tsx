import { createRoot } from 'react-dom/client'
import App from './App.tsx'

export const localApps = ['settings', 'cameras']
export const desktopApps = ['settings']

export const appData = {
  version: '0.25',

  mode: 'desktop', // 'desktop', 'mobile'
  appOpened: null as { app: string; time: number } | null,
}

export function updateMode(e: any | null = null) {
  if (desktopApps.includes(e) || !e) {
    appData.mode = 'desktop'
  } else {
    appData.mode = 'mobile'
  }

  const bottomBar = document.querySelector('.bottom-bar')
  bottomBar!.setAttribute('data-mode', appData.mode)
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
