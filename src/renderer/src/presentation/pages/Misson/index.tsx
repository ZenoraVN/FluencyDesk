import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import {
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from 'lucide-react'
import { tasks } from './data/mockData'
import type { Task } from './data/mockData'
import Calendar from './components/Calendar'

const MissionPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([])
  const [showOverdueTasks, setShowOverdueTasks] = useState(true)
  const [showUpcomingTasks, setShowUpcomingTasks] = useState(true)
  const [showSelectedTasks, setShowSelectedTasks] = useState(true)

  const overdueTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate)
    const now = new Date()
    return taskDate < now && (task.status === 'notStarted' || task.status === 'inProgress')
  })

  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate)
    const now = new Date()
    return taskDate > now && (task.status === 'notStarted' || task.status === 'inProgress')
  }).slice(0, 3)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTasks(tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    }))
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const TaskList = ({ tasks, title, isOverdue = false }: { tasks: Task[], title: string, isOverdue?: boolean }) => (
    <div className="space-y-4">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`flex items-start gap-4 rounded-lg border p-4 ${
            isOverdue ? 'border-red-100 bg-red-50/50' : 'border-[#52aaa5]/10'
          }`}
        >
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h4 className="font-medium text-[#2D3748]">{task.title}</h4>
              <Badge className={getTaskStatusColor(task.status)}>
                {task.status === 'completed' ? 'Hoàn thành' : 
                 task.status === 'cancelled' ? 'Đã hủy' :
                 task.status === 'inProgress' ? 'Đang làm' : 'Chưa làm'}
              </Badge>
            </div>
            <p className="text-sm text-[#718096]">{task.description}</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-[#718096]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                </span>
                <span>
                  {new Date(task.dueDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <Badge variant="outline" className="text-[#52aaa5]">
                {task.points} điểm
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f6f6f0] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#2D3748]">Nhiệm vụ</h1>
        <p className="mt-2 text-[#718096]">
          Quản lý và theo dõi các nhiệm vụ học tập của bạn
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
        </div>

        {/* Task Lists */}
        <div className="space-y-8">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <Card className="p-6">
              <div 
                className="mb-6 flex items-center justify-between cursor-pointer"
                onClick={() => setShowOverdueTasks(!showOverdueTasks)}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2">
                    <AlertTriangle className="h-5 w-5 text-red-800" />
                  </div>
                  <h2 className="text-lg font-medium text-[#2D3748]">Nhiệm vụ quá hạn</h2>
                </div>
                {showOverdueTasks ? (
                  <ChevronUp className="h-5 w-5 text-[#718096]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#718096]" />
                )}
              </div>
              {showOverdueTasks && <TaskList tasks={overdueTasks} title="Nhiệm vụ quá hạn" isOverdue />}
            </Card>
          )}

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <Card className="p-6">
              <div 
                className="mb-6 flex items-center justify-between cursor-pointer"
                onClick={() => setShowUpcomingTasks(!showUpcomingTasks)}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                    <Clock className="h-5 w-5 text-[#52aaa5]" />
                  </div>
                  <h2 className="text-lg font-medium text-[#2D3748]">Nhiệm vụ sắp tới</h2>
                </div>
                {showUpcomingTasks ? (
                  <ChevronUp className="h-5 w-5 text-[#718096]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#718096]" />
                )}
              </div>
              {showUpcomingTasks && <TaskList tasks={upcomingTasks} title="Nhiệm vụ sắp tới" />}
            </Card>
          )}

          {/* Selected Date Tasks */}
          {selectedTasks.length > 0 && (
            <Card className="p-6">
              <div 
                className="mb-6 flex items-center justify-between cursor-pointer"
                onClick={() => setShowSelectedTasks(!showSelectedTasks)}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                    <CalendarDays className="h-5 w-5 text-[#52aaa5]" />
                  </div>
                  <h2 className="text-lg font-medium text-[#2D3748]">
                    Danh sách nhiệm vụ
                  </h2>
                </div>
                {showSelectedTasks ? (
                  <ChevronUp className="h-5 w-5 text-[#718096]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#718096]" />
                )}
              </div>
              {showSelectedTasks && (
                <>
                  <div className="mb-4 text-sm text-[#718096]">
                    Ngày {selectedDate.toLocaleDateString('vi-VN')}
                  </div>
                  <TaskList tasks={selectedTasks} title="Danh sách nhiệm vụ" />
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default MissionPage