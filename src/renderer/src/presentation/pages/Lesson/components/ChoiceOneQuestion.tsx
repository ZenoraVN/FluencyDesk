import { useState } from 'react'
import { Card } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { ChoiceOneQuestion } from '../data/mockData'

interface ChoiceOneQuestionProps {
  data: ChoiceOneQuestion
  onAnswer: (isCorrect: boolean) => void
}

const ChoiceOneQuestion = ({ data, onAnswer }: ChoiceOneQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleOptionSelect = (optionId: string) => {
    if (showExplanation) return // Prevent selection after answer is revealed
    setSelectedOption(optionId)
  }

  const handleCheck = () => {
    if (!selectedOption) return
    const selectedAnswer = data.options.find(opt => opt.id === selectedOption)
    if (selectedAnswer) {
      setShowExplanation(true)
      onAnswer(selectedAnswer.isCorrect)
    }
  }

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="rounded-xl bg-[#52aaa5]/5 p-6">
        <h3 className="text-lg font-medium text-[#2D3748]">{data.question}</h3>
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {data.options.map((option) => {
          const isSelected = selectedOption === option.id
          const showResult = showExplanation && isSelected

          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-[#52aaa5]'
                  : 'hover:ring-2 hover:ring-[#52aaa5]/50'
              } ${
                showResult
                  ? option.isCorrect
                    ? 'bg-green-50'
                    : 'bg-red-50'
                  : ''
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? 'border-[#52aaa5] bg-[#52aaa5] text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {showResult ? (
                    option.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )
                  ) : null}
                </div>
                <span className="flex-1 text-[#2D3748]">{option.text}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="rounded-xl bg-[#52aaa5]/5 p-6">
          <h4 className="mb-2 font-medium text-[#2D3748]">Giải thích</h4>
          <p className="text-[#718096]">{data.explain}</p>
        </div>
      )}

      {/* Action Button */}
      {!showExplanation && (
        <Button
          className="w-full bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90 disabled:bg-[#52aaa5]/50"
          disabled={!selectedOption}
          onClick={handleCheck}
        >
          Kiểm tra
        </Button>
      )}
    </div>
  )
}

export default ChoiceOneQuestion