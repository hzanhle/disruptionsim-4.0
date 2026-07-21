import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ChoiceCards } from '@/components/game/ChoiceCards'
import { AssetImage } from '@/components/shared/AssetImage'
import { ChoiceEffectPreview } from '@/components/shared/ChoiceEffectPreview'
import { MetricChip } from '@/components/shared/MetricChip'
import { getMonthEvent, isAutomaticEvent, isChoiceEvent, isFinaleEvent } from '@/data/monthEvents'
import { characterUrl, eventSceneUrl } from '@/lib/gameAssets'
import { playSound } from '@/lib/soundManager'
import { microTransition } from '@/lib/motion'
import { useGameStore } from '@/store/gameStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface EventPanelProps {
  month: number
}

export function EventPanel({ month }: EventPanelProps) {
  const reducedMotion = useReducedMotion()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const pendingChoiceId = useGameStore((state) => state.pendingChoiceId)
  const choiceLocked = useGameStore((state) => state.choiceLocked)
  const isResolving = useGameStore((state) => state.isResolving)
  const budget = useGameStore((state) => state.budget)
  const llsx = useGameStore((state) => state.llsx)
  const qhsx = useGameStore((state) => state.qhsx)
  const selectChoice = useGameStore((state) => state.selectChoice)
  const confirmChoice = useGameStore((state) => state.confirmChoice)
  const resolveAutomaticEvent = useGameStore((state) => state.resolveAutomaticEvent)

  const event = getMonthEvent(month)
  if (!event) return null

  const selectedChoice =
    isChoiceEvent(event) && pendingChoiceId
      ? event.choices.find((choice) => choice.id === pendingChoiceId)
      : null

  const scene = eventSceneUrl(month)
  const speakerAvatar = event.speaker ? characterUrl(event.speaker.id) : undefined

  const handleConfirm = () => {
    playSound('confirm')
    confirmChoice()
    setConfirmOpen(false)
  }

  const handleAutomatic = () => {
    playSound('click')
    resolveAutomaticEvent()
  }

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={microTransition}
      className="space-y-4"
    >
      <Card className="overflow-hidden pb-3">
        <AssetImage
          src={scene}
          alt={`Bối cảnh tháng ${month}: ${event.title}`}
          fit="cover"
          inset
          className="aspect-video w-full"
        />
        <CardHeader className="px-4 pb-0 pt-3">
          <CardTitle className="text-balance">{event.title}</CardTitle>
          <p className="text-base leading-relaxed text-pretty text-slate-300">
            {event.context}
          </p>
        </CardHeader>
      </Card>

      {event.speaker ? (
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-cyan-400/40 shadow-md">
                <AssetImage
                  src={speakerAvatar}
                  alt={event.speaker.name}
                  fit="cover"
                  className="h-full w-full"
                />
              </div>
              <div className="space-y-0.5">
                <span className="inline-block rounded-full bg-cyan-950/80 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300 border border-cyan-500/30 uppercase">
                  Nhân vật phát biểu
                </span>
                <h4 className="text-base font-bold text-slate-100">{event.speaker.name}</h4>
                <p className="text-xs font-medium text-slate-400">{event.speaker.role}</p>
              </div>
            </div>
            <div className="flex-1 rounded-xl bg-slate-950/60 p-3 border-l-2 border-cyan-400 text-sm leading-relaxed text-pretty text-cyan-100 italic">
              &ldquo;{event.speaker.dialogue}&rdquo;
            </div>
          </div>
        </div>
      ) : null}

      {isChoiceEvent(event) ? (
        <>
          <ChoiceCards
            choices={event.choices}
            selectedId={pendingChoiceId}
            locked={choiceLocked || isResolving}
            budget={budget}
            llsx={llsx}
            qhsx={qhsx}
            onSelect={(id) => {
              playSound('click')
              selectChoice(id)
            }}
          />
          {selectedChoice && !choiceLocked ? (
            <ChoiceEffectPreview
              budget={budget}
              llsx={llsx}
              qhsx={qhsx}
              effects={selectedChoice.effects}
              choiceTitle={selectedChoice.title}
            />
          ) : null}
          <Button
            disabled={!pendingChoiceId || choiceLocked || isResolving}
            onClick={() => setConfirmOpen(true)}
          >
            <Check className="h-4 w-4" />
            Xác nhận lựa chọn
          </Button>
        </>
      ) : null}

      {isAutomaticEvent(event) ? (
        <Button
          disabled={choiceLocked || isResolving}
          onClick={handleAutomatic}
        >
          <Eye className="h-4 w-4" />
          Xem kết quả
        </Button>
      ) : null}

      {isFinaleEvent(event) ? (
        <Button
          disabled={choiceLocked || isResolving}
          onClick={handleAutomatic}
        >
          <Eye className="h-4 w-4" />
          Xem tổng kết tháng cuối
        </Button>
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận quyết định</DialogTitle>
            <DialogDescription>
              {selectedChoice
                ? `Bạn chọn "${selectedChoice.title}". Sau khi xác nhận, quyết định không thể thay đổi.`
                : 'Vui lòng chọn một phương án trước khi xác nhận.'}
            </DialogDescription>
          </DialogHeader>
          {selectedChoice ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <MetricChip
                  kind="budget"
                  label="Ngân sách"
                  value={selectedChoice.effects.budget}
                  signed
                  currency
                  size="sm"
                />
                <MetricChip
                  kind="llsx"
                  label="LLSX"
                  value={selectedChoice.effects.llsx}
                  signed
                  size="sm"
                />
                <MetricChip
                  kind="qhsx"
                  label="QHSX"
                  value={selectedChoice.effects.qhsx}
                  signed
                  size="sm"
                />
              </div>
              <ChoiceEffectPreview
                budget={budget}
                llsx={llsx}
                qhsx={qhsx}
                effects={selectedChoice.effects}
                choiceTitle={selectedChoice.title}
              />
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button disabled={!selectedChoice || isResolving} onClick={handleConfirm}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.section>
  )
}
