import { FC, useState, useMemo } from 'react'
import {
  BookOpen,
  BarChart,
  GraduationCap,
  Pencil,
  Trash2,
  Eye,
  ListChecks,
  Sparkles
} from 'lucide-react'
import { Lesson } from '../types/course'

// Reduced pool of Lucide icons to avoid render errors
const ICONS = [BookOpen, BarChart, GraduationCap]
const BG_COLORS = [
  'bg-rose-100',
  'bg-green-100',
  'bg-blue-100',
  'bg-purple-100',
  'bg-yellow-100',
  'bg-pink-100',
  'bg-orange-100',
  'bg-gray-100',
  'bg-teal-100'
]

// Deterministic random assignment based on lesson.id
function pickRandomById<T>(arr: T[], id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 10007
  return arr[hash % arr.length]
}

/**
 * Info sub-item with icon, number, and text.
 */
const InfoItem: FC<{ icon: React.ReactNode; number: number | string; text: string }> = ({
  icon,
  number,
  text
}) => (
  <div className="flex items-center gap-[2px] px-1 py-0.5 text-xs font-medium text-gray-500">
    <span className="text-gray-400 w-3 h-3 flex items-center">{icon}</span>
    <span className="font-semibold text-gray-400">{number}</span>
    <span className="ml-0.5 text-gray-400">{text}</span>
  </div>
)

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
  published: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  review: { bg: 'bg-blue-100', text: 'text-blue-700' },
  archived: { bg: 'bg-slate-100', text: 'text-slate-700' }
}

const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const s = status?.toLowerCase() ?? 'draft'
  const color = STATUS_COLOR_MAP[s] || { bg: 'bg-gray-100', text: 'text-gray-700' }

  return (
    <span
      className={`px-2 py-0.5 min-w-[56px] text-xs rounded font-semibold ml-2 text-center ${color.bg} ${color.text}`}
      title={status}
      style={{ letterSpacing: 0.1 }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

import { useNavigate } from 'react-router-dom'

interface LessonItemProps {
  lesson: Lesson
  courseId: string
  onRemoveLesson: (lessonId: string, setLoading: (loading: boolean) => void) => void
}

export const LessonItem: FC<LessonItemProps> = ({ lesson, courseId, onRemoveLesson }) => {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  // Pick icon as React component
  const IconComponent = useMemo(() => pickRandomById(ICONS, lesson.id), [lesson.id])
  const bgColor = useMemo(() => pickRandomById(BG_COLORS, lesson.id), [lesson.id])

  // Derive icon color: e.g. bg-rose-100 → text-rose-500
  const iconColorClass = useMemo(() => {
    const match = bgColor.match(/^bg-(\w+)-100$/)
    if (match && match[1]) {
      return `text-${match[1]}-500`
    }
    return 'text-slate-500'
  }, [bgColor])

  // For demo: generate fake score and skill
  const fakeScore = useMemo(() => 50 + (lesson.id.length % 50), [lesson.id])
  const fakeSkill = useMemo(
    () => ['Listening', 'Reading', 'Writing', 'Speaking'][lesson.id.length % 4],
    [lesson.id]
  )

  // Title truncation utility
  const titleText = lesson.title?.length > 40 ? `${lesson.title.slice(0, 40)}...` : lesson.title

  // Handlers for actions (replace with real if needed)
  const handleEdit = () => {
    navigate(`/course/${courseId}/lesson/${lesson.id}/edit`)
  }
  const handleView = () => alert('View lesson ' + lesson.title)
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteLoading(true)
    await onRemoveLesson(lesson.id, setDeleteLoading)
  }

  return (
    <div className="relative border-b border-gray-200 hover:border-[#52aaa5] rounded-lg p-3 pr-24 flex items-center min-h-[68px]  transition-colors group">
      {/* Left: Random Icon and BG */}
      <div
        className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-md ${bgColor} mr-3`}
        style={{ borderRadius: 8 }}
      >
        {IconComponent && (
          // Use the derived icon color class for a richer color
          <IconComponent size={20} className={iconColorClass} />
        )}
      </div>
      {/* Main content column */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex flex-row items-center gap-2">
          <h3
            className="font-extrabold text-[#233c5c] text-base leading-tight max-w-full truncate flex items-center"
            style={{ lineHeight: '1.28', letterSpacing: '-0.02em' }}
            title={lesson.title}
          >
            {`Lesson ${lesson.sequence}: `}
            <span className="font-bold">{titleText}</span>
          </h3>
          <StatusBadge status={lesson.status || 'draft'} />
        </div>

        {/* Info row */}
        <div className="flex gap-1 mt-2 flex-wrap">
          <InfoItem
            icon={<ListChecks size={12} className="text-gray-400" />}
            number={lesson.questions?.length ?? 0}
            text="question"
          />
          <InfoItem
            icon={<BarChart size={12} className="text-gray-400" />}
            number={fakeScore}
            text="score"
          />
          <InfoItem
            icon={<Sparkles size={12} className="text-gray-400" />}
            number=""
            text={fakeSkill}
          />
        </div>
      </div>
      {/* Right: actions */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-row gap-1 items-center">
        <button className="p-1.5 transition-colors" onClick={handleEdit} aria-label="Edit lesson">
          <Pencil
            size={15}
            className={`text-gray-400 ${deleteLoading ? 'animate-spin' : 'hover:text-gray-600'}`}
          />
        </button>
        <button
          className="p-1.5 transition-colors"
          onClick={handleDelete}
          aria-label="Delete lesson"
          disabled={deleteLoading}
        >
          <Trash2
            size={15}
            className={`text-gray-400 ${deleteLoading ? 'animate-spin' : 'hover:text-gray-600'}`}
          />
        </button>
        <button className="p-1.5 transition-colors" onClick={handleView} aria-label="View lesson">
          <Eye
            size={15}
            className={`text-gray-400 ${deleteLoading ? 'animate-spin' : 'hover:text-gray-600'}`}
          />
        </button>
      </div>
    </div>
  )
}
