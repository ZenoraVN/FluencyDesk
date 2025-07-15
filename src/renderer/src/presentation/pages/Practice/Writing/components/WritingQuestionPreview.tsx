import React from 'react'
import { MyExamType, TaskType } from '../PracticeWritingPage'
import ChartRenderer from './ChartRenderer'

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
  <>
    <div className="mb-3">
      <div className="text-lg font-bold mb-2 flex gap-2 items-center">
        <span role="img" aria-label="writing">
          📝
        </span>
        {exam.label} &ndash; {task.name}
      </div>
      <div className="text-base mb-2 text-gray-600">{task.description}</div>
    </div>
    <div className="mb-4 border rounded p-4 bg-white dark:bg-gray-800 min-h-[80px]">
      {preview?.text || '(No exam question)'}
    </div>
    {preview?.chart && (
      <div className="mb-5 flex flex-col items-center">
        <div className="text-sm font-medium mb-2 text-gray-500">Chart Data</div>
        <div className="w-full max-w-[480px] border rounded-lg p-2 bg-white dark:bg-gray-900">
          <ChartRenderer chart={preview.chart} />
        </div>
      </div>
    )}
  </>
)

export default WritingQuestionPreview
