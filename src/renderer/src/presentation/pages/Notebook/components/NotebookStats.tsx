import { Card, CardContent } from '../../../../components/ui/card'
import { ScrollText, Brain, Target, Flame } from 'lucide-react'
import { notebookStats } from '../data/mockData'

const NotebookStats = () => {
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
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-blue-500/10 p-3">
            <ScrollText className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tổng sổ ghi chú</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-blue-700">
                {notebookStats.totalNotebooks}
              </p>
              <p className="text-sm text-blue-600">
                ({notebookStats.totalNotes} từ vựng)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-purple-500/10 p-3">
            <Brain className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Độ chính xác</p>
            <p className="text-2xl font-bold text-purple-700">
              {notebookStats.reviewAccuracy}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-orange-500/10 p-3">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Chuỗi ngày học</p>
            <p className="text-2xl font-bold text-orange-700">
              {notebookStats.studyStreak} ngày
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-green-500/10 p-3">
            <Target className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Học gần nhất</p>
            <p className="text-base font-medium text-green-700">
              {formatDate(notebookStats.lastStudied)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotebookStats