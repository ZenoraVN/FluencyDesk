import { Card, CardContent } from '../../../../components/ui/card'
import { Progress } from '../../../../components/ui/progress'
import { Button } from '../../../../components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'
import { currentCoursesData } from '../data/mockData'

const CurrentCourses = () => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#2D3748]">Current Courses</h2>
        <Button variant="ghost" className="text-[#52aaa5]">
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {currentCoursesData.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="relative h-32">
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-[#2D3748]">Next Lesson:</p>
                <p className="text-sm text-gray-600">{course.nextLesson}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Last studied {course.lastStudied}</span>
                </div>
                <Button size="sm" className="bg-[#52aaa5] hover:bg-[#52aaa5]/90">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CurrentCourses