import { Card } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Progress } from '../../../../components/ui/progress'
import { ScrollText, Share2, ChevronRight, Brain, Clock } from 'lucide-react'

interface Note {
  id: string
  term: string
  definition: string
  example: string
}

interface NotebookStats {
  mastered: number
  learning: number
  toReview: number
  accuracy: number
}

interface NotebookProps {
  id: string
  title: string
  description: string
  totalNotes: number
  color: string
  lastUpdated: string
  isShared: boolean
  stats: NotebookStats
  categories: string[]
  recentNotes: Note[]
  onClick?: (id: string) => void
  sharedBy?: string
}

const NotebookCard = ({ 
  id,
  title,
  description,
  totalNotes,
  color,
  lastUpdated,
  isShared,
  stats,
  categories,
  recentNotes,
  onClick,
  sharedBy
}: NotebookProps) => {
  const totalTerms = stats.mastered + stats.learning + stats.toReview

  return (
    <Card 
      className="group cursor-pointer overflow-hidden rounded-2xl border-[#52aaa5]/10 transition-all hover:scale-[1.02] hover:bg-[#52aaa5]/5 hover:shadow-lg hover:shadow-[#52aaa5]/10"
      onClick={() => onClick?.(id)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}10` }}
            >
              <ScrollText 
                className="h-6 w-6"
                style={{ color: color }}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#2D3748]">{title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-[#718096]">{totalNotes} từ vựng</p>
                {sharedBy && (
                  <>
                    <span className="text-[#718096]">•</span>
                    <p className="text-sm text-[#718096]">
                      Chia sẻ bởi {sharedBy}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          {isShared && (
            <Share2 className="h-5 w-5 text-[#52aaa5]" />
          )}
        </div>

        {/* Categories */}
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant="secondary"
              className="bg-[#52aaa5]/10 text-[#52aaa5]"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-[#718096] line-clamp-2">
          {description}
        </p>

        {/* Progress */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-[#52aaa5]">
              <Brain className="h-4 w-4" />
              <span>Tiến độ học tập</span>
            </div>
            <span className="font-medium text-[#52aaa5]">
              {stats.accuracy}% chính xác
            </span>
          </div>
          <Progress 
            value={(stats.mastered / totalTerms) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-[#718096]">
            <span>{stats.mastered} thuộc</span>
            <span>{stats.learning} đang học</span>
            <span>{stats.toReview} cần ôn tập</span>
          </div>
        </div>

        {/* Recent Notes Preview */}
        {recentNotes.length > 0 && (
          <div className="mb-4 rounded-lg bg-[#52aaa5]/5 p-3">
            <p className="mb-2 text-xs font-medium text-[#52aaa5]">
              Ghi chú gần đây:
            </p>
            {recentNotes.slice(0, 1).map((note) => (
              <div key={note.id} className="text-sm">
                <p className="font-medium text-[#2D3748]">{note.term}</p>
                <p className="text-[#718096] line-clamp-1">{note.definition}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-[#718096]">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Cập nhật {lastUpdated}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-[#718096]/50" />
        </div>
      </div>
    </Card>
  )
}

export default NotebookCard