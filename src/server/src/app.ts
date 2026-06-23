import './arduino'

export interface AppConfig {
  port: number
}
export const config: AppConfig = {
  port: 8000,
}