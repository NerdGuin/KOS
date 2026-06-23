import { tocarBeep } from '@renderer/context/AudioContext'

export const localApps = ['settings', 'cameras', 'vehicle', 'radio'] as const

export interface AppItem {
  icon: string
  label: string
  color: string
  favorite: boolean
  window?: string
}

export const APPS: AppItem[] = [
  {
    icon: 'ri-map-pin-2-fill',
    label: 'Navegação',
    color: '#4285f4',
    favorite: true,
    window: 'navigation'
  },
  {
    icon: 'ri-spotify-fill',
    label: 'Spotify',
    color: '#18D860',
    favorite: true,
    window: 'spotify'
  },
  {
    icon: 'ri-camera-fill',
    label: 'Câmeras',
    color: '#8B5CF6',
    favorite: true,
    window: 'cameras'
  },
  {
    icon: 'ri-roadster-fill',
    label: 'Veículo',
    color: '#ff4500',
    favorite: true,
    window: 'vehicle'
  },
  {
    icon: 'ri-youtube-fill',
    label: 'YouTube',
    color: '#ff0000',
    favorite: true,
    window: 'youtube'
  },
  {
    icon: 'ri-radio-2-fill',
    label: 'Rádio',
    color: '#ff9800',
    favorite: true,
    window: 'radio'
  },
  {
    icon: 'ri-sun-cloudy-fill',
    label: 'Clima',
    color: '#ffc107',
    favorite: true,
    window: 'climate'
  },
  {
    icon: 'ri-settings-4-fill',
    label: 'Configurações',
    color: '#9aa0a6',
    favorite: true,
    window: 'settings'
  },
  {
    icon: 'ri-apps-2-add-fill',
    label: 'Adicionar',
    color: '#E0E0E0',
    favorite: false,
    window: 'add'
  }
]

type AppState = {
  appOpened: { app: string; time: number } | null
}

const state: AppState = {
  appOpened: null
}

export const appManager = {
  open(app: string) {
    state.appOpened = { app, time: Date.now() }
    console.log('APP_OPEN', state.appOpened)
    tocarBeep(0, 0)

    window.electron.ipcRenderer.send('openApp', {
      name: app
    })
  },

  close() {
    console.log('APP_CLOSE', state.appOpened)
    state.appOpened = null

    window.electron.ipcRenderer.send('closeApp', {
      name: 'youtube'
    })
  },

  back() {
    console.log('APP_BACK', state.appOpened)
    state.appOpened = null

    window.electron.ipcRenderer.send('minimizeApp', {
      name: 'youtube'
    })
  },

  getState() {
    return state
  }
}
