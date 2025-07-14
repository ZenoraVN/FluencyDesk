import React from 'react'
import { ExamTypeKey } from './ExamAndTaskZone'

// These should be kept in sync with ExamAndTaskZone
const examTypeBorderColor: Record<ExamTypeKey, string> = {
  IELTS: '#1fa6e5',
  TOEIC: '#e5a11f',
  TOEFL: '#34b271',
  CEFR: '#9c3dff'
}

const examTypeIcon: Record<ExamTypeKey, string> = {
  IELTS: '🎓',
  TOEIC: '📊',
  TOEFL: '🎤',
  CEFR: '🏅'
}

type WritingHistoryItem = {
  id: string
  examType: ExamTypeKey
  taskKey: string
  taskName: string
  question: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  score?: string
}

const mockHistory: WritingHistoryItem[] = [
  {
    id: '1',
    examType: 'IELTS',
    taskKey: 'task2',
    taskName: 'Task 2 (Essay)',
    question:
      'Some people believe that technology makes life more complex, while others think it makes life easier. Discuss both views and give your opinion.',
    date: '2025-07-10',
    time: '21:12',
    score: '6.5'
  },
  {
    id: '2',
    examType: 'TOEFL',
    taskKey: 'independent',
    taskName: 'Independent Writing',
    question:
      'Do you agree or disagree with the following statement? It is more enjoyable to have a job with flexible hours than a job with fixed working hours. Use details and examples to support your answer.',
    date: '2025-07-09',
    time: '08:44',
    score: '22'
  },
  {
    id: '3',
    examType: 'CEFR',
    taskKey: 'essay',
    taskName: 'Essay',
    question:
      "Write an essay about the importance of learning a second language in today's globalized world.",
    date: '2025-07-05',
    time: '16:02',
    score: 'B2'
  },
  {
    id: '4',
    examType: 'TOEIC',
    taskKey: 'email',
    taskName: 'Write Email',
    question:
      'You are the manager of a team at work. Write an email to your staff reminding them about the upcoming project deadline and encouraging teamwork.',
    date: '2025-07-03',
    time: '10:18',
    score: '140'
  }
]

// Helper to get proper score label by exam type
const formatScore = (examType: ExamTypeKey, score?: string) => {
  if (!score) return '-'
  switch (examType) {
    case 'IELTS':
      return `${score} / 9.0`
    case 'TOEIC':
      return `${score} / 200`
    case 'TOEFL':
      return `${score} / 30`
    case 'CEFR':
      return score
    default:
      return score
  }
}

const WritingHistory: React.FC = () => (
  <div
    className="
      bg-card
      rounded-xl
      p-4
      h-full
      w-full
      flex flex-col
      mb-4
      border
      box-border
      overflow-hidden
    "
    style={{ minHeight: 0 }}
  >
    <h2 className="text-xl font-semibold mb-3">Writing History</h2>
    <div className="flex-1 overflow-y-auto min-h-0">
      {mockHistory.length === 0 && (
        <div className="text-gray-400 text-sm text-center">No recent history.</div>
      )}
      {mockHistory.map((item) => (
        <div
          key={item.id}
          className="
            mb-3
            last:mb-0
            bg-muted
            rounded-xl
            flex
            items-stretch
            hover:bg-accent
            border
            transition
            group
            w-full
            max-w-full
            box-border
            min-w-0
            overflow-hidden
            relative
          "
          style={{
            borderLeft: `4px solid ${examTypeBorderColor[item.examType]}`
          }}
        >
          <div className="flex flex-col justify-center w-fit min-w-0 relative py-3 pl-3 pr-2">
            {/* Score in corner */}
            <span
              className="
                absolute right-2 top-3
                text-sm 
                select-none
                "
            >
              {formatScore(item.examType, item.score)}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-1 min-w-0">
              <span className="text-xl">{examTypeIcon[item.examType]}</span>
              <span className="font-semibold">{item.examType}</span>
              <span className="mx-1 opacity-50">•</span>
              <span className="text-gray-600 truncate">{item.taskName}</span>
            </div>
            <div
              className="
                text-[15px]
                font-medium
                truncate
                text-ellipsis
                overflow-hidden
                whitespace-nowrap
                mb-1
                text-primary
                min-w-0
                w-full
              "
              title={item.question}
            >
              {item.question}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span>
                <span className="material-symbols-outlined align-middle text-[1.1em] mr-1">
                  event
                </span>
                {item.date}
              </span>
              <span>
                <span className="material-symbols-outlined align-middle text-[1.1em] mr-1">
                  schedule
                </span>
                {item.time}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default WritingHistory
