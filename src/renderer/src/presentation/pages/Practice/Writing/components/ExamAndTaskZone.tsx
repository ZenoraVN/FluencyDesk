import React from 'react'

export type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'CEFR'

export interface ExamType {
  key: ExamTypeKey
  label: string
  info: string
  tasks: TaskBrief[]
}

export interface TaskBrief {
  key: string
  name: string
  description: string
  time: string
  words: string
  topics?: string[]
}

interface ExamAndTaskZoneProps {
  examTypes: ExamType[]
  selectedExam: ExamTypeKey
  onSelectExam: (type: ExamTypeKey) => void
  tasks: TaskBrief[]
  selectedTask: string
  onSelectTask: (key: string) => void
  selectedTaskObj?: TaskBrief
}

const examTypeBorderColor: Record<ExamTypeKey, string> = {
  IELTS: '#1fa6e5', // blue
  TOEIC: '#e5a11f', // yellow/orange
  TOEFL: '#34b271', // green
  CEFR: '#9c3dff' // purple
}

const examTypeIcon: Record<ExamTypeKey, string> = {
  IELTS: '🎓',
  TOEIC: '📊',
  TOEFL: '🎤',
  CEFR: '🏅'
}

const ExamAndTaskZone: React.FC<ExamAndTaskZoneProps> = ({
  examTypes,
  selectedExam,
  onSelectExam,
  tasks,
  selectedTask,
  onSelectTask,
  selectedTaskObj
}) => (
  <div className="bg-card rounded-xl mb-4 border p-4 border-gray-300">
    {/* Header title and icon */}
    <div className="mb-8 flex items-center gap-2">
      <span className="text-xl text-primary">&#128218;</span>
      <h2 className="text-xl font-bold">Lựa chọn dạng bài</h2>
    </div>
    {/* Exam type selector */}
    <div className="text-gray-700 text-sm font-semibold mb-2">Loại kỳ thi</div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {examTypes.map(({ key, label, info }) => {
        const isActive = selectedExam === key
        return (
          <button
            key={key}
            onClick={() => onSelectExam(key)}
            className={[
              'w-full rounded-xl px-6 py-4 flex flex-col items-start text-left transition focus:outline-none hover:border-[#52aaad]',
              isActive
                ? 'border-t-[4px] border-x border-b border-x-gray-300 border-b-gray-300'
                : 'border border-gray-300 text-gray-900 dark:text-gray-200'
            ].join(' ')}
            style={
              isActive
                ? {
                    color: '#222',
                    borderTopColor: examTypeBorderColor[key]
                  }
                : {}
            }
          >
            <span className="flex items-center gap-2 text-lg font-semibold">
              <span>{examTypeIcon[key]}</span>
              <span>{label}</span>
            </span>
            <span className="text-sm text-gray-500 mt-1">{info}</span>
          </button>
        )
      })}
    </div>
    {/* Task type selector */}
    <div className="text-gray-700 text-sm font-semibold mb-2">Dạng bài cụ thể</div>
    <div className="flex flex-col gap-3">
      {tasks.map((task) => {
        const isActive = selectedTask === task.key
        return (
          <button
            key={task.key}
            onClick={() => onSelectTask(task.key)}
            className={[
              'w-full border rounded-xl px-5 py-4 text-left transition group',
              isActive ? 'border-l-4 border-y border-r-0' : 'border'
            ].join(' ')}
            style={
              isActive
                ? {
                    color: '#1a202c',
                    background: '#f8fafc',
                    borderLeftColor: examTypeBorderColor[selectedExam]
                  }
                : {}
            }
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className={'text-base font-semibold' + (isActive ? ' text-blue-800' : '')}>
                  {task.name}
                </div>
                <div className="text-sm text-gray-500">{task.description}</div>
              </div>
              <div className="flex gap-4 mt-2 sm:mt-0 text-sm text-blue-500 items-center">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg" style={{ fontSize: 18 }}>
                    timer
                  </span>
                  <span>{task.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg" style={{ fontSize: 18 }}>
                    format_color_text
                  </span>
                  <span>{task.words}</span>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
    {/* Info summary (moved from PracticeWritingPage) */}
    {selectedTaskObj && (
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 mt-6">
        <div className="text-sm">
          <span className="font-bold">{selectedTaskObj.name}:</span> {selectedTaskObj.description}.
          Thời gian: <b>{selectedTaskObj.time}</b>, từ: <b>{selectedTaskObj.words}</b>.
        </div>
      </div>
    )}
  </div>
)

export default ExamAndTaskZone
