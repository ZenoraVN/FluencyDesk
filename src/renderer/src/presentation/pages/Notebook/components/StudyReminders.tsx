import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Brain, Clock, ArrowRight } from 'lucide-react'
import { studyReminders } from '../data/mockData'

const StudyReminders = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(date.getTime() - now.getTime()) / 36e5

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} giờ nữa`
    }

    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'text-orange-500 bg-orange-100'
      case 'practice':
        return 'text-purple-500 bg-purple-100'
      default:
        return 'text-blue-500 bg-blue-100'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'review':
        return 'Ôn tập'
      case 'practice':
        return 'Luyện tập'
      default:
        return 'Học tập'
    }
  }

  if (studyReminders.length === 0) {
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-[#2D3748]">
          Lịch học sắp tới
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-[#52aaa5]">
          Xem tất cả
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studyReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between rounded-lg border border-[#52aaa5]/10 p-4 transition-colors hover:bg-[#52aaa5]/5"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-2 ${getTypeColor(reminder.type)}`}>
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2D3748]">
                    {reminder.notebookTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-[#718096]">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${getTypeColor(reminder.type)}`}>
                      {getTypeLabel(reminder.type)}
                    </span>
                    <span>•</span>
                    <span>{reminder.totalTerms} từ vựng</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-[#718096]">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(reminder.dueDate)}</span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
                >
                  Bắt đầu
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default StudyReminders