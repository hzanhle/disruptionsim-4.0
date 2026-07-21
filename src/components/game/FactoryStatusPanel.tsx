import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { calculateDelta } from '@/lib/gameCalculations'
import { factoryVisualUrl } from '@/lib/gameAssets'
import { cn } from '@/lib/utils'

interface FactoryStatusProps {
  budget: number
  llsx: number
  qhsx: number
}

export function FactoryStatusPanel({ budget, llsx, qhsx }: FactoryStatusProps) {
  const delta = calculateDelta(llsx, qhsx)
  const visual = factoryVisualUrl({ budget, llsx, qhsx, delta })

  const status =
    delta >= 3
      ? {
          label: 'Nguy cơ đứt gãy',
          detail: 'Chênh lệch LLSX - QHSX đã vượt ngưỡng an toàn. Cần cân bằng ngay.',
          icon: AlertCircle,
          tone: 'text-red-300',
          box: 'border-red-500/40 bg-red-950/25',
        }
      : delta === 2
        ? {
            label: 'Cảnh báo vận hành',
            detail: 'Chênh lệch = 2: tháng này có thể phát sinh phạt mất cân bằng.',
            icon: AlertCircle,
            tone: 'text-amber-300',
            box: 'border-amber-500/40 bg-amber-950/20',
          }
        : budget <= 20
          ? {
              label: 'Ngân sách căng thẳng',
              detail: 'Ngân sách thấp. Hạn chế lựa chọn tốn kém trong tháng tới.',
              icon: AlertCircle,
              tone: 'text-amber-300',
              box: 'border-amber-500/40 bg-amber-950/20',
            }
          : {
              label: 'Vận hành ổn định',
              detail: 'Công nghệ và quan hệ sản xuất đang trong ngưỡng an toàn.',
              icon: CheckCircle2,
              tone: 'text-emerald-300',
              box: 'border-emerald-500/30 bg-emerald-950/15',
            }

  const StatusIcon = status.icon

  return (
    <Card className="overflow-hidden pb-3">
      <AssetImage
        src={visual}
        alt={`Trạng thái nhà máy: ${status.label}`}
        fit="cover"
        inset
        className="aspect-video w-full"
      />
      <CardHeader className="px-4 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <CardTitle className="text-lg">Trạng thái nhà máy</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-1">
        <div className={cn('rounded-xl border px-3 py-3', status.box)}>
          <p className={cn('flex items-center gap-2 text-base font-semibold', status.tone)}>
            <StatusIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {status.label}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{status.detail}</p>
        </div>
      </CardContent>
    </Card>
  )
}
