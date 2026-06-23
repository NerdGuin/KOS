import { Server } from 'socket.io'
import { createServer } from 'http'
import { config } from './app'
import { registerWirelessHandlers } from './wireless'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

httpServer.listen(config.port, () => {
  console.log(`[IO] Listening on ws://localhost:${config.port}`)
})

const stopWirelessPolling = registerWirelessHandlers(io)

io.on('connection', (socket) => {
  // console.log('[IO] Client connected.')

  socket.on('message', (message: string) => {
    console.log(`[IO] Received payload: ${message}`)
    io.emit('message', `Echo from server: ${message}`)
  })

  socket.on('error', (error: Error) => {
    console.error(`[IO] Connection error encountered: ${error.message}`)
  })

  // socket.on('disconnect', (reason) => {
  //   console.log(`[IO] Client disconnected. (${reason.toUpperCase()})`)
  // })
})

process.on('SIGTERM', () => stopWirelessPolling())
process.on('SIGINT', () => stopWirelessPolling())
