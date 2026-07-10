import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonthHistoryEntry } from '@/types/game'

interface HistoryChartProps {
  history: MonthHistoryEntry[]
}

export function HistoryChart({ history }: HistoryChartProps) {
  if (history.length === 0) return null

  const data = history.map((entry) => ({
    month: `T${entry.month}`,
    budget: entry.after.budget,
    llsx: entry.after.llsx,
    qhsx: entry.after.qhsx,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base" id="history-chart-title">
          Biểu đồ hành trình
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="h-64"
          role="img"
          aria-labelledby="history-chart-title"
          aria-describedby="history-chart-summary"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="budget"
                name="Ngân sách"
                stroke="#34d399"
                strokeWidth={2}
                dot
              />
              <Line
                type="monotone"
                dataKey="llsx"
                name="LLSX"
                stroke="#22d3ee"
                strokeWidth={2}
                dot
              />
              <Line
                type="monotone"
                dataKey="qhsx"
                name="QHSX"
                stroke="#a78bfa"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p id="history-chart-summary" className="sr-only">
          Biểu đồ đường thể hiện Ngân sách, LLSX và QHSX qua {history.length} tháng đã hoàn thành.
          Tháng gần nhất: Ngân sách ${data[data.length - 1]?.budget}, LLSX{' '}
          {data[data.length - 1]?.llsx}, QHSX {data[data.length - 1]?.qhsx}.
        </p>

        <div className="overflow-x-auto">
          <table className="sr-only">
            <caption>Bảng số liệu hành trình theo tháng</caption>
            <thead>
              <tr>
                <th scope="col">Tháng</th>
                <th scope="col">Ngân sách</th>
                <th scope="col">LLSX</th>
                <th scope="col">QHSX</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.month}>
                  <th scope="row">{row.month}</th>
                  <td>${row.budget}</td>
                  <td>{row.llsx}</td>
                  <td>{row.qhsx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
