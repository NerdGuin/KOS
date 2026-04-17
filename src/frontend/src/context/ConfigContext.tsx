import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { configs as defaultConfigs } from '../config/config'

type ConfigContextType = {
  configs: typeof defaultConfigs
  setConfigs: React.Dispatch<React.SetStateAction<typeof defaultConfigs>>
}

const ConfigContext = createContext<ConfigContextType | null>(null)

type Props = {
  children: ReactNode
}

export function ConfigProvider({ children }: Props) {
  const [configs, setConfigs] = useState(defaultConfigs)

  return (
    <ConfigContext.Provider value={{ configs, setConfigs }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}
