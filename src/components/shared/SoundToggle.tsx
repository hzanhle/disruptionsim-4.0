import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { unlockAudio, setSoundEnabled, playSound } from '@/lib/soundManager'
import { useGameStore } from '@/store/gameStore'

export function SoundToggle() {
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const toggleSound = useGameStore((state) => state.toggleSound)

  const handleToggle = () => {
    unlockAudio()
    playSound('click')
    const next = !soundEnabled
    setSoundEnabled(next)
    toggleSound()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
      aria-pressed={soundEnabled}
      onClick={handleToggle}
    >
      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </Button>
  )
}
