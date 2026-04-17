type AppState = {
  appOpened: { app: string; time: number } | null
}

const state: AppState = {
  appOpened: null,
}

export const appManager = {
  open(app: string) {
    state.appOpened = { app, time: Date.now() }
    console.log('APP_OPEN', state.appOpened)
  },

  close() {
    console.log('APP_CLOSE', state.appOpened)
    state.appOpened = null
  },

  getState() {
    return state
  },
}
