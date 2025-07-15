import React from 'react'

interface WritingAnswerAreaProps {
  value: string
  onChange: (v: string) => void
  wordCount?: number
  minWords?: number
  maxWords?: number
}

const WritingAnswerArea: React.FC<WritingAnswerAreaProps> = ({
  value,
  onChange,
  wordCount = 0,
  minWords = 1,
  maxWords = 300
}) => {
  const progress = Math.min(100, (wordCount / maxWords) * 100)
  const isWarning = wordCount < minWords
  const isOver = wordCount > maxWords

  return (
    <div className="w-full flex flex-col flex-1 min-h-0" style={{ height: '100%' }}>
      <div className="mb-1 flex items-center justify-between">
        <div className="font-semibold text-md text-blue-700">Bài viết của bạn</div>
        <div className="text-xs font-mono text-gray-500 tabular-nums min-w-[120px] text-right select-none flex items-center">
          <span
            className={isWarning ? 'text-red-500' : isOver ? 'text-orange-500' : 'text-green-500'}
          >
            {wordCount} từ
          </span>
          <span className="mx-1">/</span>
          <span>
            yêu cầu: {minWords}-{maxWords}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${
            progress < 70 ? 'bg-green-500' : progress < 90 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <textarea
        className="w-full flex-1 min-h-[200px] max-h-[500px] h-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base resize-none overflow-y-auto"
        style={{ minHeight: 0, height: '100%', maxHeight: 'calc(100vh - 250px)' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập bài viết của bạn tại đây..."
        aria-label="Khu vực viết bài"
      />
    </div>
  )
}

export default WritingAnswerArea
