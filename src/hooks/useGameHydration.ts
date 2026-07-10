import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

const HYDRATION_TIMEOUT_MS = 3000

export function useGameHydration() {
  const hasHydrated = useGameStore((state) => state.hasHydrated)
  const setHasHydrated = useGameStore((state) => state.setHasHydrated)

  useEffect(() => {
    const finishHydration = () => setHasHydrated()

    const unsub = useGameStore.persist.onFinishHydration(finishHydration)
    if (useGameStore.persist.hasHydrated()) {
      finishHydration()
    }

    const timeout = window.setTimeout(finishHydration, HYDRATION_TIMEOUT_MS)

    return () => {
      unsub()
      window.clearTimeout(timeout)
    }
  }, [setHasHydrated])

  return hasHydrated
}
