import { FC } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Course } from '../type/Course'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'

interface CourseCardProps {
  course: Course
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-blue-100 text-blue-600',
  intermediate: 'bg-purple-100 text-purple-600',
  advanced: 'bg-orange-100 text-orange-600',
  expert: 'bg-red-100 text-red-600'
}
const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia'
}

export const CourseCard: FC<CourseCardProps> = ({ course, onView, onEdit, onDelete }) => {
  return (
    <div className="relative rounded-2xl border border-[#eee] shadow-sm bg-white flex overflow-hidden min-h-[158px] group hover:shadow-lg transition-shadow">
      {/* Level Badge (top-left) */}
      <div
        className={twMerge(
          'absolute top-3 left-3 z-10 font-semibold text-xs px-3 py-1 rounded-full',
          LEVEL_COLORS[course.level ?? 'beginner']
        )}
      >
        {LEVEL_LABELS[course.level ?? 'beginner']}
      </div>
      {/* left: IMAGE */}
      <div className="relative w-40 min-w-[160px] max-w-[160px] h-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-50">
        {course.image_url ? (
          // TODO: Replace with NextJS <Image> if possible
          <img
            src={course.image_url}
            alt={course.title}
            className="object-cover w-full h-full rounded-2xl"
            loading="lazy"
            style={{ aspectRatio: '1/1' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#bbb] text-4xl bg-gray-100">
            ?
          </div>
        )}
        {/* Version (bottom-right of image) */}
        {course.version && (
          <div className="absolute bottom-2 right-2 bg-gray-800 text-white rounded-full px-3 py-0.5 text-xs text-nowrap opacity-80">
            v{course.version}
          </div>
        )}
      </div>
      {/* right: info */}
      <div className="flex-1 flex flex-col justify-between px-4 py-3 min-w-0">
        {/* title */}
        <div className="font-semibold text-lg text-[#2D3748] truncate" title={course.title}>
          {course.title}
        </div>
        {/* overview */}
        <div
          className="text-[#4A5568] text-sm mt-1 mb-2 leading-snug line-clamp-2"
          title={course.overview}
        >
          {course.overview}
        </div>
        {/* skills */}
        <div className="flex gap-2 flex-wrap mb-2">
          {Array.isArray(course.skills) && course.skills.length > 0 ? (
            course.skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-[#f3f6f8] text-[#52aaa5] font-medium px-2 py-1 rounded-md text-xs"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-gray-400">Chưa có kỹ năng</span>
          )}
        </div>
        {/* Actions & Last updated */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onView?.(course.id)}
              className="px-2 py-1 text-[#2D3748] hover:text-[#52aaa5] transition-colors text-xs rounded border border-transparent hover:border-[#52aaa5]"
              title="Xem chi tiết"
              type="button"
            >
              Xem
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(course.id)}
                className="px-2 py-1 text-[#2D3748] hover:text-indigo-600 transition-colors text-xs rounded border border-transparent hover:border-indigo-400"
                title="Chỉnh sửa"
                type="button"
              >
                Sửa
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(course.id)}
                className="px-2 py-1 text-[#2D3748] hover:text-red-500 transition-colors text-xs rounded border border-transparent hover:border-red-300"
                title="Xóa"
                type="button"
              >
                Xóa
              </button>
            )}
          </div>
          {/* Ngày cập nhật (right bottom) */}
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {course.updated_at ? `Cập nhật: ${dayjs(course.updated_at).format('DD/MM/YYYY')}` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
