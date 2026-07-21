import {
  calculateDelta,
  calculateMonthlySettlement,
  applyEffects,
  isBankruptcy,
  isTechnologicalBreakdown,
} from '@/lib/gameCalculations'
import {
  TECH_BREAKDOWN_DELTA,
  VICTORY_MIN_LLSX,
  VICTORY_MIN_QHSX,
  INITIAL_BUDGET,
  INITIAL_LLSX,
  INITIAL_QHSX,
} from '@/lib/constants'
import {
  getMonthEvent,
  isAutomaticEvent,
  isChoiceEvent,
  isFinaleEvent,
} from '@/data/monthEvents'
import type {
  EndingResult,
  EndingType,
  GameSnapshot,
  MonthHistoryEntry,
  MonthResolution,
  StatEffects,
} from '@/types/game'

const TECH_BREAKDOWN_MESSAGE =
  'Bạn đã thất bại. Bạn cố chấp nhập khẩu những công nghệ tối tân nhất (LLSX) nhưng QHSX (trình độ con người và năng lực quản lý) của xưởng chỉ ở mức nguyên thủy. Máy móc tiền tỷ bị đắp chiếu, công nhân đình công vì áp lực và bất công. Sự đứt gãy này chứng minh quy luật: QHSX phải phù hợp với trình độ của LLSX.'

const ECONOMIC_LAG_BASE_MESSAGE =
  'Bạn đã thất bại. Vì quá sợ rủi ro đứt gãy, bạn giữ xưởng may ở mô hình thủ công lỗi thời. Doanh nghiệp của bạn bị quét sạch khỏi chuỗi giá trị toàn cầu, phản ánh đúng nguy cơ tụt hậu của các quốc gia không kịp đón đầu CMCN 4.0 trong tiến trình CNH-HĐH.'

const VICTORY_MESSAGE =
  'Bạn đã đưa SmartGarment Việt Nam vượt qua đứt gãy công nghệ thành công. Bằng tư duy biện chứng, bạn luôn giữ sự cân bằng giữa phát triển công cụ số (LLSX) và nâng cao trình độ con người, quy trình quản lý (QHSX). Xưởng may của bạn hiện đã dịch chuyển sang mô hình Kinh tế tri thức, đóng góp vào sự nghiệp hiện đại hóa đất nước.'

export interface ResolveMonthInput {
  month: number
  snapshot: GameSnapshot
  choiceId?: string | null
}

export function evaluateImmediateEnding(
  snapshot: GameSnapshot,
): EndingResult | null {
  const delta = calculateDelta(snapshot.llsx, snapshot.qhsx)

  if (isTechnologicalBreakdown(delta)) {
    return {
      type: 'technology_breakdown',
      message: TECH_BREAKDOWN_MESSAGE,
      reason: `Chênh lệch LLSX - QHSX đạt ${delta} (ngưỡng đứt gãy: ${TECH_BREAKDOWN_DELTA}).`,
    }
  }

  if (isBankruptcy(snapshot.budget)) {
    return {
      type: 'economic_lag',
      message: buildBankruptcyMessage(snapshot.budget),
      reason: 'Ngân sách không còn dương sau sự kiện hoặc quyết toán tháng.',
    }
  }

  return null
}

export function evaluateFinalEnding(snapshot: GameSnapshot): EndingResult {
  const delta = calculateDelta(snapshot.llsx, snapshot.qhsx)

  if (
    snapshot.budget > 0 &&
    snapshot.llsx >= VICTORY_MIN_LLSX &&
    snapshot.qhsx >= VICTORY_MIN_QHSX &&
    delta < TECH_BREAKDOWN_DELTA
  ) {
    return {
      type: 'sustainable_modernization',
      message: VICTORY_MESSAGE,
      reason: null,
    }
  }

  const reasons: string[] = []
  if (snapshot.budget <= 0) {
    reasons.push('Ngân sách không đủ để duy trì hoạt động.')
  }
  if (snapshot.llsx < VICTORY_MIN_LLSX) {
    reasons.push('LLSX chưa đạt cấp độ cần thiết.')
  }
  if (snapshot.qhsx < VICTORY_MIN_QHSX) {
    reasons.push('QHSX chưa đạt cấp độ cần thiết.')
  }
  if (delta >= TECH_BREAKDOWN_DELTA) {
    reasons.push('Mức chênh lệch LLSX - QHSX vượt ngưỡng an toàn.')
  }
  if (reasons.length === 0) {
    reasons.push('Nhà máy chưa đủ điều kiện chuyển sang mô hình kinh tế tri thức.')
  }

  return {
    type: 'economic_lag',
    message: buildEconomicLagFallbackMessage(snapshot, reasons),
    reason: reasons.join(' '),
  }
}

function buildBankruptcyMessage(budget: number): string {
  return `Bạn đã thất bại. Ngân sách xưởng cạn kiệt (${budget <= 0 ? '≤ $0' : `$${budget}`}). SmartGarment Việt Nam không thể duy trì sản xuất và bị loại khỏi chuỗi giá trị toàn cầu. Đây là hậu quả của việc không cân bằng đầu tư công nghệ, chi phí vận hành và quản trị nhân sự.`
}

function buildEconomicLagFallbackMessage(
  snapshot: GameSnapshot,
  reasons: string[],
): string {
  const intro =
    snapshot.llsx >= 3
      ? 'Bạn đã thất bại. Dù đã đầu tư công nghệ, nhà máy vẫn chưa hoàn thiện mô hình CNH-HĐH bền vững.'
      : ECONOMIC_LAG_BASE_MESSAGE

  return `${intro} ${reasons.join(' ')}`
}

function resolveSpecialConsequences(
  month: number,
  choiceId: string | null,
  snapshot: GameSnapshot,
): {
  snapshot: GameSnapshot
  specialBudgetChange: number
  specialMessage: string | null
  revenueAdjustment: number
  revenueAdjustmentMessage: string | null
} {
  const event = getMonthEvent(month)
  let current = { ...snapshot }
  let specialBudgetChange = 0
  let specialMessage: string | null = null
  let revenueAdjustment = 0
  let revenueAdjustmentMessage: string | null = null

  if (!event || !isChoiceEvent(event) || !choiceId || !event.consequences) {
    return {
      snapshot: current,
      specialBudgetChange,
      specialMessage,
      revenueAdjustment,
      revenueAdjustmentMessage,
    }
  }

  for (const consequence of event.consequences) {
    if (consequence.choiceId !== choiceId) continue

    if (consequence.type === 'budget_penalty_if_qhsx_below') {
      if (current.qhsx < consequence.threshold) {
        current = applyEffects(current, {
          budget: consequence.budget,
          llsx: 0,
          qhsx: 0,
        })
        specialBudgetChange += consequence.budget
        specialMessage = consequence.message
      }
    }

    if (consequence.type === 'revenue_adjustment') {
      revenueAdjustment += consequence.amount
      revenueAdjustmentMessage = consequence.message
    }
  }

  return {
    snapshot: current,
    specialBudgetChange,
    specialMessage,
    revenueAdjustment,
    revenueAdjustmentMessage,
  }
}

function resolveAutomaticCondition(
  month: number,
  snapshot: GameSnapshot,
): {
  snapshot: GameSnapshot
  effects: StatEffects
  message: string
} {
  const event = getMonthEvent(month)
  if (!event || !isAutomaticEvent(event)) {
    return {
      snapshot,
      effects: { budget: 0, llsx: 0, qhsx: 0 },
      message: '',
    }
  }

  const delta = calculateDelta(snapshot.llsx, snapshot.qhsx)
  if (isTechnologicalBreakdown(delta)) {
    return {
      snapshot,
      effects: { budget: 0, llsx: 0, qhsx: 0 },
      message: '',
    }
  }

  for (const condition of event.conditions) {
    if (condition.when(snapshot)) {
      return {
        snapshot: applyEffects(snapshot, condition.effects),
        effects: condition.effects,
        message: condition.message,
      }
    }
  }

  return {
    snapshot,
    effects: { budget: 0, llsx: 0, qhsx: 0 },
    message: event.neutralMessage,
  }
}

function pickEnding(
  techEnding: EndingResult | null,
  bankruptcyEnding: EndingResult | null,
  finalEnding: EndingResult | null,
): EndingResult | null {
  if (techEnding) return techEnding
  if (bankruptcyEnding) return bankruptcyEnding
  if (finalEnding) return finalEnding
  return null
}

export function createHistoryEntry(
  resolution: MonthResolution,
): MonthHistoryEntry {
  return {
    month: resolution.month,
    eventId: resolution.eventId,
    eventTitle: resolution.eventTitle,
    selectedChoiceId: resolution.selectedChoiceId,
    selectedChoiceTitle: resolution.selectedChoiceTitle,
    eventMessage: resolution.eventMessage,
    before: resolution.before,
    directEffects: resolution.directEffects,
    settlement: resolution.settlement,
    after: resolution.after,
    endingTriggered: resolution.endingTriggered,
  }
}

export function resolveMonth(input: ResolveMonthInput): MonthResolution {
  const event = getMonthEvent(input.month)
  if (!event) {
    throw new Error(`Không tìm thấy sự kiện cho tháng ${input.month}`)
  }

  const before = { ...input.snapshot }
  let current = { ...input.snapshot }
  let directEffects: StatEffects = { budget: 0, llsx: 0, qhsx: 0 }
  let eventMessage = ''
  let selectedChoiceId: string | null = null
  let selectedChoiceTitle: string | null = null
  let specialBudgetChange = 0
  let specialMessage: string | null = null
  let revenueAdjustment = 0
  let revenueAdjustmentMessage: string | null = null

  if (isChoiceEvent(event)) {
    const choice = event.choices.find((item) => item.id === input.choiceId)
    if (!choice) {
      throw new Error('Lựa chọn không hợp lệ cho tháng hiện tại')
    }

    selectedChoiceId = choice.id
    selectedChoiceTitle = choice.title
    directEffects = { ...choice.effects }
    current = applyEffects(current, choice.effects)
    eventMessage = choice.logMessage

    const special = resolveSpecialConsequences(
      input.month,
      choice.id,
      current,
    )
    current = special.snapshot
    specialBudgetChange = special.specialBudgetChange
    specialMessage = special.specialMessage
    revenueAdjustment = special.revenueAdjustment
    revenueAdjustmentMessage = special.revenueAdjustmentMessage
  } else if (isAutomaticEvent(event)) {
    const automatic = resolveAutomaticCondition(input.month, current)
    current = automatic.snapshot
    directEffects = automatic.effects
    eventMessage = automatic.message
  } else if (isFinaleEvent(event)) {
    eventMessage =
      'Tháng cuối cùng: hệ thống đánh giá toàn bộ hành trình CNH-HĐH của SmartGarment Việt Nam.'
  }

  let endingTriggered: EndingType | null = null
  let endingReason: string | null = null

  const postEventTechCheck = evaluateImmediateEnding(current)
  if (postEventTechCheck?.type === 'technology_breakdown') {
    endingTriggered = postEventTechCheck.type
    endingReason = postEventTechCheck.reason

    const after = {
      ...current,
      delta: calculateDelta(current.llsx, current.qhsx),
    }

    return {
      month: input.month,
      eventId: event.id,
      eventTitle: event.title,
      selectedChoiceId,
      selectedChoiceTitle,
      eventMessage: [eventMessage, specialMessage, revenueAdjustmentMessage]
        .filter(Boolean)
        .join(' '),
      before,
      directEffects,
      specialBudgetChange,
      specialMessage,
      revenueAdjustment,
      revenueAdjustmentMessage,
      settlement: null,
      after,
      endingTriggered,
      endingReason,
    }
  }

  const postEventBankruptcyCheck = evaluateImmediateEnding(current)
  if (postEventBankruptcyCheck?.type === 'economic_lag') {
    endingTriggered = postEventBankruptcyCheck.type
    endingReason = postEventBankruptcyCheck.reason

    const after = {
      ...current,
      delta: calculateDelta(current.llsx, current.qhsx),
    }

    return {
      month: input.month,
      eventId: event.id,
      eventTitle: event.title,
      selectedChoiceId,
      selectedChoiceTitle,
      eventMessage: [eventMessage, specialMessage, revenueAdjustmentMessage]
        .filter(Boolean)
        .join(' '),
      before,
      directEffects,
      specialBudgetChange,
      specialMessage,
      revenueAdjustment,
      revenueAdjustmentMessage,
      settlement: null,
      after,
      endingTriggered,
      endingReason,
    }
  }

  const settlement = calculateMonthlySettlement({
    ...current,
    revenueAdjustment,
  })

  current = applyEffects(current, {
    budget: settlement.monthlyNet,
    llsx: 0,
    qhsx: 0,
  })

  const postSettlementTechCheck = evaluateImmediateEnding(current)
  const postSettlementBankruptcyCheck =
    postSettlementTechCheck?.type === 'technology_breakdown'
      ? null
      : evaluateImmediateEnding(current)

  let finalEnding: EndingResult | null = null
  if (isFinaleEvent(event)) {
    finalEnding = evaluateFinalEnding(current)
  }

  const ending = pickEnding(
    postSettlementTechCheck?.type === 'technology_breakdown'
      ? postSettlementTechCheck
      : null,
    postSettlementBankruptcyCheck?.type === 'economic_lag'
      ? postSettlementBankruptcyCheck
      : null,
    finalEnding,
  )

  if (ending) {
    endingTriggered = ending.type
    endingReason = ending.reason
  }

  const after = {
    ...current,
    delta: calculateDelta(current.llsx, current.qhsx),
  }

  return {
    month: input.month,
    eventId: event.id,
    eventTitle: event.title,
    selectedChoiceId,
    selectedChoiceTitle,
    eventMessage: [eventMessage, specialMessage, revenueAdjustmentMessage]
      .filter(Boolean)
      .join(' '),
    before,
    directEffects,
    specialBudgetChange,
    specialMessage,
    revenueAdjustment,
    revenueAdjustmentMessage,
    settlement,
    after,
    endingTriggered,
    endingReason,
  }
}

export function createInitialSnapshot(): GameSnapshot {
  return {
    budget: INITIAL_BUDGET,
    llsx: INITIAL_LLSX,
    qhsx: INITIAL_QHSX,
  }
}

export function endingFromResolution(
  resolution: MonthResolution,
): EndingResult | null {
  if (!resolution.endingTriggered) return null

  if (resolution.endingTriggered === 'technology_breakdown') {
    return {
      type: 'technology_breakdown',
      message: TECH_BREAKDOWN_MESSAGE,
      reason: resolution.endingReason,
    }
  }

  if (resolution.endingTriggered === 'sustainable_modernization') {
    return {
      type: 'sustainable_modernization',
      message: VICTORY_MESSAGE,
      reason: resolution.endingReason,
    }
  }

  // Bankruptcy always uses the bankruptcy narrative, including on month 10.
  if (isBankruptcy(resolution.after.budget)) {
    return {
      type: 'economic_lag',
      message: buildBankruptcyMessage(resolution.after.budget),
      reason: resolution.endingReason,
    }
  }

  // Surviving month-10 non-victory states use the adaptive economic-lag fallback.
  if (resolution.month === 10) {
    return evaluateFinalEnding(resolution.after)
  }

  return {
    type: 'economic_lag',
    message: buildBankruptcyMessage(resolution.after.budget),
    reason: resolution.endingReason,
  }
}
