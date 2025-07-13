import React from 'react'
import QuestionListSection from './components/QuestionListSection'
import QuestionEditorSection from './components/QuestionEditorSection'

/**
 * LessonEdit page - left: QuestionListSection (30%, 100% height), right: QuestionEditorSection (70%, 100% height)
 */
import { useState } from 'react'

const LessonEditPage: React.FC = () => {
  const [showQuestionCreatorCard, setShowQuestionCreatorCard] = useState(false)

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-row">
      {/* Left panel: QuestionListSection */}
      <section
        className="rounded-lg flex border-r flex-col items-start px-5 py-4"
        style={{ width: '20%', minWidth: 160, maxWidth: 300, height: '100%' }}
      >
        <QuestionListSection onAddQuestion={() => setShowQuestionCreatorCard(true)} />
      </section>
      {/* Right panel: QuestionEditorSection */}
      <section
        className=" rounded-lg flex flex-col px-5 py-7 flex-1"
        style={{ minWidth: 320, height: '100%' }}
      >
        <QuestionEditorSection showQuestionCreator={showQuestionCreatorCard} />
      </section>
    </div>
  )
}

export default LessonEditPage
