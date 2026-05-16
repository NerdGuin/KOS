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
