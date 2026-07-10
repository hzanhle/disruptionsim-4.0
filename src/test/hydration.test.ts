import { beforeEach, describe, expect, it } from 'vitest'

describe('game store hydration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('marks hydration complete for a fresh save', async () => {
    const { useGameStore } = await import('@/store/gameStore')

    await useGameStore.persist.rehydrate()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(useGameStore.persist.hasHydrated()).toBe(true)
    expect(useGameStore.getState().hasHydrated).toBe(true)
    expect(useGameStore.getState().gameStatus).toBe('landing')
  })

  it('recovers when localStorage throws while reading', async () => {
    const getItem = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new DOMException('blocked', 'SecurityError')
    }

    try {
      vi.resetModules()
      const { useGameStore } = await import('@/store/gameStore')

      await useGameStore.persist.rehydrate()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(useGameStore.persist.hasHydrated()).toBe(true)
      expect(useGameStore.getState().hasHydrated).toBe(true)
    } finally {
      Storage.prototype.getItem = getItem
      vi.resetModules()
    }
  })
})
