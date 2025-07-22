import { FC, useState, useRef, useEffect } from 'react'
import { PlusCircle, ArrowUpDown } from 'lucide-react'
import { Course } from '../types/course'
import { QuestionDetail } from '../types/questionDetail'
import { LessonItem } from './LessonItem'
import ApiService from '../../../../service/ApiService'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Loader2 } from 'lucide-react'
import { CustomInput } from '../../../../components/Input/CustomInput'
import { RichtextchtEditor } from '../../../../components/Input/CustomRichtext'

interface LessonSectionProps {
  course: Course
  editingLesson: string | null
  newLessonTitle: string
  newLessonOverview: string
  showCreateQuestion: {
    lessonId: string
    questionSequence: number
  } | null
  selectedLessonId: string | null
  onCourseChange: (course: Course) => void
  onSetEditingLesson: (lessonId: string | null) => void
  onSetNewLessonTitle: (title: string) => void
  onSetNewLessonOverview: (overview: string) => void
  onShowCreateQuestion: (lessonId: string, questionSequence: number) => void
  onCloseCreateQuestion: () => void
}

// NewLessonForm với CustomInput và RichtextchtEditor
const NewLessonForm: FC<{
  title: string
  overview: string
  loading: boolean
  onTitleChange: (val: string) => void
  onOverviewChange: (val: string) => void
  onCancel: () => void
  onCreate: () => void
}> = ({ title, overview, loading, onTitleChange, onOverviewChange, onCancel, onCreate }) => (
  <div className="border rounded-lg p-4 mb-3 bg-transparent border-[#ddd] hover:border-[#52aaaf]">
    <div className="flex flex-col gap-3">
      <div>
        <label className="block font-medium mb-1 text-gray-700 text-sm">Tiêu đề</label>
        <CustomInput
          value={title}
          onChange={onTitleChange}
          className="w-full min-h-[40px] text-base border border-[#ddd] focus:border-[#52aaaf] hover:border-[#52aaaf] px-3 py-2 rounded-lg transition-colors"
        />
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-700 text-sm">Tổng quan</label>
        <RichtextchtEditor
          value={overview}
          onChange={onOverviewChange}
          placeholder="Tổng quan bài học"
          className="border-[#ddd] hover:border-[#52aaaf]"
          count={false}
        />
      </div>
      <div className="flex justify-end items-center gap-2 mt-2">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="text-[#52aaaf]"
        >
          Hủy
        </Button>
        <Button
          onClick={onCreate}
          disabled={loading || !title.trim() || !overview.trim() || overview === '<p></p>'}
          className="flex gap-2 border border-[#52aaaf] bg-transparent text-[#52aaaf] hover:bg-[#52aaaf] hover:text-white"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Tạo bài học
        </Button>
      </div>
    </div>
  </div>
)

export const LessonSection: FC<LessonSectionProps> = ({
  course,
  editingLesson,
  newLessonTitle,
  newLessonOverview,
  onCourseChange,
  onSetNewLessonTitle,
  onSetNewLessonOverview
}) => {
  const listRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [showNewLessonForm, setShowNewLessonForm] = useState(false)
  const [creatingLesson, setCreatingLesson] = useState(false)
  const [reverseOrder, setReverseOrder] = useState(false)
  const [filterSequence, setFilterSequence] = useState('')

  const [drawerQuestion] = useState<QuestionDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (editingLesson && bottomRef.current && !reverseOrder) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [editingLesson, reverseOrder])

  const getLessons = () => course.lessons ?? []

  const handleShowNewLessonForm = () => {
    setShowNewLessonForm(true)
    onSetNewLessonTitle('')
    onSetNewLessonOverview('')
  }

  const handleCreateLesson = async () => {
    if (!newLessonTitle.trim() || !newLessonOverview.trim() || newLessonOverview === '<p></p>')
      return
    try {
      setCreatingLesson(true)
      const newSequence = reverseOrder ? 1 : getLessons().length + 1
      await ApiService.post('/lesson', {
        course_id: course.id,
        sequence: newSequence,
        title: newLessonTitle.trim(),
        overview: newLessonOverview.trim()
      })
      const updatedCourse = await ApiService.get<Course>(`/course/${course.id}`)
      onCourseChange(updatedCourse)

      setShowNewLessonForm(false)
      onSetNewLessonTitle('')
      onSetNewLessonOverview('')
    } catch (err) {
      alert((err as Error).message || 'Lỗi tạo bài học')
    } finally {
      setCreatingLesson(false)
    }
  }

  const handleRemoveLesson = async (lessonId: string, setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true)
      await ApiService.delete(`/lesson/${lessonId}`)
      const updatedCourse = await ApiService.get<Course>(`/course/${course.id}`)
      onCourseChange(updatedCourse)
    } catch (err) {
      alert((err as Error).message || 'Lỗi xóa bài học')
    } finally {
      setLoading(false)
    }
  }

  const filteredLessons = getLessons().filter(
    (lesson) => !filterSequence || lesson.sequence.toString() === filterSequence
  )
  const sortedLessons = reverseOrder
    ? [...filteredLessons].sort((a, b) => b.sequence - a.sequence)
    : filteredLessons

  return (
    <div className="rounded-lg transition-colors h-full overflow-y-auto ">
      <div className="flex items-center justify-between mb-4" ref={listRef}>
        <h2 className="text-xl font-semibold text-[#2D3748]">Quản lý bài học</h2>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min="1"
            value={filterSequence}
            onChange={(e) => setFilterSequence(e.target.value)}
            placeholder="Nhập số thứ tự"
            className="bg-transparent w-32 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#52aaa5] focus:border-[#52aaa5] focus:ring-1 focus:ring-[#52aaa5]/20 text-[#2D3748] placeholder-[#718096] outline-none transition-colors"
          />
          <Button
            variant="ghost"
            onClick={() => setReverseOrder(!reverseOrder)}
            className="p-2 text-[#52aaa5] hover:bg-[#52aaa5]/10 rounded-lg transition-colors"
            type="button"
          >
            <ArrowUpDown className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleShowNewLessonForm}
            className="inline-flex items-center bg-transparent gap-2 px-3 py-1.5 border border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5] hover:text-white rounded-lg transition-all"
            type="button"
            disabled={showNewLessonForm}
          >
            <PlusCircle className="w-5 h-5" />
            Thêm bài học
          </Button>
        </div>
      </div>
      {/* Form tạo mới bài học */}
      {showNewLessonForm && (
        <NewLessonForm
          title={newLessonTitle}
          overview={newLessonOverview}
          loading={creatingLesson}
          onTitleChange={onSetNewLessonTitle}
          onOverviewChange={onSetNewLessonOverview}
          onCancel={() => setShowNewLessonForm(false)}
          onCreate={handleCreateLesson}
        />
      )}
      {/* Lessons List */}
      <div className="space-y-4">
        {sortedLessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            courseId={course.id}
            onRemoveLesson={handleRemoveLesson}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
