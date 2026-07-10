import { getChoiceIcon } from '@/lib/choiceIcons'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetImage } from '@/components/shared/AssetImage'
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
                'h-full w-full rounded-xl text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                locked && 'cursor-not-allowed opacity-70',
              )}
            >
              <Card
                className={cn(
                  'flex h-full flex-col overflow-hidden border-2',
                  selected
                    ? 'border-cyan-500 bg-cyan-950/20'
                    : 'border-slate-700 hover:border-slate-500',
                )}
              >
                <AssetImage
                  src={image}
                  alt={choice.title}
                  className="aspect-[4/3] border-b border-slate-800"
                  imgClassName="object-cover"
                />
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
                    <CardTitle className="text-base leading-snug">{choice.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-3">
                  <p className="flex-1 text-sm leading-relaxed text-slate-300">
                    {choice.description}
                  </p>
                  <div className="grid shrink-0 grid-cols-3 gap-2 text-xs">
                    <p>Ngân sách: {formatSigned(choice.effects.budget, '$')}</p>
                    <p>LLSX: {formatSigned(choice.effects.llsx)}</p>
                    <p>QHSX: {formatSigned(choice.effects.qhsx)}</p>
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
