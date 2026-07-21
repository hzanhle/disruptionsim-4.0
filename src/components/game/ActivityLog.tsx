import { useState } from 'react'
import { ScrollText, ChevronDown, ChevronUp, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonthHistoryEntry } from '@/types/game'
import { useGameStore } from '@/store/gameStore'

interface ActivityLogProps {
  history: MonthHistoryEntry[]
}

export function ActivityLog({ history }: ActivityLogProps) {
  const currentMonth = useGameStore((state) => state.currentMonth)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const activeMonthDisplay =
    selectedMonth ?? (history.length > 0 ? history[history.length - 1].month : currentMonth)
  const activeEntry = history.find((h) => h.month === activeMonthDisplay)

  return (
    <Card className="overflow-hidden border border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <CardHeader className="p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-cyan-400" />
            <CardTitle className="text-sm font-bold text-slate-100">
              Nhật ký hoạt động
            </CardTitle>
          </div>
          <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 font-mono text-xs font-semibold text-cyan-300 border border-cyan-500/30">
            Đang ở Tháng {currentMonth}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3.5 pt-1 space-y-3">
        {history.length > 0 ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/50 hover:bg-slate-950"
            >
              <div className="flex items-center gap-2 truncate">
                <History className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {activeEntry
                    ? `Tháng ${activeEntry.month}: ${activeEntry.eventTitle}`
                    : `Tháng ${currentMonth}: Đang trong tiến trình...`}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-cyan-400 shrink-0 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
              )}
            </button>

            {isOpen ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-2 space-y-1.5 max-h-56 overflow-y-auto">
                <p className="text-[11px] font-semibold text-slate-400 px-2 pt-1 uppercase tracking-wider">
                  Chọn tháng để xem lịch sử:
                </p>
                {history.map((entry) => {
                  const isSelected = entry.month === activeMonthDisplay
                  return (
                    <button
                      key={entry.month}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(entry.month)
                        setIsOpen(false)
                      }}
                      className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/30 font-medium'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                      }`}
                    >
                      <span className="font-mono text-cyan-400 font-bold shrink-0">
                        T{entry.month}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{entry.eventTitle}</p>
                        <p className="truncate text-[11px] text-slate-400">
                          {entry.selectedChoiceTitle ?? 'Sự kiện tự động'}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : null}

            {activeEntry ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                  <span>
                    Tháng {activeEntry.month}: {activeEntry.eventTitle}
                  </span>
                  {activeEntry.selectedChoiceTitle ? (
                    <span className="text-[11px] font-normal text-slate-400">
                      Lựa chọn: {activeEntry.selectedChoiceTitle}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  {activeEntry.eventMessage}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 text-xs text-slate-400 text-center">
            Đang ở <strong className="text-cyan-300">Tháng {currentMonth}</strong> — Chưa có lịch sử tháng trước.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
