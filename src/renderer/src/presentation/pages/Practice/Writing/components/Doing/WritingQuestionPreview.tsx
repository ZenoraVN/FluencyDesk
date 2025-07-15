import React from 'react'
import { MyExamType, TaskType } from '../../PracticeWritingPage'
import { examTypeBorderColor } from '../../data/examTypeColors'

type ChartPreview = {
  chartType: string
  chartData: any
  chartOptions?: any
}
interface WritingPreviewData {
  text: string
  chart?: ChartPreview | null
}

interface WritingQuestionPreviewProps {
  exam: MyExamType
  task: TaskType
  preview: WritingPreviewData | null
}

const WritingQuestionPreview: React.FC<WritingQuestionPreviewProps> = ({ exam, task, preview }) => (
  <div>
    <div className="mb-3">
      <div className="text-lg font-bold mb-2 flex gap-2 items-center">
        <span role="img" aria-label="writing">
          📝
        </span>
        {exam.label} &ndash; {task.name}
      </div>
      <div className="text-base mb-2 text-gray-600">{task.description}</div>
    </div>
    <div
      className="mb-4 border px-4 py-3 bg-gray-50 min-h-[68px] whitespace-pre-line rounded-lg border-l-4 rounded-l-lg"
      style={{ borderLeftColor: examTypeBorderColor[exam.key] }}
    >
      {preview?.text ? (
        <div className="font-medium text-gray-800">{preview.text}</div>
      ) : (
        '(No exam question)'
      )}
    </div>
  </div>
)

export default WritingQuestionPreview
