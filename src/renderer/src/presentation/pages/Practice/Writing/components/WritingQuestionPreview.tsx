import React from 'react'
import { MyExamType, TaskType } from '../PracticeWritingPage'
import ChartRenderer from './ChartRenderer'
import { examTypeBorderColor } from './examTypeColors'

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
    {preview?.chart && (
      <div className="mb-5 flex flex-col items-center">
        <div className="text-sm font-medium mb-2 text-gray-500">Chart Data</div>
        <div className="w-full max-w-[480px] border rounded-lg p-2 bg-white dark:bg-gray-900">
          <ChartRenderer chart={preview.chart} />
        </div>
      </div>
    )}
  </div>
)

export default WritingQuestionPreview
