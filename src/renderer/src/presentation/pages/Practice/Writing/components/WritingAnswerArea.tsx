import React from 'react'

interface WritingAnswerAreaProps {
  value: string
  onChange: (v: string) => void
}

const WritingAnswerArea: React.FC<WritingAnswerAreaProps> = ({ value, onChange }) => {
  // Custom rich text editor can be dropped in here in the future.
  return (
    <div className="w-full">
      <div className="mb-1 font-semibold text-md text-blue-700">Your Writing</div>
      <textarea
        className="w-full min-h-[200px] p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
      />
    </div>
  )
}

export default WritingAnswerArea
