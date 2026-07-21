import { getChoiceIcon } from '@/lib/choiceIcons'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { MetricChip, signedTone } from '@/components/shared/MetricChip'
import { choiceImageUrl } from '@/lib/gameAssets'
import { calculateDelta } from '@/lib/gameCalculations'
import { durations, fadeIn, microTransition } from '@/lib/motion'
import { cn, formatBudget, formatSigned } from '@/lib/utils'
import type { ChoiceOption } from '@/types/game'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ChoiceCardsProps {
  choices: ChoiceOption[]
  selectedId: string | null
  locked: boolean
  onSelect: (choiceId: string) => void
  budget: number
  llsx: number
  qhsx: number
}

export function ChoiceCards({
  choices,
  selectedId,
  locked,
  onSelect,
  budget,
  llsx,
  qhsx,
}: ChoiceCardsProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="grid items-stretch gap-4 md:grid-cols-2"
      aria-label="Các lựa chọn tháng này"
    >
      {choices.map((choice, index) => {
        const Icon = getChoiceIcon(choice.icon)
        const selected = selectedId === choice.id
        const image = choiceImageUrl(choice.id)
        const nextBudget = budget + choice.effects.budget
        const nextLlsx = llsx + choice.effects.llsx
        const nextQhsx = qhsx + choice.effects.qhsx
        const nextDelta = calculateDelta(nextLlsx, nextQhsx)

        return (
          <motion.div
            key={choice.id}
            className="h-full"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: selected && !reducedMotion ? 1.01 : 1,
            }}
            transition={{
              ...microTransition,
              delay: reducedMotion ? 0 : index * durations.stagger,
            }}
          >
            <button
              type="button"
              disabled={locked}
              onClick={() => onSelect(choice.id)}
              aria-label={`${choice.title}. Ngân sách ${formatSigned(choice.effects.budget, '$')}, LLSX ${formatSigned(choice.effects.llsx)}, QHSX ${formatSigned(choice.effects.qhsx)}. Sau chọn còn ${formatBudget(nextBudget)}.`}
              aria-pressed={selected}
              className={cn(
                'group h-full w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                locked && 'cursor-not-allowed opacity-70',
              )}
            >
              <Card
                className={cn(
                  'flex h-full flex-col overflow-hidden border pb-3 transition-[border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  selected
                    ? 'border-cyan-400/80 bg-cyan-950/30 shadow-[0_0_0_1px_rgb(34_211_238_/_0.25),0_16px_40px_-20px_rgb(34_211_238_/_0.45)]'
                    : 'border-slate-700/70 hover:border-slate-500 hover:bg-slate-900/90',
                )}
              >
                <AssetImage
                  src={image}
                  alt={choice.title}
                  fit="cover"
                  inset
                  className="aspect-video w-full"
                  imgClassName="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <CardHeader className="px-4 pb-2 pt-3">
                  <div className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
                    <CardTitle className="text-lg leading-snug text-balance">
                      {choice.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-3 px-4 pb-1">
                  <p className="flex-1 text-base leading-relaxed text-pretty text-slate-300">
                    {choice.description}
                  </p>
                  <div className="grid shrink-0 grid-cols-3 gap-2">
                    <MetricChip
                      kind="budget"
                      label="Ngân sách"
                      value={choice.effects.budget}
                      signed
                      currency
                      size="md"
                    />
                    <MetricChip
                      kind="llsx"
                      label="LLSX"
                      value={choice.effects.llsx}
                      signed
                      size="md"
                    />
                    <MetricChip
                      kind="qhsx"
                      label="QHSX"
                      value={choice.effects.qhsx}
                      signed
                      size="md"
                    />
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={selected ? 'selected' : 'preview'}
                      variants={fadeIn}
                      initial={reducedMotion ? false : 'initial'}
                      animate="animate"
                      className={cn(
                        'rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2 text-sm',
                        !selected && 'opacity-80 group-hover:opacity-100',
                      )}
                    >
                      <p className="font-medium text-slate-200">
                        Sau chọn còn{' '}
                        <span className="font-mono text-emerald-300">
                          {formatBudget(nextBudget)}
                        </span>
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-slate-400 sm:text-sm">
                        LLSX {llsx}→{nextLlsx} · QHSX {qhsx}→{nextQhsx} · Delta{' '}
                        <span className={signedTone(nextDelta)}>{formatSigned(nextDelta)}</span>
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
