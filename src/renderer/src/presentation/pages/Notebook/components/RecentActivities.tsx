import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { PlusCircle, CheckCircle2, Share2, ArrowRight, Clock } from 'lucide-react'
import { recentActivities } from '../data/mockData'

const RecentActivities = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(date.getTime() - now.getTime()) / 36e5

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} giờ trước`
    }

    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note_added':
        return <PlusCircle className="h-5 w-5 text-green-500" />
      case 'review_completed':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />
      case 'notebook_shared':
        return <Share2 className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'note_added':
        return 'bg-green-100'
      case 'review_completed':
        return 'bg-blue-100'
      case 'notebook_shared':
        return 'bg-purple-100'
      default:
        return 'bg-gray-100'
    }
  }

  if (recentActivities.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-[#2D3748]">
          Hoạt động gần đây
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-[#52aaa5]">
          Xem tất cả
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-[#52aaa5]/5"
            >
              <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-[#2D3748]">
                    {activity.notebookTitle}
                  </h4>
                  <span className="text-sm text-[#718096]">
                    {formatDate(activity.date)}
                  </span>
                </div>
                <p className="text-sm text-[#718096]">
                  {activity.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivities