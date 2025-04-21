import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { useParams } from 'react-router-dom'
import { courses } from '../Home/data'
import { Course } from '../Home/data'

const CoursePage = () => {
  const { courseId } = useParams()
  const course = courses.find((c) => c.id === courseId) as Course

  if (!course) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl">Course not found</h1>
      </div>
    )
  }

  return (
    <div className="container py-6">
      {/* Course Header */}
      <div className="mb-8 flex gap-8">
        <div className="relative aspect-square w-[300px] overflow-hidden rounded-lg">
          <img
            src={course.image_urls[0]}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-white/20 text-white">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <Badge variant="outline" className="text-lg">
              {course.band}
            </Badge>
          </div>
          <p className="mb-6 text-lg text-muted-foreground">{course.overview}</p>
          <Button size="lg" className="w-full max-w-md">
            Start Course
          </Button>
        </div>
      </div>

      {/* Course Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p>Course Completion</p>
                <p className="font-medium">0%</p>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full w-0 rounded-full bg-primary transition-all"></div>
              </div>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold">0/{course.lessons?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0h</p>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      {course.lessons && (
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Course Content</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson) => (
              <Card key={lesson.id} className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <Badge variant="outline" className="h-6 w-6 justify-center rounded-full p-0">
                          {lesson.sequence}
                        </Badge>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{lesson.overview}</p>
                    </div>
                    {lesson.questions && (
                      <Badge variant="secondary" className="shrink-0">
                        {lesson.questions.length} questions
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
                            className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">+20 students completed</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Start Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursePage