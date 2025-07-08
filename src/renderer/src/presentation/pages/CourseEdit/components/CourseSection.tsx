import { FC, useRef, useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { RichtextchtEditor } from '../../../../components/Input/CustomRichtext'
import { CustomInput } from '../../../../components/Input/CustomInput'
import { Plus, X, Edit2, Save, Image as ImageIcon, Upload } from 'lucide-react'
import ApiService from '../../../../service/ApiService'
import { Course, CourseBook } from '../types/course'

interface Skill {
  value: string
  label: string
  color: string
}
interface Level {
  value: string
  label: string
  color: string
}
const SKILLS: Skill[] = [
  { value: 'listening', label: 'Nghe', color: '#FF6B6B' },
  { value: 'reading', label: 'Đọc', color: '#4ECDC4' },
  { value: 'writing', label: 'Viết', color: '#45B7D1' },
  { value: 'speaking', label: 'Nói', color: '#96CEB4' },
  { value: 'grammar', label: 'Ngữ pháp', color: '#6366F1' }
]
const LEVELS: Level[] = [
  { value: 'beginner', label: 'Cơ bản', color: '#FF6B6B' },
  { value: 'intermediate', label: 'Trung cấp', color: '#4ECDC4' },
  { value: 'advanced', label: 'Nâng cao', color: '#45B7D1' }
]

interface CourseSectionProps {
  course: Course
  editor: Editor | null
  editingTitle: boolean
  editingImage: boolean
  imageUrl: string
  newTag: string
  showTagInput: boolean
  onCourseChange: (course: Course) => void
  onSetEditingTitle: (editing: boolean) => void
  onSetEditingImage: (editing: boolean) => void
  onSetImageUrl: (url: string) => void
  onSetNewTag: (tag: string) => void
  onSetShowTagInput: (show: boolean) => void
  onUpdateCourseField: (field: string, value: any) => Promise<void>
}

export const CourseSection: FC<CourseSectionProps> = ({
  course,
  editingImage,
  imageUrl,
  newTag,
  showTagInput,
  onCourseChange,
  onSetEditingImage,
  onSetImageUrl,
  onSetNewTag,
  onSetShowTagInput,
  onUpdateCourseField
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Title
  const [localTitle, setLocalTitle] = useState(course.title)
  const [editingLocalTitle, setEditingLocalTitle] = useState(false)
  const [titleError, setTitleError] = useState('')
  const [titleChanged, setTitleChanged] = useState(false)
  const [savingTitle, setSavingTitle] = useState(false)

  // Overview
  const [localOverview, setLocalOverview] = useState(course.overview || '')
  const [overviewChanged, setOverviewChanged] = useState(false)
  const [savingOverview, setSavingOverview] = useState(false)

  // Book
  const [bookInfo, setBookInfo] = useState<CourseBook | null>(null)
  const [bookLoading, setBookLoading] = useState(false)
  const [newAuthors, setNewAuthors] = useState<string[]>([])
  const [newPublishers, setNewPublishers] = useState<string[]>([])
  const [authorInput, setAuthorInput] = useState('')
  const [publisherInput, setPublisherInput] = useState('')

  // Publication year
  const [editingYear, setEditingYear] = useState(false)
  const [localYear, setLocalYear] = useState<number | ''>('')
  const [yearChanged, setYearChanged] = useState(false)
  const [savingYear, setSavingYear] = useState(false)

  // Sync state với props
  useEffect(() => {
    setLocalTitle(course.title)
    setEditingLocalTitle(false)
    setTitleChanged(false)
  }, [course.title])
  useEffect(() => {
    setLocalOverview(course.overview ?? '')
    setOverviewChanged(false)
  }, [course.overview])
  useEffect(() => {
    if (course.type === 'BOOK' && course.course_book) {
      const data = course.course_book
      setBookInfo(data)
      setNewAuthors(data.authors || [])
      setNewPublishers(data.publishers || [])
      setLocalYear(data.publication_year ?? '')
      setEditingYear(false)
      setYearChanged(false)
      setAuthorInput('')
      setPublisherInput('')
      setBookLoading(false)
    } else {
      setBookInfo(null)
      setNewAuthors([])
      setNewPublishers([])
      setAuthorInput('')
      setPublisherInput('')
      setLocalYear('')
      setEditingYear(false)
      setYearChanged(false)
      setBookLoading(false)
    }
  }, [course.type, course.course_book])

  // Drag & drop image logic
  useEffect(() => {
    if (dropZoneRef.current && editingImage) {
      const dropZone = dropZoneRef.current as HTMLDivElement
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dropZone.classList.add('border-[#52aaa5]', 'bg-[#52aaa5]/10')
      }
      const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dropZone.classList.remove('border-[#52aaa5]', 'bg-[#52aaa5]/10')
      }
      const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dropZone.classList.remove('border-[#52aaa5]', 'bg-[#52aaa5]/10')
        if (e.dataTransfer?.files.length) {
          const file = e.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
              onSetImageUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
          }
        }
      }
      dropZone.addEventListener('dragover', handleDragOver)
      dropZone.addEventListener('dragleave', handleDragLeave)
      dropZone.addEventListener('drop', handleDrop)
      return () => {
        dropZone.removeEventListener('dragover', handleDragOver)
        dropZone.removeEventListener('dragleave', handleDragLeave)
        dropZone.removeEventListener('drop', handleDrop)
      }
    }
  }, [editingImage, onSetImageUrl])

  // Handlers

  const handleSaveTitle = async () => {
    if (!localTitle.trim()) {
      setTitleError('Tiêu đề không được để trống')
      return
    }
    setSavingTitle(true)
    try {
      await onUpdateCourseField('title', localTitle.trim())
      onCourseChange({ ...course, title: localTitle.trim() })
      setEditingLocalTitle(false)
      setTitleChanged(false)
    } catch {
      alert('Lỗi khi cập nhật tiêu đề!')
    }
    setSavingTitle(false)
  }

  const handleSaveOverview = async () => {
    setSavingOverview(true)
    try {
      await onUpdateCourseField('overview', localOverview)
      onCourseChange({ ...course, overview: localOverview })
      setOverviewChanged(false)
    } catch {
      alert('Lỗi khi cập nhật tổng quan!')
    }
    setSavingOverview(false)
  }

  const handleSkillToggle = async (skillValue: string) => {
    const newSkills = course.skills.includes(skillValue)
      ? course.skills.filter((s: string) => s !== skillValue)
      : [...course.skills, skillValue]
    onCourseChange({ ...course, skills: newSkills })
    try {
      await onUpdateCourseField('skills', newSkills)
    } catch {
      alert('Lỗi khi cập nhật kỹ năng!')
    }
  }
  const handleLevelChange = async (levelValue: string) => {
    onCourseChange({ ...course, level: levelValue })
    try {
      await onUpdateCourseField('level', levelValue)
    } catch {
      alert('Lỗi khi cập nhật cấp độ!')
    }
  }
  const handleTagRemove = async (tagToRemove: string) => {
    const tags = course.tags.filter((tag: string) => tag !== tagToRemove)
    onCourseChange({ ...course, tags })
    try {
      await onUpdateCourseField('tags', tags)
    } catch {
      alert('Lỗi khi cập nhật thẻ!')
    }
  }
  const handleAddTag = async () => {
    if (newTag.trim() && !course.tags.includes(newTag.trim())) {
      const tags = [...course.tags, newTag.trim()]
      onCourseChange({ ...course, tags })
      try {
        await onUpdateCourseField('tags', tags)
      } catch {
        alert('Lỗi khi cập nhật thẻ!')
      }
    }
    onSetNewTag('')
    onSetShowTagInput(false)
  }
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Escape') {
      onSetShowTagInput(false)
      onSetNewTag('')
    }
  }

  const handleTypeChange = async (typeVal: 'BOOK' | 'OTHER') => {
    if (course.type === typeVal) return
    onCourseChange({ ...course, type: typeVal })
    try {
      await onUpdateCourseField('type', typeVal)
    } catch {
      alert('Lỗi khi cập nhật loại khoá học!')
    }
  }

  // Lưu publication_year
  const handleSaveYear = async () => {
    if (!bookInfo || localYear === '') return
    setSavingYear(true)
    try {
      await ApiService.put(`/course-book/${bookInfo.id}`, {
        field: 'publication_year',
        value: localYear
      })
      setBookInfo({ ...bookInfo, publication_year: Number(localYear) })
      setEditingYear(false)
      setYearChanged(false)
    } catch {
      alert('Lỗi khi cập nhật năm xuất bản!')
    }
    setSavingYear(false)
  }

  // --- UI ---
  return (
    <div
      ref={containerRef}
      className="rounded-lg border-r border-gray-200 transition-colors pr-4 space-y-4 h-full overflow-y-auto"
    >
      {/* Image */}
      <div className="relative">
        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#f6f6f0]">
          {editingImage ? (
            <div
              ref={dropZoneRef}
              className="w-full h-full border-2 border-dashed border-[#52aaa5]/20 rounded-xl p-4 bg-[#52aaa5]/5 flex flex-col items-center justify-center relative transition-colors"
            >
              {imageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      onSetImageUrl('')
                      onSetEditingImage(false)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-[#52aaa5] hover:bg-[#52aaa5]/90 text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          onSetImageUrl(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="mb-4 p-4 rounded-full bg-[#52aaa5]/10">
                      <Upload className="h-8 w-8 text-[#52aaa5]" />
                    </div>
                    <span className="text-[#52aaa5] font-medium">Chọn hình ảnh</span>
                    <span className="text-sm text-[#718096] mt-1">hoặc kéo thả vào đây</span>
                  </label>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full">
              {course.image_url && (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => onSetEditingImage(true)}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-[#52aaa5] rounded-lg transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Title */}
      <div className="relative">
        {editingLocalTitle ? (
          <div>
            <CustomInput
              value={localTitle}
              onChange={(v) => {
                setLocalTitle(v)
                setTitleError('')
                setTitleChanged(v.trim() !== course.title.trim())
              }}
              className="w-full"
            />
            {titleError && <div className="text-sm text-red-500">{titleError}</div>}
            {titleChanged && (
              <div className="flex gap-2 mt-2">
                <button
                  disabled={savingTitle}
                  onClick={handleSaveTitle}
                  className="flex items-center gap-1 bg-[#52aaa5] text-white px-3 py-1.5 hover:bg-[#489c92] transition-all text-sm rounded-md"
                >
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className="group relative"
            tabIndex={-1}
            onMouseLeave={() => setTimeout(() => setEditingLocalTitle(false), 200)}
          >
            <h1 className="text-xl font-semibold text-[#2D3748] pr-8">{course.title}</h1>
            <button
              onClick={() => setEditingLocalTitle(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-[#52aaa5] opacity-0 group-hover:opacity-100 hover:bg-[#52aaa5]/10 rounded-md transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {/* Type (BOOK|OTHER) */}
      <div>
        <h3 className="text-base font-medium text-[#2D3748] mb-2">Loại khoá học</h3>
        <div className="flex gap-3">
          {['OTHER', 'BOOK'].map((value) => (
            <button
              key={value}
              onClick={() => handleTypeChange(value as 'BOOK' | 'OTHER')}
              className={`
                px-3 py-1.5 text-sm rounded-md border
                ${
                  course.type === value
                    ? 'bg-[#52aaa5] text-white border-[#52aaa5]'
                    : 'bg-white text-[#52aaa5] border-[#52aaa5]/20'
                }
                transition-all
              `}
            >
              {value === 'OTHER' ? 'Khác' : 'Sách'}
            </button>
          ))}
        </div>
      </div>
      {/* Skills & Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-base font-medium text-[#2D3748] mb-2">Kỹ năng</h3>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS.map((skill) => (
              <button
                key={skill.value}
                onClick={() => handleSkillToggle(skill.value)}
                className={`px-2.5 py-1 text-sm rounded-lg transition-all hover:scale-105 hover:shadow-md`}
                style={{
                  backgroundColor: course.skills.includes(skill.value)
                    ? skill.color
                    : `${skill.color}20`,
                  color: course.skills.includes(skill.value) ? 'white' : skill.color
                }}
              >
                {skill.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-medium text-[#2D3748] mb-2">Cấp độ</h3>
          <div className="flex gap-1.5">
            {LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => handleLevelChange(level.value)}
                className={`flex-1 px-2.5 py-1 text-sm rounded-lg transition-all hover:scale-105 hover:shadow-md`}
                style={{
                  backgroundColor: course.level === level.value ? level.color : `${level.color}20`,
                  color: course.level === level.value ? 'white' : level.color
                }}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Tags */}
      <div>
        <h3 className="text-base font-medium text-[#2D3748] mb-2">Thẻ</h3>
        <div className="flex flex-wrap gap-1.5">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 text-sm rounded-md bg-[#52aaa5]/10 text-[#52aaa5]"
            >
              {tag}
              <button onClick={() => handleTagRemove(tag)} className="hover:text-red-500">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          {showTagInput ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newTag}
                onChange={(e) => onSetNewTag(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Nhập tên thẻ"
                className="px-2 py-0.5 text-sm rounded-md border border-[#52aaa5]/20 focus:border-[#52aaa5] focus:ring-1 focus:ring-[#52aaa5]/20 text-[#2D3748] placeholder-[#718096] outline-none"
                autoFocus
              />
              <button
                onClick={handleAddTag}
                className="p-1 text-[#52aaa5] hover:bg-[#52aaa5]/10 rounded-md transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  onSetShowTagInput(false)
                  onSetNewTag('')
                }}
                className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSetShowTagInput(true)}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 text-sm rounded-md border border-dashed border-[#52aaa5]/20 text-[#52aaa5] hover:border-[#52aaa5]/40"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm thẻ
            </button>
          )}
        </div>
      </div>
      {/* Overview */}
      <div>
        <h3 className="text-base font-medium text-[#2D3748] mb-2">Tổng quan</h3>
        <RichtextchtEditor
          value={localOverview}
          onChange={(value: string) => {
            setLocalOverview(value)
            setOverviewChanged(
              value.trim().replace(/(<([^>]+)>)/gi, '').length !==
                (course.overview?.trim().replace(/(<([^>]+)>)/gi, '')?.length ?? 0) ||
                course.overview !== value
            )
          }}
          className=" border-gray-200 hover:border-[#52aaa5] rounded-lg transition-colors"
        />
        {overviewChanged && (
          <div className="flex gap-2 mt-2">
            <button
              disabled={savingOverview}
              onClick={handleSaveOverview}
              className="flex items-center gap-1 bg-[#52aaa5] text-white px-3 py-1.5 hover:bg-[#489c92] transition-all text-sm rounded-md"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>
      {/* Book info */}
      {course.type === 'BOOK' && (
        <div className="mt-4 rounded-lg">
          {bookLoading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="space-y-2">
              {/* Authors */}
              <div>
                <label className="block mb-1 text-black">Tác giả</label>
                <div className="flex flex-wrap gap-1.5">
                  {newAuthors.map((author, idx) => (
                    <span
                      key={author + idx}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 text-sm rounded-md bg-[#6366F1]/10 text-[#6366F1]"
                    >
                      {author}
                      <button
                        onClick={() => {
                          const updated = newAuthors.filter((_, i) => i !== idx)
                          setNewAuthors(updated)
                          if (bookInfo)
                            ApiService.put(`/course-book/${bookInfo.id}`, {
                              field: 'authors',
                              value: updated
                            })
                        }}
                        className="hover:text-red-500"
                        tabIndex={-1}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="px-2 py-0.5 text-sm rounded-md border border-[#6366F1]/20 focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 text-[#2D3748] placeholder-[#ccc] outline-none"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ',') && authorInput.trim()) {
                        e.preventDefault()
                        if (!newAuthors.includes(authorInput.trim())) {
                          const updated = [...newAuthors, authorInput.trim()]
                          setNewAuthors(updated)
                          setAuthorInput('')
                          if (bookInfo)
                            ApiService.put(`/course-book/${bookInfo.id}`, {
                              field: 'authors',
                              value: updated
                            })
                        } else {
                          setAuthorInput('')
                        }
                      } else if (e.key === 'Backspace' && !authorInput && newAuthors.length) {
                        const updated = newAuthors.slice(0, -1)
                        setNewAuthors(updated)
                        if (bookInfo)
                          ApiService.put(`/course-book/${bookInfo.id}`, {
                            field: 'authors',
                            value: updated
                          })
                      }
                    }}
                    placeholder="Ấn Enter để thêm"
                    style={{ width: 120 }}
                  />
                </div>
              </div>
              {/* Publishers */}
              <div>
                <label className="block mb-1 text-black">Nhà xuất bản</label>
                <div className="flex flex-wrap gap-1.5">
                  {newPublishers.map((pub, idx) => (
                    <span
                      key={pub + idx}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 text-sm rounded-md bg-[#52aaa5]/10 text-[#52aaa5]"
                    >
                      {pub}
                      <button
                        onClick={() => {
                          const updated = newPublishers.filter((_, i) => i !== idx)
                          setNewPublishers(updated)
                          if (bookInfo)
                            ApiService.put(`/course-book/${bookInfo.id}`, {
                              field: 'publishers',
                              value: updated
                            })
                        }}
                        className="hover:text-red-500"
                        tabIndex={-1}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="px-2 py-0.5 text-sm rounded-md border border-[#52aaa5]/20 focus:border-[#52aaa5] focus:ring-1 focus:ring-[#52aaa5]/20 text-[#2D3748] placeholder-[#ccc] outline-none"
                    value={publisherInput}
                    onChange={(e) => setPublisherInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ',') && publisherInput.trim()) {
                        e.preventDefault()
                        if (!newPublishers.includes(publisherInput.trim())) {
                          const updated = [...newPublishers, publisherInput.trim()]
                          setNewPublishers(updated)
                          setPublisherInput('')
                          if (bookInfo)
                            ApiService.put(`/course-book/${bookInfo.id}`, {
                              field: 'publishers',
                              value: updated
                            })
                        } else {
                          setPublisherInput('')
                        }
                      } else if (e.key === 'Backspace' && !publisherInput && newPublishers.length) {
                        const updated = newPublishers.slice(0, -1)
                        setNewPublishers(updated)
                        if (bookInfo)
                          ApiService.put(`/course-book/${bookInfo.id}`, {
                            field: 'publishers',
                            value: updated
                          })
                      }
                    }}
                    placeholder="Ấn Enter để thêm"
                    style={{ width: 120 }}
                  />
                </div>
              </div>
              {/* Publication Year */}
              <div className="relative group">
                <label className="block mb-1 text-black">Năm xuất bản</label>
                {editingYear ? (
                  <>
                    <CustomInput
                      value={localYear === '' ? '' : String(localYear)}
                      onChange={(v) => {
                        const val = v.replace(/\D/g, '')
                        setLocalYear(val ? parseInt(val, 10) : '')
                        setYearChanged(
                          (val ? parseInt(val, 10) : '') !== (bookInfo?.publication_year ?? '')
                        )
                      }}
                      className="w-full"
                    />
                    {yearChanged && (
                      <button
                        disabled={savingYear}
                        onClick={handleSaveYear}
                        className="mt-2 flex items-center gap-1 bg-[#52aaa5] text-white px-3 py-1.5 hover:bg-[#489c92] transition-all text-sm rounded-md"
                      >
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </button>
                    )}
                  </>
                ) : (
                  <div className="relative group">
                    <span className="text-base text-[#2D3748]">
                      {bookInfo?.publication_year || ''}
                    </span>
                    <button
                      onClick={() => setEditingYear(true)}
                      className="absolute top-0 right-0 p-1.5 text-[#52aaa5] opacity-0 group-hover:opacity-100 hover:bg-[#52aaa5]/10 rounded-md transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
