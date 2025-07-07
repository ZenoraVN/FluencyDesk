import { FC, useState, ReactNode, useEffect } from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { Loader2, CheckCircle2 } from 'lucide-react'
import ApiService from '../../../../service/ApiService'
import { CustomSingleImageDropzone } from '../../../../components/Image/CustomSinglemageDropzone'
import { CustomInput } from '../../../../components/Input/CustomInput'
import { RichtextchtEditor } from '../../../../components/Input/CustomRichtext'
import CustomCombobox from '../../../../components/Combobox/CustomCombobox'
import { ButtonGroup } from '../../../../components/Button/ButtonGroup'

type CourseType = 'BOOK' | 'OTHER'
interface CreateCourseRequest {
  title: string
  overview: string
  skills: string[]
  level: string
  image: File | null
  tags: string[]
  type: CourseType
}
interface CreateCourseDrawerProps {
  isOpen: boolean
  onClose: () => void
  newCourse: CreateCourseRequest
  onCourseChange: (course: CreateCourseRequest) => void
  onSubmit: () => void
  createLoading: boolean
  createError: string | null
}
interface ValidationErrors {
  title?: string[]
  overview?: string[]
  skills?: string[]
  level?: string[]
  image?: string[]
  tags?: string[]
  api?: string[]
  type?: string[]
}

const SKILLS = [
  { value: 'listening', label: 'Nghe' },
  { value: 'reading', label: 'Đọc' },
  { value: 'writing', label: 'Viết' },
  { value: 'speaking', label: 'Nói' },
  { value: 'grammar', label: 'Ngữ pháp' }
]

const LEVELS = [
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' }
]

const COURSE_TYPES = [
  { value: 'BOOK' as const, label: 'Sách' },
  { value: 'OTHER' as const, label: 'Khác' }
]
const SUGGESTED_TAGS: string[] = [
  'IELTS',
  'TOEIC',
  'Business',
  'Academic',
  'General',
  'Kids',
  'Teens',
  'Adults',
  'Conversation',
  'Exam',
  'Grammar',
  'Vocabulary',
  'Pronunciation',
  'Writing',
  'Speaking',
  'Listening',
  'Reading'
]
const CreateCourseDrawer: FC<CreateCourseDrawerProps> = ({
  isOpen,
  onClose,
  newCourse,
  onCourseChange,
  createLoading
}): ReactNode => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  // ESC - Close Drawer
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Validate FORM
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    if (!newCourse.title.trim()) errors.title = ['Tiêu đề là bắt buộc']
    else if (newCourse.title.trim().length < 15) errors.title = ['Tiêu đề phải có ít nhất 15 ký tự']
    else if (newCourse.title.trim().length > 150)
      errors.title = ['Tiêu đề không được vượt quá 150 ký tự']
    if (!newCourse.overview.trim()) errors.overview = ['Tổng quan là bắt buộc']
    else if (newCourse.overview.trim().length < 25)
      errors.overview = ['Tổng quan phải có ít nhất 25 ký tự']
    else if (newCourse.overview.trim().length > 1000)
      errors.overview = ['Tổng quan không được vượt quá 1000 ký tự']
    if (newCourse.skills.length === 0) errors.skills = ['Vui lòng chọn ít nhất một kỹ năng']
    else if (newCourse.skills.length > 5) errors.skills = ['Không được chọn quá 5 kỹ năng']
    if (!newCourse.level) errors.level = ['Vui lòng chọn cấp độ']
    if (!newCourse.image) errors.image = ['Vui lòng chọn hình ảnh']
    if (newCourse.tags.length === 0) errors.tags = ['Vui lòng thêm ít nhất một thẻ']
    if (!newCourse.type) errors.type = ['Vui lòng chọn loại khóa học']
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // SUBMIT
  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      const formData = new FormData()
      formData.append('type', newCourse.type)
      formData.append('title', newCourse.title.trim())
      formData.append('overview', newCourse.overview.trim())
      formData.append('skills', JSON.stringify(newCourse.skills))
      formData.append('level', newCourse.level)
      if (newCourse.image) {
        formData.append('image', newCourse.image)
      }
      formData.append('tags', JSON.stringify(newCourse.tags))
      await ApiService.post('/course', formData, true, true)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      setValidationErrors((prev) => ({
        ...prev,
        api: [(error as Error).message]
      }))
    }
  }

  const isFormValid =
    !createLoading &&
    newCourse.title.trim().length >= 15 &&
    newCourse.title.trim().length <= 150 &&
    newCourse.overview.trim().length >= 25 &&
    newCourse.overview.trim().length <= 1000 &&
    newCourse.skills.length > 0 &&
    newCourse.skills.length <= 5 &&
    newCourse.level &&
    newCourse.image &&
    newCourse.tags.length > 0 &&
    newCourse.type

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      size="40%"
      className="!bg-[#f6f6f0] relative"
    >
      {/* Loading Overlay */}
      {createLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-[#52aaa5] animate-spin" />
            <p className="text-[#52aaa5] font-medium">Đang tạo khóa học...</p>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <p className="text-green-500 font-medium">Tạo khóa học thành công!</p>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-[#f6f6f0] px-6 py-4 border-b border-[#52aaa5]/10 flex items-center justify-between w-full min-h-[64px]">
          {/* Title left */}
          <h2 className="text-2xl font-semibold text-[#2D3748] flex-1 text-left">
            Tạo khóa học mới
          </h2>
          {/* Buttons right */}
          <div className="flex gap-3 items-center">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || createLoading}
              className={`px-5 py-2 rounded-xl bg-[#52aaa5] text-white font-medium flex items-center gap-2 transition-colors
                ${
                  !isFormValid || createLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#52aaa5]/90'
                }
              `}
              type="button"
            >
              {createLoading && <Loader2 className="h-5 w-5 text-white animate-spin" />}
              {createLoading ? 'Đang tạo...' : 'Tạo khoá học'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-[#52aaa5] text-[#52aaa5] hover:bg-[#52aaa5]/10 transition-colors text-base font-medium"
              disabled={createLoading}
              type="button"
            >
              Hủy
            </button>
          </div>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-[#2D3748] font-medium mb-2">Hình ảnh khóa học</label>
            <CustomSingleImageDropzone
              imageFile={newCourse.image ?? undefined}
              onChange={(file) => onCourseChange({ ...newCourse, image: file ?? null })}
            />
            {validationErrors.image?.map((error, i) => (
              <p key={i} className="mt-1 text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          {/* TITLE */}
          <div>
            <label className="block text-[#2D3748] font-medium mb-2">
              Tiêu đề
              <span className="text-sm text-[#718096] ml-1">({newCourse.title.length}/150)</span>
            </label>
            <CustomInput
              value={newCourse.title}
              onChange={(val) => onCourseChange({ ...newCourse, title: val })}
              className="w-full p-3 border-[#52aaa5]/20 focus:border-[#52aaa5] hover:border-[#52aaaf]"
            />
            {validationErrors.title?.map((error, i) => (
              <p key={i} className="mt-1 text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          {/* OVERVIEW */}
          <div>
            <label className="block text-[#2D3748] font-medium mb-2">
              Tổng quan
              <span className="text-sm text-[#718096] ml-1">
                ({newCourse.overview.length}/1000)
              </span>
            </label>
            <RichtextchtEditor
              value={newCourse.overview}
              onChange={(val) => onCourseChange({ ...newCourse, overview: val })}
              placeholder="Nhập tổng quan về khóa học..."
              className="hover:border-[#52aaaf]"
            />
            {validationErrors.overview?.map((error, i) => (
              <p key={i} className="mt-1 text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          {/* COURSE TYPE */}
          <div>
            <label className="block text-[#2D3748] font-medium mb-2">Loại khóa học</label>
            <ButtonGroup
              options={COURSE_TYPES}
              selected={newCourse.type}
              onClick={(val) => onCourseChange({ ...newCourse, type: val })}
              colorNames={['indigo', 'blueGray']}
            />
            {validationErrors.type?.map((error, i) => (
              <p key={i} className="mt-1 text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          {/* SKILLS */}
          <div>
            <label className="block text-[#2D3748] font-medium mb-2">
              Kỹ năng
              <span className="text-sm text-[#718096] ml-1">({newCourse.skills.length}/5)</span>
            </label>
            <ButtonGroup
              options={SKILLS}
              selected={newCourse.skills}
              onClick={(val) => {
                const newSkills = newCourse.skills.includes(val)
                  ? newCourse.skills.filter((s) => s !== val)
                  : [...newCourse.skills, val]
                onCourseChange({ ...newCourse, skills: newSkills })
              }}
              multiple
              colorNames={['red', 'teal', 'blueSky', 'greenPastel', 'indigo']}
            />

            {validationErrors.skills?.map((error, i) => (
              <p key={i} className="mt-1 text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          {/* LEVEL */}
          <div>
            <label className="block text-[#2D3748] font-medium mb-2">Cấp độ</label>
            <ButtonGroup
              options={LEVELS}
              selected={newCourse.level}
              onClick={(val) => onCourseChange({ ...newCourse, level: val })}
              colorNames={['yellow', 'teal', 'blueSky']}
            />

            {validationErrors.level?.map((error, i) => (
              <p key={i} className="mt-1 text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          {/* TAGS */}
          <div>
            <label className="block text-[#2D3748] font-medium mb-2">Thẻ</label>
            <CustomCombobox
              label=""
              value={newCourse.tags}
              options={SUGGESTED_TAGS.map((tag) => ({
                value: tag,
                label: tag
              }))}
              onChange={(tags) => {
                // đảm bảo tags luôn là string[]
                if (Array.isArray(tags)) {
                  onCourseChange({
                    ...newCourse,
                    tags
                  })
                } else if (typeof tags === 'string' && !newCourse.tags.includes(tags)) {
                  onCourseChange({
                    ...newCourse,
                    tags: [...newCourse.tags, tags]
                  })
                }
              }}
              placeholder="Tìm kiếm hoặc thêm thẻ mới"
              searchable
              multiple
              creatable // nếu bạn muốn cho phép tạo thêm tag mới
              className="mb-2"
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {newCourse.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#52aaa5]/10 text-[#52aaa5]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      onCourseChange({
                        ...newCourse,
                        tags: newCourse.tags.filter((t) => t !== tag)
                      })
                    }
                    className="hover:text-red-500 ml-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            {validationErrors.tags?.map((error, i) => (
              <p key={i} className="mt-1 text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          {/* API Error Message */}
          {validationErrors.api?.map((error, i) => (
            <div key={i} className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-500">
              {error}
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  )
}

export default CreateCourseDrawer
