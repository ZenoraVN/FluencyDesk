import { Progress } from '../../../../components/ui/progress'
import { Button } from '../../../../components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '../../../../components/ui/card'

interface LessonProgressProps {
  currentQuestion: number
  totalQuestions: number
  progress: number
  onPrevious: () => void
  onNext: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

const LessonProgress = ({
  currentQuestion,
  totalQuestions,
  progress,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious
}: LessonProgressProps) => {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10">
      <div className="space-y-4 p-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#2D3748]">
                Câu {currentQuestion + 1}/{totalQuestions}
              </span>
              <span className="text-[#718096]">•</span>
              <span className="text-[#718096]">
                {totalQuestions - (currentQuestion + 1)} câu còn lại
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#52aaa5]" />
              <span className="font-medium text-[#52aaa5]">{progress}% hoàn thành</span>
            </div>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-[#52aaa5]/10 [&>[role=progressbar]]:bg-[#52aaa5]" 
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-[#52aaa5]/20 font-medium text-[#52aaa5] hover:bg-[#52aaa5]/5 disabled:border-gray-200 disabled:text-gray-300"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
            Câu trước
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 border-[#52aaa5]/20 font-medium text-[#52aaa5] hover:bg-[#52aaa5]/5 disabled:border-gray-200 disabled:text-gray-300"
            onClick={onNext}
            disabled={!canGoNext}
          >
            Câu tiếp theo
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isCompleted = index < currentQuestion
            const isCurrent = index === currentQuestion
            return (
              <div
                key={index}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-[#52aaa5]'
                    : isCurrent
                    ? 'bg-[#52aaa5]/50'
                    : 'bg-[#52aaa5]/10'
                }`}
              />
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default LessonProgress