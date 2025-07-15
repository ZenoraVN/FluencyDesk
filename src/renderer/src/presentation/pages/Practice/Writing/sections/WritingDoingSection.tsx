import React from 'react'
import { MyExamType, TaskType } from '../PracticeWritingPage'
import WritingQuestionPreview from '../components/WritingQuestionPreview'
import WritingAnswerArea from '../components/WritingAnswerArea'
import TimerAndSubmit from '../components/TimerAndSubmit'
import WritingSuggestion from '../components/WritingSuggestion'

interface WritingPreviewData {
  text: string
  chart?: {
    chartType: string
    chartData: any
    chartOptions?: any
  } | null
}

interface WritingDoingSectionProps {
  exam: MyExamType
  task: TaskType
  preview: WritingPreviewData | null
  onSubmit: () => void
  remaining: number // remaining time in seconds
  answer: string
  onChangeAnswer: (val: string) => void
  canSubmit: boolean
  suggestions: string[]
}

const WritingDoingSection: React.FC<WritingDoingSectionProps> = ({
  exam,
  task,
  preview,
  onSubmit,
  remaining,
  answer,
  onChangeAnswer,
  canSubmit,
  suggestions
}) => {
  return (
    <div className="flex flex-row h-screen gap-6 px-4 pt-4 pb-8 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Left panel: 70% - Question and answering */}
      <div className="w-[70%] flex flex-col h-full bg-background rounded-xl border p-6 overflow-y-auto min-w-0">
        <WritingQuestionPreview exam={exam} task={task} preview={preview} />
        <WritingAnswerArea value={answer} onChange={onChangeAnswer} />
      </div>

      {/* Right panel: 30% - info, submit, suggestion */}
      <div className="w-[30%] flex flex-col h-full">
        <TimerAndSubmit remaining={remaining} onSubmit={onSubmit} canSubmit={canSubmit} />
        <WritingSuggestion suggestions={suggestions} />
        {/* You can add more right panel widgets here */}
      </div>
    </div>
  )
}

export default WritingDoingSection
