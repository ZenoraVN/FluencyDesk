import { Button } from '../../../../components/ui/button'
import { Calendar, ChevronRight } from 'lucide-react'
import type { Event } from '../data/mockData'

interface EventItemProps {
  event: Event
  onClick?: (id: string) => void
}

export const EventItem = ({ event, onClick }: EventItemProps) => {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-[#10b981]/10 text-[#10b981]'
      case 'test':
        return 'bg-[#ec4899]/10 text-[#ec4899]'
      case 'study':
        return 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
      default:
        return 'bg-[#52aaa5]/10 text-[#52aaa5]'
    }
  }

  return (
    <div className="flex items-start gap-4 rounded-lg border border-[#52aaa5]/10 p-3">
      <div className={`rounded p-2 ${getEventColor(event.type)}`}>
        <Calendar className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-[#2D3748]">{event.title}</h3>
        <p className="text-sm text-[#718096]">{event.time}</p>
        <p className="text-sm text-[#718096]">{event.date}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onClick?.(event.id)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default EventItem