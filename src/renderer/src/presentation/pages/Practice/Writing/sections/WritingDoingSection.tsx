import React from 'react'
import { MyExamType, TaskType } from '../PracticeWritingPage'
import WritingQuestionPreview from '../components/Doing/WritingQuestionPreview'
import WritingAnswerArea from '../components/Doing/WritingAnswerArea'
import TimerAndSubmit from '../components/Doing/TimerAndSubmit'
import WritingSuggestion from '../components/Doing/WritingSuggestion'

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
  onSaveDraft?: () => void
  onLoadSuggestion?: () => void
  remaining: number // remaining time in seconds
  answer: string
  onChangeAnswer: (val: string) => void
  canSubmit: boolean
  suggestions: string[]
  wordCount: number
  minWords: number
  evaluating?: boolean
}

const WritingDoingSection: React.FC<WritingDoingSectionProps> = ({
  exam,
  task,
  preview,
  onSubmit,
  onSaveDraft,
  onLoadSuggestion,
  remaining,
  answer,
  onChangeAnswer,
  canSubmit,
  suggestions,
  wordCount,
  minWords,
  evaluating
}) => {
  // Dummy handlers for demo - replace with props or state in parent as needed
  const handleSaveDraft =
    onSaveDraft || (() => window && window.alert && window.alert('Đã lưu nháp (demo)!'))
  const handleLoadSuggestion =
    onLoadSuggestion || (() => window && window.alert && window.alert('Đã tải thêm gợi ý (demo)!'))

  return (
    <div className="flex flex-row h-screen gap-6 px-4 pt-4 pb-8 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Left panel: 70% - Question and answering */}
      <div className="w-[70%] flex flex-col h-full bg-background rounded-xl border p-6 overflow-y-auto min-w-0">
        <WritingQuestionPreview exam={exam} task={task} preview={preview} />
        <WritingAnswerArea
          value={answer}
          onChange={onChangeAnswer}
          wordCount={wordCount}
          minWords={minWords}
        />
      </div>

      {/* Right panel: 30% - info, submit, suggestion */}
      <div className="w-[30%] flex flex-col h-full">
        <TimerAndSubmit
          remaining={remaining}
          onSubmit={onSubmit}
          onSaveDraft={handleSaveDraft}
          canSubmit={canSubmit}
          evaluating={evaluating}
        />
        <WritingSuggestion suggestions={suggestions} onLoadSuggestion={handleLoadSuggestion} />
        {/* You can add more right panel widgets here */}
      </div>
    </div>
  )
}

export default WritingDoingSection
