import React from 'react'

interface WritingAnswerAreaProps {
  value: string
  onChange: (v: string) => void
  wordCount?: number
  minWords?: number
}

const WritingAnswerArea: React.FC<WritingAnswerAreaProps> = ({
  value,
  onChange,
  wordCount = 0,
  minWords = 1
}) => {
  // Custom rich text editor can be dropped in here in the future.
  return (
    <div className="w-full flex flex-col flex-1 min-h-0" style={{ height: '100%' }}>
      <div className="mb-1 flex items-center justify-between">
        <div className="font-semibold text-md text-blue-700">Your Writing</div>
        <div className="text-xs font-mono text-gray-500 tabular-nums min-w-[60px] text-right select-none">
          {wordCount}/{minWords}
        </div>
      </div>
      <textarea
        className="w-full flex-1 min-h-[200px] max-h-[500px] h-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base resize-none overflow-y-auto"
        style={{ minHeight: 0, height: '100%', maxHeight: 'calc(100vh - 250px)' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
        aria-label="Your writing answer area"
      />
    </div>
  )
}

export default WritingAnswerArea
