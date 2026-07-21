import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { Toaster, toast } from 'sonner'
import { useGameHydration } from '@/hooks/useGameHydration'
import { setSoundEnabled } from '@/lib/soundManager'
import { LandingScreen } from '@/components/layout/LandingScreen'
import { ScreenFallback } from '@/components/shared/ScreenFallback'
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

  if (tutorialOpen) {
    return (
      <>
        <Suspense fallback={<ScreenFallback />}>
          <TutorialScreen />
        </Suspense>
        <Toaster richColors position="top-center" />
      </>
    )
  }

  let screen: ReactNode
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

  return (
    <>
      <a href="#main" className="skip-link">
        Bỏ qua đến nội dung
      </a>
      <Suspense fallback={<ScreenFallback />}>
        <div id="main">{screen}</div>
      </Suspense>
      <Toaster richColors position="top-center" />
    </>
  )
}
