import { BrowserWindow, ipcMain } from 'electron'

let appWindow: BrowserWindow | null = null

function createAppWindow(appName: string): void {
  const mainWindow = BrowserWindow.getAllWindows()[0]

  console.log(mainWindow.getBounds().height)
  console.log(appName)

  appWindow = new BrowserWindow({
    parent: mainWindow,
    show: true,
    autoHideMenuBar: true,
    frame: false,
    resizable: false
  })

  switch (appName) {
    case 'youtube':
      appWindow.loadURL('https://m.youtube.com/?persist_app=1&app=m')
      break
    case 'spotify':
      appWindow.loadURL('https://open.spotify.com/')
      break
    case 'navigation':
      appWindow.loadURL('https://maps.google.com/')
      break
  }

  appWindow.setBounds({
    x: mainWindow.getBounds().width - 495,
    y: 216,
    width: mainWindow.getBounds().width - 80,
    height: mainWindow.getBounds().height
  })

  appWindow.on('closed', () => {
    appWindow = null
  })
}

ipcMain.on('openApp', (_event, data) => {
  if (data.name === 'youtube' || data.name === 'spotify' || data.name === 'navigation') {
    if (!appWindow) {
      createAppWindow(data.name)
    } else {
      appWindow.focus()
      appWindow.show()
    }
  }
})

ipcMain.on('closeApp', (_event, data) => {
  if (data.name === 'youtube' && appWindow) {
    appWindow.close()
  }
})

ipcMain.on('minimizeApp', (_event, data) => {
  if (data.name === 'youtube' && appWindow) {
    appWindow.minimize()
  }
})
