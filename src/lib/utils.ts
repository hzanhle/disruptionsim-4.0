import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  const prefix = value >= 0 ? '+' : ''
  return `${prefix}$${Math.abs(value)}`
}

export function formatSigned(value: number, suffix = ''): string {
  if (value === 0) return `0${suffix}`
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value}${suffix}`
}

export function formatBudget(value: number): string {
  return `$${value}`
}
