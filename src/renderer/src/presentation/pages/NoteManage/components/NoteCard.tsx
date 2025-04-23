import { Card } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { StickyNote, Share2, ChevronRight, Pin, Clock } from 'lucide-react'

interface NoteCardProps {
  id: string
  title: string
  overview: string
  tags: string[]
  color: string
  lastUpdated: string
  pinned: boolean
  content?: string
  sharedBy?: string
  onClick: (id: string) => void
}

const NoteCard = ({
  id,
  title,
  overview,
  tags,
  color,
  lastUpdated,
  pinned,
  content,
  sharedBy,
  onClick
}: NoteCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden rounded-2xl border-[#52aaa5]/10 transition-all hover:scale-[1.02] hover:bg-[#52aaa5]/5 hover:shadow-lg hover:shadow-[#52aaa5]/10"
      onClick={() => onClick(id)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}10` }}
            >
              <StickyNote 
                className="h-6 w-6"
                style={{ color: color }}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#2D3748] line-clamp-1">{title}</h3>
              {sharedBy && (
                <p className="text-sm text-[#718096]">
                  Chia sẻ bởi {sharedBy}
                </p>
              )}
            </div>
          </div>
          {pinned && (
            <Pin className="h-5 w-5 text-[#52aaa5] transform -rotate-45" />
          )}
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag}
              variant="secondary"
              className="bg-[#52aaa5]/10 text-[#52aaa5]"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Overview */}
        <p className="mb-4 text-sm text-[#718096] line-clamp-2">
          {overview}
        </p>

        {/* Content Preview */}
        {content && (
          <div className="mb-4 rounded-lg bg-[#52aaa5]/5 p-3">
            <p className="text-sm text-[#718096] line-clamp-2">{content}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-[#718096]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Cập nhật {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            {sharedBy && <Share2 className="h-4 w-4" />}
            <ChevronRight className="h-5 w-5 text-[#718096]/50" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default NoteCard