import { useState } from 'react'
import { Card } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { FillInTheBlankQuestion } from '../data/mockData'

interface FillInTheBlankQuestionProps {
  data: FillInTheBlankQuestion
  onAnswer: (isCorrect: boolean) => void
}

const FillInTheBlankQuestion = ({ data, onAnswer }: FillInTheBlankQuestionProps) => {
  const [answer, setAnswer] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const checkAnswer = () => {
    if (!answer.trim()) return

    // Check if the answer matches any of the correct answers (case insensitive)
    const isAnswerCorrect = data.answers.some(
      correctAnswer => correctAnswer.answer.toLowerCase() === answer.toLowerCase().trim()
    )

    setIsCorrect(isAnswerCorrect)
    setShowExplanation(true)
    onAnswer(isAnswerCorrect)
  }

  // Split the question text into parts based on the blank placeholder
  const questionParts = data.question.split('____')

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="rounded-xl bg-[#52aaa5]/5 p-6">
        <div className="flex items-center gap-2 text-lg text-[#2D3748]">
          {questionParts.map((part, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{part}</span>
              {index < questionParts.length - 1 && (
                <div className="relative inline-block min-w-[120px]">
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={showExplanation}
                    className={`border-b-2 border-dotted bg-transparent focus:border-[#52aaa5] ${
                      showExplanation
                        ? isCorrect
                          ? 'border-green-500 text-green-700'
                          : 'border-red-500 text-red-700'
                        : 'border-gray-400'
                    }`}
                    placeholder="Điền vào chỗ trống"
                  />
                  {showExplanation && (
                    <div className="absolute -right-7 top-1/2 -translate-y-1/2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <Card className={isCorrect ? 'bg-green-50' : 'bg-red-50'}>
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h4 className="font-medium text-[#2D3748]">
                {isCorrect ? 'Chính xác!' : 'Chưa chính xác'}
              </h4>
            </div>
            {!isCorrect && (
              <p className="mb-2 text-[#718096]">
                Đáp án đúng: <span className="font-medium">{data.answers[0].answer}</span>
              </p>
            )}
            <p className="text-[#718096]">{data.answers[0].explain}</p>
          </div>
        </Card>
      )}

      {/* Action Button */}
      {!showExplanation && (
        <Button
          className="w-full bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90 disabled:bg-[#52aaa5]/50"
          disabled={!answer.trim()}
          onClick={checkAnswer}
        >
          Kiểm tra
        </Button>
      )}
    </div>
  )
}

export default FillInTheBlankQuestion