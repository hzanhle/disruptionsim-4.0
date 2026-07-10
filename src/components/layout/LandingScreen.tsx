import { motion } from 'framer-motion'
import {
  BookOpen,
  Cpu,
  Factory,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SoundToggle } from '@/components/shared/SoundToggle'
import { unlockAudio, playSound } from '@/lib/soundManager'
import { getSaveAvailability, useGameStore } from '@/store/gameStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function LandingScreen() {
  const reducedMotion = useReducedMotion()
  const [resetOpen, setResetOpen] = useState(false)
  const [startConfirmOpen, setStartConfirmOpen] = useState(false)
  const startNewGame = useGameStore((state) => state.startNewGame)
  const continueGame = useGameStore((state) => state.continueGame)
  const resetGame = useGameStore((state) => state.resetGame)
  const openTutorial = useGameStore((state) => state.openTutorial)
  const history = useGameStore((state) => state.history)
  const ending = useGameStore((state) => state.ending)
  const currentResolution = useGameStore((state) => state.currentResolution)
  const gameStatus = useGameStore((state) => state.gameStatus)

  const { canContinue } = getSaveAvailability({
    history,
    ending,
    currentResolution,
    gameStatus,
  })

  const beginNewGame = () => {
    unlockAudio()
    playSound('click')
    startNewGame()
    setStartConfirmOpen(false)
  }

  const handleStart = () => {
    unlockAudio()
    playSound('click')
    if (canContinue) {
      setStartConfirmOpen(true)
      return
    }
    startNewGame()
  }

  const handleContinue = () => {
    unlockAudio()
    playSound('click')
    continueGame()
  }

  const handleReset = () => {
    playSound('confirm')
    resetGame()
    setResetOpen(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:40px_40px]" />

      {!reducedMotion ? (
        <motion.div
          className="pointer-events-none absolute -left-10 top-24 text-cyan-400/20"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Factory className="h-32 w-32" />
        </motion.div>
      ) : null}

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300">
            <Cpu className="h-5 w-5" />
            <span className="text-sm uppercase tracking-[0.2em]">Industry 4.0</span>
          </div>
          <SoundToggle />
        </header>

        <main className="flex flex-1 flex-col justify-center gap-8">
          <motion.section
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              SmartGarment Việt Nam
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              DISRUPTIONSIM 4.0
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              Mô phỏng quản trị nhà máy may xuất khẩu trong hành trình công nghiệp hóa,
              hiện đại hóa và chuyển đổi số — nơi LLSX và QHSX phải phát triển hài hòa.
            </p>
          </motion.section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-violet-400" />
              <p className="text-sm leading-relaxed text-slate-300">
                Quan hệ sản xuất phải phù hợp với trình độ phát triển của lực lượng sản xuất.
                Bạn có 10 tháng để cân bằng công nghệ, con người, quản trị và ngân sách.
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" onClick={handleStart}>
              <Play className="h-4 w-4" />
              Bắt đầu trò chơi
            </Button>
            {canContinue ? (
              <Button size="lg" variant="secondary" onClick={handleContinue}>
                Tiếp tục trò chơi
              </Button>
            ) : null}
            <Button size="lg" variant="outline" onClick={openTutorial}>
              <BookOpen className="h-4 w-4" />
              Hướng dẫn &amp; thuật ngữ
            </Button>
            {canContinue ? (
              <Button size="lg" variant="ghost" onClick={() => setResetOpen(true)}>
                <RotateCcw className="h-4 w-4" />
                Chơi lại từ đầu
              </Button>
            ) : null}
          </div>
        </main>
      </div>

      <Dialog open={startConfirmOpen} onOpenChange={setStartConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bắt đầu ván mới?</DialogTitle>
            <DialogDescription>
              Bạn đang có tiến trình đã lưu. Bắt đầu mới sẽ xóa tiến trình hiện tại.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setStartConfirmOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={beginNewGame}>
              Xóa và bắt đầu mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận chơi lại</DialogTitle>
            <DialogDescription>
              Tiến trình hiện tại sẽ bị xóa. Bạn có chắc muốn bắt đầu lại từ đầu?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Chơi lại từ đầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
