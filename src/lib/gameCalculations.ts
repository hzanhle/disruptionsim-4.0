import {
  IMBALANCE_PENALTY,
  IMBALANCE_WARNING_DELTA,
  OPERATING_COST_MULTIPLIER,
  REVENUE_MULTIPLIER,
  TECH_BREAKDOWN_DELTA,
} from '@/lib/constants'
import type { GameSnapshot, SettlementLedger } from '@/types/game'

export function calculateDelta(llsx: number, qhsx: number): number {
  return llsx - qhsx
}

export interface SettlementInput extends GameSnapshot {
  revenueAdjustment?: number
  eventBudgetAdjustment?: number
}

export function calculateMonthlySettlement(
  input: SettlementInput,
): SettlementLedger {
  const delta = calculateDelta(input.llsx, input.qhsx)
  const baseRevenue = input.llsx * REVENUE_MULTIPLIER
  const revenueAdjustment = input.revenueAdjustment ?? 0
  const operatingCost = input.qhsx * OPERATING_COST_MULTIPLIER
  const imbalancePenalty = delta === IMBALANCE_WARNING_DELTA ? IMBALANCE_PENALTY : 0
  const eventBudgetAdjustment = input.eventBudgetAdjustment ?? 0

  const monthlyNet =
    baseRevenue +
    revenueAdjustment -
    operatingCost -
    imbalancePenalty +
    eventBudgetAdjustment

  const imbalanceWarning =
    delta === IMBALANCE_WARNING_DELTA
      ? 'LLSX và QHSX đang lệch nhau. Công nhân có thể vận hành sai quy trình, gây hao hụt hiệu quả.'
      : null

  return {
    baseRevenue,
    revenueAdjustment,
    operatingCost,
    imbalancePenalty,
    eventBudgetAdjustment,
    monthlyNet,
    imbalanceWarning,
  }
}

export function isTechnologicalBreakdown(delta: number): boolean {
  return delta >= TECH_BREAKDOWN_DELTA
}

export function isBankruptcy(budget: number): boolean {
  return budget <= 0
}

export function applyEffects(
  snapshot: GameSnapshot,
  effects: { budget: number; llsx: number; qhsx: number },
): GameSnapshot {
  return {
    budget: snapshot.budget + effects.budget,
    llsx: snapshot.llsx + effects.llsx,
    qhsx: snapshot.qhsx + effects.qhsx,
  }
}
