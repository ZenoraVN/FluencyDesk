import React from 'react'
import LessonSection from './components/LessonSection'
import QuestionSection from './components/QuestionSection'

/**
 * LessonEdit page - left: LessonSection (30%, 100% height), right: QuestionSection (70%, 100% height)
 * "Create Question" button is displayed at the top of the LessonSection area.
 */
import { useNavigate, useParams } from 'react-router-dom'

const LessonEditPage: React.FC = () => {
  const navigate = useNavigate()
  const { lessonId, sequence } = useParams<{ lessonId?: string; sequence?: string }>()

  const handleCreateQuestion = () => {
    if (lessonId && sequence) {
      navigate(`/lesson/${lessonId}/${sequence}/question/create`)
    } else if (lessonId) {
      navigate(`/lesson/${lessonId}/1/question/create`)
    } else {
      alert('Missing lessonId and/or sequence in URL.')
    }
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-row gap-4 px-6 py-6">
      {/* Left panel: LessonSection */}
      <section
        className="bg-white rounded-lg shadow flex flex-col items-start px-5 py-7"
        style={{ width: '30%', minWidth: 280, height: '100%' }}
      >
        <button
          className="mb-4 px-4 py-2 bg-gradient-to-r from-[#52aaa5] to-[#377f85] text-white rounded-lg font-semibold shadow-md hover:from-[#377f85] hover:to-[#52aaa5] transition"
          style={{ minWidth: 160 }}
          onClick={handleCreateQuestion}
        >
          Create Question
        </button>
        <div className="flex-1 w-full">
          <LessonSection />
        </div>
      </section>
      {/* Right panel: QuestionSection */}
      <section
        className="bg-white rounded-lg shadow flex flex-col px-5 py-7"
        style={{ width: '70%', minWidth: 400, height: '100%' }}
      >
        <QuestionSection />
      </section>
    </div>
  )
}

export default LessonEditPage
