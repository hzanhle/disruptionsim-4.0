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
import { getMonthEvent, isAutomaticEvent, isChoiceEvent, isFinaleEvent } from '@/data/monthEvents'
import { eventSceneUrl } from '@/lib/gameAssets'
import { MetricChip } from '@/components/shared/MetricChip'
import { playSound } from '@/lib/soundManager'
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
      className="space-y-4"
    >
      <Card className="p-3">
        <AssetImage
          src={scene}
          alt={`Bối cảnh tháng ${month}: ${event.title}`}
          fit="cover"
          className="aspect-[21/9] max-h-44 rounded-xl ring-1 ring-inset ring-slate-700/50"
        />
        <CardHeader className="px-1 pb-0 pt-3">
          <CardTitle className="text-balance">{event.title}</CardTitle>
          <p className="text-base leading-relaxed text-pretty text-slate-300">
            {event.context}
          </p>
        </CardHeader>
      </Card>

      {isChoiceEvent(event) ? (
        <>
          <ChoiceCards
            choices={event.choices}
            selectedId={pendingChoiceId}
            locked={choiceLocked || isResolving}
            onSelect={(id) => {
              playSound('click')
              selectChoice(id)
            }}
          />
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
