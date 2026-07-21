export type GameStatus =
  | 'landing'
  | 'playing'
  | 'report'
  | 'ended'

export type EndingType =
  | 'technology_breakdown'
  | 'economic_lag'
  | 'sustainable_modernization'
  | 'esg_utopia'

export interface StatEffects {
  budget: number
  llsx: number
  qhsx: number
}

export interface ChoiceOption {
  id: string
  title: string
  description: string
  effects: StatEffects
  logMessage: string
  icon: string
}

export interface SpecialConsequence {
  type: 'budget_penalty_if_qhsx_below'
  threshold: number
  budget: number
  message: string
  choiceId: string
}

export interface RevenueAdjustmentConsequence {
  type: 'revenue_adjustment'
  amount: number
  message: string
  choiceId: string
}

export type ChoiceConsequence =
  | SpecialConsequence
  | RevenueAdjustmentConsequence

export interface AutomaticCondition {
  id: string
  when: (state: GameSnapshot) => boolean
  effects: StatEffects
  message: string
}

export interface EventSpeaker {
  id: string
  name: string
  role: string
  dialogue: string
}

export interface ChoiceMonthEvent {
  id: string
  month: number
  type: 'choice'
  title: string
  context: string
  speaker?: EventSpeaker
  choices: ChoiceOption[]
  consequences?: ChoiceConsequence[]
}

export interface AutomaticMonthEvent {
  id: string
  month: number
  type: 'automatic'
  title: string
  context: string
  speaker?: EventSpeaker
  conditions: AutomaticCondition[]
  neutralMessage: string
}

export interface FinaleMonthEvent {
  id: string
  month: number
  type: 'finale'
  title: string
  context: string
  speaker?: EventSpeaker
}

export type MonthEvent = ChoiceMonthEvent | AutomaticMonthEvent | FinaleMonthEvent

export interface GameSnapshot {
  budget: number
  llsx: number
  qhsx: number
}

export interface SettlementLedger {
  baseRevenue: number
  revenueAdjustment: number
  operatingCost: number
  imbalancePenalty: number
  eventBudgetAdjustment: number
  monthlyNet: number
  imbalanceWarning: string | null
}

export interface MonthResolution {
  month: number
  eventId: string
  eventTitle: string
  selectedChoiceId: string | null
  selectedChoiceTitle: string | null
  eventMessage: string
  before: GameSnapshot
  directEffects: StatEffects
  specialBudgetChange: number
  specialMessage: string | null
  revenueAdjustment: number
  revenueAdjustmentMessage: string | null
  settlement: SettlementLedger | null
  after: GameSnapshot & { delta: number }
  endingTriggered: EndingType | null
  endingReason: string | null
}

export interface MonthHistoryEntry {
  month: number
  eventId: string
  eventTitle: string
  selectedChoiceId: string | null
  selectedChoiceTitle: string | null
  eventMessage: string
  before: GameSnapshot
  directEffects: StatEffects
  settlement: SettlementLedger | null
  after: GameSnapshot & { delta: number }
  endingTriggered: EndingType | null
}

export interface EndingResult {
  type: EndingType
  message: string
  reason: string | null
}

export interface PersistedGameState {
  schemaVersion: number
  gameStatus: GameStatus
  currentMonth: number
  budget: number
  llsx: number
  qhsx: number
  history: MonthHistoryEntry[]
  currentResolution: MonthResolution | null
  pendingChoiceId: string | null
  choiceLocked: boolean
  ending: EndingResult | null
  soundEnabled: boolean
}
