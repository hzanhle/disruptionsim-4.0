import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Signed money: +$50 / -$25 / $0 */
export function formatCurrency(value: number): string {
  if (value === 0) return '$0'
  if (value > 0) return `+$${value}`
  return `-$${Math.abs(value)}`
}

/**
 * Signed number. Pass suffix '$' for money (+$25 / -$25).
 * Non-currency: +1 / -2 / 0
 */
export function formatSigned(value: number, suffix = ''): string {
  if (suffix === '$') return formatCurrency(value)
  if (value === 0) return '0'
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value}`
}

export function formatBudget(value: number): string {
  return `$${value}`
}
