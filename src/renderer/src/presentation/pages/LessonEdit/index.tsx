import React, { useState } from 'react'
import QuestionListSection from './components/QuestionListSection'
import QuestionEditorSection from './components/QuestionEditorSection'
import type { QuestionDefinition } from '../QuestionCreate/types/questionDetail'

const LessonEditPage: React.FC = () => {
  // State for multi-step modal flow
  const [isQuestionChoiceCardOpen, setIsQuestionChoiceCardOpen] = useState(false)
  const [createdQuestion, setCreatedQuestion] = useState<QuestionDefinition | null>(null)

  // "+" is visible when both modals are not shown
  const showAddButton = !isQuestionChoiceCardOpen && !createdQuestion

  // Handlers
  const handleAddClick = () => setIsQuestionChoiceCardOpen(true)
  const handleQuestionTypeChosen = (questionDef: QuestionDefinition) => {
    setCreatedQuestion(questionDef)
    setIsQuestionChoiceCardOpen(false)
  }
  const handleCancelCreate = () => {
    setCreatedQuestion(null)
    setIsQuestionChoiceCardOpen(false)
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-row">
      {/* Left panel: QuestionListSection */}
      <section
        className="rounded-lg flex border-r flex-col items-start px-5 py-4"
        style={{ width: '20%', minWidth: 160, maxWidth: 300, height: '100%' }}
      >
        <QuestionListSection onAddQuestion={handleAddClick} showAddButton={showAddButton} />
      </section>
      {/* Right panel: QuestionEditorSection */}
      <section
        className="rounded-lg flex flex-col px-5 py-7 flex-1"
        style={{ minWidth: 320, height: '100%' }}
      >
        <QuestionEditorSection
          isQuestionChoiceCardOpen={isQuestionChoiceCardOpen}
          createdQuestion={createdQuestion}
          onQuestionTypeChosen={handleQuestionTypeChosen}
          onCancelCreate={handleCancelCreate}
        />
      </section>
    </div>
  )
}

export default LessonEditPage
