import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight transition-[transform,background-color,border-color,box-shadow,color,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-cyan-500 text-slate-950 shadow-[0_8px_24px_-8px_rgb(34_211_238_/_0.55)] hover:bg-cyan-400 hover:shadow-[0_10px_28px_-8px_rgb(34_211_238_/_0.65)]',
        secondary:
          'border border-slate-700/80 bg-slate-800/90 text-slate-100 hover:border-slate-600 hover:bg-slate-700',
        outline:
          'border border-slate-600/90 bg-transparent text-slate-100 hover:border-slate-500 hover:bg-slate-800/80',
        destructive:
          'bg-red-600 text-white shadow-[0_8px_24px_-10px_rgb(220_38_38_/_0.55)] hover:bg-red-500',
        ghost: 'font-medium text-slate-200 hover:bg-slate-800/80 hover:text-slate-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-[13px]',
        lg: 'h-11 rounded-xl px-7 text-[15px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
