import { FC } from 'react'
import { QuestionDetail } from '../../types/questionDetail'
import { RichtextView } from '../../../../../components/common/RichtextView'

interface Props {
  question: QuestionDetail
}

export const ViewChoiceMultiSection: FC<Props> = ({ question }) => {
  if (!question.choice_multi_question) return null
  const { question: questionText, explain } = question.choice_multi_question
  const options = (question.choice_multi_options ?? []).map((o: any, idx: number) => ({
    ...o,
    idx
  }))

  return (
    <div className="rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-medium text-[#2D3748]">{questionText}</h3>
      </div>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id || option.idx}
            className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${
              option.is_correct
                ? 'text-[#52aaaf] border border-[#52aaaf] bg-[#e9faf9]'
                : 'border border-[#ddd] text-[#2D3748] hover:border-red-500'
            }`}
          >
            <span className={option.is_correct ? 'font-medium' : ''}>{option.option}</span>
          </div>
        ))}
      </div>
      {explain && (
        <div className="mt-6">
          <h4 className="font-medium text-[#2D3748] mb-1">Giải thích</h4>
          <RichtextView content={explain} className="text-[#718096]" />
        </div>
      )}
    </div>
  )
}
