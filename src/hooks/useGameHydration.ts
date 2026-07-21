import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

const HYDRATION_TIMEOUT_MS = 250

export function useGameHydration() {
  const hasHydrated = useGameStore((state) => state.hasHydrated)
  const setHasHydrated = useGameStore((state) => state.setHasHydrated)

  useEffect(() => {
    const finishHydration = () => {
      if (!useGameStore.getState().hasHydrated) {
        setHasHydrated()
      }
    }

    const unsub = useGameStore.persist.onFinishHydration(finishHydration)
    if (useGameStore.persist.hasHydrated()) {
      finishHydration()
    }

    // Persist is sync for localStorage — don't leave the UI stuck on the loader.
    const raf = window.requestAnimationFrame(finishHydration)
    const timeout = window.setTimeout(finishHydration, HYDRATION_TIMEOUT_MS)

    return () => {
      unsub()
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
    }
  }, [setHasHydrated])

  return hasHydrated
}
