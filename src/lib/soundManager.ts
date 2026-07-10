import { Howl } from 'howler'

export type SoundId =
  | 'click'
  | 'confirm'
  | 'positive'
  | 'negative'
  | 'warning'
  | 'settlement'
  | 'victory'
  | 'defeat'

const soundFiles: Record<SoundId, string> = {
  click: '/sounds/click.wav',
  confirm: '/sounds/confirm.wav',
  positive: '/sounds/positive.wav',
  negative: '/sounds/negative.wav',
  warning: '/sounds/warning.wav',
  settlement: '/sounds/settlement.wav',
  victory: '/sounds/victory.wav',
  defeat: '/sounds/defeat.wav',
}

let initialized = false
let enabled = true
const sounds = new Map<SoundId, Howl>()

export function initSounds() {
  if (initialized) return
  initialized = true

  ;(Object.keys(soundFiles) as SoundId[]).forEach((id) => {
    sounds.set(
      id,
      new Howl({
        src: [soundFiles[id]],
        volume: 0.6,
        html5: false,
        onloaderror: () => {
          // Gracefully ignore missing audio
        },
        onplayerror: (_id, error) => {
          console.warn(`Không thể phát âm thanh ${id}:`, error)
        },
      }),
    )
  })
}

export function setSoundEnabled(value: boolean) {
  enabled = value
}

export function playSound(id: SoundId) {
  if (!enabled) return
  try {
    initSounds()
    sounds.get(id)?.play()
  } catch {
    // Audio unavailable
  }
}

export function unlockAudio() {
  initSounds()
}
