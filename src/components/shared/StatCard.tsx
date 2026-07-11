import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatBudget, formatSigned } from '@/lib/utils'

interface StatCardProps {
  title: string
  subtitle?: string
  value: number | string
  icon: LucideIcon
  tone?: 'budget' | 'llsx' | 'qhsx' | 'neutral'
  format?: 'budget' | 'level' | 'delta'
}

const toneClasses = {
  budget: 'border-emerald-500/30 text-emerald-300',
  llsx: 'border-cyan-500/30 text-cyan-300',
  qhsx: 'border-violet-500/30 text-violet-300',
  neutral: 'border-slate-600 text-slate-200',
}

export function StatCard({
  title,
  subtitle,
  value,
  icon: Icon,
  tone = 'neutral',
  format = 'level',
}: StatCardProps) {
  const displayValue =
    typeof value === 'number'
      ? format === 'budget'
        ? formatBudget(value)
        : format === 'delta'
          ? formatSigned(value)
          : String(value)
      : value

  return (
    <Card className={cn('border', toneClasses[tone])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {subtitle ? (
              <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{displayValue}</p>
      </CardContent>
    </Card>
  )
}
