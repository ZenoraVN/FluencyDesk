import { useState, useEffect } from 'react'
import { ArrowLeft, CloudOff, GraduationCap, Search, BarChart2 } from 'lucide-react'
import { Card } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'

// Mock data - replace with actual data later
const myCourses = [
  {
    id: '1',
    title: 'IELTS Speaking Practice',
    overview:
      'Khóa học luyện tập kỹ năng nói IELTS với các chủ đề phổ biến, giúp học viên tự tin trong phần thi Speaking',
    skills: ['Speaking', 'Pronunciation', 'Fluency'],
    band: 7.0,
    thumbnail: 'https://example.com/course1.jpg'
  },
  {
    id: '2',
    title: 'Business English Writing',
    overview:
      'Khóa học viết tiếng Anh thương mại chuyên nghiệp, tập trung vào các kỹ năng viết email, báo cáo và đề xuất',
    skills: ['Writing', 'Business', 'Communication'],
    band: 6.5,
    thumbnail: 'https://example.com/course2.jpg'
  }
]

// Mock analytics data
const analyticsData = {
  totalCourses: 12,
  totalStudents: 450,
  averageRating: 4.8,
  totalViews: 2800
}

const MyCoursePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<string | null>(null)
  const [isOfflineMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const checkNetworkAndLoadData = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    checkNetworkAndLoadData()
  }, [])

  const handleCourseClick = (courseId: string) => {
    // Handle course click
    console.log('Navigate to course:', courseId)
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-full bg-[#52aaa5]/10 p-6">
        <GraduationCap className="h-16 w-16 text-[#52aaa5]" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-[#2D3748]">Bạn chưa tạo khóa học nào</h3>
      <p className="max-w-md text-sm text-[#718096]">
        Hãy bắt đầu tạo khóa học đầu tiên của bạn để chia sẻ kiến thức với cộng đồng
      </p>
    </div>
  )

  const renderOfflineBanner = () => (
    <div className="mb-4 rounded-2xl bg-[#52aaa5]/10 p-4">
      <div className="flex items-center gap-2">
        <CloudOff className="h-5 w-5 text-[#52aaa5]" />
        <span className="text-sm font-medium text-[#52aaa5]">Đang sử dụng dữ liệu ngoại tuyến</span>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <GraduationCap className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div>
            <p className="text-sm text-[#718096]">Tổng khóa học</p>
            <p className="text-xl font-semibold text-[#2D3748]">{analyticsData.totalCourses}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <BarChart2 className="h-5 w-5 text-[#52aaa5]" />
          </div>
          <div>
            <p className="text-sm text-[#718096]">Tổng học viên</p>
            <p className="text-xl font-semibold text-[#2D3748]">{analyticsData.totalStudents}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <span className="text-lg text-[#52aaa5]">★</span>
          </div>
          <div>
            <p className="text-sm text-[#718096]">Đánh giá trung bình</p>
            <p className="text-xl font-semibold text-[#2D3748]">{analyticsData.averageRating}/5</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#52aaa5]/10 p-2">
            <span className="text-lg text-[#52aaa5]">👁</span>
          </div>
          <div>
            <p className="text-sm text-[#718096]">Lượt xem</p>
            <p className="text-xl font-semibold text-[#2D3748]">{analyticsData.totalViews}</p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderCourseCard = (course: (typeof myCourses)[0]) => (
    <Card
      key={course.id}
      className="overflow-hidden transition-all hover:shadow-lg"
      onClick={() => handleCourseClick(course.id)}
    >
      <div className="aspect-video w-full bg-gray-100">
        {/* Replace with actual image */}
        <div className="flex h-full items-center justify-center bg-[#52aaa5]/10">
          <GraduationCap className="h-12 w-12 text-[#52aaa5]" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-[#2D3748]">{course.title}</h3>
        <p className="mb-4 text-sm text-[#718096] line-clamp-2">{course.overview}</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {course.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-[#52aaa5]/10 text-[#52aaa5]">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#718096]">IELTS Band</span>
          <span className="font-medium text-[#52aaa5]">{course.band}</span>
        </div>
      </div>
    </Card>
  )

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[400px] animate-pulse bg-gray-100" />
          ))}
        </div>
      )
    }

    if (error?.toLowerCase().includes('maintenance')) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-yellow-100 p-4">
            <span className="text-4xl">🔧</span>
          </div>
          <h3 className="text-xl font-semibold text-[#2D3748]">Đang bảo trì</h3>
          <p className="text-[#718096]">Vui lòng thử lại sau</p>
        </div>
      )
    }

    if (error === 'offline_not_found') {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-red-100 p-4">
            <CloudOff className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-[#2D3748]">
            Không tìm thấy dữ liệu ngoại tuyến
          </h3>
          <p className="text-[#718096]">Vui lòng kết nối internet để tải dữ liệu</p>
        </div>
      )
    }

    if (myCourses.length === 0) {
      return renderEmptyState()
    }

    const filteredCourses = myCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
      <>
        {isOfflineMode && renderOfflineBanner()}

        {/* Analytics Overview */}
        {renderAnalytics()}

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718096]" />
            <Input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(renderCourseCard)}
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f6f0] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="rounded-2xl p-2 text-[#2D3748] hover:bg-[#52aaa5]/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-[#2D3748]">Khóa học của tôi</h1>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}

export default MyCoursePage
