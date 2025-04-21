import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { courses } from './data'
import { Badge } from '../../../components/ui/badge'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`)
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back!</h1>
        <p className="text-lg text-muted-foreground">Continue your English learning journey</p>
      </div>

      {/* Available Courses */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">Available Courses</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="overflow-hidden cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="relative">
                <img
                  src={course.image_urls[0]}
                  alt={course.title}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="flex flex-wrap gap-1">
                    {course.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-white/20 text-xs text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <CardHeader className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-base">{course.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">{course.band}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {course.overview}
                </p>
                <Button 
                  size="sm" 
                  className="mt-3 w-full text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCourseClick(course.id)
                  }}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage