import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { useGameHydration } from '@/hooks/useGameHydration'
import { setSoundEnabled } from '@/lib/soundManager'
import { LandingScreen } from '@/components/layout/LandingScreen'
import { ScreenFallback } from '@/components/shared/ScreenFallback'
import { ScreenTransition } from '@/components/shared/ScreenTransition'
import { useGameStore } from '@/store/gameStore'

const TutorialScreen = lazy(() =>
  import('@/components/layout/TutorialScreen').then((module) => ({
    default: module.TutorialScreen,
  })),
)
const GameDashboard = lazy(() =>
  import('@/components/game/GameDashboard').then((module) => ({
    default: module.GameDashboard,
  })),
)
const MonthlyReportScreen = lazy(() =>
  import('@/components/game/MonthlyReportScreen').then((module) => ({
    default: module.MonthlyReportScreen,
  })),
)
const EndingScreen = lazy(() =>
  import('@/components/game/EndingScreen').then((module) => ({
    default: module.EndingScreen,
  })),
)

export function App() {
  const hasHydrated = useGameHydration()
  const gameStatus = useGameStore((state) => state.gameStatus)
  const tutorialOpen = useGameStore((state) => state.tutorialOpen)
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const saveNotice = useGameStore((state) => state.saveNotice)
  const clearSaveNotice = useGameStore((state) => state.clearSaveNotice)
  const currentResolution = useGameStore((state) => state.currentResolution)
  const ending = useGameStore((state) => state.ending)
  const currentMonth = useGameStore((state) => state.currentMonth)

  useEffect(() => {
    setSoundEnabled(soundEnabled)
  }, [soundEnabled])

  useEffect(() => {
    if (saveNotice) {
      toast.warning(saveNotice)
      clearSaveNotice()
    }
  }, [saveNotice, clearSaveNotice])

  useEffect(() => {
    if (!hasHydrated) return

    if (gameStatus === 'report' && !currentResolution) {
      useGameStore.setState({
        gameStatus: ending ? 'ended' : 'landing',
      })
    }

    if (gameStatus === 'ended' && !ending) {
      useGameStore.setState({ gameStatus: 'landing' })
    }
  }, [hasHydrated, gameStatus, currentResolution, ending])

  if (!hasHydrated) {
    return <ScreenFallback message="Đang tải tiến trình..." />
  }

  const screenKey = tutorialOpen
    ? 'tutorial'
    : gameStatus === 'playing'
      ? `playing-${currentMonth}`
      : gameStatus === 'report'
        ? `report-${currentResolution?.month ?? 'none'}`
        : gameStatus

  let screen = <LandingScreen />
  if (tutorialOpen) {
    screen = <TutorialScreen />
  } else {
    switch (gameStatus) {
      case 'landing':
        screen = <LandingScreen />
        break
      case 'playing':
        screen = <GameDashboard />
        break
      case 'report':
        screen = currentResolution ? <MonthlyReportScreen /> : <LandingScreen />
        break
      case 'ended':
        screen = ending ? <EndingScreen /> : <LandingScreen />
        break
      default:
        screen = <LandingScreen />
    }
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Bỏ qua đến nội dung
      </a>
      <div id="main">
        <AnimatePresence mode="wait">
          <ScreenTransition key={screenKey}>
            <Suspense fallback={<ScreenFallback />}>{screen}</Suspense>
          </ScreenTransition>
        </AnimatePresence>
      </div>
      <Toaster richColors position="top-center" />
    </>
  )
}
