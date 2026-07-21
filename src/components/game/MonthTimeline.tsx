import { motion } from 'framer-motion'
import { cn, formatBudget, formatSigned } from '@/lib/utils'
import { TOTAL_MONTHS } from '@/lib/constants'
import { microTransition, easeOutSoft } from '@/lib/motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { MonthHistoryEntry } from '@/types/game'

type MonthOutcome = 'breakdown' | 'lag' | 'warning' | 'gain' | 'loss' | 'ok' | 'current' | 'upcoming'

function getOutcome(entry: MonthHistoryEntry | undefined): MonthOutcome {
  if (!entry) return 'upcoming'
  if (entry.endingTriggered === 'technology_breakdown') return 'breakdown'
  if (entry.endingTriggered === 'economic_lag') return 'lag'
  if (
    entry.after.delta >= 2 ||
    (entry.settlement?.imbalancePenalty ?? 0) > 0
  ) {
    return 'warning'
  }
  const net = entry.settlement?.monthlyNet ?? 0
  if (net > 0) return 'gain'
  if (net < 0) return 'loss'
  return 'ok'
}

const outcomeStyles: Record<MonthOutcome, string> = {
  breakdown: 'border-red-500/60 bg-red-950/35 text-red-200',
  lag: 'border-amber-500/55 bg-amber-950/30 text-amber-200',
  warning: 'border-amber-500/45 bg-amber-950/20 text-amber-200',
  gain: 'border-emerald-500/45 bg-emerald-950/25 text-emerald-200',
  loss: 'border-rose-500/40 bg-rose-950/20 text-rose-200',
  ok: 'border-emerald-500/30 bg-emerald-950/15 text-emerald-300',
  current: 'border-cyan-500/55 bg-cyan-950/25 text-cyan-100 ring-1 ring-cyan-400/30',
  upcoming: 'border-slate-800 bg-slate-900/40 text-slate-500',
}

const outcomeLabel: Record<MonthOutcome, string> = {
  breakdown: 'Đứt gãy công nghệ',
  lag: 'Tụt hậu kinh tế',
  warning: 'Có cảnh báo mất cân bằng',
  gain: 'Tháng lãi / tiến triển',
  loss: 'Tháng lỗ ngân sách',
  ok: 'Hoàn thành ổn định',
  current: 'Đang diễn ra',
  upcoming: 'Chưa tới',
}

interface MonthTimelineProps {
  currentMonth: number
  history: MonthHistoryEntry[]
}

export function MonthTimeline({ currentMonth, history }: MonthTimelineProps) {
  const reduced = useReducedMotion()
  const byMonth = new Map(history.map((entry) => [entry.month, entry]))
  const latestCompleted = history.length
    ? Math.max(...history.map((entry) => entry.month))
    : 0

  return (
    <TooltipProvider delayDuration={120}>
      <ol
        className="grid grid-cols-5 gap-2 sm:grid-cols-10"
        aria-label="Dòng thời gian 10 tháng"
      >
        {Array.from({ length: TOTAL_MONTHS }, (_, index) => {
          const month = index + 1
          const entry = byMonth.get(month)
          const isCurrent = month === currentMonth && !entry
          const isLatestDone = month === latestCompleted && Boolean(entry)
          const outcome: MonthOutcome = isCurrent
            ? 'current'
            : entry
              ? getOutcome(entry)
              : 'upcoming'

          return (
            <li key={month}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    className={cn(
                      'w-full rounded-lg border px-2 py-2 text-center text-xs font-medium tabular-nums sm:text-sm',
                      outcomeStyles[outcome],
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Tháng ${month}: ${outcomeLabel[outcome]}`}
                    initial={false}
                    animate={
                      !reduced && isLatestDone
                        ? { scale: [1, 1.08, 1] }
                        : { scale: 1 }
                    }
                    transition={
                      !reduced && isLatestDone
                        ? { duration: 0.45, ease: easeOutSoft, times: [0, 0.4, 1] }
                        : microTransition
                    }
                  >
                    <span aria-hidden="true">T{month}</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="space-y-1.5">
                  <p className="font-semibold text-slate-50">Tháng {month}</p>
                  <p className="text-slate-300">{outcomeLabel[outcome]}</p>
                  {entry ? (
                    <>
                      <p className="text-slate-400">{entry.eventTitle}</p>
                      <p className="text-slate-300">
                        {entry.selectedChoiceTitle ?? 'Sự kiện tự động'}
                      </p>
                      <p className="font-mono text-xs text-slate-400">
                        Ngân sách {formatBudget(entry.after.budget)} · LLSX{' '}
                        {entry.after.llsx} · QHSX {entry.after.qhsx} · Delta{' '}
                        {formatSigned(entry.after.delta)}
                        {entry.settlement
                          ? ` · Ròng ${formatSigned(entry.settlement.monthlyNet, '$')}`
                          : ''}
                      </p>
                    </>
                  ) : isCurrent ? (
                    <p className="text-slate-400">Đang chờ quyết định tháng này.</p>
                  ) : (
                    <p className="text-slate-400">Tháng chưa diễn ra.</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </li>
          )
        })}
      </ol>
    </TooltipProvider>
  )
}

