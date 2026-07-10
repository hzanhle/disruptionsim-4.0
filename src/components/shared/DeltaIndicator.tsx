import { AlertTriangle, Scale } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { deltaBadgeUrl, deltaConceptUrl } from '@/lib/gameAssets'
import { cn, formatSigned } from '@/lib/utils'

interface DeltaIndicatorProps {
  delta: number
}

export function DeltaIndicator({ delta }: DeltaIndicatorProps) {
  const isWarning = delta === 2
  const isBreakdown = delta >= 3
  const isBalanced = delta === 0
  const badge = deltaBadgeUrl(delta)
  const concept = deltaConceptUrl(delta)

  return (
    <Card
      className={cn(
        'overflow-hidden border',
        isBreakdown && 'border-red-500/50 bg-red-950/20',
        isWarning && 'border-amber-500/50 bg-amber-950/20',
        isBalanced && 'border-emerald-500/30 bg-emerald-950/10',
        !isBreakdown && !isWarning && !isBalanced && 'border-slate-700',
      )}
    >
      <div className="grid gap-0 md:grid-cols-[1fr_0.9fr]">
        <div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {badge ? (
                <img src={badge} alt="" className="h-8 w-8 object-contain" />
              ) : isWarning || isBreakdown ? (
                <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              ) : (
                <Scale className="h-5 w-5 text-slate-300" aria-hidden="true" />
              )}
              <CardTitle className="text-base">Chênh lệch LLSX − QHSX</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{formatSigned(delta)}</p>
            <p className="text-sm text-slate-300">
              {isBreakdown
                ? 'Nguy cơ đứt gãy công nghệ! QHSX quá thấp so với LLSX.'
                : isWarning
                  ? 'Cảnh báo: LLSX và QHSX đang lệch nhau, có thể phát sinh hao hụt vận hành.'
                  : isBalanced
                    ? 'Cân bằng tốt giữa công nghệ và quan hệ sản xuất.'
                    : delta > 0
                      ? 'LLSX cao hơn QHSX — cần nâng năng lực con người và quản trị.'
                      : 'QHSX cao hơn LLSX — có thể tận dụng để đầu tư thêm công nghệ.'}
            </p>
          </CardContent>
        </div>
        <AssetImage
          src={concept}
          alt="Minh họa chênh lệch LLSX và QHSX"
          className="min-h-40 border-t border-slate-800 md:border-l md:border-t-0"
        />
      </div>
    </Card>
  )
}
