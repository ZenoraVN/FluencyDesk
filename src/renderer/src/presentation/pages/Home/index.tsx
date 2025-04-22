import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { courses } from './data'
import { Badge } from '../../../components/ui/badge'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`)
  }

  const generateRandomShapes = () => {
    const shapes = []
    // Generate 50 random shapes
    for (let i = 0; i < 50; i++) {
      const size = Math.floor(Math.random() * 40) + 2 // 2px to 42px
      const opacity = Math.floor(Math.random() * 15) + 3 // 3% to 18%
      const left = Math.floor(Math.random() * 100)
      const top = Math.floor(Math.random() * 100)
      const rotation = Math.floor(Math.random() * 360)
      const isVertical = Math.random() > 0.5
      const isBorder = Math.random() > 0.8

      shapes.push(
        <div
          key={i}
          className={`absolute ${
            isVertical ? `h-${size} w-2` : `h-2 w-${size}`
          } rounded-full ${
            isBorder
              ? `border border-[#52aaa5]/${opacity}`
              : `bg-[#52aaa5]/${opacity}`
          }`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            transform: `rotate(${rotation}deg)`,
          }}
        />
      )
    }
    return shapes
  }

  return (
    <div className="relative min-h-screen bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Dynamic random shapes */}
        {generateRandomShapes()}
        
        {/* Large focal points */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-3xl bg-[#52aaa5]/4 transform rotate-45" />
        <div className="absolute left-1/3 bottom-1/3 h-64 w-64 rounded-full bg-[#52aaa5]/6" />
        
        {/* Medium elements */}
        <div className="absolute right-1/2 top-1/2 h-48 w-48 rounded-2xl bg-[#52aaa5]/8 transform -rotate-15" />
        <div className="absolute left-2/3 bottom-1/4 h-40 w-40 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute right-1/3 top-2/3 h-36 w-36 rounded-3xl bg-[#52aaa5]/7 transform rotate-30" />
        <div className="absolute left-1/4 top-1/3 h-32 w-32 rounded-2xl bg-[#52aaa5]/4 transform -rotate-45" />
        
        {/* Small elements */}
        <div className="absolute right-1/4 bottom-2/3 h-24 w-24 rounded-full bg-[#52aaa5]/9" />
        <div className="absolute left-1/2 top-2/5 h-20 w-20 rounded-2xl bg-[#52aaa5]/6 transform rotate-15" />
        <div className="absolute right-2/5 bottom-1/2 h-16 w-16 rounded-full bg-[#52aaa5]/8" />
        <div className="absolute left-3/4 top-1/4 h-12 w-12 rounded-xl bg-[#52aaa5]/5 transform -rotate-30" />
        
        {/* Border elements */}
        <div className="absolute right-1/3 top-1/3 h-40 w-40 rounded-full border-4 border-[#52aaa5]/10" />
        <div className="absolute left-2/3 bottom-2/3 h-32 w-32 rounded-2xl border-2 border-[#52aaa5]/15" />
        <div className="absolute right-2/3 top-2/3 h-24 w-24 rounded-full border-3 border-[#52aaa5]/8" />
        <div className="absolute left-1/3 bottom-1/3 h-20 w-20 rounded-xl border border-[#52aaa5]/12" />
        
        {/* Lines and bars */}
        <div className="absolute left-0 top-1/2 h-1 w-1/3 bg-[#52aaa5]/10 transform -rotate-45" />
        <div className="absolute right-0 bottom-1/3 h-1/4 w-1 bg-[#52aaa5]/8" />
        <div className="absolute top-0 right-1/4 h-1/3 w-1 bg-[#52aaa5]/6" />
        <div className="absolute bottom-0 left-1/3 h-1 w-1/4 bg-[#52aaa5]/12" />
        
        {/* Diagonal lines */}
        <div className="absolute left-1/4 top-1/4 h-1/2 w-1 bg-[#52aaa5]/5 transform rotate-45" />
        <div className="absolute right-1/3 bottom-1/3 h-1 w-1/2 bg-[#52aaa5]/7 transform -rotate-45" />
        <div className="absolute left-2/3 top-1/3 h-1/3 w-1 bg-[#52aaa5]/9 transform rotate-30" />
        <div className="absolute right-1/4 bottom-1/4 h-1 w-1/3 bg-[#52aaa5]/6 transform -rotate-30" />
        
        {/* Additional scattered elements */}
        {Array.from({ length: 20 }).map((_, i) => (
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
        <div className="mb-10">
          <h1 className="mb-2 text-4xl font-bold text-[#2D3748]">Welcome back!</h1>
          <p className="text-lg text-[#718096]">Continue your English learning journey</p>
        </div>

        {/* Available Courses */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-[#2D3748]">Available Courses</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="group relative flex h-full flex-col overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#52aaa5]/20 hover:ring-2 hover:ring-[#52aaa5]"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="relative">
                  <img
                    src={course.image_urls[0]}
                    alt={course.title}
                    className="aspect-square w-full rounded-t-xl object-cover"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute right-3 top-3 bg-[#52aaa5] text-xs font-medium text-white"
                  >
                    {course.band}
                  </Badge>
                </div>
                <CardHeader className="flex-grow space-y-2 p-4 pb-2">
                  <CardTitle className="line-clamp-1 text-lg font-semibold text-[#2D3748]">
                    {course.title}
                  </CardTitle>
                  <div className="no-scrollbar flex gap-2 overflow-x-auto">
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
                          className={`${colors[index % colors.length]} shrink-0 text-xs font-medium`}
                        >
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="line-clamp-2 text-sm text-[#718096]">
                    {course.overview}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add styles to hide scrollbar but keep functionality
const style = document.createElement('style');
style.textContent = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default HomePage