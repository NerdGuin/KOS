import { appData } from '../../main'

export async function OnOpenApp(data: any) {
  console.log('APP_OPEN', data)
  appData.appOpened = { app: data.app, time: new Date().getTime() }
}

export async function OnCloseApp(data: any) {
  console.log('APP_CLOSE', data)
  appData.appOpened = null
}
