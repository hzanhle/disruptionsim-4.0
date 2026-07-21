import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, X, Sparkles, Film, ShieldCheck, AlertOctagon, TrendingDown, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AssetImage } from '@/components/shared/AssetImage'
import { characterUrl } from '@/lib/gameAssets'
import { playSound } from '@/lib/soundManager'
import type { EndingResult } from '@/types/game'

interface CinematicEndingModalProps {
  ending: EndingResult | null
  open: boolean
  onClose: () => void
}

export function CinematicEndingModal({ ending, open, onClose }: CinematicEndingModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [videoTime, setVideoTime] = useState(0)

  const meta = ending
    ? {
        esg_utopia: {
          tag: 'SECRET ENDING CINEMATIC FEED',
          title: 'Kỷ nguyên Tự động hóa Toàn phần & ESG Tiên phong',
          badge: 'Secret Utopia 🏆',
          badgeClass: 'bg-amber-950 text-yellow-300 border-yellow-400/60 shadow-lg shadow-yellow-500/20',
          icon: Sparkles,
          themeColor: '#f59e0b',
          videoSrc: '/videos/utopia.mp4',
          quote:
            '“Xuất sắc tuyệt đối! Bạn không chỉ đưa LLSX và QHSX lên cấp độ 5 tối đa mà còn đạt thặng dư thặng dư ngân sách và chuẩn ESG hoàn hảo. SmartGarment Việt Nam chính thức trở thành biểu tượng CNH-HĐH toàn cầu tại Diễn đàn Kinh tế Thế giới!”',
          videoPrompt:
            'Phim thực tế đời thực tiếng Việt: Nhà máy không ánh đèn (Dark Factory) chuẩn ESG toàn cầu của SmartGarment Việt Nam, vận hành 100% bằng năng lượng mặt trời và AI, công nhân Việt Nam trở thành chuyên gia quản trị AI đẳng cấp thế giới.',
        },
        sustainable_modernization: {
          tag: 'PHIM TƯ LIỆU THỰC TẾ SMARTGARMENT VIỆT NAM',
          title: 'Hành trình CNH-HĐH Thành công Bền vững',
          badge: 'Thành công Rực rỡ',
          badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
          icon: ShieldCheck,
          themeColor: '#34d399',
          videoSrc: '/videos/victory.mp4',
          quote:
            '“SmartGarment Việt Nam chính thức bước vào kỷ nguyên Nhà máy Thông minh chuẩn ESG toàn cầu! Sự hài hòa giữa Lực lượng sản xuất và Quan hệ sản xuất chính là điểm tựa chiến thắng.”',
          videoPrompt:
            'Phim thực tế đời thực tiếng Việt: Nhà máy may SmartGarment Việt Nam hiện đại, công nhân Việt Nam thao tác máy may công nghiệp tự động và dây chuyền chuyển đổi số 4.0.',
        },
        technology_breakdown: {
          tag: 'PHIM TƯ LIỆU SỰ CỐ ĐỨT GÃY CÔNG NGHỆ',
          title: 'Khủng hoảng Đứt gãy Công nghệ',
          badge: 'Đứt gãy Vận hành',
          badgeClass: 'bg-red-950 text-red-300 border-red-500/40',
          icon: AlertOctagon,
          themeColor: '#f87171',
          videoSrc: '/videos/breakdown.mp4',
          quote:
            '“Công nghệ tiên tiến đã biến thành thảm họa khi trình độ quản lý và tay nghề công nhân chưa kịp thích ứng. Bài học đắt giá về sự mất cân bằng LLSX và QHSX!”',
          videoPrompt:
            'Phim thực tế đời thực tiếng Việt: Dàn máy tự động quá tải bị kẹt vải, hệ thống báo lỗi vi tính tiếng Việt và sự lúng túng của nhân sự vận hành.',
        },
        economic_lag: {
          tag: 'PHIM TƯ LIỆU SUY THOÁI & TỤT HẬU KINH TẾ',
          title: 'Tụt hậu Kinh tế & Suy thoái',
          badge: 'Tụt hậu Thị trường',
          badgeClass: 'bg-amber-950 text-amber-300 border-amber-500/40',
          icon: TrendingDown,
          themeColor: '#fbbf24',
          videoSrc: '/videos/economic_lag.mp4',
          quote:
            '“Bảo thủ và chần chừ trong chuyển đổi số khiến nhà máy kiệt quệ tài chính và tụt lại phía sau trong cuộc đua công nghiệp hóa.”',
          videoPrompt:
            'Phim thực tế đời thực tiếng Việt: Xưởng may gia công vắng bóng đơn hàng xuất khẩu, bảng hiệu SmartGarment Việt Nam im lìm trong ánh hoàng hôn.',
        },
      }[ending.type]
    : null

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hasRealVideo, setHasRealVideo] = useState(false)

  // 60FPS Video Canvas Renderer
  useEffect(() => {
    if (!open || !ending || !meta) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let startTime = performance.now()
    let running = isPlaying

    const renderFrame = (now: number) => {
      if (!running) return
      const elapsed = (now - startTime) / 1000
      setVideoTime(Math.floor(elapsed))

      const width = (canvas.width = 1280)
      const height = (canvas.height = 720)

      // Background Video Canvas Base Gradient
      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, width, height)

      // Camera Pan Dynamic Offsets
      const panX = Math.sin(elapsed * 0.5) * 30
      const panY = Math.cos(elapsed * 0.3) * 15

      ctx.save()
      ctx.translate(panX, panY)

      if (ending.type === 'sustainable_modernization') {
        // --- VICTORY VIDEO SCENE: Modern Factory Floor & Workers ---
        // Industrial Factory Background Grid
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)'
        ctx.lineWidth = 2
        for (let x = -50; x < width + 100; x += 80) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x - 200, height)
          ctx.stroke()
        }

        // Factory Floor Horizon & Workstations
        const floorY = height * 0.65
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(-100, floorY, width + 200, height - floorY + 100)

        // Moving Conveyor Belt & Fabric Boxes
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(-100, floorY + 60, width + 200, 45)
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 3
        const beltOffset = (elapsed * 180) % 60
        for (let bx = -100 + beltOffset; bx < width + 100; bx += 60) {
          ctx.beginPath()
          ctx.moveTo(bx, floorY + 60)
          ctx.lineTo(bx - 30, floorY + 105)
          ctx.stroke()

          // Moving Fabric Rolls on Conveyor
          ctx.fillStyle = (bx / 60) % 2 === 0 ? '#34d399' : '#0ea5e9'
          ctx.fillRect(bx - 15, floorY + 30, 35, 25)
          ctx.fillStyle = '#f8fafc'
          ctx.font = '10px monospace'
          ctx.fillText('EXPORT', bx - 10, floorY + 46)
        }

        // Animated Sewing Workstations & Human Garment Workers
        for (let w = 0; w < 3; w++) {
          const wx = 180 + w * 360
          const wy = floorY - 80

          // Sewing Table
          ctx.fillStyle = '#334155'
          ctx.fillRect(wx, wy, 160, 70)
          ctx.fillStyle = '#64748b'
          ctx.fillRect(wx + 10, wy - 30, 20, 30) // Sewing machine head

          // Worker Head & Body (Human Operator Animation)
          const armAnim = Math.sin(elapsed * 12 + w) * 6
          ctx.fillStyle = '#38bdf8' // Worker Uniform
          ctx.beginPath()
          ctx.arc(wx + 70, wy - 45, 18, 0, Math.PI * 2) // Head
          ctx.fill()
          ctx.fillStyle = '#0284c7'
          ctx.fillRect(wx + 50, wy - 25, 40, 50) // Torso

          // Moving Arms Sewing Fabric
          ctx.strokeStyle = '#fde047'
          ctx.lineWidth = 6
          ctx.beginPath()
          ctx.moveTo(wx + 60, wy - 10)
          ctx.lineTo(wx + 40 + armAnim, wy + 15)
          ctx.stroke()

          // Fabric Under Needle
          ctx.fillStyle = '#a78bfa'
          ctx.fillRect(wx + 20, wy + 10, 80, 20)
        }

        // Overhead AI Robotic Arm Laser Scanner
        const robotX = (Math.sin(elapsed * 1.5) * 0.4 + 0.5) * width
        ctx.fillStyle = '#22d3ee'
        ctx.fillRect(robotX - 40, 40, 80, 30)
        ctx.strokeStyle = '#22d3ee'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(robotX, 70)
        ctx.lineTo(robotX, floorY - 20)
        ctx.stroke()

        // Cyan Laser Beam
        ctx.fillStyle = 'rgba(34, 211, 238, 0.25)'
        ctx.beginPath()
        ctx.moveTo(robotX - 5, 70)
        ctx.lineTo(robotX - 60, floorY + 40)
        ctx.lineTo(robotX + 60, floorY + 40)
        ctx.lineTo(robotX + 5, 70)
        ctx.closePath()
        ctx.fill()

        // ESG Green Energy Orbs Floating
        for (let p = 0; p < 15; p++) {
          const px = (p * 90 + elapsed * 40) % (width + 100)
          const py = 120 + Math.sin(elapsed * 2 + p) * 40
          ctx.fillStyle = 'rgba(52, 211, 153, 0.6)'
          ctx.beginPath()
          ctx.arc(px, py, 4 + (p % 3), 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (ending.type === 'technology_breakdown') {
        // --- CRISIS VIDEO SCENE: Machine Jam & Alarm Glitch ---
        const alertIntensity = Math.abs(Math.sin(elapsed * 8))

        // Red Flashing Background
        ctx.fillStyle = `rgba(225, 29, 72, ${0.15 + alertIntensity * 0.25})`
        ctx.fillRect(-100, -100, width + 200, height + 200)

        // Damaged Jammed Cutter Machine
        const machineX = width * 0.5
        const machineY = height * 0.5
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(machineX - 220, machineY - 120, 440, 240)

        // Tangled Fabric Pile
        ctx.fillStyle = '#f43f5e'
        ctx.beginPath()
        ctx.ellipse(machineX, machineY + 20, 180, 70, elapsed, 0, Math.PI * 2)
        ctx.fill()

        // Electrical Spark Particles
        for (let s = 0; s < 25; s++) {
          const sx = machineX + (Math.random() - 0.5) * 300
          const sy = machineY + (Math.random() - 0.5) * 160
          ctx.fillStyle = '#fef08a'
          ctx.fillRect(sx, sy, 4, 4)
        }

        // Glitch Scanlines
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
        for (let g = 0; g < height; g += 8) {
          if ((g + Math.floor(elapsed * 100)) % 16 === 0) {
            ctx.fillRect(0, g, width, 4)
          }
        }
      } else {
        // --- ECONOMIC LAG SCENE: Empty Factory & Dusk Fog ---
        // Dark Sunset Dusk Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#1e1b4b')
        grad.addColorStop(0.5, '#311042')
        grad.addColorStop(1, '#020617')
        ctx.fillStyle = grad
        ctx.fillRect(-100, -100, width + 200, height + 200)

        // Quiet Factory Silhouettes
        ctx.fillStyle = '#090d16'
        ctx.fillRect(100, height * 0.4, 300, height * 0.6)
        ctx.fillRect(500, height * 0.35, 400, height * 0.65)

        // Rolling Dusk Fog Layer
        const fogX = (elapsed * 25) % width
        ctx.fillStyle = 'rgba(251, 191, 36, 0.06)'
        ctx.beginPath()
        ctx.ellipse(fogX, height * 0.7, 400, 120, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      // Real Video HUD Overlay (Recorded Video Time & Status)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px monospace'
      const timeStr = `TRUYỀN HÌNH TRỰC TIẾP 00:${String(Math.floor(elapsed % 60)).padStart(2, '0')}:24 | SMARTGARMENT VIỆT NAM 60FPS`
      ctx.fillText(timeStr, 30, 40)

      ctx.fillStyle = '#34d399'
      ctx.beginPath()
      ctx.arc(18, 35, 5, 0, Math.PI * 2)
      ctx.fill()

      if (running) {
        animFrameRef.current = requestAnimationFrame(renderFrame)
      }
    }

    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(renderFrame)
    }

    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [open, ending, isPlaying, meta])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isPlaying, hasRealVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = isMuted
  }, [isMuted, hasRealVideo])

  const togglePlay = () => {
    const video = videoRef.current
    if (video) {
      if (video.paused) {
        video.play().catch(() => {})
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    } else {
      setIsPlaying((prev) => !prev)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      const nextMuted = !video.muted
      video.muted = nextMuted
      setIsMuted(nextMuted)
    } else {
      setIsMuted((prev) => !prev)
    }
  }

  const handleReplay = () => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
    setIsPlaying(true)
    if (ending?.type === 'sustainable_modernization') {
      playSound('fanfare')
    } else if (ending?.type === 'technology_breakdown') {
      playSound('glitch')
    } else {
      playSound('defeat')
    }
  }

  if (!open || !ending || !meta) return null

  const directorAvatar = characterUrl('player-director')
  const Icon = meta.icon

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900 shadow-2xl shadow-cyan-950/80"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-3">
            <div className="flex items-center gap-2.5">
              <Film className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-300">
                {meta.tag}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${meta.badgeClass}`}>
                {meta.badge}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Đóng video</span>
              </button>
            </div>
          </div>

          {/* 60FPS Video Canvas & HTML5 Real Video Player Viewport */}
          <div
            onClick={togglePlay}
            className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer group"
          >
            <video
              ref={videoRef}
              src={meta.videoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onLoadedData={() => {
                setHasRealVideo(true)
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {})
                }
              }}
              onError={() => setHasRealVideo(false)}
              className={`h-full w-full object-cover ${hasRealVideo ? 'block' : 'hidden'}`}
            />
            <canvas
              ref={canvasRef}
              className={`h-full w-full object-cover ${hasRealVideo ? 'hidden' : 'block'}`}
            />

            {/* Video Vignette Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />

            {/* Real Video Badge Tag */}
            <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/75 px-3 py-1 text-[11px] font-mono font-medium text-cyan-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              Short Video Thực tế Đời thực (SmartGarment Việt Nam)
            </div>

            {/* Video Title Overlay */}
            <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 space-y-1">
              <div className="flex items-center gap-2">
                <Icon className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                  {meta.title}
                </h2>
              </div>
              <p className="max-w-2xl text-xs sm:text-sm text-slate-200 drop-shadow">
                {meta.videoPrompt}
              </p>
            </div>

            {/* Video Player Controls */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                title={isPlaying ? 'Tạm dừng' : 'Phát'}
                className="rounded-full bg-black/80 p-2.5 text-white border border-cyan-400/40 backdrop-blur-md hover:bg-cyan-950 hover:scale-110 active:scale-95 transition-all shadow-lg"
              >
                {isPlaying ? <Pause className="h-4.5 w-4.5 text-cyan-400" /> : <Play className="h-4.5 w-4.5 text-emerald-400 fill-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMute()
                }}
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                className="rounded-full bg-black/80 p-2.5 text-white border border-cyan-400/40 backdrop-blur-md hover:bg-cyan-950 hover:scale-110 active:scale-95 transition-all shadow-lg"
              >
                {isMuted ? <VolumeX className="h-4.5 w-4.5 text-amber-400" /> : <Volume2 className="h-4.5 w-4.5 text-cyan-400" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleReplay()
                }}
                title="Phát lại từ đầu"
                className="rounded-full bg-black/80 p-2.5 text-white border border-cyan-400/40 backdrop-blur-md hover:bg-cyan-950 hover:scale-110 active:scale-95 transition-all shadow-lg"
              >
                <RotateCcw className="h-4.5 w-4.5 text-slate-200" />
              </button>
            </div>
          </div>

          {/* Director Speech Commentary */}
          <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 space-y-4">
            <div className="flex items-start gap-3.5 rounded-2xl border border-cyan-500/25 bg-slate-900/80 p-3.5 backdrop-blur-md">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-cyan-400">
                <AssetImage
                  src={directorAvatar}
                  alt="Giám đốc Nguyễn Văn Minh"
                  fit="cover"
                  className="h-full w-full"
                />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Giám đốc Nguyễn Văn Minh tổng kết:
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  {meta.quote}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-400">
                Đang phát video thực tế 60FPS cho kết cục trò chơi ({videoTime}s).
              </p>
              <Button size="lg" onClick={onClose} className="w-full sm:w-auto">
                Xem Báo cáo Chi tiết
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
