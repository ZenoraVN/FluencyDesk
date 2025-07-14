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

const ExamAndTaskZone: React.FC<ExamAndTaskZoneProps> = ({
  examTypes,
  selectedExam,
  onSelectExam,
  tasks,
  selectedTask,
  onSelectTask,
  selectedTaskObj
}) => (
  <div className="bg-card rounded-xl mb-4 border p-4">
    {/* Header title and icon */}
    <div className="mb-8 flex items-center gap-2">
      <span className="text-xl text-primary">&#128218;</span>
      <h2 className="text-xl font-bold">Lựa chọn dạng bài</h2>
    </div>
    {/* Exam type selector */}
    <div className="text-gray-700 text-sm font-semibold mb-2">Loại kỳ thi</div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {examTypes.map(({ key, label, info }) => (
        <button
          key={key}
          onClick={() => onSelectExam(key)}
          className={[
            'w-full border rounded-xl px-6 py-4 flex flex-col items-start text-left transition focus:outline-none',
            selectedExam === key
              ? 'bg-blue-600 border-blue-600 text-white font-bold'
              : 'bg-white dark:bg-muted border-border text-gray-900 dark:text-gray-200 hover:bg-blue-50 hover:border-blue-400'
          ].join(' ')}
        >
          <span className="text-lg font-semibold">{label}</span>
          <span className="text-sm text-gray-300 dark:text-gray-400 mt-1">{info}</span>
        </button>
      ))}
    </div>
    {/* Task type selector */}
    <div className="text-gray-700 text-sm font-semibold mb-2">Dạng bài cụ thể</div>
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <button
          key={task.key}
          onClick={() => onSelectTask(task.key)}
          className={[
            'w-full border rounded-xl px-5 py-4 text-left transition group',
            selectedTask === task.key
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white dark:bg-muted border-border hover:border-blue-400'
          ].join(' ')}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div
                className={
                  'text-base font-semibold' + (selectedTask === task.key ? ' text-blue-800' : '')
                }
              >
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
      ))}
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
