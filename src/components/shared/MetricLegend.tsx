import { metricTone } from '@/components/shared/MetricChip'
import { cn } from '@/lib/utils'

const items = [
  { key: 'budget' as const, label: 'Ngân sách' },
  { key: 'llsx' as const, label: 'LLSX' },
  { key: 'qhsx' as const, label: 'QHSX' },
]

interface MetricLegendProps {
  className?: string
}

/** Fixed color key for Ngân sách / LLSX / QHSX */
export function MetricLegend({ className }: MetricLegendProps) {
  return (
    <ul
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300',
        className,
      )}
      aria-label="Chú thích màu chỉ số"
    >
      {items.map((item) => (
        <li key={item.key} className="inline-flex items-center gap-2">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 ring-offset-slate-950',
              item.key === 'budget' && 'bg-emerald-400 ring-emerald-400/30',
              item.key === 'llsx' && 'bg-cyan-400 ring-cyan-400/30',
              item.key === 'qhsx' && 'bg-violet-400 ring-violet-400/30',
            )}
            aria-hidden="true"
          />
          <span className={cn('font-medium', metricTone[item.key].label)}>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
