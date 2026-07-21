import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn, formatBudget, formatSigned } from '@/lib/utils'
import { durations, easeOutSoft } from '@/lib/motion'

type NumberFormat = 'plain' | 'budget' | 'signed' | 'currency'

interface AnimatedNumberProps {
  value: number
  format?: NumberFormat
  className?: string
  /** Flash green/red briefly when value changes */
  flashOnChange?: boolean
}

function formatValue(value: number, format: NumberFormat): string {
  switch (format) {
    case 'budget':
      return formatBudget(Math.round(value))
    case 'signed':
      return formatSigned(Math.round(value))
    case 'currency':
      return formatSigned(Math.round(value), '$')
    default:
      return String(Math.round(value))
  }
}

/**
 * Interpolates a number on change. Instant when prefers-reduced-motion.
 */
export function AnimatedNumber({
  value,
  format = 'plain',
  className,
  flashOnChange = false,
}: AnimatedNumberProps) {
  const reduced = useReducedMotion()
  const motionValue = useMotionValue(value)
  const [display, setDisplay] = useState(() => formatValue(value, format))
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)

  useMotionValueEvent(motionValue, 'change', (latest) => {
    setDisplay(formatValue(latest, format))
  })

  useEffect(() => {
    if (reduced) {
      motionValue.set(value)
      setDisplay(formatValue(value, format))
      return
    }

    const prev = motionValue.get()
    if (prev === value) return

    if (flashOnChange) {
      setFlash(value > prev ? 'up' : value < prev ? 'down' : null)
      const t = window.setTimeout(() => setFlash(null), 420)
      const controls = animate(motionValue, value, {
        duration: durations.screen,
        ease: easeOutSoft,
      })
      return () => {
        window.clearTimeout(t)
        controls.stop()
      }
    }

    const controls = animate(motionValue, value, {
      duration: durations.screen,
      ease: easeOutSoft,
    })
    return () => controls.stop()
  }, [value, format, reduced, motionValue, flashOnChange])

  return (
    <span
      className={cn(
        'tabular-nums transition-colors duration-300',
        flash === 'up' && 'text-emerald-400',
        flash === 'down' && 'text-red-400',
        className,
      )}
    >
      {display}
    </span>
  )
}
