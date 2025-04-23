import { useState } from 'react'
import { Card } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Task } from '../data/mockData'

interface CalendarProps {
  tasks: Task[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

const Calendar = ({ tasks, selectedDate, onSelectDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    onSelectDate(new Date())
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const getDateStatus = (date: Date, dateTasks: Task[]) => {
    const now = new Date()
    const isPastDate = date < new Date(now.setHours(0, 0, 0, 0))
    
    const statusCounts = {
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    }

    dateTasks.forEach(task => {
      statusCounts[task.status]++
    })

    const allCompleted = dateTasks.length > 0 &&
      dateTasks.every(task => task.status === 'completed' || task.status === 'cancelled')
    const hasIncomplete = dateTasks.some(task =>
      task.status === 'notStarted' || task.status === 'inProgress'
    )

    return {
      outline: allCompleted ? 'border-green-500' : 
               (isPastDate && hasIncomplete) ? 'border-red-500' : '',
      counts: statusCounts
    }
  }

  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const calendar = []

    // Header
    calendar.push(
      <div key="header" className="grid grid-cols-7 gap-1 mb-1">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-[#718096] py-2">
            {day}
          </div>
        ))}
      </div>
    )

    // Days
    let cells = []
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2" />)
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateTasks = getTasksForDate(date)
      const { outline, counts } = getDateStatus(date, dateTasks)
      const isSelected = date.toDateString() === selectedDate.toDateString()
      const isToday = date.toDateString() === new Date().toDateString()

      cells.push(
        <div
          key={day}
          className={`p-2 border-2 rounded-lg cursor-pointer transition-all min-h-[100px]
            ${outline ? outline : isToday ? 'border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]' : 'border-[#52aaa5]/10'}
            ${isSelected ? 'bg-[#52aaa5]/5' : ''}
            ${isToday ? 'bg-[#52aaa5]/5' : ''}
            hover:bg-[#52aaa5]/5`}
          onClick={() => onSelectDate(date)}
        >
          <div className="text-sm font-medium text-[#2D3748] mb-2">{day}</div>
          <div className="flex flex-wrap gap-1">
            {counts.notStarted > 0 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                +{counts.notStarted}
              </Badge>
            )}
            {counts.inProgress > 0 && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                +{counts.inProgress}
              </Badge>
            )}
            {counts.completed > 0 && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                +{counts.completed}
              </Badge>
            )}
            {counts.cancelled > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800">
                +{counts.cancelled}
              </Badge>
            )}
          </div>
        </div>
      )
    }

    calendar.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    )

    return calendar
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <CalendarIcon className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <h2 className="text-lg font-medium text-[#2D3748]">Lịch nhiệm vụ</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#E2E8F0] hover:border-[#52aaa5]/20"
            onClick={goToToday}
          >
            Hôm nay
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-[#E2E8F0] hover:border-[#52aaa5]/20"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-[#E2E8F0] hover:border-[#52aaa5]/20"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-[#2D3748]">
          {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      {renderCalendar()}
    </Card>
  )
}

export default Calendar