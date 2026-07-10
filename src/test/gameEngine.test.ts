import { describe, expect, it } from 'vitest'
import {
  calculateDelta,
  calculateMonthlySettlement,
} from '@/lib/gameCalculations'
import {
  createHistoryEntry,
  createInitialSnapshot,
  endingFromResolution,
  evaluateFinalEnding,
  evaluateImmediateEnding,
  resolveMonth,
} from '@/lib/gameEngine'
import {
  createDefaultPersistedState,
  hasCompletedSave,
  hasUnfinishedSave,
  validatePersistedState,
} from '@/lib/storageValidation'

describe('initial state', () => {
  it('starts with expected values', () => {
    const snapshot = createInitialSnapshot()
    const defaults = createDefaultPersistedState()

    expect(snapshot.budget).toBe(100)
    expect(snapshot.llsx).toBe(1)
    expect(snapshot.qhsx).toBe(1)
    expect(defaults.currentMonth).toBe(1)
    expect(defaults.gameStatus).toBe('landing')
  })
})

describe('monthly formulas', () => {
  it('calculates revenue and operating cost', () => {
    const settlement = calculateMonthlySettlement({ budget: 100, llsx: 3, qhsx: 2 })
    expect(settlement.baseRevenue).toBe(75)
    expect(settlement.operatingCost).toBe(20)
  })

  it('applies imbalance penalty only when delta is 2', () => {
    const penalized = calculateMonthlySettlement({ budget: 100, llsx: 3, qhsx: 1 })
    const safe = calculateMonthlySettlement({ budget: 100, llsx: 3, qhsx: 2 })

    expect(calculateDelta(3, 1)).toBe(2)
    expect(penalized.imbalancePenalty).toBe(15)
    expect(safe.imbalancePenalty).toBe(0)
  })

  it('detects technological breakdown when delta >= 3', () => {
    const ending = evaluateImmediateEnding({ budget: 100, llsx: 4, qhsx: 1 })
    expect(ending?.type).toBe('technology_breakdown')
  })
})

describe('month 2 special consequence', () => {
  it('applies penalty for option B when QHSX < 2', () => {
    const resolution = resolveMonth({
      month: 2,
      snapshot: { budget: 100, llsx: 1, qhsx: 1 },
      choiceId: 'month-2-b',
    })

    expect(resolution.specialBudgetChange).toBe(-20)
    expect(resolution.after.budget).toBe(95)
  })

  it('does not apply penalty for option B when QHSX >= 2', () => {
    const resolution = resolveMonth({
      month: 2,
      snapshot: { budget: 100, llsx: 1, qhsx: 2 },
      choiceId: 'month-2-b',
    })

    expect(resolution.specialBudgetChange).toBe(0)
  })
})

describe('month 4 automatic event', () => {
  it('applies loss when delta is 2', () => {
    const resolution = resolveMonth({
      month: 4,
      snapshot: { budget: 100, llsx: 3, qhsx: 1 },
    })

    expect(resolution.directEffects.budget).toBe(-30)
  })

  it('applies bonus when LLSX equals QHSX', () => {
    const resolution = resolveMonth({
      month: 4,
      snapshot: { budget: 100, llsx: 2, qhsx: 2 },
    })

    expect(resolution.directEffects.budget).toBe(20)
  })

  it('applies no budget effect for other valid states', () => {
    const resolution = resolveMonth({
      month: 4,
      snapshot: { budget: 100, llsx: 2, qhsx: 1 },
    })

    expect(resolution.directEffects.budget).toBe(0)
    expect(resolution.eventMessage).toContain('cần được theo dõi')
  })

  it('triggers technological breakdown instead of neutral when delta >= 3', () => {
    const resolution = resolveMonth({
      month: 4,
      snapshot: { budget: 100, llsx: 4, qhsx: 1 },
    })

    expect(resolution.endingTriggered).toBe('technology_breakdown')
    expect(resolution.settlement).toBeNull()
  })
})

describe('month 6 automatic event', () => {
  it('rewards LLSX >= 3', () => {
    const resolution = resolveMonth({
      month: 6,
      snapshot: { budget: 100, llsx: 3, qhsx: 2 },
    })

    expect(resolution.directEffects.budget).toBe(40)
  })

  it('penalizes LLSX below 3', () => {
    const resolution = resolveMonth({
      month: 6,
      snapshot: { budget: 100, llsx: 2, qhsx: 2 },
    })

    expect(resolution.directEffects.budget).toBe(-25)
  })
})

describe('month 8 revenue adjustment', () => {
  it('applies -15 revenue adjustment for option B', () => {
    const resolution = resolveMonth({
      month: 8,
      snapshot: { budget: 100, llsx: 2, qhsx: 2 },
      choiceId: 'month-8-b',
    })

    expect(resolution.revenueAdjustment).toBe(-15)
    expect(resolution.settlement?.revenueAdjustment).toBe(-15)
  })
})

describe('endings', () => {
  it('triggers economic failure when budget <= 0', () => {
    const ending = evaluateImmediateEnding({ budget: 0, llsx: 2, qhsx: 2 })
    expect(ending?.type).toBe('economic_lag')
  })

  it('requires all victory conditions after month 10', () => {
    const victory = evaluateFinalEnding({ budget: 50, llsx: 4, qhsx: 4 })
    const lag = evaluateFinalEnding({ budget: 50, llsx: 3, qhsx: 4 })

    expect(victory.type).toBe('sustainable_modernization')
    expect(lag.type).toBe('economic_lag')
  })

  it('uses economic lag fallback for non-winning month 10 states', () => {
    const resolution = resolveMonth({
      month: 10,
      snapshot: { budget: 80, llsx: 3, qhsx: 3 },
    })

    expect(resolution.endingTriggered).toBe('economic_lag')
  })

  it('prioritizes technological breakdown over bankruptcy', () => {
    const resolution = resolveMonth({
      month: 3,
      snapshot: { budget: 40, llsx: 2, qhsx: 1 },
      choiceId: 'month-3-a',
    })

    expect(resolution.endingTriggered).toBe('technology_breakdown')
  })

  it('keeps bankruptcy narrative on month 10 when budget is depleted', () => {
    const resolution = resolveMonth({
      month: 10,
      snapshot: { budget: 0, llsx: 4, qhsx: 4 },
    })

    const ending = endingFromResolution(resolution)
    expect(resolution.endingTriggered).toBe('economic_lag')
    expect(ending?.message).toContain('Ngân sách xưởng cạn kiệt')
  })

  it('records null settlement when tech breakdown skips monthly settlement', () => {
    const resolution = resolveMonth({
      month: 3,
      snapshot: { budget: 100, llsx: 2, qhsx: 1 },
      choiceId: 'month-3-a',
    })
    const history = createHistoryEntry(resolution)

    expect(resolution.settlement).toBeNull()
    expect(history.settlement).toBeNull()
    expect(history.endingTriggered).toBe('technology_breakdown')
  })
})

describe('persistence validation', () => {
  it('restores valid state', () => {
    const defaults = createDefaultPersistedState()
    const result = validatePersistedState(defaults)
    expect(result.corrupted).toBe(false)
    expect(result.state?.budget).toBe(100)
  })

  it('falls back safely for invalid state', () => {
    const result = validatePersistedState({ schemaVersion: 99 })
    expect(result.corrupted).toBe(true)
    expect(result.state).toBeNull()
  })

  it('does not treat a fresh landing state as an unfinished save', () => {
    const defaults = createDefaultPersistedState()
    expect(hasUnfinishedSave(defaults)).toBe(false)
    expect(hasCompletedSave(defaults)).toBe(false)
  })

  it('detects unfinished progress and completed endings', () => {
    const unfinished = {
      ...createDefaultPersistedState(),
      history: [
        {
          month: 1,
          eventId: 'month-1',
          eventTitle: 'Test',
          selectedChoiceId: 'month-1-a',
          selectedChoiceTitle: 'A',
          eventMessage: 'ok',
          before: { budget: 100, llsx: 1, qhsx: 1 },
          directEffects: { budget: -30, llsx: 1, qhsx: 0 },
          settlement: {
            baseRevenue: 50,
            revenueAdjustment: 0,
            operatingCost: 10,
            imbalancePenalty: 0,
            eventBudgetAdjustment: 0,
            monthlyNet: 40,
            imbalanceWarning: null,
          },
          after: { budget: 110, llsx: 2, qhsx: 1, delta: 1 },
          endingTriggered: null,
        },
      ],
      gameStatus: 'playing' as const,
    }

    const completed = {
      ...createDefaultPersistedState(),
      ending: {
        type: 'sustainable_modernization' as const,
        message: 'win',
        reason: null,
      },
      gameStatus: 'ended' as const,
    }

    expect(hasUnfinishedSave(unfinished)).toBe(true)
    expect(hasCompletedSave(completed)).toBe(true)
    expect(hasUnfinishedSave(completed)).toBe(false)
  })
})

describe('turn safety', () => {
  it('produces one settlement per resolved month', () => {
    const resolution = resolveMonth({
      month: 1,
      snapshot: createInitialSnapshot(),
      choiceId: 'month-1-b',
    })

    expect(resolution.settlement).not.toBeNull()
    expect(resolution.settlement?.monthlyNet).toBeTypeOf('number')
  })
})
