import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { useParams } from 'react-router-dom'
import { courseDetail } from './data'

const CoursePage = () => {
  const { courseId } = useParams()
  const course = courseId === courseDetail.id ? courseDetail : null

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f6f6f0] p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl text-[#2D3748]">Course not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large focal points */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
        
        {/* Medium elements */}
        <div className="absolute right-1/2 top-1/2 h-48 w-48 rounded-2xl bg-[#52aaa5]/8 transform -rotate-15" />
        <div className="absolute left-2/3 bottom-1/4 h-40 w-40 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute right-1/3 top-2/3 h-36 w-36 rounded-3xl bg-[#52aaa5]/7 transform rotate-30" />
        
        {/* Border elements */}
        <div className="absolute right-1/3 top-1/3 h-40 w-40 rounded-full border-4 border-[#52aaa5]/10" />
        <div className="absolute left-2/3 bottom-2/3 h-32 w-32 rounded-2xl border-2 border-[#52aaa5]/15" />
        
        {/* Lines */}
        <div className="absolute left-0 top-1/2 h-1 w-1/3 bg-[#52aaa5]/10 transform -rotate-45" />
        <div className="absolute right-0 bottom-1/3 h-1/4 w-1 bg-[#52aaa5]/8" />
        
        {/* Scattered elements */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`scatter-${i}`}
            className={`absolute h-${Math.floor(Math.random() * 8) + 2} w-${
              Math.floor(Math.random() * 8) + 2
            } rounded-full bg-[#52aaa5]/${Math.floor(Math.random() * 10) + 5}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Course Header */}
        <div className="mb-8 flex gap-8">
          <div className="relative aspect-square w-[300px] overflow-hidden rounded-2xl">
            <img
              src={course.image_urls[0]}
              alt={course.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => {
                  const colors = [
                    'bg-[#FF69B4]/20 text-[#FF69B4]',
                    'bg-[#4A90E2]/20 text-[#4A90E2]',
                    'bg-[#3CB371]/20 text-[#3CB371]',
                    'bg-[#9370DB]/20 text-[#9370DB]',
                    'bg-[#FF7F50]/20 text-[#FF7F50]',
                    'bg-[#FFD700]/20 text-[#FFD700]'
                  ];
                  return (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className={`${colors[index % colors.length]} text-xs font-medium`}
                    >
                      {skill}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-[#2D3748]">{course.title}</h1>
              <Badge variant="secondary" className="bg-[#52aaa5] text-white">
                {course.band}
              </Badge>
            </div>
            <p className="mb-6 text-lg text-[#718096]">{course.overview}</p>
            <Button 
              size="lg" 
              className="w-full max-w-md bg-[#52aaa5] text-white transition-colors hover:bg-[#52aaa5]/90"
            >
              Start Course
            </Button>
          </div>
        </div>

        {/* Course Progress */}
        <Card className="mb-8 rounded-2xl border-[#52aaa5]/10">
          <CardHeader>
            <CardTitle className="text-[#2D3748]">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[#2D3748]">Course Completion</p>
                  <p className="font-medium text-[#52aaa5]">0%</p>
                </div>
                <div className="h-2 rounded-full bg-[#52aaa5]/10">
                  <div className="h-full w-0 rounded-full bg-[#52aaa5] transition-all"></div>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-[#52aaa5]">0/{course.lessons.length}</p>
                  <p className="text-sm text-[#718096]">Lessons Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#52aaa5]">0</p>
                  <p className="text-sm text-[#718096]">Questions Answered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#52aaa5]">0h</p>
                  <p className="text-sm text-[#718096]">Time Spent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-[#2D3748]">Course Content</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson) => (
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
                            className="h-8 w-8 rounded-full border-2 border-[#f6f6f0] bg-[#52aaa5]/10"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[#718096]">+20 students completed</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10"
                    >
                      Start Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage