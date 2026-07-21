import { cn } from '@/lib/utils'
import { TOTAL_MONTHS } from '@/lib/constants'

interface MonthTimelineProps {
  currentMonth: number
  completedMonths: number[]
}

export function MonthTimeline({ currentMonth, completedMonths }: MonthTimelineProps) {
  return (
    <ol className="grid grid-cols-5 gap-2 sm:grid-cols-10" aria-label="Dòng thời gian 10 tháng">
      {Array.from({ length: TOTAL_MONTHS }, (_, index) => {
        const month = index + 1
        const isCompleted = completedMonths.includes(month)
        const isCurrent = month === currentMonth
        const status = isCompleted
          ? 'đã hoàn thành'
          : isCurrent
            ? 'đang diễn ra'
            : 'chưa tới'

        return (
          <li
            key={month}
            className={cn(
              'rounded-lg border px-2 py-2 text-center text-xs font-medium tabular-nums transition-colors duration-300 sm:text-sm',
              isCompleted && 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
              isCurrent && !isCompleted && 'border-cyan-500/50 bg-cyan-950/20 text-cyan-200',
              !isCompleted && !isCurrent && 'border-slate-800 bg-slate-900/40 text-slate-500',
            )}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span aria-hidden="true">T{month}</span>
            <span className="sr-only">
              Tháng {month}, {status}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
