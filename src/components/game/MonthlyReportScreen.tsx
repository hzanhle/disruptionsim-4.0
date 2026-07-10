import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TOTAL_MONTHS } from '@/lib/constants'
import { formatSigned } from '@/lib/utils'
import { playSound } from '@/lib/soundManager'
import { useGameStore } from '@/store/gameStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function MonthlyReportScreen() {
  const reducedMotion = useReducedMotion()
  const resolution = useGameStore((state) => state.currentResolution)
  const ending = useGameStore((state) => state.ending)
  const advanceMonth = useGameStore((state) => state.advanceMonth)
  const viewEndingFromReport = useGameStore((state) => state.viewEndingFromReport)

  if (!resolution) return null

  const settlement = resolution.settlement
  const isFinalMonth = resolution.month === TOTAL_MONTHS

  const handleContinue = () => {
    playSound('settlement')
    if (ending) {
      if (ending.type === 'sustainable_modernization') {
        playSound('victory')
      } else {
        playSound('defeat')
      }
      viewEndingFromReport()
      return
    }
    advanceMonth()
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold">Báo cáo tháng {resolution.month}</h1>
            <p className="text-slate-400">{resolution.eventTitle}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kết quả sự kiện</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            {resolution.selectedChoiceTitle ? (
              <p>Lựa chọn: {resolution.selectedChoiceTitle}</p>
            ) : (
              <p>Sự kiện tự động</p>
            )}
            <p>{resolution.eventMessage}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sổ cái quyết toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Ngân sách đầu tháng" value={`$${resolution.before.budget}`} />
            <Row
              label="Tác động trực tiếp sự kiện"
              value={formatSigned(resolution.directEffects.budget, '$')}
            />
            {resolution.specialBudgetChange !== 0 ? (
              <Row
                label="Hệ quả đặc biệt"
                value={formatSigned(resolution.specialBudgetChange, '$')}
              />
            ) : null}
            {settlement ? (
              <>
                <Row label="Doanh thu cơ bản" value={`+$${settlement.baseRevenue}`} positive />
                {settlement.revenueAdjustment !== 0 ? (
                  <Row
                    label="Điều chỉnh doanh thu"
                    value={formatSigned(settlement.revenueAdjustment, '$')}
                    positive={settlement.revenueAdjustment > 0}
                  />
                ) : null}
                <Row label="Chi phí vận hành" value={`-$${settlement.operatingCost}`} />
                {settlement.imbalancePenalty > 0 ? (
                  <Row
                    label="Phạt mất cân bằng"
                    value={`-$${settlement.imbalancePenalty}`}
                  />
                ) : null}
                <Row
                  label="Thay đổi ròng tháng"
                  value={formatSigned(settlement.monthlyNet, '$')}
                  positive={settlement.monthlyNet >= 0}
                />
              </>
            ) : (
              <p className="text-amber-300">
                Quyết toán tháng bị dừng do kích hoạt kết cục ngay lập tức.
              </p>
            )}
            <Row label="Ngân sách cuối tháng" value={`$${resolution.after.budget}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chỉ số sau tháng</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
            <p>LLSX: {resolution.before.llsx} → {resolution.after.llsx}</p>
            <p>QHSX: {resolution.before.qhsx} → {resolution.after.qhsx}</p>
            <p>Chênh lệch: {formatSigned(resolution.after.delta)}</p>
          </CardContent>
        </Card>

        {settlement?.imbalanceWarning ? (
          <Card className="border-amber-500/40 bg-amber-950/10">
            <CardContent className="p-5 text-sm text-amber-200">
              {settlement.imbalanceWarning}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-5 text-sm leading-relaxed text-slate-300">
            {ending
              ? 'Tháng này kích hoạt kết cục. Hãy xem tổng kết để hiểu bài học từ hành trình của bạn.'
              : 'Mỗi quyết định đều phản ánh mối quan hệ biện chứng giữa LLSX và QHSX. Tiếp tục theo dõi chênh lệch để tránh đứt gãy hoặc tụt hậu.'}
          </CardContent>
        </Card>

        <Button size="lg" onClick={handleContinue}>
          {isFinalMonth || ending ? 'Xem tổng kết' : 'Sang tháng tiếp theo'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )
}

function Row({
  label,
  value,
  positive,
}: {
  label: string
  value: string
  positive?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 py-2 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span
        className={
          positive === undefined
            ? 'text-slate-100'
            : positive
              ? 'text-emerald-300'
              : 'text-red-300'
        }
      >
        {value}
      </span>
    </div>
  )
}
