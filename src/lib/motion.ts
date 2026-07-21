import type { Transition, Variants } from 'framer-motion'

/** Shared cubic-bezier — soft decelerate */
export const easeOutSoft = [0.16, 1, 0.3, 1] as const

export const durations = {
  micro: 0.18,
  screen: 0.32,
  screenExit: 0.22,
  stagger: 0.05,
} as const

export const softTransition: Transition = {
  duration: durations.screen,
  ease: easeOutSoft,
}

export const microTransition: Transition = {
  duration: durations.micro,
  ease: easeOutSoft,
}

export const screenTransition: Transition = {
  duration: durations.screen,
  ease: easeOutSoft,
}

export const screenExitTransition: Transition = {
  duration: durations.screenExit,
  ease: easeOutSoft,
}

/** Enter / exit for full screens */
export const fadeSlide: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: screenTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: screenExitTransition,
  },
}

/** Soft scale-in (ending hero, cards) */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: softTransition,
  },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: durations.stagger,
      delayChildren: 0.04,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: microTransition,
  },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: microTransition,
  },
}

/**
 * When reduced-motion is on, skip enter animation (instant visible).
 * Pass withExit only for AnimatePresence screen wrappers.
 */
export function getMotionProps(reduced: boolean, withExit = false) {
  if (reduced) {
    return {
      initial: false as const,
      animate: 'animate' as const,
    }
  }
  return {
    initial: 'initial' as const,
    animate: 'animate' as const,
    ...(withExit ? { exit: 'exit' as const } : {}),
  }
}
