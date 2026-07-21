import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const sampleRate = 44100

function writeTone(filename, frequency, durationMs, volume = 0.25, fade = true) {
  const numSamples = Math.floor((sampleRate * durationMs) / 1000)
  const buffer = Buffer.alloc(44 + numSamples * 2)

  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + numSamples * 2, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(numSamples * 2, 40)

  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate
    const envelope = fade
      ? Math.min(1, i / (sampleRate * 0.01)) *
        Math.min(1, (numSamples - i) / (sampleRate * 0.04))
      : 1
    const sample = Math.sin(2 * Math.PI * frequency * t) * volume * envelope
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, sample * 32767)), 44 + i * 2)
  }

  writeFileSync(join('public', 'sounds', filename), buffer)
}

function writeChord(filename, frequencies, durationMs, volume = 0.25) {
  const numSamples = Math.floor((sampleRate * durationMs) / 1000)
  const buffer = Buffer.alloc(44 + numSamples * 2)

  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + numSamples * 2, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(numSamples * 2, 40)

  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate
    const envelope = Math.min(1, i / (sampleRate * 0.01)) * Math.min(1, (numSamples - i) / (sampleRate * 0.08))
    let combined = 0
    frequencies.forEach((freq) => {
      combined += Math.sin(2 * Math.PI * freq * t)
    })
    const sample = (combined / frequencies.length) * volume * envelope
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, sample * 32767)), 44 + i * 2)
  }

  writeFileSync(join('public', 'sounds', filename), buffer)
}

function writeSweep(filename, startFreq, endFreq, durationMs, volume = 0.25) {
  const numSamples = Math.floor((sampleRate * durationMs) / 1000)
  const buffer = Buffer.alloc(44 + numSamples * 2)

  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + numSamples * 2, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(numSamples * 2, 40)

  for (let i = 0; i < numSamples; i += 1) {
    const progress = i / numSamples
    const currentFreq = startFreq + (endFreq - startFreq) * progress
    const t = i / sampleRate
    const envelope = Math.min(1, i / (sampleRate * 0.01)) * Math.min(1, (numSamples - i) / (sampleRate * 0.05))
    const sample = Math.sin(2 * Math.PI * currentFreq * t) * volume * envelope
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, sample * 32767)), 44 + i * 2)
  }

  writeFileSync(join('public', 'sounds', filename), buffer)
}

mkdirSync(join('public', 'sounds'), { recursive: true })

writeTone('click.wav', 880, 60, 0.15)
writeTone('hover.wav', 1200, 30, 0.08)
writeTone('confirm.wav', 660, 120, 0.22)
writeTone('positive.wav', 523, 180, 0.25)
writeTone('negative.wav', 220, 220, 0.28)
writeTone('warning.wav', 440, 250, 0.24)
writeTone('settlement.wav', 392, 200, 0.2)
writeTone('victory.wav', 784, 320, 0.26)
writeTone('defeat.wav', 165, 360, 0.3)

// Multi-tonal chimes & cinematic effects
writeChord('fanfare.wav', [523.25, 659.25, 783.99, 1046.5], 600, 0.3)
writeSweep('glitch.wav', 800, 120, 450, 0.35)
writeChord('alarm.wav', [440, 880], 350, 0.28)

console.log('Generated enhanced sound effects in public/sounds/')
