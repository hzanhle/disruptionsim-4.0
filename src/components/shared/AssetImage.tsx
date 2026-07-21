import { cn } from '@/lib/utils'

interface AssetImageProps {
  src?: string
  alt: string
  /**
   * Frame size classes. Use ONE of: aspect ratio OR fixed height/size — never both with max-height.
   * Prefer `w-full aspect-video` for card heroes.
   */
  className?: string
  imgClassName?: string
  /** cover = fill frame (scenes). contain = letterbox inside frame (logos). */
  fit?: 'cover' | 'contain'
  /** Soft padding + inset ring so art is not flush to the card border. */
  inset?: boolean
}

/**
 * Safe image wrapper — renders nothing when src is missing.
 * Frame is always sized by `className`; the img always fills that frame.
 */
export function AssetImage({
  src,
  alt,
  className,
  imgClassName,
  fit = 'contain',
  inset = false,
}: AssetImageProps) {
  if (!src) return null

  const frame = (
    <div
      className={cn(
        'w-full overflow-hidden',
        fit === 'contain' && 'bg-slate-950',
        inset
          ? 'h-full rounded-xl ring-1 ring-inset ring-slate-700/50'
          : className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          'h-full w-full object-center',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          imgClassName,
        )}
      />
    </div>
  )

  if (!inset) return frame

  return <div className={cn('w-full p-1 sm:p-1.5', className)}>{frame}</div>
}
