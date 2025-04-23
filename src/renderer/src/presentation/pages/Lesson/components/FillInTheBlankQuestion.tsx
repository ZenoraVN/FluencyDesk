import { useState } from 'react'
import { Card } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
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
    <div className="space-y-8">
      {/* Question */}
      <div className="rounded-2xl bg-[#52aaa5]/5 p-8">
        <div className="flex flex-wrap items-center gap-2 text-xl text-[#2D3748]">
          {questionParts.map((part, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-medium">{part}</span>
              {index < questionParts.length - 1 && (
                <div className="relative inline-block min-w-[180px]">
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={showExplanation}
                    className={`h-12 border-b-2 border-dotted bg-transparent px-4 text-lg transition-colors focus-visible:ring-0 ${
                      showExplanation
                        ? isCorrect
                          ? 'border-green-500 text-green-700'
                          : 'border-red-500 text-red-700'
                        : 'border-[#52aaa5] focus:border-[#52aaa5]'
                    }`}
                    placeholder="Điền vào chỗ trống"
                  />
                  {showExplanation && (
                    <div className="absolute -right-10 top-1/2 -translate-y-1/2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
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
        <Card className={`overflow-hidden border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                  <h4 className="text-lg font-medium">Chính xác!</h4>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-6 w-6" />
                    <h4 className="text-lg font-medium">Chưa chính xác</h4>
                  </div>
                  <span className="text-[#718096]">•</span>
                  <div className="text-[#2D3748]">
                    Đáp án đúng: <span className="font-medium">{data.answers[0].answer}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-[#52aaa5]/5 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-[#52aaa5]" />
              <p className="text-[#718096]">{data.answers[0].explain}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action Button */}
      {!showExplanation && (
        <Button
          className="w-full bg-[#52aaa5] text-lg font-medium text-white hover:bg-[#52aaa5]/90 disabled:bg-[#52aaa5]/50"
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