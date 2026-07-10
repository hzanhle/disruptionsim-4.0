import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { calculateDelta } from '@/lib/gameCalculations'
import { factoryVisualUrl } from '@/lib/gameAssets'

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
          icon: AlertCircle,
          tone: 'text-red-300',
        }
      : delta === 2
        ? {
            label: 'Cảnh báo vận hành',
            icon: AlertCircle,
            tone: 'text-amber-300',
          }
        : budget <= 20
          ? {
              label: 'Ngân sách căng thẳng',
              icon: AlertCircle,
              tone: 'text-amber-300',
            }
          : {
              label: 'Vận hành ổn định',
              icon: CheckCircle2,
              tone: 'text-emerald-300',
            }

  const StatusIcon = status.icon

  return (
    <Card className="overflow-hidden">
      <AssetImage
        src={visual}
        alt={`Trạng thái nhà máy: ${status.label}`}
        className="aspect-[16/9] border-b border-slate-800"
      />
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <CardTitle className="text-base">Trạng thái nhà máy</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-300">
        <p className={status.tone}>
          <StatusIcon className="mr-2 inline h-4 w-4" />
          {status.label}
        </p>
        <p>
          LLSX {llsx} · QHSX {qhsx} · Chênh lệch {delta >= 0 ? '+' : ''}
          {delta}
        </p>
        <p>Ngân sách khả dụng: ${budget}</p>
      </CardContent>
    </Card>
  )
}
