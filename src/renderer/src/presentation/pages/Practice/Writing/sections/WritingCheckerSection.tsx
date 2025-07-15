import React from 'react'
import { MyExamType, TaskType, WritingPreviewData, EvaluationResult } from '../PracticeWritingPage'
import { examTypeBorderColor } from '../components/examTypeColors'

interface WritingCheckerSectionProps {
  exam: MyExamType
  task: TaskType
  preview: WritingPreviewData | null
  answer: string
  evaluation: EvaluationResult
  onRetry: () => void
}

function WritingCheckerSection({
  exam,
  task,
  preview,
  answer,
  evaluation,
  onRetry
}: WritingCheckerSectionProps) {
  return (
    <div className="flex flex-col h-full p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Kết quả đánh giá - {exam.label} {task.name}
        </h2>
        <div
          className="px-4 py-2 rounded-full text-white font-bold"
          style={{ backgroundColor: examTypeBorderColor[exam.key] }}
        >
          Điểm: {evaluation.score}/10
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-grow">
        {/* Cột trái: Đề bài và bài làm */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">Đề bài:</h3>
            <p className="whitespace-pre-line">{preview?.text}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-lg mb-2">Bài làm của bạn:</h3>
            <p className="whitespace-pre-line">{answer}</p>
          </div>
        </div>

        {/* Cột phải: Đánh giá chi tiết */}
        <div className="bg-gray-50 p-4 rounded-lg border h-full overflow-y-auto">
          <h3 className="font-semibold text-lg mb-4">Nhận xét tổng quan:</h3>
          <p className="mb-6 p-3 bg-yellow-50 rounded">{evaluation.feedback}</p>

          <h3 className="font-semibold text-lg mb-4">Phân tích chi tiết:</h3>
          <div className="space-y-4">
            {Object.entries(evaluation.detailedAnalysis).map(([criteria, feedback]) => (
              <div key={criteria} className="p-3 border-b">
                <h4 className="font-medium text-blue-700">{criteria}:</h4>
                <p>{feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="px-6 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          onClick={onRetry}
        >
          Làm lại bài
        </button>
      </div>
    </div>
  )
}

export { WritingCheckerSection }
