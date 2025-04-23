import { Card } from '../../../../components/ui/card'
import { Progress } from '../../../../components/ui/progress'
import {
  Trophy,
  Target,
  BarChart2,
  CheckCircle2,
} from 'lucide-react'
import { achievements, dailyGoals, weeklyStats } from '../data/mockData'

const MissionSidebar = () => {
  return (
    <div className="space-y-8">
      {/* Daily Goals */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <Target className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <h2 className="text-lg font-medium text-[#2D3748]">Mục tiêu hôm nay</h2>
        </div>
        <div className="space-y-6">
          {dailyGoals.map(goal => (
            <div key={goal.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-[#2D3748]">{goal.title}</span>
                <span className="text-sm font-medium text-[#52aaa5]">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <Progress value={(goal.current / goal.target) * 100} />
              {goal.streak > 0 && (
                <div className="mt-1 flex items-center gap-1 text-xs text-[#718096]">
                  <Trophy className="h-3 w-3 text-[#f59e0b]" />
                  Chuỗi {goal.streak} ngày
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Stats */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <BarChart2 className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <h2 className="text-lg font-medium text-[#2D3748]">Thống kê tuần</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#718096]">Tổng nhiệm vụ</span>
            <span className="font-medium text-[#2D3748]">{weeklyStats.totalTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#718096]">Đã hoàn thành</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-medium text-[#2D3748]">{weeklyStats.completedTasks}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#718096]">Điểm số</span>
            <span className="font-medium text-[#52aaa5]">{weeklyStats.totalPoints}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#718096]">Độ chính xác</span>
            <span className="font-medium text-[#2D3748]">{weeklyStats.averageAccuracy}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#718096]">Thời gian học</span>
            <span className="font-medium text-[#2D3748]">{weeklyStats.studyTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#718096]">Kỹ năng tốt nhất</span>
            <span className="font-medium text-[#2D3748]">{weeklyStats.topSkill}</span>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <Trophy className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <h2 className="text-lg font-medium text-[#2D3748]">Thành tích</h2>
        </div>
        <div className="space-y-6">
          {achievements.map(achievement => (
            <div key={achievement.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-[#2D3748]">{achievement.title}</span>
                <span className="text-sm font-medium text-[#52aaa5]">
                  {achievement.current}/{achievement.target}
                </span>
              </div>
              <Progress value={(achievement.current / achievement.target) * 100} />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-[#718096]">{achievement.reward}</span>
                <span className="text-[#52aaa5]">+{achievement.points} điểm</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default MissionSidebar