import { useState } from 'react'
import { motion } from 'framer-motion'
import { Film, RotateCcw, ScrollText, Sparkles, Trophy, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { MetricRow } from '@/components/shared/MetricChip'
import { calculateDelta } from '@/lib/gameCalculations'
import { characterUrl, endingImageUrl } from '@/lib/gameAssets'
import { CinematicEndingModal } from '@/components/game/CinematicEndingModal'
import {
  getMotionProps,
  scaleIn,
  staggerContainer,
  staggerItem,
} from '@/lib/motion'
import { playSound } from '@/lib/soundManager'
import { useGameStore } from '@/store/gameStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { EndingType } from '@/types/game'

const endingMeta: Record<
  EndingType,
  { title: string; status: string; tone: string; icon: typeof Trophy }
> = {
  esg_utopia: {
    title: 'Kỷ nguyên Tự động hóa Toàn phần & ESG Tiên phong',
    status: 'SECRET ENDING TOÀN DIỆN 🏆',
    tone: 'border-yellow-400/60 bg-amber-950/40 text-yellow-300 shadow-xl shadow-yellow-500/20',
    icon: Sparkles,
  },
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
  const motionProps = getMotionProps(reducedMotion)
  const [showVideoModal, setShowVideoModal] = useState(false)

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
    <div className="bg-transparent px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div variants={scaleIn} {...motionProps}>
          <Card className={`overflow-hidden pb-3 ${meta.tone}`}>
            <AssetImage
              src={hero}
              alt={meta.title}
              fit="cover"
              inset
              className="aspect-video w-full"
            />
            <CardHeader className="px-4 pt-4">
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
            <CardContent className="space-y-4 px-4 pb-1 text-base leading-relaxed text-pretty">
              <p>{ending.message}</p>
              {ending.reason ? (
                <p className="text-sm opacity-80 sm:text-base">Lý do: {ending.reason}</p>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chỉ số cuối cùng</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="grid gap-2.5 sm:grid-cols-2"
              variants={staggerContainer}
              {...motionProps}
            >
              <motion.div variants={staggerItem}>
                <MetricRow kind="budget" label="Ngân sách" value={`$${budget}`} />
              </motion.div>
              <motion.div variants={staggerItem}>
                <MetricRow kind="llsx" label="LLSX" value={llsx} />
              </motion.div>
              <motion.div variants={staggerItem}>
                <MetricRow kind="qhsx" label="QHSX" value={qhsx} />
              </motion.div>
              <motion.div variants={staggerItem}>
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
              </motion.div>
              <motion.div variants={staggerItem} className="sm:col-span-2">
                <MetricRow
                  kind="months"
                  label="Số tháng hoàn thành"
                  value={history.length}
                />
              </motion.div>
            </motion.div>
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
                  <p className="mt-0.5 text-sm text-slate-400 sm:text-base">
                    {entry.eventMessage}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-slate-900/80 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-cyan-400">
                <AssetImage
                  src={characterUrl('player-director')}
                  alt="Giám đốc Nguyễn Văn Minh"
                  fit="cover"
                  className="h-full w-full"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Lời kết của Giám đốc Nguyễn Văn Minh</h4>
                <p className="text-sm italic leading-relaxed text-slate-200">
                  {ending.type === 'sustainable_modernization'
                    ? '“SmartGarment Việt Nam đã vươn mình thành công nghiệp hóa hiện đại hóa bền vững nhờ sự phối hợp đồng bộ giữa công nghệ AI và kỹ năng công nhân!”'
                    : ending.type === 'technology_breakdown'
                    ? '“Chúng ta đã quá vội vã chạy theo công nghệ khi trình độ quản lý và công nhân chưa sẵn sàng, dẫn đến đứt gãy đáng tiếc.”'
                    : '“Thận trọng quá mức khiến nhà máy tụt hậu so với dòng chảy chuyển đổi số toàn cầu. Lần sau chúng ta sẽ làm tốt hơn!”'}
                </p>
              </div>
            </div>
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
          <Button size="lg" variant="outline" onClick={() => setShowVideoModal(true)}>
            <Film className="h-4 w-4 text-cyan-400" />
            Xem lại Video AI Kết cục
          </Button>
        </div>

        <CinematicEndingModal
          ending={ending}
          open={showVideoModal}
          onClose={() => setShowVideoModal(false)}
        />
      </div>
    </div>
  )
}
