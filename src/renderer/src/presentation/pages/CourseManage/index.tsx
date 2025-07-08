// FluencyDev/src/presentation/pages/CourseManage/index.tsx
import { useState, useEffect } from 'react'
import CourseFilter from './components/CourseFilter'
import CreateCourseDrawer from './components/CreateCourseDrawer'
import ApiService from '../../../service/ApiService'
import { CourseSearchRequest, Course, CreateCourseRequest } from './type/Course'
import CourseGrid from './components/CourseGrid'
import { useNavigate } from 'react-router-dom'

const CourseManagePage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [totalCourses, setTotalCourses] = useState(0)
  const [loading, setLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [filters, setFilters] = useState<CourseSearchRequest>({
    page: 1,
    page_size: 10,
    is_random: true
  })
  const [newCourse, setNewCourse] = useState<CreateCourseRequest>({
    title: '',
    overview: '',
    skills: [],
    level: '',
    image: null,
    tags: [],
    type: 'BOOK'
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const handleCreateCourse = async () => {
    try {
      setCreateLoading(true)
      setCreateError(null)
      const formData = new FormData()
      formData.append('type', newCourse.type)
      formData.append('title', newCourse.title)
      formData.append('overview', newCourse.overview)
      formData.append('skills', JSON.stringify(newCourse.skills))
      formData.append('level', newCourse.level)
      if (newCourse.image) {
        formData.append('image', newCourse.image)
      }
      formData.append('tags', JSON.stringify(newCourse.tags))
      await ApiService.post('/course', formData, true, true)
      setNewCourse({
        title: '',
        overview: '',
        skills: [],
        level: '',
        image: null,
        tags: [],
        type: 'BOOK'
      })
      setIsDrawerOpen(false)
      fetchCourses()
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleCancel = () => {
    setNewCourse({
      title: '',
      overview: '',
      skills: [],
      level: '',
      image: null,
      tags: [],
      type: 'BOOK'
    })
    setCreateError(null)
    setIsDrawerOpen(false)
  }

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      return
    }
    try {
      setLoading(true)
      await ApiService.delete(`/course/${courseId}`, true)
      fetchCourses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course')
    } finally {
      setLoading(false)
    }
  }
  const handleFilterChange = (name: keyof CourseSearchRequest, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? value : 1
    }))
  }

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.get<{
        courses: Course[]
        total: number
        page: number
        page_size: number
      }>('/course/search', true, {
        ...filters,
        page: currentPage,
        page_size: pageSize
      })
      if (response && Array.isArray(response.courses)) {
        setCourses(response.courses)
        setTotalCourses(response.total)
      } else {
        setCourses([])
        setTotalCourses(0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters])

  // table columns
  // const columns = getCourseColumns(handleDelete, navigate, (currentPage - 1) * pageSize)

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#2D3748]">Quản lý khóa học</h1>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#52aaa5] text-white hover:bg-[#52aaa5]/90 transition-colors"
          >
            Tạo khóa học
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex gap-4 flex-1 px-8 pt-0 pb-4 min-h-0 overflow-hidden">
        {/* Left - Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <CourseGrid
              courses={courses}
              total={totalCourses}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              loading={loading}
              emptyMessage={
                <>
                  <div className="mb-2 text-xl font-semibold text-[#2D3748]">
                    Không tìm thấy khóa học
                  </div>
                  <p className="text-[#718096]">Thử điều chỉnh bộ lọc tìm kiếm</p>
                </>
              }
              onView={(id) => navigate(`/course/view/${id}`)}
              onEdit={(id) => navigate(`/course/${id}/edit`)}
              onDelete={handleDelete}
            />
          </div>
        </div>
        {/* Right - Filter */}
        <div className="w-80 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <CourseFilter filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
      {/* Create Course Drawer */}
      <CreateCourseDrawer
        isOpen={isDrawerOpen}
        onClose={handleCancel}
        newCourse={newCourse}
        onCourseChange={setNewCourse}
        onSubmit={handleCreateCourse}
        createLoading={createLoading}
        createError={createError}
      />
    </div>
  )
}
export default CourseManagePage
