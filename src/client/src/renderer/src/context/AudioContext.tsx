export function tocarBeep(frequency: number = 1000, durationMs: number = 500) {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = 'triangle'
  oscillator.frequency.value = frequency

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start()
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)
  oscillator.stop(ctx.currentTime + durationMs / 1000)
}

// setInterval(() => {
//   tocarBeep(550, 1000)
// }, 1000)
