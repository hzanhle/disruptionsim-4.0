import { motion } from 'framer-motion'
import { BookOpen, Play, RotateCcw, Sparkles } from 'lucide-react'
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
import { AssetImage } from '@/components/shared/AssetImage'
import { SoundToggle } from '@/components/shared/SoundToggle'
import { branding } from '@/lib/gameAssets'
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

  const logo = branding.logo()
  const hero = branding.heroFactory()
  const pattern = branding.bgPattern()
  const industry = branding.heroIndustry()

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
    <div className="relative min-h-[100dvh] overflow-hidden bg-transparent text-slate-100">
      {hero ? (
        <div className="pointer-events-none absolute inset-0">
          <img
            src={hero}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/75" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_bottom,_rgba(8,47,73,0.35),transparent_50%)]" />
      )}

      {pattern ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light"
          style={{ backgroundImage: `url(${pattern})`, backgroundSize: '420px' }}
        />
      ) : null}

      <div className="relative mx-auto flex min-h-[100dvh] max-w-5xl flex-col px-4 py-7 sm:px-6 sm:py-8">
        <header className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="flex items-center gap-3 text-cyan-300">
            {logo ? (
              <img
                src={logo}
                alt="DISRUPTIONSIM"
                className="h-10 w-10 rounded-xl object-contain ring-1 ring-cyan-500/20"
              />
            ) : null}
            <span className="text-xs font-medium uppercase tracking-[0.22em]">
              Industry 4.0
            </span>
          </div>
          <SoundToggle />
        </header>

        <main className="flex flex-1 flex-col justify-center gap-7 sm:gap-8">
          <motion.section
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 sm:space-y-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
              SmartGarment Việt Nam
            </p>
            <h1 className="max-w-4xl text-4xl font-bold tracking-[-0.03em] text-balance sm:text-6xl sm:leading-[1.05]">
              DISRUPTIONSIM 4.0
            </h1>
            <p className="max-w-[42rem] text-base leading-relaxed text-pretty text-slate-300 sm:text-lg">
              Mô phỏng quản trị nhà máy may xuất khẩu trên hành trình CNH-HĐH và chuyển đổi số.
              LLSX và QHSX phải phát triển hài hòa.
            </p>
          </motion.section>

          <motion.section
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-slate-700/50 bg-slate-900/55 p-2.5 shadow-[var(--shadow-surface)] backdrop-blur-sm sm:p-3"
          >
            <div className="grid items-stretch gap-2.5 md:grid-cols-[1.15fr_0.85fr] md:gap-3">
              <div className="flex items-start gap-3 rounded-xl bg-slate-950/50 p-4">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                <p className="max-w-prose text-sm leading-relaxed text-pretty text-slate-300">
                  Quan hệ sản xuất phải phù hợp với trình độ phát triển của lực lượng sản xuất.
                  Bạn có 10 tháng để cân bằng công nghệ, con người, quản trị và ngân sách.
                </p>
              </div>
              <AssetImage
                src={industry}
                alt="Chuyển đổi số Industry 4.0 tại nhà máy may"
                fit="cover"
                className="min-h-36 rounded-xl ring-1 ring-inset ring-slate-600/40 md:min-h-full"
              />
            </div>
          </motion.section>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
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
          </motion.div>
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
