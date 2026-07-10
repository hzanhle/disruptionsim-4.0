import { BookOpen, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SoundToggle } from '@/components/shared/SoundToggle'
import { Progress } from '@/components/ui/progress'
import { TOTAL_MONTHS } from '@/lib/constants'
import { branding } from '@/lib/gameAssets'

interface GameHeaderProps {
  currentMonth: number
  onOpenTutorial: () => void
  onReset: () => void
}

export function GameHeader({
  currentMonth,
  onOpenTutorial,
  onReset,
}: GameHeaderProps) {
  const progress = Math.min(100, ((currentMonth - 1) / TOTAL_MONTHS) * 100)
  const logo = branding.logo()

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-11 w-11 rounded-xl border border-slate-700 object-cover"
            />
          ) : null}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              SmartGarment Việt Nam
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">DISRUPTIONSIM 4.0</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onOpenTutorial}>
            <BookOpen className="h-4 w-4" />
            Hướng dẫn
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Chơi lại
          </Button>
          <SoundToggle />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">
            Tháng {currentMonth}/{TOTAL_MONTHS}
          </span>
          <span className="text-slate-400">Tiến trình sản xuất</span>
        </div>
        <Progress value={progress} aria-label="Tiến trình 10 tháng" />
      </div>
    </header>
  )
}
