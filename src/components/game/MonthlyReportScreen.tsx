import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TOTAL_MONTHS } from '@/lib/constants'
import { formatSigned } from '@/lib/utils'
import { MetricRow, signedTone } from '@/components/shared/MetricChip'
import { playSound } from '@/lib/soundManager'
import { useGameStore } from '@/store/gameStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  easeOutSoft,
  getMotionProps,
  staggerContainer,
  staggerItem,
} from '@/lib/motion'

export function MonthlyReportScreen() {
  const reducedMotion = useReducedMotion()
  const resolution = useGameStore((state) => state.currentResolution)
  const ending = useGameStore((state) => state.ending)
  const advanceMonth = useGameStore((state) => state.advanceMonth)
  const viewEndingFromReport = useGameStore((state) => state.viewEndingFromReport)
  const motionProps = getMotionProps(reducedMotion)

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

  const ledgerRows: Array<{
    key: string
    label: string
    value: string
    signed?: number
    tone?: 'budget' | 'llsx' | 'qhsx'
  }> = [
    {
      key: 'start',
      label: 'Ngân sách đầu tháng',
      value: `$${resolution.before.budget}`,
      tone: 'budget',
    },
    {
      key: 'direct',
      label: 'Tác động trực tiếp sự kiện',
      value: formatSigned(resolution.directEffects.budget, '$'),
      signed: resolution.directEffects.budget,
    },
  ]

  if (resolution.specialBudgetChange !== 0) {
    ledgerRows.push({
      key: 'special',
      label: 'Hệ quả đặc biệt',
      value: formatSigned(resolution.specialBudgetChange, '$'),
      signed: resolution.specialBudgetChange,
    })
  }

  if (settlement) {
    ledgerRows.push({
      key: 'revenue',
      label: 'Doanh thu cơ bản',
      value: `+$${settlement.baseRevenue}`,
      signed: settlement.baseRevenue,
    })
    if (settlement.revenueAdjustment !== 0) {
      ledgerRows.push({
        key: 'revAdj',
        label: 'Điều chỉnh doanh thu',
        value: formatSigned(settlement.revenueAdjustment, '$'),
        signed: settlement.revenueAdjustment,
      })
    }
    ledgerRows.push({
      key: 'cost',
      label: 'Chi phí vận hành',
      value: `-$${settlement.operatingCost}`,
      signed: -settlement.operatingCost,
    })
    if (settlement.imbalancePenalty > 0) {
      ledgerRows.push({
        key: 'penalty',
        label: 'Phạt mất cân bằng',
        value: `-$${settlement.imbalancePenalty}`,
        signed: -settlement.imbalancePenalty,
      })
    }
    ledgerRows.push({
      key: 'net',
      label: 'Thay đổi ròng tháng',
      value: formatSigned(settlement.monthlyNet, '$'),
      signed: settlement.monthlyNet,
    })
  }

  ledgerRows.push({
    key: 'end',
    label: 'Ngân sách cuối tháng',
    value: `$${resolution.after.budget}`,
    tone: 'budget',
  })

  return (
    <div className="bg-transparent px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-cyan-400" strokeWidth={1.75} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Báo cáo tháng {resolution.month}
            </h1>
            <p className="text-base text-slate-400">{resolution.eventTitle}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kết quả sự kiện</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-base text-slate-300">
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
            <CardTitle className="text-lg">Sổ cái quyết toán</CardTitle>
          </CardHeader>
          <CardContent className="text-base">
            {settlement ? null : (
              <p className="mb-3 text-base text-amber-300">
                Quyết toán tháng bị dừng do kích hoạt kết cục ngay lập tức.
              </p>
            )}
            <motion.div
              className="space-y-1"
              variants={staggerContainer}
              {...motionProps}
            >
              {ledgerRows.map((row) => (
                <motion.div key={row.key} variants={staggerItem}>
                  <Row
                    label={row.label}
                    value={row.value}
                    signed={row.signed}
                    tone={row.tone}
                  />
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chỉ số sau tháng</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2.5 sm:grid-cols-2">
            <MetricRow
              kind="llsx"
              label="LLSX"
              value={`${resolution.before.llsx} → ${resolution.after.llsx}`}
            />
            <MetricRow
              kind="qhsx"
              label="QHSX"
              value={`${resolution.before.qhsx} → ${resolution.after.qhsx}`}
            />
            <MetricRow
              kind="delta"
              label="Chênh lệch"
              value={formatSigned(resolution.after.delta)}
              valueClassName={signedTone(resolution.after.delta)}
              className="sm:col-span-2"
            />
          </CardContent>
        </Card>

        {settlement?.imbalanceWarning ? (
          <Card className="border-amber-500/40 bg-amber-950/10">
            <CardContent className="p-5 text-base text-amber-200">
              {settlement.imbalanceWarning}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-5 text-base leading-relaxed text-slate-300">
            {ending
              ? 'Tháng này kích hoạt kết cục. Hãy xem tổng kết để hiểu bài học từ hành trình của bạn.'
              : 'Mỗi quyết định đều phản ánh mối quan hệ biện chứng giữa LLSX và QHSX. Tiếp tục theo dõi chênh lệch để tránh đứt gãy hoặc tụt hậu.'}
          </CardContent>
        </Card>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : 0.28,
            duration: 0.28,
            ease: easeOutSoft,
          }}
        >
          <Button size="lg" onClick={handleContinue}>
            {isFinalMonth || ending ? 'Xem tổng kết' : 'Sang tháng tiếp theo'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  signed,
  tone,
}: {
  label: string
  value: string
  signed?: number
  tone?: 'budget' | 'llsx' | 'qhsx'
}) {
  const valueClass =
    signed !== undefined
      ? signedTone(signed)
      : tone === 'budget'
        ? 'text-emerald-300'
        : tone === 'llsx'
          ? 'text-cyan-300'
          : tone === 'qhsx'
            ? 'text-violet-300'
            : 'text-slate-100'

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 py-3 last:border-0">
      <span className="text-base text-slate-400">{label}</span>
      <span className={`font-mono text-base font-semibold tabular-nums sm:text-lg ${valueClass}`}>
        {value}
      </span>
    </div>
  )
}
