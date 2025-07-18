import React from 'react'
import type { QuestionDefinition } from '../../QuestionCreate/types/questionDetail'
import { QuestionChoiceCard } from './QuestionChoiceCard'
import QuestionCreateCard from './QuestionCreateCard'
import QuestionEditorCard from './QuestionEditorCard'

interface QuestionEditorSectionProps {
  isQuestionChoiceCardOpen: boolean
  createdQuestion: QuestionDefinition | null
  onQuestionTypeChosen: (q: QuestionDefinition) => void
  onCancelCreate: () => void
}

const fakeEditorCards = [
  {
    title: 'Question 1: Which is bigger?',
    description: 'Edit area for multiple choice question.'
  },
  {
    title: 'Question 2: Fill in the blank',
    description: 'Edit area for fill in the blank question.'
  },
  {
    title: 'Question 3: Is water wet?',
    description: 'Edit area for true/false question.'
  }
]

const QuestionEditorSection: React.FC<QuestionEditorSectionProps> = ({
  isQuestionChoiceCardOpen,
  createdQuestion,
  onQuestionTypeChosen,
  onCancelCreate
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {createdQuestion ? (
        <div className="mb-5">
          <QuestionCreateCard question={createdQuestion} onDelete={onCancelCreate} />
        </div>
      ) : isQuestionChoiceCardOpen ? (
        <div className="mb-5">
          <QuestionChoiceCard onCreate={onQuestionTypeChosen} />
        </div>
      ) : (
        fakeEditorCards.map((card, idx) => (
          <QuestionEditorCard key={idx} title={card.title} description={card.description} />
        ))
      )}
    </div>
  )
}

export default QuestionEditorSection
