import { Card, CardHeader, CardContent, CardTitle } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'

interface Lesson {
  id: string
  sequence: number
  title: string
  overview: string
  questions: {
    id: string
    type: string
    points: number
  }[]
}

interface CourseContentProps {
  lessons: Lesson[]
}

const CourseContent = ({ lessons }: CourseContentProps) => {
  const navigate = useNavigate()
  const { courseId } = useParams()

  const handleStartLesson = (lessonId: string) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`)
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
                  <div className="mb-1 flex items-center gap-3">
                    <Badge 
                      variant="secondary" 
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[#52aaa5]/10 p-0 text-[#52aaa5]"
                    >
                      {lesson.sequence}
                    </Badge>
                    <CardTitle className="text-lg text-[#2D3748]">{lesson.title}</CardTitle>
                  </div>
                  <p className="text-sm text-[#718096]">{lesson.overview}</p>
                </div>
                {lesson.questions && lesson.questions.length > 0 && (
                  <Badge variant="secondary" className="shrink-0 bg-[#52aaa5]/10 text-[#52aaa5]">
                    {lesson.questions.length} câu hỏi
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-[#f6f6f0] bg-[#52aaa5]/10"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#718096]">+20 học viên đã hoàn thành</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
                  onClick={() => handleStartLesson(lesson.id)}
                >
                  Bắt đầu bài học
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CourseContent