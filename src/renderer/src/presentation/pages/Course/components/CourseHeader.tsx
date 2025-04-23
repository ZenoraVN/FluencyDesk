import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'

interface CourseHeaderProps {
  course: {
    title: string
    overview: string
    band: string
    image_urls: string[]
    skills: string[]
  }
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  const colors = [
    'bg-[#FF69B4]/20 text-[#FF69B4]',
    'bg-[#4A90E2]/20 text-[#4A90E2]',
    'bg-[#3CB371]/20 text-[#3CB371]',
    'bg-[#9370DB]/20 text-[#9370DB]',
    'bg-[#FF7F50]/20 text-[#FF7F50]',
    'bg-[#FFD700]/20 text-[#FFD700]'
  ]

  return (
    <div className="mb-8 flex gap-8">
      <div className="relative aspect-square w-[300px] overflow-hidden rounded-2xl">
        <img
          src={course.image_urls[0]}
          alt={course.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, index) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className={`${colors[index % colors.length]} text-xs font-medium`}
              >
                {skill}
              </Badge>
            ))}
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
  )
}

export default CourseHeader