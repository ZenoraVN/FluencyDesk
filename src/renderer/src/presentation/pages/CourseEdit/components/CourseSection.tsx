import { FC, useRef, useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { RichtextchtEditor } from '../../../../components/Input/CustomRichtext'
import { CustomInput } from '../../../../components/Input/CustomInput'
import { X, Edit2, Save, Upload } from 'lucide-react'
import ApiService from '../../../../service/ApiService'
import { Eye, Upload as UploadIcon } from 'lucide-react'

import { ImageViewDialog } from '../../../../components/Dialog/ImageViewDialog'
import CustomCombobox from '../../../../components/Combobox/CustomCombobox'
import { ButtonGroup } from '../../../../components/Button/ButtonGroup'
import { Course, CourseBook } from '../types/course'

const SKILLS: { value: string; label: string }[] = [
  { value: 'listening', label: 'Listening' },
  { value: 'reading', label: 'Reading' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'grammar', label: 'Grammar' }
]

const LEVELS: { value: string; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

const COURSE_TYPES = [
  { value: 'BOOK' as const, label: 'Book' },
  { value: 'OTHER' as const, label: 'Other' }
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

interface CourseSectionProps {
  course: Course
  editor: Editor | null
  editingTitle: boolean
  editingImage: boolean
  imageUrl: string
  onCourseChange: (course: Course) => void
  onSetEditingTitle: (editing: boolean) => void
  onSetEditingImage: (editing: boolean) => void
  onSetImageUrl: (url: string) => void
  onUpdateCourseField: (field: string, value: any) => Promise<void>
}

export const CourseSection: FC<CourseSectionProps> = ({
  course,
  editingImage,
  imageUrl,
  onCourseChange,
  onSetEditingImage,
  onSetImageUrl,
  onUpdateCourseField
}) => {
  // Custom: hover & image view dialog (correctly placed inside function body)
  const [isImageHover, setIsImageHover] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
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

  // Image upload logic
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onloadend = () => {
      onSetImageUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // 🌟 Upload to backend
    try {
      const formData = new FormData()
      formData.append('field', 'image_url')
      formData.append('image', file)
      const resp = await ApiService.put<{ image_url: string }>(
        `/course/${course.id}`,
        formData,
        true,
        true
      )
      if (resp.image_url) {
        onSetImageUrl(resp.image_url)
        onCourseChange({ ...course, image_url: resp.image_url })
      }
    } catch (e) {
      alert('Error updating image!')
    }
  }

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
          handleImageUpload(file)
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
      setTitleError('Title must not be empty')
      return
    }
    setSavingTitle(true)
    try {
      await onUpdateCourseField('title', localTitle.trim())
      onCourseChange({ ...course, title: localTitle.trim() })
      setEditingLocalTitle(false)
      setTitleChanged(false)
    } catch {
      alert('Error updating title!')
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
      alert('Error updating overview!')
    }
    setSavingOverview(false)
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
      alert('Error updating publication year!')
    }
    setSavingYear(false)
  }

  // --- UI ---
  return (
    <div
      ref={containerRef}
      className="rounded-lg border-r border-gray-200 transition-colors pr-4 space-y-4 h-full overflow-y-auto"
    >
      {/* Universal hidden file input for all modes (fixes UploadIcon not opening file picker) */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleImageUpload(file)
          }
        }}
        className="hidden"
        id="image-upload"
      />
      {/* Image */}
      <div className="relative">
        <div className="inline-flex items-center justify-center w-full rounded-lg overflow-hidden bg-[#f6f6f0]">
          {editingImage ? (
            <div
              ref={dropZoneRef}
              className="w-full h-full border-2 border-dashed border-[#52aaa5]/20 rounded-xl p-4 bg-[#52aaa5]/5 flex flex-col items-center justify-center relative transition-colors"
            >
              {imageUrl ? (
                <div
                  className="relative w-full h-full group"
                  onMouseEnter={() => setIsImageHover(true)}
                  onMouseLeave={() => setIsImageHover(false)}
                >
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain bg-white rounded-lg"
                    style={{ borderRadius: 8 }}
                  />
                  {/* Hover Overlay + Action Buttons */}
                  <div
                    className={`absolute inset-0 rounded-lg flex items-center justify-center transition-opacity duration-200
                      ${isImageHover ? 'opacity-100' : 'opacity-0'}
                      bg-black/40 z-20`}
                    style={{
                      borderRadius: 8
                    }}
                  >
                    {/* View Button - Blue theme */}
                    <button
                      type="button"
                      aria-label="Xem ảnh"
                      className="mx-2 p-1.5 rounded-[8px] bg-[#E0ECFF] hover:bg-[#C5E1FF] transition duration-200 shadow-lg border border-[#93B6E5]"
                      style={{ borderRadius: 8 }}
                      onClick={() => setShowImageDialog(true)}
                    >
                      <Eye className="w-5 h-5 text-[#292D32]" />
                    </button>
                    {/* Replace Button - Teal theme */}
                    <button
                      type="button"
                      aria-label="Thay ảnh"
                      className="mx-2 p-1.5 rounded-[8px] bg-[#D4FAF6] hover:bg-[#B6F0E6] transition duration-200 shadow-lg border border-[#7EDFCB]"
                      style={{ borderRadius: 8 }}
                      onClick={() => {
                        // trigger file input by id
                        const fileInput = document.getElementById('image-upload')
                        if (fileInput) (fileInput as HTMLInputElement).click()
                      }}
                    >
                      <UploadIcon className="w-5 h-5 text-black" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      onSetImageUrl('')
                      onSetEditingImage(false)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-[#52aaa5] hover:bg-[#52aaa5]/90 text-white transition-colors z-30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="mb-4 p-4 rounded-full bg-[#52aaa5]/10">
                      <Upload className="h-8 w-8 text-[#52aaa5]" />
                    </div>
                    <span className="text-[#52aaa5] font-medium">Choose an image</span>
                    <span className="text-sm text-[#718096] mt-1">or drag and drop here</span>
                  </label>
                </>
              )}
            </div>
          ) : (
            <div
              className="relative w-full h-full group"
              onMouseEnter={() => setIsImageHover(true)}
              onMouseLeave={() => setIsImageHover(false)}
            >
              {course.image_url && (
                <>
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-contain bg-white rounded-lg"
                    style={{ borderRadius: 8 }}
                  />
                  {/* Hover Overlay + Action Button */}
                  <div
                    className={`absolute inset-0 rounded-lg flex items-center justify-center transition-opacity duration-200
                      ${isImageHover ? 'opacity-100' : 'opacity-0'}
                      bg-black/40 z-20`}
                    style={{
                      borderRadius: 8
                    }}
                  >
                    {/* View Button - Blue theme */}
                    <button
                      type="button"
                      aria-label="Xem ảnh"
                      className="mx-2 p-1.5 rounded-[8px] bg-[#E0ECFF] hover:bg-[#C5E1FF] transition duration-200 shadow-lg border border-[#93B6E5]"
                      style={{ borderRadius: 8 }}
                      onClick={() => setShowImageDialog(true)}
                    >
                      <Eye className="w-5 h-5 text-[#292D32]" />
                    </button>
                    {/* Replace Button - Teal theme */}
                    <button
                      type="button"
                      aria-label="Thay ảnh"
                      className="mx-2 p-1.5 rounded-[8px] bg-[#D4FAF6] hover:bg-[#B6F0E6] transition duration-200 shadow-lg border border-[#7EDFCB]"
                      style={{ borderRadius: 8 }}
                      onClick={() => {
                        // trigger file input by id
                        const fileInput = document.getElementById('image-upload')
                        if (fileInput) (fileInput as HTMLInputElement).click()
                      }}
                    >
                      <UploadIcon className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </>
              )}
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
              onChange={(v: any) => {
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
                  Save changes
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
        <label className="block text-base font-medium text-[#2D3748] mb-2">Course Type</label>
        <ButtonGroup
          options={COURSE_TYPES}
          selected={course.type}
          onClick={async (value) => {
            if (course.type === value) return
            onCourseChange({ ...course, type: value })
            try {
              await onUpdateCourseField('type', value)
            } catch {
              alert('Error updating course type!')
            }
          }}
          colorNames={['indigo', 'blueGray']}
        />
      </div>
      {/* Skills & Level */}
      <div className="space-y-4">
        <div>
          <label className="text-base font-medium text-[#2D3748] mb-2 block">Skills</label>
          <ButtonGroup
            options={SKILLS}
            selected={course.skills}
            onClick={async (val) => {
              const newSkills = course.skills.includes(val)
                ? course.skills.filter((s: string) => s !== val)
                : [...course.skills, val]
              onCourseChange({ ...course, skills: newSkills })
              try {
                await onUpdateCourseField('skills', newSkills)
              } catch {
                alert('Error updating skills!')
              }
            }}
            multiple
            colorNames={['red', 'teal', 'blueSky', 'greenPastel', 'indigo']}
          />
        </div>
        <div>
          <label className="text-base font-medium text-[#2D3748] mb-2 block">Level</label>
          <ButtonGroup
            options={LEVELS}
            selected={course.level}
            onClick={async (val) => {
              onCourseChange({ ...course, level: val })
              try {
                await onUpdateCourseField('level', val)
              } catch {
                alert('Error updating level!')
              }
            }}
            colorNames={['yellow', 'teal', 'blueSky']}
          />
        </div>
      </div>
      {/* Tags */}
      <div>
        <label className="block text-base font-medium text-[#2D3748] mb-2">Tags</label>
        <CustomCombobox
          label=""
          value={course.tags}
          options={SUGGESTED_TAGS.map((tag) => ({
            value: tag,
            label: tag
          }))}
          onChange={async (tags) => {
            if (Array.isArray(tags)) {
              onCourseChange({ ...course, tags })
              try {
                await onUpdateCourseField('tags', tags)
              } catch {
                alert('Error updating tags!')
              }
            }
          }}
          placeholder="Search or add new tag"
          searchable
          multiple
          creatable
          className="w-full"
        />
      </div>
      {/* Overview */}
      <div>
        <h3 className="text-base font-medium text-[#2D3748] mb-2">Overview</h3>
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
              Save changes
            </button>
          </div>
        )}
      </div>
      {/* Book info */}
      {course.type === 'BOOK' && (
        <div className="mt-4 rounded-lg">
          {bookLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2">
              {/* Authors */}
              <div>
                <label className="block mb-1 text-black">Authors</label>
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
                    placeholder="Press Enter to add"
                    style={{ width: 120 }}
                  />
                </div>
              </div>
              {/* Publishers */}
              <div>
                <label className="block mb-1 text-black">Publishers</label>
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
                    placeholder="Press Enter to add"
                    style={{ width: 120 }}
                  />
                </div>
              </div>
              {/* Publication Year */}
              <div className="relative group">
                <label className="block mb-1 text-black">Publication Year</label>
                {editingYear ? (
                  <>
                    <CustomInput
                      value={localYear === '' ? '' : String(localYear)}
                      onChange={(v: any) => {
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
                        Save changes
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
      {/* Image Viewer Dialog, always mounted for preview */}
      <ImageViewDialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        images={[
          {
            src: editingImage && imageUrl ? imageUrl : course.image_url || '',
            name: editingImage && imageUrl ? 'Ảnh xem trước' : course.title || ''
          }
        ]}
        currentIndex={0}
      />
      {/* Image Viewer Dialog, always mounted for preview */}
      <ImageViewDialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        images={[
          {
            src: editingImage && imageUrl ? imageUrl : course.image_url || '',
            name: editingImage && imageUrl ? 'Ảnh xem trước' : course.title || ''
          }
        ]}
        currentIndex={0}
      />
    </div>
  )
}
