import { Card, CardContent } from '../../../../components/ui/card'
import { BookOpen, Clock, Trophy, Calendar } from 'lucide-react'
import { favoriteStats } from '../data/mockData'

const FavoriteStats = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-purple-500/10 p-3">
            <Trophy className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã hoàn thành</p>
            <p className="text-2xl font-bold text-purple-700">
              {favoriteStats.totalCompleted}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-blue-500/10 p-3">
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang học</p>
            <p className="text-2xl font-bold text-blue-700">
              {favoriteStats.inProgress}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-green-500/10 p-3">
            <Clock className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tổng giờ học</p>
            <p className="text-2xl font-bold text-green-700">
              {favoriteStats.totalHours}h
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-orange-500/10 p-3">
            <Calendar className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Học gần nhất</p>
            <p className="text-base font-medium text-orange-700">
              {formatDate(favoriteStats.lastStudied)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FavoriteStats