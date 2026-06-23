import { BrowserWindow, ipcMain } from 'electron'

const APP_URLS: Record<string, string> = {
  youtube: 'https://m.youtube.com/?persist_app=1&app=m',
  spotify: 'https://open.spotify.com/',
  navigation: 'https://maps.google.com/'
}

const APP_BOUNDS = { x: 80, y: 0, width: 944, height: 600 }

let appWindow: BrowserWindow | null = null
let mainWindowCloseListenerRegistered = false

function createAppWindow(appName: string): void {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  if (!mainWindow) return

  appWindow = new BrowserWindow({
    ...APP_BOUNDS,
    show: false,
    parent: mainWindow,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    movable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  appWindow.loadURL(APP_URLS[appName])

  appWindow.once('ready-to-show', () => {
    appWindow?.setBounds(APP_BOUNDS)
    appWindow?.show()
  })

  appWindow.on('closed', () => {
    appWindow = null
  })

  if (!mainWindowCloseListenerRegistered) {
    mainWindow.on('closed', () => {
      if (appWindow && !appWindow.isDestroyed()) {
        appWindow.close()
      }
    })
    mainWindowCloseListenerRegistered = true
  }
}

ipcMain.on('openApp', (_event, data) => {
  if (!Object.keys(APP_URLS).includes(data.name)) return

  if (!appWindow || appWindow.isDestroyed()) {
    createAppWindow(data.name)
  } else {
    appWindow.show()
    appWindow.focus()
  }
})

ipcMain.on('closeApp', () => {
  if (appWindow && !appWindow.isDestroyed()) {
    appWindow.close()
  }
})

ipcMain.on('minimizeApp', () => {
  if (appWindow && !appWindow.isDestroyed()) {
    appWindow.minimize()
  }
})
