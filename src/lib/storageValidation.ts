import {
  INITIAL_BUDGET,
  INITIAL_LLSX,
  INITIAL_QHSX,
  SCHEMA_VERSION,
  TOTAL_MONTHS,
} from '@/lib/constants'
import type {
  EndingResult,
  GameStatus,
  MonthHistoryEntry,
  MonthResolution,
  PersistedGameState,
} from '@/types/game'

export interface ValidationResult {
  state: PersistedGameState | null
  corrupted: boolean
  message: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isGameStatus(value: unknown): value is GameStatus {
  return value === 'landing' || value === 'playing' || value === 'report' || value === 'ended'
}

function isEnding(value: unknown): value is EndingResult {
  if (!isRecord(value)) return false
  const type = value.type
  return (
    (type === 'technology_breakdown' ||
      type === 'economic_lag' ||
      type === 'sustainable_modernization') &&
    typeof value.message === 'string'
  )
}

function isHistoryEntry(value: unknown): value is MonthHistoryEntry {
  if (!isRecord(value)) return false
  return (
    isNumber(value.month) &&
    typeof value.eventId === 'string' &&
    typeof value.eventTitle === 'string' &&
    isRecord(value.before) &&
    isRecord(value.after) &&
    isRecord(value.directEffects) &&
    (value.settlement === null || isRecord(value.settlement))
  )
}

function isResolution(value: unknown): value is MonthResolution {
  if (!isRecord(value)) return false
  return (
    isNumber(value.month) &&
    typeof value.eventId === 'string' &&
    isRecord(value.before) &&
    isRecord(value.after)
  )
}

export function createDefaultPersistedState(): PersistedGameState {
  return {
    schemaVersion: SCHEMA_VERSION,
    gameStatus: 'landing',
    currentMonth: 1,
    budget: INITIAL_BUDGET,
    llsx: INITIAL_LLSX,
    qhsx: INITIAL_QHSX,
    history: [],
    currentResolution: null,
    pendingChoiceId: null,
    choiceLocked: false,
    ending: null,
    soundEnabled: true,
  }
}

export function validatePersistedState(raw: unknown): ValidationResult {
  if (!isRecord(raw)) {
    return {
      state: null,
      corrupted: true,
      message: 'Dữ liệu lưu không hợp lệ. Trò chơi sẽ bắt đầu lại.',
    }
  }

  if (raw.schemaVersion !== SCHEMA_VERSION) {
    return {
      state: null,
      corrupted: true,
      message: 'Phiên bản lưu trữ không được hỗ trợ. Trò chơi sẽ bắt đầu lại.',
    }
  }

  if (
    !isGameStatus(raw.gameStatus) ||
    !isNumber(raw.currentMonth) ||
    !isNumber(raw.budget) ||
    !isNumber(raw.llsx) ||
    !isNumber(raw.qhsx) ||
    !Array.isArray(raw.history)
  ) {
    return {
      state: null,
      corrupted: true,
      message: 'Dữ liệu lưu bị hỏng. Trò chơi sẽ bắt đầu lại.',
    }
  }

  if (
    raw.currentMonth < 1 ||
    raw.currentMonth > TOTAL_MONTHS + 1 ||
    raw.llsx < 0 ||
    raw.qhsx < 0
  ) {
    return {
      state: null,
      corrupted: true,
      message: 'Giá trị trò chơi không hợp lệ. Trò chơi sẽ bắt đầu lại.',
    }
  }

  if (!raw.history.every(isHistoryEntry)) {
    return {
      state: null,
      corrupted: true,
      message: 'Lịch sử trò chơi bị hỏng. Trò chơi sẽ bắt đầu lại.',
    }
  }

  const currentResolution =
    raw.currentResolution === null || isResolution(raw.currentResolution)
      ? (raw.currentResolution as MonthResolution | null)
      : null

  const ending =
    raw.ending === null || raw.ending === undefined
      ? null
      : isEnding(raw.ending)
        ? raw.ending
        : null

  return {
    state: {
      schemaVersion: SCHEMA_VERSION,
      gameStatus: raw.gameStatus,
      currentMonth: raw.currentMonth,
      budget: raw.budget,
      llsx: raw.llsx,
      qhsx: raw.qhsx,
      history: raw.history as MonthHistoryEntry[],
      currentResolution,
      pendingChoiceId:
        typeof raw.pendingChoiceId === 'string' ? raw.pendingChoiceId : null,
      choiceLocked: Boolean(raw.choiceLocked),
      ending,
      soundEnabled:
        typeof raw.soundEnabled === 'boolean' ? raw.soundEnabled : true,
    },
    corrupted: false,
    message: null,
  }
}

export function hasCompletedSave(
  state: Pick<PersistedGameState, 'ending'>,
): boolean {
  return state.ending !== null
}

/** True only when there is real in-progress progress (not a fresh landing state). */
export function hasUnfinishedSave(state: PersistedGameState): boolean {
  if (hasCompletedSave(state)) return false

  return (
    state.history.length > 0 ||
    state.currentResolution !== null ||
    state.gameStatus === 'playing' ||
    state.gameStatus === 'report'
  )
}
