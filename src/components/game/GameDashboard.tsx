import { lazy, Suspense, useState } from 'react'
import { DollarSign, Cpu, Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { GameHeader } from '@/components/layout/GameHeader'
import { StatCard } from '@/components/shared/StatCard'
import { DeltaIndicator } from '@/components/shared/DeltaIndicator'
import { MonthTimeline } from '@/components/game/MonthTimeline'
import { EventPanel } from '@/components/game/EventPanel'
import { FactoryStatusPanel } from '@/components/game/FactoryStatusPanel'
import { ActivityLog } from '@/components/game/ActivityLog'
import { calculateDelta } from '@/lib/gameCalculations'
import { budgetBadgeUrl, concepts } from '@/lib/gameAssets'
import { useGameStore } from '@/store/gameStore'

const HistoryChart = lazy(() =>
  import('@/components/game/HistoryChart').then((module) => ({
    default: module.HistoryChart,
  })),
)

export function GameDashboard() {
  const [resetOpen, setResetOpen] = useState(false)
  const budget = useGameStore((state) => state.budget)
  const llsx = useGameStore((state) => state.llsx)
  const qhsx = useGameStore((state) => state.qhsx)
  const currentMonth = useGameStore((state) => state.currentMonth)
  const history = useGameStore((state) => state.history)
  const openTutorial = useGameStore((state) => state.openTutorial)
  const resetGame = useGameStore((state) => state.resetGame)

  const delta = calculateDelta(llsx, qhsx)
  const completedMonths = history.map((entry) => entry.month)

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <GameHeader
          currentMonth={currentMonth}
          onOpenTutorial={openTutorial}
          onReset={() => setResetOpen(true)}
        />

        <MonthTimeline currentMonth={currentMonth} completedMonths={completedMonths} />

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Ngân sách"
            value={budget}
            icon={DollarSign}
            tone="budget"
            format="budget"
            imageSrc={budgetBadgeUrl(budget) ?? concepts.budget()}
          />
          <StatCard
            title="Trình độ LLSX"
            subtitle="Lực lượng sản xuất — Công nghệ và công cụ lao động"
            value={llsx}
            icon={Cpu}
            tone="llsx"
            imageSrc={concepts.llsx()}
          />
          <StatCard
            title="Trình độ QHSX"
            subtitle="Quan hệ sản xuất — Quản lý, con người và cơ chế phân phối"
            value={qhsx}
            icon={Users}
            tone="qhsx"
            imageSrc={concepts.qhsx()}
          />
        </div>

        <DeltaIndicator delta={delta} />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <EventPanel month={currentMonth} />
          <div className="space-y-4">
            <FactoryStatusPanel budget={budget} llsx={llsx} qhsx={qhsx} />
            <ActivityLog history={history} />
          </div>
        </div>

        {history.length > 0 ? (
          <Suspense
            fallback={
              <div
                role="status"
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400"
              >
                Đang tải biểu đồ hành trình...
              </div>
            }
          >
            <HistoryChart history={history} />
          </Suspense>
        ) : null}
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chơi lại từ đầu?</DialogTitle>
            <DialogDescription>
              Toàn bộ tiến trình hiện tại sẽ bị xóa và quay về màn hình bắt đầu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetGame()
                setResetOpen(false)
              }}
            >
              Chơi lại từ đầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
