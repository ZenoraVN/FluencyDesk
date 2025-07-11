import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QUESTION_DEFINITIONS, QuestionDefinition, SKILLS, SkillType } from './types/questionDetail'
import { QuestionCard } from './components/QuestionCard'

const QuestionCreatePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  if (!lessonId)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold">Thiếu lessonId</div>
      </div>
    )

  // Display a beautiful responsive grid of question types
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f2fbfa] to-[#e3eafd] flex flex-col items-center px-4 py-8 overflow-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#233c5c] mb-8">
        Chọn loại câu hỏi bạn muốn tạo
      </h1>
      <div
        className="
          w-full max-w-7xl
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-5
          gap-6
        "
      >
        {QUESTION_DEFINITIONS.map((q, i) => (
          <QuestionCard
            key={q.type}
            skill={q.skills[0] as SkillType}
            title={q.name}
            description={q.purpose}
            onClick={() => {
              // Chưa làm action chuyển form, tạm thời log/disable
              // navigate(`/question-create/${lessonId}/${q.type}`);
              alert('Chức năng này chưa hoàn thiện')
            }}
            disabled={false}
            metrics={{
              totalQuestions: 0,
              avgTime: '--',
              difficulty: '--',
              popularity: '--',
              successRate: '--'
            }}
          />
        ))}
      </div>
      {/* Optionally show a legend of all skills */}
      <div className="mt-10 text-xs text-gray-500 flex flex-wrap gap-4 items-center">
        {SKILLS.map((skill) => (
          <span key={skill.value} className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: skill.color }}
            />
            {skill.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default QuestionCreatePage
