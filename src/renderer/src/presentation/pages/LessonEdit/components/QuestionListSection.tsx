import React from 'react'
import { Plus } from 'lucide-react'
import QuestionListItem, { QuestionType } from './QuestionListItem'

const fakeQuestions: { question: string; type: QuestionType }[] = [
  {
    question: 'Which is bigger, the sun or the earth?',
    type: 'Multiple Choice'
  },
  {
    question: 'Fill in the blank: The capital of France is ____.',
    type: 'Fill in the blank'
  },
  {
    question: 'Is water wet?',
    type: 'True/False'
  },
  {
    question:
      'This is a very long question to demonstrate truncation in the list rendering component: What is photosynthesis?',
    type: 'Matching'
  }
]

interface QuestionListSectionProps {
  onAddQuestion: () => void
}

const QuestionListSection: React.FC<QuestionListSectionProps> = ({ onAddQuestion }) => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-base">
          Question <span className="text-black">({fakeQuestions.length})</span>
        </span>
        <button
          className="rounded-md p-1 transition"
          aria-label="Add Question"
          type="button"
          onClick={onAddQuestion}
        >
          <Plus size={18} />
        </button>
      </div>
      {/* Question List Items */}
      <div className="overflow-y-auto pr-0.5 flex-1 w-full">
        {fakeQuestions.map((q, idx) => (
          <QuestionListItem key={idx} number={idx + 1} question={q.question} type={q.type} />
        ))}
      </div>
    </div>
  )
}

export default QuestionListSection
