import { execSync } from 'child_process'
import * as os from 'os'
import type { Server } from 'socket.io'

const WIRELESS_POLL_INTERVAL_MS = 5000

interface WirelessStatus {
  wifiEnabled: boolean
  wifiConnected: boolean
  connectionType: string | null // "wifi" | "ethernet" | null
  bluetoothEnabled: boolean
  bluetoothConnected: boolean
}

interface WifiNetwork {
  ssid: string
  signal: number
  security: string
  connected: boolean
}

function runCommand(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8' })
}

export function getWirelessStatus(): WirelessStatus {
  const status: WirelessStatus = {
    wifiEnabled: false,
    wifiConnected: false,
    connectionType: null,
    bluetoothEnabled: false,
    bluetoothConnected: false,
  }

  if (os.platform() === 'linux') {
    // ---------------------------
    // NETWORK (WIFI OR CABLE)
    // ---------------------------
    try {
      const output = runCommand('nmcli -t -f TYPE,STATE device')

      for (const line of output.split('\n')) {
        if (!line.trim()) continue
        const [devType, state] = line.split(':')

        if (state === 'connected') {
          status.wifiConnected = true
          status.wifiEnabled = true
          status.connectionType = devType // wifi / ethernet
          break
        }
      }
    } catch {}

    // ---------------------------
    // WIFI
    // ---------------------------
    try {
      const wifiState = runCommand('nmcli radio wifi').trim()
      status.wifiEnabled = wifiState.toLowerCase() === 'enabled'
    } catch {}

    // ---------------------------
    // BLUETOOTH
    // ---------------------------
    try {
      const btState = runCommand('bluetoothctl show')
      status.bluetoothEnabled = btState.includes('Powered: yes')

      const btConn = runCommand('bluetoothctl info')
      status.bluetoothConnected = btConn.includes('Connected: yes')
    } catch {}
  } else {
    status.wifiEnabled = true
    status.wifiConnected = true
    status.connectionType = 'ethernet'
    status.bluetoothEnabled = false
    status.bluetoothConnected = false
  }
  return status
}

export function scanWifiNetworks(): WifiNetwork[] {
  let networks: WifiNetwork[] = []

  if (os.platform() !== 'linux') {
    return networks
  }

  try {
    execSync('nmcli device wifi rescan', { stdio: 'ignore' })

    const output = runCommand(
      'nmcli -t -f IN-USE,SSID,SIGNAL,SECURITY device wifi list',
    )

    for (const line of output.split('\n')) {
      if (!line.trim()) continue
      const parts = line.split(':')

      if (parts.length >= 4) {
        const [inUse, ssid, signal, security] = parts

        networks.push({
          ssid,
          signal: /^\d+$/.test(signal) ? parseInt(signal, 10) : 0,
          security,
          connected: inUse === '*',
        })
      }
    }

    networks = networks.sort((a, b) => {
      if (a.connected !== b.connected) return a.connected ? -1 : 1
      return b.signal - a.signal
    })
  } catch (e) {
    console.error('Error scanning Wi-Fi:', e)
  }

  return networks
}

export function registerWirelessHandlers(io: Server): () => void {
  let lastStatusJson: string | null = null

  function pollAndBroadcast() {
    try {
      const status = getWirelessStatus()
      const statusJson = JSON.stringify(status)

      if (statusJson !== lastStatusJson) {
        lastStatusJson = statusJson
        io.emit('wireless:status', status)
      }
    } catch (error) {
      console.error('[Wireless] Failed to poll status:', error)
    }
  }

  pollAndBroadcast()
  const intervalHandle = setInterval(
    pollAndBroadcast,
    WIRELESS_POLL_INTERVAL_MS,
  )

  io.on('connection', (socket) => {
    if (lastStatusJson) {
      socket.emit('wireless:status', JSON.parse(lastStatusJson))
    }
  })

  return () => clearInterval(intervalHandle)
}
