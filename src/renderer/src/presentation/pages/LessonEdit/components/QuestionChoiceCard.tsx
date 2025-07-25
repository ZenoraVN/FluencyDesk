import React, { useState } from 'react'
import { SkillTabs } from './SkillTabs'
import { QuestionTypeGrid } from './QuestionTypeGrid'
import {
  SKILLS,
  QUESTION_DEFINITIONS,
  SkillType,
  QuestionDefinition
} from '../types/questionDetail'
// import { QuestionCreateCard } from './QuestionCreateCard'

/**
 * This card allows the user to pick a skill area and then a question type to create.
 */
interface QuestionChoiceCardProps {
  onCreate: (q: QuestionDefinition) => void
}

export const QuestionChoiceCard: React.FC<QuestionChoiceCardProps> = ({ onCreate }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillType>(SKILLS[0]?.value as SkillType)
  const allQuestions: QuestionDefinition[] = QUESTION_DEFINITIONS ?? []
  const filteredQuestions = allQuestions.filter((q) => q.skills.includes(selectedSkill))

  function handleViewExample(_q: QuestionDefinition) {
    // No-op, for now
  }
  function handleCreateQuestion(q: QuestionDefinition) {
    onCreate(q)
  }

  return (
    <div className="w-full dark:bg-zinc-900 border rounded-xl p-6 mb-6">
      {/* Skill Tabs UI at top */}
      <SkillTabs selectedSkill={selectedSkill} onSelect={setSelectedSkill} />
      {/* Question Grid below */}
      <div className="mt-5">
        <QuestionTypeGrid
          questions={filteredQuestions}
          onViewExample={handleViewExample}
          onCreateQuestion={handleCreateQuestion}
          skillsList={SKILLS}
        />
        {filteredQuestions.length === 0 && (
          <div className="text-sm text-gray-500 mt-5 ml-5">
            No question types available for this skill.
          </div>
        )}
      </div>
    </div>
  )
}
