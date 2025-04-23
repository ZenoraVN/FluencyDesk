import { useParams } from 'react-router-dom'
import { courseDetail } from './data/mockData'
import CourseHeader from './components/CourseHeader'
import CourseProgress from './components/CourseProgress'
import CourseContent from './components/CourseContent'
import CourseOverview from './components/CourseOverview'

const CoursePage = () => {
  const { courseId } = useParams()
  const course = courseId === courseDetail.id ? courseDetail : null

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f6f6f0] p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl text-[#2D3748]">Không tìm thấy khóa học</h1>
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
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Course Header */}
        <CourseHeader course={course} />

        {/* Course Progress */}
        <CourseProgress 
          progress={course.progress}
          totalLessons={course.lessons.length}
        />

        {/* Course Overview */}
        <CourseOverview 
          requirements={course.requirements}
          objectives={course.objectives}
        />

        {/* Course Content */}
        <CourseContent lessons={course.lessons} />
      </div>
    </div>
  )
}

export default CoursePage