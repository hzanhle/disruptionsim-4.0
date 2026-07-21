import { cn } from '@/lib/utils'

interface AssetImageProps {
  src?: string
  alt: string
  className?: string
  imgClassName?: string
  /** Default contain — safer for AI art. Use cover for scene/hero bleed. */
  fit?: 'cover' | 'contain'
  /** Soft inset inside a card so art is not flush to the border. */
  inset?: boolean
}

/** Safe image wrapper — renders nothing when src is missing. */
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
        'overflow-hidden',
        fit === 'contain' && 'flex items-center justify-center bg-slate-950',
        inset && 'rounded-lg ring-1 ring-inset ring-slate-700/50',
        !inset && className,
        inset && 'h-full w-full',
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          fit === 'cover'
            ? 'h-full w-full object-cover object-center'
            : 'max-h-full max-w-full object-contain object-center',
          imgClassName,
        )}
      />
    </div>
  )

  if (!inset) return frame

  return <div className={cn('p-3', className)}>{frame}</div>
}
