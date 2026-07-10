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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChoiceCards } from '@/components/game/ChoiceCards'
import { getMonthEvent, isAutomaticEvent, isChoiceEvent, isFinaleEvent } from '@/data/monthEvents'
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
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-300">{event.context}</p>
        </CardContent>
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
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
              <p>Ngân sách: {selectedChoice.effects.budget >= 0 ? '+' : ''}${Math.abs(selectedChoice.effects.budget)}</p>
              <p>LLSX: {selectedChoice.effects.llsx >= 0 ? '+' : ''}{selectedChoice.effects.llsx}</p>
              <p>QHSX: {selectedChoice.effects.qhsx >= 0 ? '+' : ''}{selectedChoice.effects.qhsx}</p>
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
