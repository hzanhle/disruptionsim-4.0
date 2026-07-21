import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MetricChip, signedTone } from '@/components/shared/MetricChip'
import { calculateDelta } from '@/lib/gameCalculations'
import { fadeIn, getMotionProps } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn, formatBudget, formatSigned } from '@/lib/utils'
import type { StatEffects } from '@/types/game'

interface ChoiceEffectPreviewProps {
  budget: number
  llsx: number
  qhsx: number
  effects: StatEffects
  choiceTitle: string
  className?: string
}

/** Shows projected stats after applying a choice's direct effects. */
export function ChoiceEffectPreview({
  budget,
  llsx,
  qhsx,
  effects,
  choiceTitle,
  className,
}: ChoiceEffectPreviewProps) {
  const reduced = useReducedMotion()
  const motionProps = getMotionProps(reduced)
  const nextBudget = budget + effects.budget
  const nextLlsx = llsx + effects.llsx
  const nextQhsx = qhsx + effects.qhsx
  const nextDelta = calculateDelta(nextLlsx, nextQhsx)
  const currentDelta = calculateDelta(llsx, qhsx)

  return (
    <motion.div variants={fadeIn} {...motionProps}>
      <Card
        className={cn('border-cyan-500/30 bg-cyan-950/15', className)}
        aria-live="polite"
      >
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
            <div>
              <p className="text-base font-semibold text-slate-100">
                Sau lựa chọn &ldquo;{choiceTitle}&rdquo;
              </p>
              <p className="mt-0.5 text-sm text-slate-400">
                Ước tính ngay sau tác động trực tiếp (chưa gồm quyết toán tháng).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MetricChip kind="budget" label="Ngân sách còn" value={nextBudget} size="sm" />
            <MetricChip kind="llsx" label="LLSX còn" value={nextLlsx} size="sm" />
            <MetricChip kind="qhsx" label="QHSX còn" value={nextQhsx} size="sm" />
            <MetricChip kind="delta" label="Chênh lệch" value={nextDelta} signed size="sm" />
          </div>

          <p className="text-sm text-slate-400">
            Thay đổi:{' '}
            <span className={cn('font-mono font-semibold', signedTone(effects.budget))}>
              {formatSigned(effects.budget, '$')}
            </span>
            {' · '}
            <span className={cn('font-mono font-semibold', signedTone(effects.llsx))}>
              LLSX {formatSigned(effects.llsx)}
            </span>
            {' · '}
            <span className={cn('font-mono font-semibold', signedTone(effects.qhsx))}>
              QHSX {formatSigned(effects.qhsx)}
            </span>
            {nextDelta !== currentDelta ? (
              <>
                {' · '}
                delta {formatSigned(currentDelta)} →{' '}
                <span className={cn('font-mono font-semibold', signedTone(nextDelta))}>
                  {formatSigned(nextDelta)}
                </span>
              </>
            ) : null}
            {' · '}
            từ {formatBudget(budget)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
