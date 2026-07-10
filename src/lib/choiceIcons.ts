import {
  Anchor,
  Bot,
  Circle,
  ClipboardCheck,
  Cpu,
  EyeOff,
  Factory,
  Leaf,
  Network,
  ShieldCheck,
  TrendingDown,
  UserMinus,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Anchor,
  Bot,
  ClipboardCheck,
  Cpu,
  EyeOff,
  Factory,
  Leaf,
  Network,
  ShieldCheck,
  TrendingDown,
  UserMinus,
  Users,
  Wrench,
  Zap,
}

export function getChoiceIcon(name: string): LucideIcon {
  return iconMap[name] ?? Circle
}
