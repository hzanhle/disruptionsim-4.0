import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

export function useGameHydration() {
  const hasHydrated = useGameStore((state) => state.hasHydrated)
  const setHasHydrated = useGameStore((state) => state.setHasHydrated)

  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => {
      setHasHydrated()
    })
    if (useGameStore.persist.hasHydrated()) {
      setHasHydrated()
    }
    return unsub
  }, [setHasHydrated])

  return hasHydrated
}
