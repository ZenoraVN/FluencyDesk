import { Progress } from '../../../../components/ui/progress'
import { Button } from '../../../../components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#718096]">
            Câu hỏi {currentQuestion + 1}/{totalQuestions}
          </span>
          <span className="font-medium text-[#52aaa5]">{progress}% hoàn thành</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="flex-1 gap-2 border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10 disabled:border-gray-200 disabled:text-gray-400"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
          Câu trước
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10 disabled:border-gray-200 disabled:text-gray-400"
          onClick={onNext}
          disabled={!canGoNext}
        >
          Câu tiếp theo
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default LessonProgress