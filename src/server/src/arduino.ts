import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

const ard = new SerialPort({
  path: 'COM5',
  baudRate: 9600,
})

const parser = ard.pipe(new ReadlineParser({ delimiter: '\n' }))

ard.on('open', () => {
  console.log('[AR] Connected')
})

ard.on('error', (err) => {
  console.error('[AR]', err.message)
})

parser.on('data', (message: string) => {
  try {
    const data = JSON.parse(message)
    console.log('[AR]', data)
  } catch {
    console.log('[AR]', message.trim())
  }
})
