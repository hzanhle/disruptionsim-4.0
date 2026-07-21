interface ScreenFallbackProps {
  message?: string
}

export function ScreenFallback({
  message = 'Đang tải giao diện...',
}: ScreenFallbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-transparent text-slate-300"
    >
      <div className="flex w-48 flex-col gap-2" aria-hidden="true">
        <div className="h-2.5 animate-pulse rounded-full bg-slate-800" />
        <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-slate-800/80" />
        <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-slate-800/60" />
      </div>
      <p className="text-sm tracking-tight">{message}</p>
    </div>
  )
}
