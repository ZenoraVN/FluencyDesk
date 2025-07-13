import React from 'react'
import QuestionEditorCard from './QuestionEditorCard'

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

import { QuestionChoiceCard } from './QuestionChoiceCard'

interface QuestionEditorSectionProps {
  showQuestionCreator: boolean
}

const QuestionEditorSection: React.FC<QuestionEditorSectionProps> = ({ showQuestionCreator }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {showQuestionCreator && (
        <div className="mb-5">
          <QuestionChoiceCard />
        </div>
      )}
      {fakeEditorCards.map((card, idx) => (
        <QuestionEditorCard key={idx} title={card.title} description={card.description} />
      ))}
    </div>
  )
}

export default QuestionEditorSection
