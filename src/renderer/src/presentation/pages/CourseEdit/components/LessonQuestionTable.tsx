import { FC, useMemo, useState } from 'react'
import { Trash2, Eye, Move, ClipboardCheck } from 'lucide-react'
import { Question } from '../types/course'
import clsx from 'clsx'
import CustomTable from '../../../../components/Table/CustomTable'

interface LessonQuestionTableProps {
  questions: Question[]
  onRemoveQuestion: (questionId: string, setLoadingId: (id: string | null) => void) => void
  onViewQuestion: (questionId: string) => void
}

const skillLabel: Record<string, { label: string; color: string }> = {
  grammar: { label: 'Ngữ pháp', color: 'bg-blue-100 text-blue-800' },
  vocab: { label: 'Từ vựng', color: 'bg-green-100 text-green-800' },
  listening: { label: 'Nghe', color: 'bg-purple-100 text-purple-800' },
  reading: { label: 'Đọc', color: 'bg-orange-100 text-orange-800' }
}
const typeLabel: Record<string, { label: string; color: string }> = {
  fill_in_the_blank: {
    label: 'Điền chỗ trống',
    color: 'bg-teal-100 text-teal-800'
  },
  multiple_choice: { label: 'Trắc nghiệm', color: 'bg-pink-100 text-pink-800' },
  short_answer: { label: 'Tự luận', color: 'bg-yellow-100 text-yellow-800' }
}
const ROWS_PER_PAGE = 5

const LessonQuestionTable: FC<LessonQuestionTableProps> = ({
  questions,
  onRemoveQuestion,
  onViewQuestion
}) => {
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Pagination
  const totalCount = questions.length
  const pagedQuestions = useMemo(
    () => questions.slice((page - 1) * ROWS_PER_PAGE, (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE),
    [page, questions]
  )

  // Column definitions theo TanStack Table
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        cell: (info: any) => (
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded text-xs font-semibold">
            {(page - 1) * ROWS_PER_PAGE + info.row.index + 1}
          </span>
        )
      },
      {
        header: 'ID',
        cell: (info: any) => {
          const q = info.row.original as Question
          const id = q.question_id || q.id
          return (
            <span
              className={clsx(
                'font-mono text-xs text-[#319795] cursor-pointer select-all relative',
                'hover:underline'
              )}
              onClick={async (e) => {
                e.preventDefault()
                await navigator.clipboard.writeText(id)
                setCopied(id)
                setTimeout(() => setCopied(null), 1200)
              }}
              title="Click để copy ID"
            >
              {id}
              {copied === id && (
                <span className="absolute right-0 top-1 flex items-center gap-1 text-teal-700 text-xs animate-fade-in">
                  <ClipboardCheck className="inline w-4 h-4" /> Copied!
                </span>
              )}
            </span>
          )
        }
      },
      {
        header: 'Kĩ năng',
        cell: (info: any) => {
          const q = info.row.original as Question
          const label = skillLabel[q.question_skill]?.label || q.question_skill
          const color = skillLabel[q.question_skill]?.color || 'bg-gray-100 text-gray-500'
          return (
            <span className={clsx('inline-block px-2 py-1 rounded text-xs font-semibold', color)}>
              {label}
            </span>
          )
        }
      },
      {
        header: 'Loại',
        cell: (info: any) => {
          const q = info.row.original as Question
          const label = typeLabel[q.question_type]?.label || q.question_type
          const color = typeLabel[q.question_type]?.color || 'bg-gray-100 text-gray-500'
          return (
            <span className={clsx('inline-block px-2 py-1 rounded text-xs font-semibold', color)}>
              {label}
            </span>
          )
        }
      },
      {
        header: 'Hành động',
        cell: (info: any) => {
          const q = info.row.original as Question
          return (
            <div className="flex gap-2">
              <button
                type="button"
                title="Xem câu hỏi"
                className="rounded p-1 text-[#52aaa5] hover:bg-[#E7FAF7] hover:text-[#368681] transition-colors"
                onClick={() => onViewQuestion(q.question_id || q.id)}
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                type="button"
                title="Chuyển vị trí"
                className="rounded p-1 text-gray-400 hover:bg-[#F5F7FB] hover:text-[#2D3748] transition-colors"
                disabled
              >
                <Move className="w-5 h-5" />
              </button>
              <button
                type="button"
                title="Xóa"
                className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-700 transition-colors"
                onClick={() => onRemoveQuestion(q.id, setLoadingId)}
                disabled={loadingId === q.id}
              >
                {loadingId === q.id ? (
                  <svg className="animate-spin w-5 h-5 text-red-400" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          )
        }
      }
    ],
    [copied, loadingId, onRemoveQuestion, onViewQuestion, page]
  )

  // Xử lý reset page khi đang ở page > maxPage mà xóa bớt câu hỏi
  const maxPage = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE))
  if (page > maxPage) setPage(maxPage)

  return (
    <CustomTable<Question>
      data={pagedQuestions}
      columns={columns as any}
      totalCount={totalCount}
      currentPage={page}
      pageSize={ROWS_PER_PAGE}
      onPageChange={(nextPage) => setPage(nextPage)}
      emptyMessage="Không có câu hỏi nào"
    />
  )
}

export default LessonQuestionTable
