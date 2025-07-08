import { FC, useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { Lesson } from '../types/course'
import { QuestionDetail } from '../types/questionDetail'
import { AddQuestionSection } from './AddQuestionSection'
import LessonQuestionTable from './LessonQuestionTable'
import { CustomInput } from '../../../../components/Input/CustomInput'
import { RichtextView } from '../../../../components/common/RichtextView'
import { RichtextchtEditor } from '../../../../components/Input/CustomRichtext'

// Trạng thái với màu sắc border và text cùng nhau, bg-transparent, không shadow
const STATUS_STYLES: Record<string, { border: string; text: string }> = {
  draft: { border: 'border-gray-500', text: 'text-gray-700' },
  pending: { border: 'border-yellow-500', text: 'text-yellow-700' },
  approved: { border: 'border-teal-600', text: 'text-teal-700' },
  rejected: { border: 'border-red-500', text: 'text-red-700' },
  published: { border: 'border-green-600', text: 'text-green-700' },
  unpublished: { border: 'border-blue-600', text: 'text-blue-700' },
  archived: { border: 'border-gray-400', text: 'text-gray-600' }
}

const getStatusClass = (status?: string) => {
  const st = STATUS_STYLES[status ?? 'draft']
  return `${st.border} ${st.text}`
}

/**
 * Status badge - style like button, no shadow, color by status, bg is transparent, h-8 (32px)
 */
const StatusBadge: FC<{ status: string }> = ({ status }) => (
  <span
    className={`h-8 min-h-[32px] px-4 flex items-center rounded-md text-sm font-semibold border bg-transparent select-none whitespace-nowrap ${getStatusClass(
      status
    )}`}
    style={{ lineHeight: '1.2' }}
    title={status}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

interface LessonItemProps {
  lesson: Lesson
  expanded: boolean
  showQuestionForm: { lessonId: string; questionSequence: number } | null
  newQuestionId: string
  foundQuestion: QuestionDetail | null
  onSetExpanded: (lessonId: string | null) => void
  onRemoveLesson: (lessonId: string, setLoading: (loading: boolean) => void) => void
  onToggleQuestionForm: (lessonId: string) => void
  onCreateQuestion: () => void
  onQuestionIdChange: (val: string) => void
  onCheckQuestion: () => void
  onAddQuestion: () => void
  onViewQuestion: (questionId: string) => void
  onRemoveQuestion: (questionId: string, setLoadingId: (id: string | null) => void) => void
}

export const LessonItem: FC<LessonItemProps> = ({
  lesson,
  expanded,
  showQuestionForm,
  newQuestionId,
  foundQuestion,
  onSetExpanded,
  onRemoveLesson,
  onToggleQuestionForm,
  onCreateQuestion,
  onQuestionIdChange,
  onCheckQuestion,
  onAddQuestion,
  onViewQuestion,
  onRemoveQuestion
}) => {
  const [title, setTitle] = useState(lesson.title || '')
  const [overview, setOverview] = useState(lesson.overview || '')
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    setTitle(lesson.title || '')
    setOverview(lesson.overview || '')
  }, [lesson.id, lesson.title, lesson.overview, expanded])

  const titleChanged = title !== (lesson.title || '')
  const overviewChanged = overview !== (lesson.overview || '')
  const resetTitle = () => setTitle(lesson.title || '')
  const resetOverview = () => setOverview(lesson.overview || '')

  return (
    <div className="relative border border-gray-200 hover:border-[#52aaa5] rounded-lg p-4 transition-colors">
      {/* Top-left number badge and status - only when expanded */}
      {expanded && (
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center text-[#52aaa5] text-base font-bold rounded-lg border border-[#52aaa5] select-none pointer-events-none bg-white">
              {lesson.sequence}
            </div>
            {/* Status badge on the left with number */}
            <StatusBadge status={lesson.status || 'draft'} />
          </div>
        </div>
      )}

      {/* Top-right expand/collapse + delete */}
      <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
        {expanded && (
          <button
            className="bg-white bg-opacity-60 hover:bg-red-50 rounded-lg hover:outline hover:outline-red-200 p-2 transition-colors disabled:opacity-50"
            onClick={async (e) => {
              e.stopPropagation()
              setDeleteLoading(true)
              await onRemoveLesson(lesson.id, setDeleteLoading)
            }}
            aria-label="Xóa bài học"
            type="button"
            tabIndex={0}
            disabled={deleteLoading}
          >
            <Trash2
              className={`w-5 h-5 ${
                deleteLoading ? 'animate-spin' : 'text-red-400 hover:text-red-600 transition-colors'
              }`}
            />
          </button>
        )}
        <button
          className="bg-white bg-opacity-60 hover:bg-[#52aaa5]/10 rounded-lg hover:outline hover:outline-[#52aaa5] hover:outline-1 p-2 transition-colors"
          onClick={() => onSetExpanded(expanded ? null : lesson.id)}
          aria-label="Expand or collapse lesson"
          type="button"
          tabIndex={0}
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-[#52aaa5]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#52aaa5]" />
          )}
        </button>
      </div>

      {/* Title + Overview */}
      {!expanded ? (
        // VIEW MODE
        <div className="mb-1 pl-0">
          <div className="flex justify-between items-end gap-2">
            <h3 className="text-base font-medium text-[#2D3748]">
              {lesson.sequence}. {lesson.title}
            </h3>
          </div>
          {/* Tổng quan ở view */}
          <RichtextView content={lesson.overview || ''} className="text-[#718096] mt-2" />
          {/* Status badge absolute bottom right */}
          <div className="absolute bottom-3 right-3">
            <StatusBadge status={lesson.status || 'draft'} />
          </div>
        </div>
      ) : (
        // EDIT MODE (expanded)
        <>
          <div className="mb-3 pt-10">
            <label className="block mb-1 text-sm font-semibold text-[#2D3748]">Tiêu đề</label>
            <CustomInput value={title} onChange={setTitle} className="hover:border-[#52aaa5]" />
            {titleChanged && (
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={resetTitle}
                  className="px-3 py-1 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                  type="button"
                >
                  Hủy thay đổi
                </button>
                <button
                  // Chưa thực hiện lưu
                  className="px-3 py-1 text-sm rounded-md bg-[#52aaa5] text-white hover:bg-[#368681] font-medium transition-colors"
                  type="button"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
          <div className="mb-1">
            <label className="block mb-1 text-sm font-semibold text-[#2D3748]">Tổng quan</label>
            {/* Dùng RichtextchtEditor cho tổng quan */}
            <RichtextchtEditor
              value={overview}
              onChange={setOverview}
              placeholder="Nhập tổng quan cho bài học..."
              className="text-[#718096] hover:border-[#52aaa5]"
            />
            {overviewChanged && (
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={resetOverview}
                  className="px-3 py-1 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                  type="button"
                >
                  Hủy thay đổi
                </button>
                <button
                  // Chưa thực hiện lưu
                  className="px-3 py-1 text-sm rounded-md bg-[#52aaa5] text-white hover:bg-[#368681] font-medium transition-colors"
                  type="button"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </>
      )}
      <div className="text-sm text-[#718096] mt-2">{(lesson.questions ?? []).length} câu hỏi</div>
      {/* Expanded content */}
      {expanded && (
        <div className="mt-6">
          <AddQuestionSection
            showForm={showQuestionForm?.lessonId === lesson.id}
            newQuestionId={newQuestionId}
            foundQuestion={foundQuestion}
            onToggleForm={() => onToggleQuestionForm(lesson.id)}
            onCreateQuestion={onCreateQuestion}
            onQuestionIdChange={onQuestionIdChange}
            onCheckQuestion={onCheckQuestion}
            onAddQuestion={onAddQuestion}
            onViewQuestion={onViewQuestion}
          />
          {(lesson.questions ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-300 rounded-lg my-4 hover:outline hover:border-[#52aaa5]">
              <div className="mb-2 text-[#52aaa5]">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17v.01M12 13a4 4 0 10-4-4m8 0a4 4 0 00-4 4m0 4h.01"
                  />
                </svg>
              </div>
              <span className="text-[#a0aec0] text-sm font-medium mb-1">
                Chưa có câu hỏi nào cho bài học này
              </span>
              <span className="text-[#cbd5e1] text-xs">Hãy thêm câu hỏi để bắt đầu!</span>
            </div>
          ) : (
            <LessonQuestionTable
              questions={lesson.questions ?? []}
              onRemoveQuestion={onRemoveQuestion}
              onViewQuestion={onViewQuestion}
            />
          )}
        </div>
      )}
    </div>
  )
}
