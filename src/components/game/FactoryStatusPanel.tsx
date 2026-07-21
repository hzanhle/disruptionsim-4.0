import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { MetricChip } from '@/components/shared/MetricChip'
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
    <Card className="p-3">
      <AssetImage
        src={visual}
        alt={`Trạng thái nhà máy: ${status.label}`}
        fit="cover"
        className="aspect-[2/1] max-h-36 rounded-xl ring-1 ring-inset ring-slate-700/50"
      />
      <CardHeader className="px-1 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <CardTitle className="text-lg">Trạng thái nhà máy</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-1 pb-1">
        <p className={`text-base font-medium ${status.tone}`}>
          <StatusIcon className="mr-2 inline h-5 w-5" />
          {status.label}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          <MetricChip kind="llsx" label="LLSX" value={llsx} size="md" />
          <MetricChip kind="qhsx" label="QHSX" value={qhsx} size="md" />
          <MetricChip kind="delta" label="Chênh lệch" value={delta} signed size="md" />
          <MetricChip kind="budget" label="Ngân sách" value={budget} size="md" />
        </div>
      </CardContent>
    </Card>
  )
}
