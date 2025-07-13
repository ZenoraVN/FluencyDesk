import React from 'react'
import { MoreHorizontal, List, Edit2, CheckCircle, Shuffle, LucideIcon } from 'lucide-react'
import { Badge } from '../../../../components/ui/badge'
import { cn } from '../../../../shared/utils/cn'

export type QuestionType = 'Multiple Choice' | 'Fill in the blank' | 'True/False' | 'Matching'

export interface QuestionListItemProps {
  number: number
  question: string
  type: QuestionType
  selected?: boolean
}

const MAX_QUESTION_LENGTH = 32

const truncate = (text: string) => {
  if (text.length <= MAX_QUESTION_LENGTH) return text
  return text.slice(0, MAX_QUESTION_LENGTH - 3) + '...'
}

const typeMetaMap: Record<
  QuestionType,
  {
    color: string
    badge: { from: string; to: string }
    icon: LucideIcon
  }
> = {
  'Multiple Choice': {
    color: '#2775ec',
    badge: { from: '#53a5ff', to: '#2273bb' },
    icon: List
  },
  'Fill in the blank': {
    color: '#fd8d3c',
    badge: { from: '#fbb040', to: '#ff6f43' },
    icon: Edit2
  },
  'True/False': {
    color: '#8d63f7',
    badge: { from: '#b197fc', to: '#833ff8' },
    icon: CheckCircle
  },
  Matching: {
    color: '#24b979',
    badge: { from: '#56eab8', to: '#13b182' },
    icon: Shuffle
  }
}

const typeLabelMap: Record<QuestionType, string> = {
  'Multiple Choice': 'multiple choice',
  'Fill in the blank': 'fill in the blank',
  'True/False': 'true/false',
  Matching: 'matching'
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({
  number,
  question,
  type,
  selected = false
}) => {
  const { color, badge, icon: TypeIcon } = typeMetaMap[type]

  return (
    <div
      className={cn(
        'relative flex flex-col w-full rounded-lg px-3 py-2 mb-3 min-h-[52px] cursor-pointer',
        'transition border-b',
        selected && 'border-l-4'
      )}
      style={{
        borderLeft: selected ? `4px solid ${color}` : undefined
      }}
    >
      {/* Badge & question */}
      <div className="flex items-center gap-2 mb-1">
        <Badge
          className="rounded-[6px] font-bold px-1.5 py-0.5 text-white min-w-[22px] flex justify-center"
          style={{
            background: `linear-gradient(135deg, ${badge.from} 0%, ${badge.to} 100%)`,
            fontSize: '12px'
          }}
        >
          {number}
        </Badge>
        <span className="flex-1 text-sm truncate" title={question}>
          {truncate(question)}
        </span>
      </div>
      {/* Bottom info: type (left), menu (right) */}
      <div className="flex items-center justify-between mt-1 w-full" style={{ fontSize: '12px' }}>
        <span className="flex items-center gap-1 font-semibold capitalize" style={{ color }}>
          <TypeIcon size={15} /> {typeLabelMap[type]}
        </span>
        <MoreHorizontal size={19} className="text-gray-400 cursor-pointer" />
      </div>
    </div>
  )
}

export default QuestionListItem
