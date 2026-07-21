import { motion } from 'framer-motion'
import { RotateCcw, ScrollText, Trophy, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { MetricRow } from '@/components/shared/MetricChip'
import { calculateDelta } from '@/lib/gameCalculations'
import { endingImageUrl } from '@/lib/gameAssets'
import { playSound } from '@/lib/soundManager'
import { useGameStore } from '@/store/gameStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { EndingType } from '@/types/game'

const endingMeta: Record<
  EndingType,
  { title: string; status: string; tone: string; icon: typeof Trophy }
> = {
  sustainable_modernization: {
    title: 'CNH-HĐH Bền vững',
    status: 'Chiến thắng',
    tone: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
    icon: Trophy,
  },
  technology_breakdown: {
    title: 'Đứt gãy công nghệ',
    status: 'Thất bại',
    tone: 'border-red-500/40 bg-red-950/20 text-red-200',
    icon: XCircle,
  },
  economic_lag: {
    title: 'Tụt hậu kinh tế',
    status: 'Thất bại',
    tone: 'border-amber-500/40 bg-amber-950/20 text-amber-200',
    icon: XCircle,
  },
}

export function EndingScreen() {
  const reducedMotion = useReducedMotion()
  const ending = useGameStore((state) => state.ending)
  const budget = useGameStore((state) => state.budget)
  const llsx = useGameStore((state) => state.llsx)
  const qhsx = useGameStore((state) => state.qhsx)
  const history = useGameStore((state) => state.history)
  const resetGame = useGameStore((state) => state.resetGame)
  const reviewJourney = useGameStore((state) => state.reviewJourney)
  if (!ending) return null

  const meta = endingMeta[ending.type]
  const Icon = meta.icon
  const delta = calculateDelta(llsx, qhsx)
  const hero = endingImageUrl(ending.type)

  const handleReplay = () => {
    playSound('click')
    resetGame()
  }

  const handleReview = () => {
    playSound('click')
    reviewJourney()
  }

  return (
    <div className="min-h-[100dvh] bg-transparent px-4 py-8 text-slate-100 sm:px-6">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl space-y-6"
      >
        <Card className={`overflow-hidden p-3 ${meta.tone}`}>
          <AssetImage
            src={hero}
            alt={meta.title}
            fit="cover"
            className="aspect-video max-h-52 rounded-xl ring-1 ring-inset ring-white/10"
          />
          <CardHeader className="px-1 pt-4">
            <div className="flex items-center gap-3">
              <Icon className="h-8 w-8" strokeWidth={1.75} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
                  {meta.status}
                </p>
                <CardTitle className="mt-1 text-2xl tracking-tight text-balance">
                  {meta.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-1 pb-1 text-base leading-relaxed text-pretty">
            <p>{ending.message}</p>
            {ending.reason ? (
              <p className="text-sm opacity-80 sm:text-base">Lý do: {ending.reason}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chỉ số cuối cùng</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2.5 sm:grid-cols-2">
            <MetricRow kind="budget" label="Ngân sách" value={`$${budget}`} />
            <MetricRow kind="llsx" label="LLSX" value={llsx} />
            <MetricRow kind="qhsx" label="QHSX" value={qhsx} />
            <MetricRow
              kind="delta"
              label="Chênh lệch"
              value={delta >= 0 ? `+${delta}` : String(delta)}
              valueClassName={
                delta > 0
                  ? 'text-emerald-300'
                  : delta < 0
                    ? 'text-red-300'
                    : undefined
              }
            />
            <MetricRow
              kind="months"
              label="Số tháng hoàn thành"
              value={history.length}
              className="sm:col-span-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              <CardTitle className="text-base">Dòng thời gian lựa chọn</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-base text-slate-300">
              {history.map((entry) => (
                <li key={entry.month} className="border-l-2 border-slate-700 pl-3">
                  <p className="font-medium text-slate-100">
                    Tháng {entry.month}: {entry.selectedChoiceTitle ?? 'Sự kiện tự động'}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400 sm:text-base">{entry.eventMessage}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-base leading-relaxed text-slate-300">
            Bài học triết học: Quan hệ sản xuất phải phù hợp với trình độ phát triển của lực
            lượng sản xuất. Phát triển công nghệ mà thiếu con người và quản trị sẽ dẫn tới đứt
            gãy; bảo thủ quá mức sẽ khiến doanh nghiệp tụt hậu.
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={handleReplay}>
            <RotateCcw className="h-4 w-4" />
            Chơi lại từ đầu
          </Button>
          <Button size="lg" variant="secondary" onClick={handleReview}>
            Xem lại hành trình
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
