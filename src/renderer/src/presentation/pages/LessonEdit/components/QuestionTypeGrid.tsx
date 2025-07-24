import React from 'react'
import * as LucideIcons from 'lucide-react'
import { QuestionCard } from './QuestionCard'
import { SKILLS, QuestionDefinition } from '../types/questionDetail'
// Define a palette for varied quiz colors
const colorPalette = [
  '#FF6B6B',
  '#4ECDC4',
  '#6366F1',
  '#E11D48',
  '#FBBF24',
  '#96CEB4',
  '#EF4444',
  '#45B7D1',
  '#007BFF',
  '#F59E42'
]

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
    writing: { icon: 'LucidePen', color: '#F59E42' },
    social: { icon: 'LucideUsers', color: '#52AAA5' },
    vocabulary: { icon: 'LucideSpellCheck', color: '#EF4444' }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {questions.map((q, idx) => {
        const cardColor = colorPalette[idx % colorPalette.length]
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
            color={cardColor}
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
