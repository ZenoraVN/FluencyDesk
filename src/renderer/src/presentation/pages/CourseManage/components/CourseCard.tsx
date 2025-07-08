import { FC, useState } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Course } from '../type/Course'
import { twMerge } from 'tailwind-merge'
import { Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react'

interface CourseCardProps {
  course: Course
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// Level badge coloring and labels
const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-blue-50 text-blue-600 border border-blue-200',
  intermediate: 'bg-purple-50 text-purple-700 border border-purple-200',
  advanced: 'bg-orange-50 text-orange-700 border border-orange-200',
  expert: 'bg-red-50 text-red-700 border border-red-200'
}
const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia'
}

const STATUS_COLORS: Record<string, string> = {
  public: 'bg-green-100 text-green-600 border border-green-200',
  private: 'bg-slate-100 text-slate-600 border border-slate-200',
  draft: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  archived: 'bg-gray-100 text-gray-400 border border-gray-200'
}

const STATUS_LABELS: Record<string, string> = {
  public: 'Công khai',
  private: 'Riêng tư',
  draft: 'Nháp',
  archived: 'Đã lưu trữ'
}

export const CourseCard: FC<CourseCardProps> = ({ course, onView, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div
      className={twMerge(
        'relative rounded-2xl border border-[#b9b9b9] flex overflow-hidden transition-all group',
        'bg-transparent',
        'hover:shadow-2xl hover:border-[#52aaad]'
      )}
      style={{ boxShadow: '0 2px 16px 0 rgba(82, 170, 173, 0.07)' }}
    >
      {/* Left: IMAGE - đã giảm kích thước, đảm bảo vuông */}
      <div className="relative w-32 min-w-[128px] max-w-[128px] aspect-square flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-50 rounded-2xl">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="object-cover w-full h-full rounded-2xl"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#bbb] text-4xl bg-gray-100 rounded-2xl">
            ?
          </div>
        )}
      </div>

      {/* Right: info - giảm padding */}
      <div className="flex-1 flex flex-col px-3 py-1.5 min-w-0 h-full relative justify-between">
        {/* Dùng flex-col + justify-between để chia đều 4 khối dọc card */}
        {/* Title */}
        <div className="font-semibold text-base text-[#2D3748] truncate" title={course.title}>
          {course.title}
        </div>
        {/* Overview */}
        <div className="text-[#4A5568] text-sm leading-snug line-clamp-2" title={course.overview}>
          {course.overview}
        </div>
        {/* Skills */}
        <div className="flex gap-1 flex-wrap">
          {Array.isArray(course.skills) && course.skills.length > 0 ? (
            course.skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-[#f3f6f8] text-[#52aaa5] font-medium px-2 py-0.5 rounded-md text-xs"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-gray-400">Chưa có kỹ năng</span>
          )}
        </div>
        {/* Nhóm badge căn trái đi liền nhau */}
        <div className="flex flex-row gap-2 items-center">
          {/* Status Badge */}
          {course.status && (
            <div
              className={twMerge(
                'text-xs px-2 py-0.5 rounded-[2px] font-semibold flex items-center gap-1',
                STATUS_COLORS[course.status] ?? 'bg-gray-50 text-gray-400 border border-gray-200'
              )}
            >
              {STATUS_LABELS[course.status] ?? course.status}
            </div>
          )}
          {/* Level Badge */}
          <div
            className={twMerge(
              'text-xs px-2 py-0.5 rounded-[2px] font-semibold',
              LEVEL_COLORS[course.level ?? 'beginner']
            )}
          >
            {LEVEL_LABELS[course.level ?? 'beginner']}
          </div>
          {/* Version Badge */}
          {course.version && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-[2px]">
              v{course.version}
            </span>
          )}
        </div>
        {/* Fixed Horizontal More Button */}
        <div className="absolute bottom-1 right-3 z-30">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full transition-colors"
              type="button"
              title="Hành động"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-100"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    onView?.(course.id)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Xem chi tiết</span>
                </button>
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(course.id)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(course.id)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span>Xóa</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
