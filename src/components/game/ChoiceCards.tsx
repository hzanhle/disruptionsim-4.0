import { getChoiceIcon } from '@/lib/choiceIcons'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
import { MetricChip } from '@/components/shared/MetricChip'
import { choiceImageUrl } from '@/lib/gameAssets'
import { cn, formatSigned } from '@/lib/utils'
import type { ChoiceOption } from '@/types/game'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ChoiceCardsProps {
  choices: ChoiceOption[]
  selectedId: string | null
  locked: boolean
  onSelect: (choiceId: string) => void
}

export function ChoiceCards({
  choices,
  selectedId,
  locked,
  onSelect,
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

        return (
          <motion.div
            key={choice.id}
            className="h-full"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : index * 0.05 }}
          >
            <button
              type="button"
              disabled={locked}
              onClick={() => onSelect(choice.id)}
              aria-label={`${choice.title}. Ngân sách ${formatSigned(choice.effects.budget, '$')}, LLSX ${formatSigned(choice.effects.llsx)}, QHSX ${formatSigned(choice.effects.qhsx)}`}
              aria-pressed={selected}
              className={cn(
                'group h-full w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                locked && 'cursor-not-allowed opacity-70',
              )}
            >
              <Card
                className={cn(
                  'flex h-full flex-col border p-3 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  selected
                    ? 'border-cyan-400/80 bg-cyan-950/30 shadow-[0_0_0_1px_rgb(34_211_238_/_0.25),0_16px_40px_-20px_rgb(34_211_238_/_0.45)]'
                    : 'border-slate-700/70 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900/90',
                )}
              >
                <div className="overflow-hidden rounded-xl">
                  <AssetImage
                    src={image}
                    alt={choice.title}
                    fit="cover"
                    className="aspect-video max-h-32 rounded-xl ring-1 ring-inset ring-slate-700/50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <CardHeader className="px-1 pb-2 pt-3">
                  <div className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
                    <CardTitle className="text-lg leading-snug text-balance">
                      {choice.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-3 px-1 pb-1">
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
                </CardContent>
              </Card>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
