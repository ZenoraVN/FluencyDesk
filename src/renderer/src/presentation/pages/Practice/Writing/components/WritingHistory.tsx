import React from 'react'

type WritingHistoryItem = {
  id: string
  title: string
  date: string
  score?: string
}

const mockHistory: WritingHistoryItem[] = [
  { id: '1', title: 'IELTS Writing Task 2', date: '2025-07-10', score: '6.5' },
  { id: '2', title: 'TOEFL Integrated Writing', date: '2025-07-09', score: '22' },
  { id: '3', title: 'CERF Writing Type D', date: '2025-07-05', score: 'B2' }
]

const WritingHistory: React.FC = () => (
  <div className="bg-card rounded-xl p-4 h-1/2 w-full flex flex-col mb-4 border">
    <h2 className="text-xl font-semibold mb-3">Writing History</h2>
    <div className="flex-1 overflow-y-auto">
      {mockHistory.length === 0 && (
        <div className="text-gray-400 text-sm text-center">No recent history.</div>
      )}
      {mockHistory.map((item) => (
        <div
          key={item.id}
          className="mb-2 last:mb-0 bg-muted rounded-lg px-3 py-2 flex items-center justify-between hover:bg-accent transition"
        >
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-xs text-gray-500">{item.date}</div>
          </div>
          <div className="text-sm text-primary font-bold">{item.score || '-'}</div>
        </div>
      ))}
    </div>
  </div>
)

export default WritingHistory
