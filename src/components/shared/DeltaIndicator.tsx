import { AlertTriangle, Scale } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedNumber } from '@/components/shared/AnimatedNumber'
import { signedTone } from '@/components/shared/MetricChip'
import { cn } from '@/lib/utils'

interface DeltaIndicatorProps {
  delta: number
}

export function DeltaIndicator({ delta }: DeltaIndicatorProps) {
  const isWarning = delta === 2
  const isBreakdown = delta >= 3
  const isBalanced = delta === 0

  return (
    <Card
      className={cn(
        'border transition-all duration-500',
        isBreakdown && 'border-red-500/70 bg-red-950/30 shadow-[0_0_35px_rgba(239,68,68,0.45)] animate-pulse',
        isWarning && 'border-amber-500/60 bg-amber-950/25 shadow-[0_0_30px_rgba(245,158,11,0.35)]',
        isBalanced && 'border-emerald-500/40 bg-emerald-950/15 shadow-[0_0_20px_rgba(52,211,153,0.2)]',
        !isBreakdown && !isWarning && !isBalanced && 'border-slate-700/80',
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {isWarning || isBreakdown ? (
            <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
          ) : (
            <Scale className="h-5 w-5 text-slate-300" aria-hidden="true" />
          )}
          <CardTitle className="text-lg">Chênh lệch LLSX - QHSX</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className={cn('font-mono text-4xl font-semibold', signedTone(delta))}>
          <AnimatedNumber value={delta} format="signed" flashOnChange />
        </p>
        <p className="text-base leading-relaxed text-slate-300">
          {isBreakdown
            ? 'Nguy cơ đứt gãy công nghệ. QHSX quá thấp so với LLSX.'
            : isWarning
              ? 'Cảnh báo: LLSX và QHSX đang lệch nhau, có thể phát sinh hao hụt vận hành.'
              : isBalanced
                ? 'Cân bằng tốt giữa công nghệ và quan hệ sản xuất.'
                : delta > 0
                  ? 'LLSX cao hơn QHSX: cần nâng năng lực con người và quản trị.'
                  : 'QHSX cao hơn LLSX: có thể tận dụng để đầu tư thêm công nghệ.'}
        </p>
      </CardContent>
    </Card>
  )
}
