import { cn } from '@/lib/utils'

interface AssetImageProps {
  src?: string
  alt: string
  className?: string
  imgClassName?: string
  /** Default contain — safer for AI art. Use cover for scene/hero bleed. */
  fit?: 'cover' | 'contain'
}

/** Safe image wrapper — renders nothing when src is missing. */
export function AssetImage({
  src,
  alt,
  className,
  imgClassName,
  fit = 'contain',
}: AssetImageProps) {
  if (!src) return null

  return (
    <div
      className={cn(
        'overflow-hidden',
        fit === 'contain' && 'bg-slate-950',
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          'h-full w-full',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          imgClassName,
        )}
      />
    </div>
  )
}
