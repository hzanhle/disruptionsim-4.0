import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { getMonthEvent, isAutomaticEvent, isChoiceEvent, isFinaleEvent } from '@/data/monthEvents'
import {
  createHistoryEntry,
  endingFromResolution,
  resolveMonth,
} from '@/lib/gameEngine'
import {
  createDefaultPersistedState,
  hasCompletedSave,
  hasUnfinishedSave,
  validatePersistedState,
} from '@/lib/storageValidation'
import {
  STORAGE_KEY,
  TOTAL_MONTHS,
} from '@/lib/constants'
import type {
  EndingResult,
  MonthHistoryEntry,
  MonthResolution,
  PersistedGameState,
} from '@/types/game'

interface GameStore extends PersistedGameState {
  hasHydrated: boolean
  saveNotice: string | null
  isResolving: boolean
  setHasHydrated: () => void
  clearSaveNotice: () => void
  startNewGame: () => void
  continueGame: () => void
  selectChoice: (choiceId: string) => void
  confirmChoice: () => void
  resolveAutomaticEvent: () => void
  advanceMonth: () => void
  resetGame: () => void
  toggleSound: () => void
  viewEndingFromReport: () => void
  reviewJourney: () => void
  openTutorial: () => void
  returnFromTutorial: () => void
  tutorialOpen: boolean
  previousScreen: GameStore['gameStatus'] | 'landing'
}

function snapshotFromState(state: Pick<GameStore, 'budget' | 'llsx' | 'qhsx'>) {
  return {
    budget: state.budget,
    llsx: state.llsx,
    qhsx: state.qhsx,
  }
}

let pendingSaveNotice: string | null = null

function resolveUiGameStatus(state: PersistedGameState): PersistedGameState['gameStatus'] {
  // Prefer restoring the report if the player was mid-report (including ending-triggering months).
  if (state.currentResolution && state.gameStatus !== 'ended') {
    return 'report'
  }
  if (hasCompletedSave(state) || state.gameStatus === 'ended') {
    return 'ended'
  }
  return 'landing'
}

const validatedStorage: StateStorage = {
  getItem: (name) => {
    try {
      const raw = localStorage.getItem(name)
      if (!raw) return null

      const parsed = JSON.parse(raw) as { state?: unknown; version?: number }
      const validated = validatePersistedState(parsed.state)
      if (validated.corrupted || !validated.state) {
        pendingSaveNotice =
          validated.message ?? 'Dữ liệu lưu không hợp lệ. Trò chơi sẽ bắt đầu lại.'
        return null
      }

      const restored: PersistedGameState = {
        ...validated.state,
        gameStatus: resolveUiGameStatus(validated.state),
      }

      return JSON.stringify({ state: restored, version: parsed.version ?? 0 })
    } catch {
      pendingSaveNotice =
        pendingSaveNotice ??
        'Không thể đọc dữ liệu lưu. Trò chơi sẽ bắt đầu lại.'
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // Ignore quota / privacy restrictions — gameplay can continue in-memory.
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // Ignore storage access failures.
    }
  },
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createDefaultPersistedState(),
      hasHydrated: false,
      saveNotice: null,
      isResolving: false,
      tutorialOpen: false,
      previousScreen: 'landing',

      setHasHydrated: () => set({ hasHydrated: true }),

      clearSaveNotice: () => set({ saveNotice: null }),

      startNewGame: () =>
        set({
          ...createDefaultPersistedState(),
          gameStatus: 'playing',
          saveNotice: null,
          isResolving: false,
          tutorialOpen: false,
          previousScreen: 'landing',
        }),

      continueGame: () => {
        const state = get()
        if (hasCompletedSave(state)) {
          set({ gameStatus: 'ended', tutorialOpen: false })
          return
        }
        if (state.currentResolution) {
          set({ gameStatus: 'report', tutorialOpen: false })
          return
        }
        set({ gameStatus: 'playing', tutorialOpen: false })
      },

      selectChoice: (choiceId) => {
        const state = get()
        if (state.choiceLocked || state.isResolving || state.gameStatus !== 'playing') {
          return
        }
        const event = getMonthEvent(state.currentMonth)
        if (!event || !isChoiceEvent(event)) return
        if (!event.choices.some((choice) => choice.id === choiceId)) return
        set({ pendingChoiceId: choiceId })
      },

      confirmChoice: () => {
        const state = get()
        if (
          state.choiceLocked ||
          state.isResolving ||
          !state.pendingChoiceId ||
          state.gameStatus !== 'playing'
        ) {
          return
        }

        const event = getMonthEvent(state.currentMonth)
        if (!event || !isChoiceEvent(event)) return

        set({ isResolving: true, choiceLocked: true })

        const resolution = resolveMonth({
          month: state.currentMonth,
          snapshot: snapshotFromState(state),
          choiceId: state.pendingChoiceId,
          history: state.history,
        })

        const historyEntry = createHistoryEntry(resolution)

        set((current) => ({
          budget: resolution.after.budget,
          llsx: resolution.after.llsx,
          qhsx: resolution.after.qhsx,
          history: [...current.history, historyEntry],
          currentResolution: resolution,
          pendingChoiceId: null,
          choiceLocked: true,
          ending: endingFromResolution(resolution, current.history),
          gameStatus: 'report',
          isResolving: false,
        }))
      },

      resolveAutomaticEvent: () => {
        const state = get()
        if (
          state.choiceLocked ||
          state.isResolving ||
          state.gameStatus !== 'playing'
        ) {
          return
        }

        const event = getMonthEvent(state.currentMonth)
        if (!event || (!isAutomaticEvent(event) && !isFinaleEvent(event))) return

        set({ isResolving: true, choiceLocked: true })

        const resolution = resolveMonth({
          month: state.currentMonth,
          snapshot: snapshotFromState(state),
          history: state.history,
        })

        const historyEntry = createHistoryEntry(resolution)

        set((current) => ({
          budget: resolution.after.budget,
          llsx: resolution.after.llsx,
          qhsx: resolution.after.qhsx,
          history: [...current.history, historyEntry],
          currentResolution: resolution,
          pendingChoiceId: null,
          choiceLocked: true,
          ending: endingFromResolution(resolution, current.history),
          gameStatus: 'report',
          isResolving: false,
        }))
      },

      advanceMonth: () => {
        const state = get()
        if (!state.currentResolution || state.isResolving) return

        if (state.ending) {
          set({ gameStatus: 'ended' })
          return
        }

        if (state.currentMonth >= TOTAL_MONTHS) return

        set({
          currentMonth: state.currentMonth + 1,
          currentResolution: null,
          pendingChoiceId: null,
          choiceLocked: false,
          gameStatus: 'playing',
        })
      },

      resetGame: () =>
        set({
          ...createDefaultPersistedState(),
          hasHydrated: true,
          tutorialOpen: false,
          previousScreen: 'landing',
        }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      viewEndingFromReport: () => {
        const state = get()
        if (state.ending) {
          set({ gameStatus: 'ended' })
        }
      },

      reviewJourney: () => {
        const state = get()
        if (state.currentResolution) {
          set({ gameStatus: 'report' })
        }
      },

      openTutorial: () =>
        set((state) => ({
          tutorialOpen: true,
          previousScreen:
            state.gameStatus === 'landing' ? 'landing' : state.gameStatus,
        })),

      returnFromTutorial: () =>
        set((state) => ({
          tutorialOpen: false,
          gameStatus:
            state.previousScreen === 'landing'
              ? 'landing'
              : state.previousScreen,
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => validatedStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        gameStatus: state.gameStatus,
        currentMonth: state.currentMonth,
        budget: state.budget,
        llsx: state.llsx,
        qhsx: state.qhsx,
        history: state.history,
        currentResolution: state.currentResolution,
        pendingChoiceId: state.pendingChoiceId,
        choiceLocked: state.choiceLocked,
        ending: state.ending,
        soundEnabled: state.soundEnabled,
      }),
      merge: (persisted, current) => {
        const incoming =
          persisted && typeof persisted === 'object'
            ? (persisted as Record<string, unknown>)
            : {}
        const {
          hasHydrated: _ignored,
          saveNotice: _notice,
          isResolving: _resolving,
          tutorialOpen: _tutorial,
          previousScreen: _previous,
          ...rest
        } = incoming
        return {
          ...current,
          ...rest,
          hasHydrated: false,
        }
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          pendingSaveNotice =
            pendingSaveNotice ??
            'Không thể khôi phục tiến trình. Trò chơi sẽ bắt đầu lại.'
        }

        useGameStore.setState({
          hasHydrated: true,
          saveNotice: pendingSaveNotice,
        })
        pendingSaveNotice = null
      },
    },
  ),
)

export function getSaveAvailability(state: {
  history: MonthHistoryEntry[]
  ending: EndingResult | null
  currentResolution: MonthResolution | null
  gameStatus: PersistedGameState['gameStatus']
}) {
  const persisted: PersistedGameState = {
    ...createDefaultPersistedState(),
    history: state.history,
    ending: state.ending,
    currentResolution: state.currentResolution,
    gameStatus: state.gameStatus,
  }

  return {
    canContinue: hasUnfinishedSave(persisted) || hasCompletedSave(persisted),
    isCompleted: hasCompletedSave(persisted),
  }
}
