import { Card } from '../../../../components/ui/card'
import { Progress } from '../../../../components/ui/progress'
import { Timer, Star, CheckCircle, Flame } from 'lucide-react'
import { userProgress } from '../data/mockData'

const ProgressStats = () => {
  const calculateProgress = () => {
    // Simple progress calculation based on completed lessons
    // In a real app, this would be more sophisticated
    return (userProgress.completedLessons / 20) * 100 // Assuming 20 lessons is 100%
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-[#52aaa5]/10 bg-white">
      <div className="border-b border-[#52aaa5]/10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#2D3748]">Tiến độ học tập</h2>
          <div className="flex items-center gap-2">
            <Progress value={calculateProgress()} className="h-2 w-24" />
            <span className="text-sm text-[#718096]">{Math.round(calculateProgress())}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2">
        <div className="group rounded-2xl bg-[#FF7F50]/5 p-5 transition-all hover:bg-[#FF7F50]/10">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#FF7F50]/10 group-hover:bg-[#FF7F50]/20">
            <Flame className="h-5 w-5 text-[#FF7F50]" />
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-semibold text-[#FF7F50]">
              {userProgress.streak} <span className="text-xs opacity-80">ngày</span>
            </div>
            <div className="text-xs text-[#718096]">Chuỗi Học Tập</div>
          </div>
        </div>

        <div className="group rounded-2xl bg-[#52aaa5]/5 p-5 transition-all hover:bg-[#52aaa5]/10">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#52aaa5]/10 group-hover:bg-[#52aaa5]/20">
            <Timer className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-semibold text-[#52aaa5]">
              {userProgress.studyTime} <span className="text-xs opacity-80">giờ</span>
            </div>
            <div className="text-xs text-[#718096]">Thời gian học</div>
          </div>
        </div>

        <div className="group rounded-2xl bg-[#22C55E]/5 p-5 transition-all hover:bg-[#22C55E]/10">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#22C55E]/10 group-hover:bg-[#22C55E]/20">
            <CheckCircle className="h-5 w-5 text-[#22C55E]" />
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-semibold text-[#22C55E]">
              {userProgress.completedLessons} <span className="text-xs opacity-80">bài học</span>
            </div>
            <div className="text-xs text-[#718096]">Hoàn thành</div>
          </div>
        </div>

        <div className="group rounded-2xl bg-[#EAB308]/5 p-5 transition-all hover:bg-[#EAB308]/10">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-[#EAB308]/10 group-hover:bg-[#EAB308]/20">
            <Star className="h-5 w-5 text-[#EAB308]" />
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-semibold text-[#EAB308]">
              {userProgress.averageScore} <span className="text-xs opacity-80">%</span>
            </div>
            <div className="text-xs text-[#718096]">Điểm trung bình</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="border-t border-[#52aaa5]/10 p-6">
        <div className="flex h-20 items-end justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const height = Math.random() * 100
            return (
              <div
                key={i}
                className="w-full rounded-t bg-[#52aaa5]/20 transition-all hover:bg-[#52aaa5]/30"
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-[#718096]">
          <span>T2</span>
          <span>T3</span>
          <span>T4</span>
          <span>T5</span>
          <span>T6</span>
          <span>T7</span>
          <span>CN</span>
        </div>
      </div>
    </Card>
  )
}

export default ProgressStats