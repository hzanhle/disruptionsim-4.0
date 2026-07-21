import { ScrollText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonthHistoryEntry } from '@/types/game'

interface ActivityLogProps {
  history: MonthHistoryEntry[]
}

export function ActivityLog({ history }: ActivityLogProps) {
  const recent = [...history].reverse().slice(0, 5)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-violet-400" />
          <CardTitle className="text-lg">Nhật ký hoạt động</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-base text-slate-400">Chưa có hoạt động nào được ghi nhận.</p>
        ) : (
          <ul className="space-y-3 text-base text-slate-300">
            {recent.map((entry) => (
              <li key={entry.month} className="border-l-2 border-slate-700 pl-3">
                <p className="font-medium text-slate-100">
                  Tháng {entry.month}: {entry.eventTitle}
                </p>
                <p className="mt-1 text-sm text-slate-400 sm:text-base">{entry.eventMessage}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
