import React from 'react'
import { Eye } from 'lucide-react'

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
  <div className="bg-card rounded-xl p-4 mb-4 border">
    <div className="mb-2 text-lg font-bold flex items-center gap-2">
      <Eye className="w-5 h-5 text-primary" />
      Xem trước đề
    </div>
    <div className="border rounded-md px-4 py-3 mb-4 min-h-[68px] whitespace-pre-line text-gray-700">
      {preview
        ? preview
        : '(Chưa có đề nào được tạo. Hãy nhập yêu cầu hoặc tạo đề ngẫu nhiên nhé!)'}
    </div>
    {preview && (
      <div className="flex justify-end">
        <button
          className="bg-green-600 text-white font-bold px-8 py-2 hover:bg-green-700 transition"
          style={{ borderRadius: 8 }}
          disabled={!enabled}
          onClick={onStartExam}
        >
          Làm bài
        </button>
      </div>
    )}
  </div>
)

export default ExamPreviewAndAction
