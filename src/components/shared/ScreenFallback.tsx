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
      className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300"
    >
      {message}
    </div>
  )
}
