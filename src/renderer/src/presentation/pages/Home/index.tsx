import HeroSection from './components/HeroSection'
import TodayTask from './components/TodayTask'
import LearningStats from './components/LearningStats'
import NewsUpdates from './components/NewsUpdates'
import CourseCard from './components/CourseCard'
import QuizSection from './components/QuizSection'
import { courses } from './data'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`)
  }

  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large focal points */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
        <div className="absolute left-1/3 bottom-1/3 h-64 w-64 rounded-full bg-[#52aaa5]/6" />
        
        {/* Medium elements */}
        <div className="absolute right-1/2 top-1/2 h-48 w-48 rounded-2xl bg-[#52aaa5]/8 transform -rotate-15" />
        <div className="absolute left-2/3 bottom-1/4 h-40 w-40 rounded-full bg-[#52aaa5]/5" />
        
        {/* Small elements */}
        <div className="absolute right-1/4 bottom-2/3 h-24 w-24 rounded-full bg-[#52aaa5]/9" />
        <div className="absolute left-1/2 top-2/5 h-20 w-20 rounded-2xl bg-[#52aaa5]/6 transform rotate-15" />
        
        {/* Lines */}
        <div className="absolute left-0 top-1/2 h-1 w-1/3 bg-[#52aaa5]/10 transform -rotate-45" />
        <div className="absolute right-0 bottom-1/3 h-1/4 w-1 bg-[#52aaa5]/8" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Current Courses & Daily Learning */}
          <div className="lg:col-span-2 space-y-8">
            <TodayTask />
            <QuizSection />
          </div>

          {/* Right Column - Stats & News */}
          <div className="space-y-8">
            <LearningStats />
            <NewsUpdates />
          </div>
        </div>

        {/* Available Courses Section */}
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-semibold text-[#2D3748]">Explore More Courses</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <div 
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="cursor-pointer"
              >
                <CourseCard course={course} onClick={handleCourseClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage