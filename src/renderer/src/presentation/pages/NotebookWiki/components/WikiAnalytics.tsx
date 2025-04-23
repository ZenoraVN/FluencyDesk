import { Card, CardContent } from '../../../../components/ui/card'
import { Progress } from '../../../../components/ui/progress'
import { Brain, Clock, CheckCircle2, Flame } from 'lucide-react'
import { wikiStats } from '../data/mockData'

const WikiAnalytics = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateProgress = () => {
    return (wikiStats.mastered / wikiStats.total) * 100
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#2D3748]">Tiến độ học tập</h2>
            <p className="text-sm text-[#718096]">
              Cập nhật lần cuối: {formatDate(wikiStats.lastStudied)}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#52aaa5]/10 px-4 py-2">
            <Flame className="h-5 w-5 text-[#52aaa5]" />
            <span className="font-medium text-[#52aaa5]">
              {wikiStats.studyStreak} ngày liên tiếp
            </span>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#718096]">Tổng tiến độ</span>
            <span className="font-medium text-[#52aaa5]">{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-purple-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-700">{wikiStats.total}</p>
              <p className="text-sm text-purple-600">Tổng từ vựng</p>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-700">{wikiStats.new}</p>
              <p className="text-sm text-blue-600">Chưa học</p>
            </div>
          </div>

          <div className="rounded-xl bg-orange-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Brain className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-700">{wikiStats.learning}</p>
              <p className="text-sm text-orange-600">Đang học</p>
            </div>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-700">{wikiStats.mastered}</p>
              <p className="text-sm text-green-600">Đã thuộc</p>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="mt-8 rounded-xl bg-[#52aaa5]/5 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-[#2D3748]">Độ chính xác</h3>
            <div className="rounded-full bg-[#52aaa5]/10 px-3 py-1">
              <span className="text-sm font-medium text-[#52aaa5]">
                {wikiStats.reviewAccuracy}% chính xác
              </span>
            </div>
          </div>
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
      </CardContent>
    </Card>
  )
}

export default WikiAnalytics