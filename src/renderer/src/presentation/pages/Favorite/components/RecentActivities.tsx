import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { CheckCircle2, Award, StickyNote, Clock } from 'lucide-react'
import { recentActivities } from '../data/mockData'

interface ActivityIconProps {
  type: string
  className?: string
}

const ActivityIcon = ({ type, className = "h-5 w-5" }: ActivityIconProps) => {
  switch (type) {
    case 'completion':
      return <CheckCircle2 className={`${className} text-green-500`} />
    case 'achievement':
      return <Award className={`${className} text-purple-500`} />
    case 'note':
      return <StickyNote className={`${className} text-blue-500`} />
    default:
      return <Clock className={`${className} text-gray-500`} />
  }
}

const RecentActivities = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`
    }
    
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#2D3748]">
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
            >
              <ActivityIcon type={activity.type} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-[#2D3748]">
                  {activity.detail}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{activity.courseName}</span>
                  <span>•</span>
                  <span>{formatDate(activity.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivities