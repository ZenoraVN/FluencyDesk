import React from 'react'
import { MdOutlineHelpOutline, MdDeleteOutline } from 'react-icons/md'
import { List, Edit2, CheckCircle, Shuffle } from 'lucide-react'
import {
  FaHeadphones,
  FaBookOpen,
  FaLanguage,
  FaSpellCheck,
  FaMicrophone,
  FaPen
} from 'react-icons/fa'
import {
  SKILLS,
  QUESTION_DEFINITIONS,
  SkillType,
  QuestionDefinition
} from '../types/questionDetail'
// import { ListeningDetailForm } from './forms/ListeningDetailForm'
// import { ReadingDetailForm } from './forms/ReadingDetailForm'
import { FillInBlankForm } from './forms/FillInBlankForm'
import { ChoiceOneForm } from './forms/ChoiceOneForm'
import { ShadowWordForm } from './forms/ShadowWordForm'

interface QuestionCreateCardProps {
  question: QuestionDefinition
  number?: number
  onDelete?: () => void
}

const typeMetaMap: Record<string, { color: string; icon: React.ReactNode }> = {
  choice_one: {
    color: '#2775ec',
    icon: <List size={16} />
  },
  choice_multi: {
    color: '#fd8d3c',
    icon: <Edit2 size={16} />
  },
  true_false_not_given: {
    color: '#8d63f7',
    icon: <CheckCircle size={16} />
  },
  matching: {
    color: '#24b979',
    icon: <Shuffle size={16} />
  },
  fill_in_the_blank: {
    color: '#fd8d3c',
    icon: <Edit2 size={16} />
  },
  error_identification: {
    color: '#6366F1',
    icon: <FaSpellCheck size={16} />
  },
  sentence_completion: {
    color: '#2775ec',
    icon: <FaPen size={16} />
  },
  word_repetition: {
    color: '#8d63f7',
    icon: <FaLanguage size={16} />
  },
  phrase_repetition: {
    color: '#8d63f7',
    icon: <FaLanguage size={16} />
  },
  conversational_repetition: {
    color: '#45B7D1',
    icon: <FaMicrophone size={16} />
  },
  open_conversation: {
    color: '#45B7D1',
    icon: <FaMicrophone size={16} />
  },
  open_paragraph: {
    color: '#4ECDC4',
    icon: <FaBookOpen size={16} />
  }
}

const skillIconMap: Record<string, React.ReactNode> = {
  listening: <FaHeadphones size={16} />,
  reading: <FaBookOpen size={16} />,
  grammar: <FaSpellCheck size={16} />,
  speaking: <FaMicrophone size={16} />,
  writing: <FaPen size={16} />,
  vocabulary: <FaLanguage size={16} />
}

const getQuizDefinition = (type: string) => {
  return QUESTION_DEFINITIONS.find((t: QuestionDefinition) => t.type === type)
}
const getSkill = (skillValue: SkillType) =>
  SKILLS.find((s: { value: string }) => s.value === skillValue)

export const QuestionCreateCard: React.FC<QuestionCreateCardProps> = ({
  question,
  number = 1,
  onDelete
}) => {
  const typeDef = getQuizDefinition(question.type)
  const skillDef = getSkill(question.skills[0])
  const typeMeta = typeMetaMap[question.type]
  const skillIcon = skillDef ? skillIconMap[skillDef.value] : undefined

  return (
    <div
      className="w-full dark:bg-zinc-900 border rounded-xl p-4"
      style={{ borderLeft: `6px solid ${typeMeta?.color || '#2775ec'}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-2 w-full border-b">
        <div className="flex items-center gap-1 min-w-0 w-full">
          <MdOutlineHelpOutline className="text-2xl text-yellow-500 mb-[2px]" />
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 select-none pr-4">
            {`Question ${number}`}
          </span>
          {typeDef?.name && (
            <span
              className="ml-2 inline-flex items-center gap-1 text-xs font-semibold rounded-lg select-none"
              style={{
                color: typeMeta?.color,
                background: `${typeMeta?.color}20`,
                padding: '2px 6px'
              }}
            >
              {typeMeta?.icon} {typeDef.name}
            </span>
          )}
          {skillDef && (
            <span
              className="ml-2 inline-flex items-center gap-1 text-xs font-semibold rounded-lg select-none"
              style={{
                color: skillDef.color,
                background: `${skillDef.color}20`,
                padding: '2px 6px'
              }}
            >
              {skillIcon} {skillDef.label}
            </span>
          )}
        </div>
        <button
          className="p-2 rounded-lg transition cursor-pointer group"
          aria-label="Delete question"
          type="button"
          onClick={onDelete}
        >
          <MdDeleteOutline className="text-xl text-zinc-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
      {/* Content */}
      <div className="w-full mt-1">
        {question.type === 'fill_in_the_blank' && <FillInBlankForm />}
        {question.type === 'choice_one' && <ChoiceOneForm />}
        {question.type === 'shadow_words' && <ShadowWordForm />}
      </div>
    </div>
  )
}

export default QuestionCreateCard
