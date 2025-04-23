import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Clock, AlertCircle, X } from 'lucide-react'
import { Settings, Book, Calendar, User, CheckSquare } from 'lucide-react'
import type { Notification } from '../data/mockData'

interface NotificationItemProps {
  notification: Notification
  onDelete?: (id: string) => void
  onMarkAsRead?: (id: string) => void
}

export const NotificationItem = ({
  notification,
  onDelete,
  onMarkAsRead,
}: NotificationItemProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Settings className="h-5 w-5 text-[#6366f1]" />
      case 'learning':
        return <Book className="h-5 w-5 text-[#10b981]" />
      case 'calendar':
        return <Calendar className="h-5 w-5 text-[#f59e0b]" />
      case 'personal':
        return <User className="h-5 w-5 text-[#8b5cf6]" />
      case 'task':
        return <CheckSquare className="h-5 w-5 text-[#ec4899]" />
      default:
        return null
    }
  }

  return (
    <div
      className={`flex items-start gap-4 p-4 transition-colors ${
        !notification.read ? 'bg-[#52aaa5]/5' : ''
      }`}
    >
      <div className="rounded-lg bg-white p-2 shadow-sm">
        {getTypeIcon(notification.type)}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-medium text-[#2D3748]">{notification.title}</h3>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={getPriorityColor(notification.priority)}
            >
              {notification.priority}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete?.(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-[#718096]">{notification.message}</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="flex items-center gap-1 text-xs text-[#718096]">
            <Clock className="h-3 w-3" />
            {notification.time}
          </span>
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 p-0 text-xs text-[#52aaa5] hover:text-[#52aaa5]/80"
              onClick={() => onMarkAsRead?.(notification.id)}
            >
              <AlertCircle className="h-3 w-3" />
              Đánh dấu đã đọc
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationItem