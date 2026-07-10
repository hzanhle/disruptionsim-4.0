import { cn } from '@/lib/utils'

interface AssetImageProps {
  src?: string
  alt: string
  className?: string
  imgClassName?: string
}

/** Safe image wrapper — renders nothing when src is missing. */
export function AssetImage({ src, alt, className, imgClassName }: AssetImageProps) {
  if (!src) return null

  return (
    <div className={cn('overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  )
}
