import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { CheckCircle2, Target } from 'lucide-react'

interface CourseOverviewProps {
  requirements: string[]
  objectives: string[]
}

const CourseOverview = ({ requirements, objectives }: CourseOverviewProps) => {
  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">
      {/* Requirements */}
      <Card className="rounded-2xl border-[#52aaa5]/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#2D3748]">
            <CheckCircle2 className="h-5 w-5 text-[#52aaa5]" />
            Yêu cầu khóa học
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-[#52aaa5]/10 p-1">
                  <CheckCircle2 className="h-4 w-4 text-[#52aaa5]" />
                </div>
                <span className="text-[#718096]">{requirement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Objectives */}
      <Card className="rounded-2xl border-[#52aaa5]/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#2D3748]">
            <Target className="h-5 w-5 text-[#52aaa5]" />
            Mục tiêu khóa học
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#52aaa5]/10 text-xs font-medium text-[#52aaa5]">
                  {index + 1}
                </div>
                <span className="text-[#718096]">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default CourseOverview