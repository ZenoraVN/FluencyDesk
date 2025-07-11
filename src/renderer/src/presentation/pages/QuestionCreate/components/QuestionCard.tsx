import React from 'react'
import { SkillType } from '../types/questionDetail'
import { Volume2, BookOpen, FileText, Mic, PenLine, Sparkle } from 'lucide-react'

const SKILL_ICONS: Record<SkillType, React.FC<{ className?: string }>> = {
  listening: Volume2,
  reading: BookOpen,
  grammar: FileText,
  speaking: Mic,
  writing: PenLine,
  vocabulary: Sparkle
}

interface QuestionCardProps {
  skill: SkillType
  title: string
  description: string
  metrics: {
    totalQuestions: number
    avgTime: string
    difficulty: string
    popularity: string
    successRate: string
  }
  onClick: () => void
  disabled?: boolean
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  skill,
  title,
  description,
  metrics,
  onClick,
  disabled = false
}) => {
  const Icon = SKILL_ICONS[skill]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-full border border-gray-200 rounded-lg p-4 hover:border-[#52aaa5] transition-colors text-left flex flex-col ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="p-2 bg-[#52aaa5]/10 rounded-lg">
          <Icon className="w-5 h-5 text-[#52aaa5]" />
        </div>
        <div className="text-xs text-gray-500">
          {metrics.totalQuestions.toLocaleString()} questions
        </div>
      </div>

      <h3 className="text-base font-medium text-[#2D3748] mt-2">{title}</h3>
      <p className="text-xs text-[#718096] mt-1">{description}</p>

      <div className="mt-3 flex flex-col gap-1 text-xs text-[#718096]">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Avg time:</span>
          <span>{metrics.avgTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Difficulty:</span>
          <span>{metrics.difficulty}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Popularity:</span>
          <span>{metrics.popularity}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Success rate:</span>
          <span>{metrics.successRate}</span>
        </div>
      </div>
    </button>
  )
}
