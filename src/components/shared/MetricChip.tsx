import type { ReactNode } from 'react'
import { cn, formatBudget, formatCurrency, formatSigned } from '@/lib/utils'

export type MetricKind = 'budget' | 'llsx' | 'qhsx' | 'delta' | 'months'

/** Brand colors for each core metric — keep consistent across the app. */
export const metricTone = {
  budget: {
    label: 'text-emerald-300/90',
    value: 'text-emerald-300',
    chip: 'border-emerald-500/35 bg-emerald-950/40 text-emerald-200',
    soft: 'text-emerald-400',
  },
  llsx: {
    label: 'text-cyan-300/90',
    value: 'text-cyan-300',
    chip: 'border-cyan-500/35 bg-cyan-950/40 text-cyan-200',
    soft: 'text-cyan-400',
  },
  qhsx: {
    label: 'text-violet-300/90',
    value: 'text-violet-300',
    chip: 'border-violet-500/35 bg-violet-950/40 text-violet-200',
    soft: 'text-violet-400',
  },
  delta: {
    label: 'text-slate-300',
    value: 'text-slate-100',
    chip: 'border-slate-600/50 bg-slate-900/70 text-slate-200',
    soft: 'text-slate-300',
  },
  months: {
    label: 'text-slate-300',
    value: 'text-slate-100',
    chip: 'border-slate-600/50 bg-slate-900/70 text-slate-200',
    soft: 'text-slate-300',
  },
} as const

export function signedTone(value: number): string {
  if (value > 0) return 'text-emerald-400'
  if (value < 0) return 'text-red-400'
  return 'text-slate-400'
}

interface MetricChipProps {
  kind: MetricKind
  label: string
  value: number
  /** Show signed format (+1 / +$30) instead of absolute */
  signed?: boolean
  /** Format as money when signed (+$25 / -$25) */
  currency?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'gap-1 px-2.5 py-2 text-sm',
  md: 'gap-1.5 px-3 py-2.5 text-base',
  lg: 'gap-2 px-3.5 py-3 text-lg',
}

/**
 * Colored metric pill — label in metric brand color, value green/red when signed.
 */
export function MetricChip({
  kind,
  label,
  value,
  signed = false,
  currency = false,
  className,
  size = 'md',
}: MetricChipProps) {
  const display = signed
    ? currency
      ? formatCurrency(value)
      : formatSigned(value)
    : kind === 'budget' || currency
      ? formatBudget(value)
      : String(value)

  const valueClass = signed ? signedTone(value) : metricTone[kind].value

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col rounded-xl border font-medium leading-tight',
        sizeClasses[size],
        metricTone[kind].chip,
        className,
      )}
    >
      <span className={cn('text-[0.7em] font-semibold uppercase tracking-wide', metricTone[kind].label)}>
        {label}
      </span>
      <span className={cn('font-mono text-lg font-semibold tabular-nums sm:text-2xl', valueClass, size === 'lg' && 'text-2xl')}>
        {display}
      </span>
    </div>
  )
}

interface MetricRowProps {
  kind: MetricKind
  label: string
  value: ReactNode
  valueClassName?: string
  className?: string
}

/** Label + large value row for ending / report summaries */
export function MetricRow({
  kind,
  label,
  value,
  valueClassName,
  className,
}: MetricRowProps) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-3 rounded-xl border px-3 py-3',
        metricTone[kind].chip,
        className,
      )}
    >
      <span className={cn('text-sm font-semibold sm:text-base', metricTone[kind].label)}>
        {label}
      </span>
      <span
        className={cn(
          'font-mono text-xl font-semibold tabular-nums sm:text-2xl',
          metricTone[kind].value,
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  )
}
