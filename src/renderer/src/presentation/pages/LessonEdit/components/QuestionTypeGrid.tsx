import React from 'react'
import * as LucideIcons from 'lucide-react'
import { QuestionCard } from './QuestionCard'
import { SKILLS, QuestionDefinition } from '../types/questionDetail'

export interface QuestionTypeGridProps {
  questions: QuestionDefinition[]
  onViewExample: (q: QuestionDefinition) => void
  onCreateQuestion: (q: QuestionDefinition) => void
  skillsList: typeof SKILLS
}

export const QuestionTypeGrid: React.FC<QuestionTypeGridProps> = ({
  questions,
  onViewExample,
  onCreateQuestion,
  skillsList
}) => {
  const skillIconMap: Record<string, { icon: keyof typeof LucideIcons; color: string }> = {
    listening: { icon: 'LucideEar', color: '#FF6B6B' },
    reading: { icon: 'LucideBookOpen', color: '#4ECDC4' },
    grammar: { icon: 'LucideAtom', color: '#6366F1' },
    speaking: { icon: 'LucideMic', color: '#96CEB4' },
    writing: { icon: 'LucidePen', color: '#45B7D1' },
    vocabulary: { icon: 'LucideSpellCheck', color: '#FBBF24' }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {questions.map((q) => {
        const skillBadges = q.skills.map((skill) => {
          const badgeIconName = skillIconMap[skill]?.icon ?? 'LucideCircle'
          const badgeColor = skillsList.find((s) => s.value === skill)?.color ?? '#777'
          const IconComponent = (LucideIcons as any)[badgeIconName] as React.FC<{ size?: number }>
          return {
            icon: IconComponent ? <IconComponent size={16} /> : null,
            label: skillsList.find((s) => s.value === skill)?.label ?? skill,
            color: badgeColor
          }
        })

        // Lucide icon casting, fallback if missing

        return (
          <QuestionCard
            key={q.type}
            name={q.name}
            purpose={q.purpose}
            icon={q.icon as keyof typeof LucideIcons}
            color={q.color}
            skills={skillBadges}
            onView={() => onViewExample(q)}
            onCreate={() => onCreateQuestion(q)}
            showTooltip={true}
          />
        )
      })}
    </div>
  )
}
