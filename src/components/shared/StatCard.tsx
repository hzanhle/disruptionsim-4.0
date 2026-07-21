import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedNumber } from '@/components/shared/AnimatedNumber'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  subtitle?: string
  value: number
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
  const numberFormat =
    format === 'budget' ? 'budget' : format === 'delta' ? 'signed' : 'plain'

  return (
    <Card className={cn('border transition-colors duration-300', toneClasses[tone])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">{title}</CardTitle>
            {subtitle ? (
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          <Icon className="h-5 w-5 shrink-0 opacity-75" aria-hidden="true" strokeWidth={1.75} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-4xl font-semibold tracking-tight">
          <AnimatedNumber value={value} format={numberFormat} flashOnChange />
        </p>
      </CardContent>
    </Card>
  )
}
