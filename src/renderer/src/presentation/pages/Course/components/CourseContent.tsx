import { Card, CardHeader, CardContent, CardTitle } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { FileText, Video, Headphones, Clock, BookOpen } from 'lucide-react'

interface Resource {
  id: string
  type: string
  title: string
  url?: string
  duration?: string
}

interface Question {
  id: string
  type: string
  points: number
}

interface Lesson {
  id: string
  sequence: number
  title: string
  overview: string
  duration: number
  type: string
  questions: Question[]
  resources: Resource[]
}

interface CourseContentProps {
  lessons: Lesson[]
}

const CourseContent = ({ lessons }: CourseContentProps) => {
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />
      case 'audio':
        return <Headphones className="h-4 w-4 text-purple-500" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'writing':
        return 'bg-blue-100 text-blue-600'
      case 'speaking':
        return 'bg-green-100 text-green-600'
      case 'listening':
        return 'bg-purple-100 text-purple-600'
      case 'reading':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-[#2D3748]">Nội dung khóa học</h2>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className="rounded-2xl border-[#52aaa5]/10 transition-all duration-300 hover:bg-[#52aaa5]/5"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge 
                      variant="secondary" 
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[#52aaa5]/10 p-0 text-[#52aaa5]"
                    >
                      {lesson.sequence}
                    </Badge>
                    <CardTitle className="text-lg text-[#2D3748]">
                      {lesson.title}
                    </CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`${getLessonTypeColor(lesson.type)} capitalize`}
                    >
                      {lesson.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#718096]">{lesson.overview}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#718096]">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration} phút</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Resources Section */}
                {lesson.resources.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-[#2D3748]">Tài liệu học tập:</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {lesson.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-100"
                        >
                          {getResourceIcon(resource.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#2D3748]">
                              {resource.title}
                            </p>
                            {resource.duration && (
                              <p className="text-xs text-[#718096]">
                                {resource.duration}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions Preview */}
                {lesson.questions.length > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-[#52aaa5]/5 p-3">
                    <div>
                      <p className="text-sm font-medium text-[#2D3748]">
                        {lesson.questions.length} câu hỏi
                      </p>
                      <p className="text-xs text-[#718096]">
                        {lesson.questions.reduce((sum, q) => sum + q.points, 0)} điểm
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
                    >
                      Bắt đầu bài học
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CourseContent