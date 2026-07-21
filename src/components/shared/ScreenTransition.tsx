import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { fadeSlide, getMotionProps } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type ScreenTransitionProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode
  className?: string
}

/** Full-screen enter/exit wrapper — opacity + small translateY only */
export function ScreenTransition({
  children,
  className,
  ...props
}: ScreenTransitionProps) {
  const reduced = useReducedMotion()
  const motionProps = getMotionProps(reduced, true)

  return (
    <motion.div
      className={cn('min-h-[100dvh]', className)}
      variants={fadeSlide}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}
