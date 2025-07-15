import React from 'react'

export type ExamTypeKey = 'IELTS' | 'TOEIC' | 'TOEFL' | 'PTE' | 'VSTEP'

export interface ExamType {
  key: ExamTypeKey
  label: string
  info: string
  purpose: string
  tasks: TaskBrief[]
}

export interface TaskBrief {
  key: string
  name: string
  description: string
  time: string
  words: string
  topics?: string[]
  disabled?: boolean
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
  PTE: '#ff6b6b', // red
  VSTEP: '#9c3dff' // purple
}

const examTypeIcon: Record<ExamTypeKey, string> = {
  IELTS: '🎓',
  TOEIC: '📊',
  TOEFL: '🎤',
  PTE: '💻',
  VSTEP: '🇻🇳'
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
  <div className="bg-card rounded-xl mb-4 border p-4 border-gray-300 w-full min-w-0">
    {/* Header title and icon */}
    <div className="mb-8 flex items-center gap-2">
      <span className="text-xl text-primary">&#128218;</span>
      <h2 className="text-xl font-bold">Choose Task Type</h2>
    </div>
    {/* Exam type selector */}
    <div className="text-gray-700 text-sm font-semibold mb-2">Exam Type</div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {examTypes.map(({ key, label, info, purpose }) => {
        const isActive = selectedExam === key
        return (
          <button
            key={key}
            onClick={() => onSelectExam(key)}
            className={[
              'w-full rounded-xl px-6 py-4 flex flex-col items-start text-left transition focus:outline-none',
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
            <span className="text-xs text-gray-400 mt-1">{purpose}</span>
          </button>
        )
      })}
    </div>
    {/* Task type selector */}
    <div className="text-gray-700 text-sm font-semibold mb-2">Task Detail Type</div>
    <div className="flex flex-col gap-3">
      {tasks.map((task) => {
        const isActive = selectedTask === task.key
        const isDisabled = !!task.disabled
        return (
          <button
            key={task.key}
            onClick={() => !isDisabled && onSelectTask(task.key)}
            className={[
              'w-full border rounded-xl px-5 py-4 text-left transition group',
              isActive ? 'border-l-4 border-y border-r-0' : 'border',
              isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            ].join(' ')}
            style={
              isActive
                ? {
                    color: '#1a202c',
                    borderLeftColor: examTypeBorderColor[selectedExam],
                    ...(isDisabled && { backgroundColor: '#f3f4f6', color: '#bfbfbf' })
                  }
                : isDisabled
                  ? { backgroundColor: '#f3f4f6', color: '#bfbfbf' }
                  : {}
            }
            disabled={isDisabled}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
            title={isDisabled ? 'This task is temporarily unavailable' : undefined}
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 w-full">
              <div>
                <div className={'text-base font-semibold' + (isActive ? ' text-blue-800' : '')}>
                  {task.name}
                  {isDisabled && (
                    <span className="ml-2 text-xs text-gray-500 font-normal">(disabled)</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{task.description}</div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0 items-center justify-end min-w-fit text-right">
                <span className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium text-xs">
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontSize: 17 }}
                  ></span>
                  {task.time}
                </span>
                <span className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium text-xs">
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontSize: 17 }}
                  ></span>
                  {task.words}
                </span>
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
          Time: <b>{selectedTaskObj.time}</b>, words: <b>{selectedTaskObj.words}</b>.
        </div>
      </div>
    )}
  </div>
)

export default ExamAndTaskZone
