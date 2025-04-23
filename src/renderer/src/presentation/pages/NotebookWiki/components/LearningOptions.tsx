import { Card, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { 
  Layers, 
  Brain, 
  SplitSquareHorizontal, 
  Pencil,
  Clock,
  ArrowRight 
} from 'lucide-react'
import { learningOptions } from '../data/mockData'

const LearningOptions = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayersIcon':
        return <Layers className="h-6 w-6" />
      case 'BrainIcon':
        return <Brain className="h-6 w-6" />
      case 'SplitSquareHorizontalIcon':
        return <SplitSquareHorizontal className="h-6 w-6" />
      case 'PencilIcon':
        return <Pencil className="h-6 w-6" />
      default:
        return <Layers className="h-6 w-6" />
    }
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#2D3748]">Phương pháp học tập</h2>
            <p className="text-sm text-[#718096]">Chọn phương pháp học phù hợp với bạn</p>
          </div>
          <Button variant="ghost" className="text-[#52aaa5]">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {learningOptions.map((option) => (
            <div
              key={option.id}
              className="group cursor-pointer space-y-4 rounded-xl border border-[#52aaa5]/10 p-4 transition-all hover:border-[#52aaa5]/30 hover:bg-[#52aaa5]/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#52aaa5]/10 text-[#52aaa5] transition-all group-hover:bg-[#52aaa5] group-hover:text-white">
                {getIcon(option.icon)}
              </div>

              <div>
                <h3 className="font-medium text-[#2D3748]">{option.title}</h3>
                <p className="text-sm text-[#718096]">{option.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#52aaa5]/10 pt-4">
                <div className="flex items-center gap-2 text-sm text-[#718096]">
                  <Clock className="h-4 w-4" />
                  <span>{option.duration}</span>
                </div>
                <div className="rounded-full bg-[#52aaa5]/10 px-2 py-1">
                  <span className="text-sm font-medium text-[#52aaa5]">
                    {option.count} từ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-[#52aaa5]/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#52aaa5]/10 p-2">
                <Brain className="h-5 w-5 text-[#52aaa5]" />
              </div>
              <div>
                <p className="font-medium text-[#2D3748]">Gợi ý cho bạn</p>
                <p className="text-sm text-[#718096]">
                  Bắt đầu với Flashcards để học từ mới hiệu quả nhất
                </p>
              </div>
            </div>
            <Button 
              className="bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90"
            >
              Bắt đầu ngay
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LearningOptions