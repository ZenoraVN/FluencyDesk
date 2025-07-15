import React from 'react'
import WritingHistory from '../components/Create/WritingHistory'
import ExamAndTaskZone from '../components/Create/ExamAndTaskZone'
import TopicSelector from '../components/Create/TopicSelector'
import AiPromptInput from '../components/Create/AiPromptInput'
import ExamPreviewAndAction from '../components/Create/ExamPreviewAndAction'

import type { MyExamType, TaskType } from '../PracticeWritingPage'

type ChartPreview = {
  chartType: string
  chartData: any
  chartOptions?: any
}
interface WritingPreviewData {
  text: string
  chart?: ChartPreview | null
}

import type { ExamTypeKey } from '../PracticeWritingPage'

interface WritingCreationSectionProps {
  examTypes: MyExamType[]
  selectedExam: ExamTypeKey
  setSelectedExam: (exam: ExamTypeKey) => void
  exam: MyExamType
  selectedTask: string
  setSelectedTask: (task: string) => void
  customTopic: string
  setCustomTopic: (topic: string) => void
  selectedTopic: string
  setSelectedTopic: (topic: string) => void
  aiPrompt: string
  setAiPrompt: (val: string) => void
  preview: WritingPreviewData | null
  created: boolean
  loading: boolean
  error: string | null
  onCreateByPrompt: () => void
  onCreateRandom: () => void
  disableCreateByPrompt: boolean
  selectedTaskObj?: TaskType
  topics: string[]
  onClickStartExam: () => void
}

const WritingCreationSection: React.FC<WritingCreationSectionProps> = ({
  examTypes,
  selectedExam,
  setSelectedExam,
  exam,
  selectedTask,
  setSelectedTask,
  customTopic,
  setCustomTopic,
  selectedTopic,
  setSelectedTopic,
  aiPrompt,
  setAiPrompt,
  preview,
  created,
  loading,
  error,
  onCreateByPrompt,
  onCreateRandom,
  disableCreateByPrompt,
  selectedTaskObj,
  topics,
  onClickStartExam
}) => {
  return (
    <div className="flex flex-row h-screen gap-6 px-4 pt-4 pb-8 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Left Panel: Writing History + (future) statistics */}
      <div className="w-1/4 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-background border-r pr-4 min-w-0 max-w-full">
        <WritingHistory />
        <div className="flex-1 mt-8 bg-background border rounded-xl flex items-center justify-center text-gray-400 text-md">
          (Statistics coming soon)
        </div>
      </div>
      {/* Right Panel: Exam Creation */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto w-20">
        <div className="min-w-0 max-w-full">
          <ExamAndTaskZone
            examTypes={examTypes}
            selectedExam={selectedExam}
            onSelectExam={setSelectedExam}
            tasks={exam.tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            selectedTaskObj={selectedTaskObj}
          />
        </div>
        {/* Topic Selector, only if task has topics */}
        {topics.length > 0 && (
          <TopicSelector
            topics={topics}
            selectedTopic={selectedTopic}
            onSelect={setSelectedTopic}
            customTopic={customTopic}
            setCustomTopic={setCustomTopic}
          />
        )}
        <AiPromptInput
          value={aiPrompt}
          onChange={setAiPrompt}
          onCreateByPrompt={onCreateByPrompt}
          onCreateRandom={onCreateRandom}
          disableCreateByPrompt={disableCreateByPrompt}
        />
        <div className="min-w-0 max-w-full">
          {loading && (
            <div className="flex items-center gap-2 mb-2 text-yellow-700 animate-pulse">
              <span className="animate-spin text-2xl">⏳</span>
              Generating exam with Gemini...
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-3 mb-4">
              {error}
            </div>
          )}
        </div>
        <ExamPreviewAndAction
          preview={preview}
          enabled={created && !loading && !error}
          onStartExam={onClickStartExam}
        />
      </div>
    </div>
  )
}

export default WritingCreationSection
