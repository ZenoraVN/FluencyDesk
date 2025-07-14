import React from 'react'

interface ExamPreviewAndActionProps {
  preview: string | null
  enabled: boolean
  onStartExam?: () => void
}

const ExamPreviewAndAction: React.FC<ExamPreviewAndActionProps> = ({
  preview,
  enabled,
  onStartExam
}) => (
  <div className="bg-card rounded-xl p-8 mb-4">
    <div className="mb-2 text-lg font-bold">Xem trước đề</div>
    <div className="bg-blue-50 border rounded-md px-4 py-3 mb-4 min-h-[68px] whitespace-pre-line text-gray-700">
      {preview
        ? preview
        : '(Chưa có đề nào được tạo. Hãy nhập yêu cầu hoặc tạo đề ngẫu nhiên nhé!)'}
    </div>
    <button
      className="bg-green-600 text-white font-bold rounded px-8 py-2 hover:bg-green-700 transition"
      disabled={!enabled}
      onClick={onStartExam}
    >
      Làm bài
    </button>
  </div>
)

export default ExamPreviewAndAction
