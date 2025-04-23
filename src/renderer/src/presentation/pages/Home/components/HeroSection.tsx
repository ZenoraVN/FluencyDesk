import { Button } from '../../../../components/ui/button'
import { userProgressData } from '../data/mockData'
import { Trophy, Clock, Flame } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#52aaa5] to-[#2D3748] p-8 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 top-0 h-64 w-64 rotate-45 transform rounded-full bg-white/20" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/20" />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Welcome Back!</h1>
          <p className="text-lg text-white/80">Ready to continue your learning journey?</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/10 p-4">
            <div className="mb-2 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              <span className="text-sm">Today's Learning</span>
            </div>
            <p className="text-2xl font-bold">{userProgressData.todayLearned} mins</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <div className="mb-2 flex items-center">
              <Flame className="mr-2 h-5 w-5" />
              <span className="text-sm">Streak</span>
            </div>
            <p className="text-2xl font-bold">{userProgressData.streakDays} days</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <div className="mb-2 flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              <span className="text-sm">Achievement</span>
            </div>
            <p className="text-sm font-medium">{userProgressData.lastAchievement}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            size="lg"
            className="bg-white font-semibold text-[#52aaa5] hover:bg-white/90"
          >
            Continue Learning
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/20 bg-white/10 font-semibold text-white hover:bg-white/20"
          >
            View Progress
          </Button>
        </div>

        {/* Level Badge */}
        <div className="absolute right-0 top-0 rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
          Level: {userProgressData.currentLevel}
        </div>
      </div>
    </div>
  )
}

export default HeroSection