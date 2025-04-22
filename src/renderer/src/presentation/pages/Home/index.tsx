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
    <div className="relative min-h-screen bg-[#f6f6f0] p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top right section */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#52aaa5]/10" />
        <div className="absolute right-40 top-40 h-32 w-32 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute right-96 top-20 h-24 w-24 rounded-3xl bg-[#52aaa5]/8 transform rotate-45" />
        <div className="absolute right-1/4 top-32 h-16 w-16 rounded-lg bg-[#52aaa5]/6 transform -rotate-12" />
        <div className="absolute right-80 top-60 h-20 w-3 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-60 top-28 h-28 w-28 rounded-2xl bg-[#52aaa5]/4 transform rotate-30" />
        <div className="absolute right-32 top-48 h-2 w-20 rounded-full bg-[#52aaa5]/9" />
        
        {/* Top left section */}
        <div className="absolute left-20 top-20 h-40 w-40 rounded-2xl bg-[#52aaa5]/6 transform rotate-15" />
        <div className="absolute left-60 top-40 h-24 w-24 rounded-full bg-[#52aaa5]/4" />
        <div className="absolute left-40 top-60 h-3 w-20 rounded-full bg-[#52aaa5]/8" />
        <div className="absolute left-80 top-32 h-16 w-16 rounded-lg bg-[#52aaa5]/5 transform rotate-45" />
        <div className="absolute left-32 top-48 h-32 w-32 rounded-full bg-[#52aaa5]/3" />
        <div className="absolute left-1/4 top-24 h-20 w-2 rounded-full bg-[#52aaa5]/7 transform -rotate-30" />
        
        {/* Bottom left section */}
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-3xl bg-[#52aaa5]/5 transform rotate-12" />
        <div className="absolute bottom-20 left-32 h-32 w-32 rounded-full bg-[#52aaa5]/10" />
        <div className="absolute bottom-40 left-60 h-20 w-20 rounded-lg bg-[#52aaa5]/7 transform -rotate-12" />
        <div className="absolute bottom-60 left-40 h-16 w-3 rounded-full bg-[#52aaa5]/9" />
        <div className="absolute bottom-28 left-48 h-24 w-24 rounded-2xl bg-[#52aaa5]/4 transform -rotate-15" />
        <div className="absolute bottom-1/4 left-1/4 h-28 w-2 rounded-full bg-[#52aaa5]/6" />
        
        {/* Bottom right section */}
        <div className="absolute -bottom-10 right-20 h-36 w-36 rounded-2xl bg-[#52aaa5]/4 transform rotate-30" />
        <div className="absolute bottom-40 right-40 h-24 w-24 rounded-full bg-[#52aaa5]/6" />
        <div className="absolute bottom-60 right-60 h-3 w-16 rounded-full bg-[#52aaa5]/8" />
        <div className="absolute bottom-32 right-28 h-20 w-20 rounded-lg bg-[#52aaa5]/5 transform -rotate-20" />
        <div className="absolute bottom-48 right-48 h-16 w-16 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute bottom-1/3 right-1/3 h-2 w-24 rounded-full bg-[#52aaa5]/9" />
        
        {/* Middle area elements */}
        <div className="absolute right-1/4 top-1/3 h-40 w-40 rounded-2xl bg-[#52aaa5]/5 transform -rotate-15" />
        <div className="absolute left-1/3 top-1/2 h-36 w-36 rounded-full bg-[#52aaa5]/6" />
        <div className="absolute right-1/3 bottom-1/3 h-28 w-28 rounded-3xl bg-[#52aaa5]/8 transform rotate-30" />
        <div className="absolute left-1/2 top-1/3 h-20 w-3 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-1/2 bottom-1/2 h-3 w-24 rounded-full bg-[#52aaa5]/5" />
        <div className="absolute left-2/5 top-2/5 h-24 w-24 rounded-2xl bg-[#52aaa5]/4 transform rotate-12" />
        <div className="absolute right-2/5 bottom-2/5 h-32 w-32 rounded-full bg-[#52aaa5]/3" />
        
        {/* Scattered elements */}
        <div className="absolute left-1/4 top-1/4 h-4 w-4 rounded-full bg-[#52aaa5]/20" />
        <div className="absolute right-1/3 bottom-1/4 h-6 w-6 rounded-full bg-[#52aaa5]/15" />
        <div className="absolute left-1/3 top-2/3 h-5 w-5 rounded-full bg-[#52aaa5]/10" />
        <div className="absolute right-1/4 top-1/2 h-8 w-8 rounded-lg bg-[#52aaa5]/12 transform rotate-45" />
        <div className="absolute left-2/3 bottom-1/3 h-10 w-10 rounded-xl bg-[#52aaa5]/7" />
        <div className="absolute right-2/3 top-2/3 h-6 w-6 rounded-full bg-[#52aaa5]/9" />
        <div className="absolute left-3/4 top-1/4 h-7 w-7 rounded-lg bg-[#52aaa5]/8" />
        <div className="absolute right-3/4 bottom-1/4 h-5 w-5 rounded-full bg-[#52aaa5]/11" />
        
        {/* Border elements */}
        <div className="absolute left-40 top-40 h-3 w-12 rounded-full bg-[#52aaa5]/10" />
        <div className="absolute right-60 bottom-60 h-12 w-3 rounded-full bg-[#52aaa5]/10" />
        <div className="absolute left-1/2 top-1/4 h-16 w-16 rounded-full border-2 border-[#52aaa5]/10" />
        <div className="absolute right-1/2 bottom-1/4 h-20 w-20 rounded-2xl border-2 border-[#52aaa5]/8" />
        <div className="absolute left-1/4 bottom-1/2 h-12 w-12 rounded-full border border-[#52aaa5]/12" />
        <div className="absolute right-1/4 top-2/3 h-14 w-14 rounded-2xl border border-[#52aaa5]/6" />
        <div className="absolute left-2/3 top-1/3 h-18 w-18 rounded-full border-2 border-[#52aaa5]/7" />
        <div className="absolute right-2/3 bottom-2/3 h-16 w-16 rounded-2xl border border-[#52aaa5]/9" />
        
        {/* Thin lines */}
        <div className="absolute left-1/3 top-1/4 h-2 w-24 rounded-full bg-[#52aaa5]/4 transform rotate-45" />
        <div className="absolute right-1/3 bottom-1/4 h-24 w-2 rounded-full bg-[#52aaa5]/4 transform -rotate-45" />
        <div className="absolute left-2/3 top-2/3 h-2 w-20 rounded-full bg-[#52aaa5]/6" />
        <div className="absolute right-2/3 bottom-2/3 h-20 w-2 rounded-full bg-[#52aaa5]/6" />
        <div className="absolute left-1/4 top-3/4 h-2 w-16 rounded-full bg-[#52aaa5]/5 transform -rotate-30" />
        <div className="absolute right-1/4 bottom-3/4 h-16 w-2 rounded-full bg-[#52aaa5]/5 transform rotate-30" />
        <div className="absolute left-3/4 top-1/4 h-2 w-28 rounded-full bg-[#52aaa5]/7" />
        <div className="absolute right-3/4 bottom-1/4 h-28 w-2 rounded-full bg-[#52aaa5]/7" />
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