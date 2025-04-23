import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { CheckSquare, ChevronRight } from 'lucide-react'
import type { Task } from '../data/mockData'

interface TaskItemProps {
  task: Task
  onClick?: (id: string) => void
}

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#ec4899]/10 text-[#ec4899]'
      case 'medium':
        return 'bg-[#f59e0b]/10 text-[#f59e0b]'
      case 'low':
        return 'bg-[#10b981]/10 text-[#10b981]'
      default:
        return 'bg-[#52aaa5]/10 text-[#52aaa5]'
    }
  }

  return (
    <div className="flex items-start gap-4 rounded-lg border border-[#52aaa5]/10 p-3">
      <div className={`rounded p-2 ${getPriorityColor(task.priority)}`}>
        <CheckSquare className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-[#2D3748]">{task.title}</h3>
        <p className="text-sm text-[#718096]">Hạn: {task.deadline}</p>
        <Badge
          variant="secondary"
          className={getStatusColor(task.status)}
        >
          {task.status === 'completed' ? 'Hoàn thành' : 'Đang thực hiện'}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onClick?.(task.id)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default TaskItem