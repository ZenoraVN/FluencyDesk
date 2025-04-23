import { Card, CardContent } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Progress } from '../../../../components/ui/progress'
import { Clock, CalendarClock, StickyNote } from 'lucide-react'

interface Course {
  id: string
  title: string
  overview: string
  image_urls: string[]
  band: string
  skills: string[]
  progress: number
  lastAccessed: string
  notes: string[]
  nextMilestone: {
    type: string
    name: string
    dueDate: string
  }
}

interface FavoriteCourseCardProps {
  course: Course
  onClick: (courseId: string) => void
}

const FavoriteCourseCard = ({ course, onClick }: FavoriteCourseCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long'
    })
  }

  const colors = [
    'bg-[#FF69B4]/20 text-[#FF69B4]',
    'bg-[#4A90E2]/20 text-[#4A90E2]',
    'bg-[#3CB371]/20 text-[#3CB371]',
    'bg-[#9370DB]/20 text-[#9370DB]',
    'bg-[#FF7F50]/20 text-[#FF7F50]',
    'bg-[#FFD700]/20 text-[#FFD700]'
  ]

  return (
    <Card 
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#52aaa5]/20 hover:ring-2 hover:ring-[#52aaa5]"
      onClick={() => onClick(course.id)}
    >
      <div className="relative">
        <img
          src={course.image_urls[0]}
          alt={course.title}
          className="aspect-video w-full object-cover"
        />
        <Badge 
          variant="secondary" 
          className="absolute right-3 top-3 bg-[#52aaa5] text-xs font-medium text-white"
        >
          {course.band}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-1 text-lg font-medium text-[#2D3748]">
          {course.title}
        </h3>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
            <span>Tiến độ</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          {course.skills.map((skill, index) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className={`${colors[index % colors.length]} shrink-0 text-xs font-medium`}
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-auto space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Học gần nhất: {formatDate(course.lastAccessed)}</span>
          </div>

          {course.nextMilestone && (
            <div className="flex items-center gap-2 text-blue-600">
              <CalendarClock className="h-4 w-4" />
              <span>{course.nextMilestone.name} - {formatDate(course.nextMilestone.dueDate)}</span>
            </div>
          )}

          {course.notes.length > 0 && (
            <div className="flex items-start gap-2 text-gray-600">
              <StickyNote className="h-4 w-4 mt-1" />
              <div className="flex-1">
                <p className="font-medium">Ghi chú:</p>
                <ul className="list-disc pl-4 text-xs">
                  {course.notes.slice(0, 2).map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                  {course.notes.length > 2 && (
                    <li className="text-[#52aaa5]">+{course.notes.length - 2} ghi chú khác</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FavoriteCourseCard