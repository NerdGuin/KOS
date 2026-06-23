import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface WirelessStatus {
  wifiEnabled: boolean
  wifiConnected: boolean
  connectionType: string | null
  bluetoothEnabled: boolean
  bluetoothConnected: boolean
}

interface WirelessContextValue {
  status: WirelessStatus | null
  isConnected: boolean // IO CONNECTION
}

const WirelessContext = createContext<WirelessContextValue | undefined>(undefined)

const SERVER_URL = 'http://localhost:8000'

export function WirelessProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WirelessStatus | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(SERVER_URL)
    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('wireless:status', (data: WirelessStatus) => {
      setStatus(data)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  return (
    <WirelessContext.Provider value={{ status, isConnected }}>{children}</WirelessContext.Provider>
  )
}

export function useWireless(): WirelessContextValue {
  const context = useContext(WirelessContext)
  if (context === undefined) {
    throw new Error('useWireless must be used within a WirelessProvider')
  }
  return context
}
